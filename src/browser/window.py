# -*- coding: utf-8 -*-
#
#  window.py
#
#  Copyright © 2021 JezerM
#
#  This file is part of Web Greeter.
#
#  Web Greeter is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 3 of the License, or
#  (at your option) any later version.
#
#  Web Greeter is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  The following additional terms are in effect as per Section 7 of the license:
#
#  The preservation of all legal notices and author attributions in
#  the material or in the Appropriate Legal Notices displayed
#  by works containing it is required.
#
#  You should have received a copy of the GNU General Public License
#  along with Web Greeter; If not, see <http://www.gnu.org/licenses/>.

from typing import (
    Dict,
    List,
    Tuple,
    TypeVar,
)

from PyQt5.QtWidgets import (
    QAction, QMainWindow, QDockWidget,
    qApp, QMenuBar
)
from PyQt5.QtWebEngineWidgets import (
    QWebEngineScript,
    QWebEngineSettings, QWebEngineView, QWebEnginePage
)
from PyQt5.QtCore import (
    Qt,
    QUrl,
    QFile,
    QRect,
    pyqtSignal
)
from PyQt5.QtGui import QColor, QIcon, QScreen
from PyQt5.QtWebChannel import QWebChannel
from browser.browser_interfaces import WindowMetadata
from browser.error_prompt import WebPage

from config import web_greeter_config

import globales

BridgeObjects = Tuple["BridgeObject"]
Url = TypeVar("Url", str, QUrl)

WINDOW_STATES = {
    'NORMAL': Qt.WindowNoState,
    'MINIMIZED': Qt.WindowMinimized,
    'MAXIMIZED': Qt.WindowMaximized,
    'FULLSCREEN': Qt.WindowFullScreen,
}  # type: Dict[str, Qt.WindowState]

DISABLED_SETTINGS = [
    'PluginsEnabled',  # Qt 5.6+
]

ENABLED_SETTINGS = [
    'FocusOnNavigationEnabled',      # Qt 5.8+
    'FullScreenSupportEnabled',      # Qt 5.6+
    'LocalContentCanAccessFileUrls',
    'ScreenCaptureEnabled',          # Qt 5.7+
    'ScrollAnimatorEnabled',
    'FocusOnNavigationEnabled',      # Qt 5.11+
]

class MainWindow(QMainWindow):
    """Main window for web-greeter"""

    def __init__(self):
        super().__init__()
        self.init_actions()

    def init_actions(self):
        """Initialize window actions and their shortcuts"""

        mon_bright_up = QAction(text="&Increase brightness", parent=self)
        mon_bright_down = QAction(text="&Decrease brightness", parent=self)
        mon_bright_up.setShortcut(Qt.Key_MonBrightnessUp)
        mon_bright_down.setShortcut(Qt.Key_MonBrightnessDown)
        mon_bright_up.triggered.connect(self.inc_brightness)
        mon_bright_down.triggered.connect(self.dec_brightness)

        self.addAction(mon_bright_up)
        self.addAction(mon_bright_down)

    @classmethod
    def inc_brightness(cls):
        """Increase brightness"""
        if globales.greeter:
            value = web_greeter_config["config"]["features"]["backlight"]["value"]
            globales.LDMGreeter.brightness_increase(value)
    @classmethod
    def dec_brightness(cls):
        """Decrease brightness"""
        if globales.greeter:
            value = web_greeter_config["config"]["features"]["backlight"]["value"]
            globales.LDMGreeter.brightness_decrease(value)

    @classmethod
    def update_brightness(cls):
        """Updates brightness"""
        if globales.greeter:
            globales.LDMGreeter.brightness_update.emit()

class BrowserWindow(MainWindow):
    # pylint: disable=too-many-instance-attributes
    """Browser window"""

    win_view: QWebEngineView
    win_page: WebPage
    dev_view: QWebEngineView
    dev_page: QWebEnginePage
    dev_tools_enabled: bool = False
    bridge_initialized: bool

    # closeEv: pyqtSignal
    closeEv: pyqtSignal = pyqtSignal(MainWindow)

    def __init__(self, geometry: QRect, dev_tools: bool):
        super().__init__()

        self.dev_tools_enabled = dev_tools
        self.bridge_initialized = False

        self.setAttribute(Qt.WA_DeleteOnClose)
        self.setWindowTitle("Web Greeter")

        self.setWindowFlags(
            self.windowFlags() | Qt.MaximizeUsingFullscreenGeometryHint
        )
        self.setGeometry(geometry)

        state = WINDOW_STATES['NORMAL']
        if web_greeter_config["app"]["fullscreen"]:
            state = WINDOW_STATES["FULLSCREEN"]

        try:
            self.windowHandle().setWindowState(state)
        except (AttributeError, TypeError):
            self.setWindowState(state)

        self.setCursor(Qt.ArrowCursor)

        self.win_view = QWebEngineView(parent=self)
        self.win_page = WebPage()

        self.win_view.setPage(self.win_page)
        self.win_view.setObjectName("WebG View")
        self.win_page.setObjectName("WebG Page")
        self._init_winpage()

        if self.dev_tools_enabled:
            self._init_devtools()
        else:
            self.win_view.setContextMenuPolicy(Qt.PreventContextMenu)

        self._init_actions()

        if web_greeter_config["app"]["frame"]:
            self._init_menu_bar()
        else:
            self.setWindowFlags(
                self.windowFlags() | Qt.FramelessWindowHint
            )

        self.win_page.setBackgroundColor(QColor(0, 0, 0))
        self.setStyleSheet("""QMainWindow, QWebEngineView {
	                                background: #000000;
                                 }""")

        self.setCentralWidget(self.win_view)

        self.init_channel()
        self.win_page.loadStarted.connect(self.init_bridge)

    def closeEvent(self, event):
        """Close event"""
        # pylint: disable=invalid-name
        self.closeEv.emit(self)
        event.accept()

    def init_channel(self):
        """Initialize channel"""
        self.channel = QWebChannel(self.win_page)
        self.bridge_objects = [
            globales.LDMGreeter,
            globales.LDMGreeterConfig,
            globales.LDMThemeUtils,
            # GreeterComm(self)
        ]

    def init_bridge(self):
        """Initialize bridge objects"""
        self.initialize_bridge_objects()
        self.load_script(':/_greeter/js/bundle.js', 'Web Greeter Bundle')
        self.win_page.loadStarted.disconnect(self.init_bridge)

    def _init_winpage(self):
        page_settings = self.win_page.settings().globalSettings()

        if not web_greeter_config["config"]["greeter"]["secure_mode"]:
            ENABLED_SETTINGS.append('LocalContentCanAccessRemoteUrls')
        else:
            DISABLED_SETTINGS.append('LocalContentCanAccessRemoteUrls')

        for setting in DISABLED_SETTINGS:
            try:
                page_settings.setAttribute(getattr(QWebEngineSettings, setting), False)
            except AttributeError:
                pass

        for setting in ENABLED_SETTINGS:
            try:
                page_settings.setAttribute(getattr(QWebEngineSettings, setting), True)
            except AttributeError:
                pass

        # self.win_page.setView(self.win_view)

    def _init_devtools(self):
        self.dev_view = QWebEngineView(parent=self)
        self.dev_page = QWebEnginePage()

        self.dev_view.setPage(self.dev_page)
        self.dev_view.setObjectName("Devtools view")
        self.dev_page.setObjectName("Devtools page")

        self.win_page.setDevToolsPage(self.dev_page)

        self.dev_page.windowCloseRequested.connect(lambda: self.toggle_devtools_value(False))

        inspect_element_action = self.win_page.action(self.win_page.InspectElement)
        inspect_element_action.triggered.connect(lambda: self.toggle_devtools_value(True))

        self.qdock = QDockWidget()
        self.qdock.setWidget(self.dev_view)
        self.qdock.setFeatures(QDockWidget.DockWidgetMovable or
                               QDockWidget.DockWidgetClosable)

        self.addDockWidget(Qt.RightDockWidgetArea, self.qdock)
        self.qdock.hide()

    def _init_menu_bar(self):
        minimize_action = QAction("Minimize", self)
        minimize_action.setShortcut("Ctrl+M")
        minimize_action.triggered.connect(self.showMinimized)
        close_action = QAction("Close", self)
        close_action.setShortcut("Ctrl+W")
        close_action.triggered.connect(self.close)

        self.win_page.action(self.win_page.ReloadAndBypassCache).setText("Force Reload")

        self.win_page.fullScreenRequested.connect(self.accept_fullscreen)

        self.menu_bar = QMenuBar()

        file_menu = self.menu_bar.addMenu("&File")
        file_menu.addAction(self.exit_action)

        edit_menu = self.menu_bar.addMenu("&Edit")
        edit_menu.addAction(self.win_page.action(self.win_page.Undo))
        edit_menu.addAction(self.win_page.action(self.win_page.Redo))
        edit_menu.addSeparator()
        edit_menu.addAction(self.win_page.action(self.win_page.Cut))
        edit_menu.addAction(self.win_page.action(self.win_page.Copy))
        edit_menu.addAction(self.win_page.action(self.win_page.Paste))
        edit_menu.addSeparator()
        edit_menu.addAction(self.win_page.action(self.win_page.SelectAll))

        view_menu = self.menu_bar.addMenu("&View")
        view_menu.addAction(self.win_page.action(self.win_page.Reload))
        view_menu.addAction(self.win_page.action(self.win_page.ReloadAndBypassCache))
        view_menu.addAction(self.toggle_dev_action)
        view_menu.addSeparator()
        view_menu.addAction(self.reset_zoom_action)
        view_menu.addAction(self.inc_zoom_action)
        view_menu.addAction(self.dec_zoom_action)
        view_menu.addSeparator()
        view_menu.addAction(self.fullscreen_action)

        window_menu = self.menu_bar.addMenu("&Window")
        window_menu.addAction(minimize_action)
        window_menu.addAction(close_action)

        # help_menu = menu_bar.addMenu("&Help")

        self.setMenuBar(self.menu_bar)

    def _init_actions(self):
        self.exit_action = QAction(QIcon("exit.png"), "&Quit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.setStatusTip("Exit application")
        self.exit_action.triggered.connect(qApp.quit)

        self.toggle_dev_action = QAction("Toggle Developer Tools", self)
        self.toggle_dev_action.setShortcut("Ctrl+Shift+I")
        self.toggle_dev_action.triggered.connect(self.toggle_devtools)

        self.fullscreen_action = QAction("Toggle Fullscreen", self)
        self.fullscreen_action.setShortcut("F11")
        self.fullscreen_action.triggered.connect(
            lambda: self.toggle_fullscreen(not self.isFullScreen())
        )

        self.inc_zoom_action = QAction("Zoom In", self)
        self.inc_zoom_action.setShortcut("Ctrl++")
        self.inc_zoom_action.triggered.connect(self._inc_zoom)
        self.dec_zoom_action = QAction("Zoom Out", self)
        self.dec_zoom_action.setShortcut("Ctrl+-")
        self.dec_zoom_action.triggered.connect(self._dec_zoom)
        self.reset_zoom_action = QAction("Actual Size", self)
        self.reset_zoom_action.setShortcut("Ctrl+0")
        self.reset_zoom_action.triggered.connect(self._reset_zoom)

        self.addAction(self.exit_action)
        self.addAction(self.toggle_dev_action)
        self.addAction(self.fullscreen_action)
        self.addAction(self.inc_zoom_action)
        self.addAction(self.dec_zoom_action)
        self.addAction(self.reset_zoom_action)

    def toggle_devtools(self):
        """Toggle devtools"""
        if not self.dev_tools_enabled:
            return
        self.toggle_devtools_value(not self.qdock.isVisible())

    def toggle_devtools_value(self, value: bool):
        """Toggle devtools by value"""
        if not self.dev_tools_enabled:
            return

        if value:
            self.qdock.show()
            self.dev_view.setFocus()
        else:
            self.qdock.hide()
            self.win_view.setFocus()

    def _inc_zoom(self):
        if self.win_view.hasFocus():
            self.win_page.increaseZoom()
        else:
            self.dev_page.increaseZoom()
    def _dec_zoom(self):
        if self.win_view.hasFocus():
            self.win_page.decreaseZoom()
        else:
            self.dev_page.decreaseZoom()
    def _reset_zoom(self):
        if self.win_view.hasFocus():
            self.win_page.setZoomFactor(1)
        else:
            self.dev_page.setZoomFactor(1)


    def accept_fullscreen(self, request):
        """Accepts fullscreen requests"""
        if self.dev_tools_enabled:
            request.reject()
            return
        if request.toggleOn():
            self.toggle_fullscreen(True)
        else:
            self.toggle_fullscreen(False)
        request.accept()

    def toggle_fullscreen(self, value: bool):
        """Toggle fullscreen"""
        if not self.dev_tools_enabled:
            return
        if value:
            state = WINDOW_STATES["FULLSCREEN"]
            self.setWindowFlags(
                self.windowFlags() or Qt.FramelessWindowHint
            )
            self.menu_bar.setParent(None)
            self.setMenuBar(None)
        else:
            state = WINDOW_STATES["NORMAL"]
            self.setWindowFlags(
                self.windowFlags() or not Qt.FramelessWindowHint
            )
            self.setMenuBar(self.menu_bar)
        try:
            self.windowHandle().setWindowState(state)
        except (AttributeError, TypeError):
            self.setWindowState(state)

    @staticmethod
    def _create_webengine_script(path: Url, name: str) -> QWebEngineScript:
        script = QWebEngineScript()
        script_file = QFile(path)

        # print(script_file, path)

        if script_file.open(QFile.ReadOnly):
            script_string = str(script_file.readAll(), 'utf-8')

            script.setInjectionPoint(QWebEngineScript.DocumentCreation)
            script.setName(name)
            script.setWorldId(QWebEngineScript.MainWorld)
            script.setSourceCode(script_string)
            # print(script_string)

        return script

    def _get_channel_api_script(self) -> QWebEngineScript:
        return self._create_webengine_script(':/_greeter/js/qwebchannel.js', 'QWebChannel API')

    def _init_bridge_channel(self) -> None:
        self.win_page.setWebChannel(self.channel)
        self.bridge_initialized = True

    def initialize_bridge_objects(self) -> None:
        """Initialize bridge objects :D"""
        if not self.bridge_initialized:
            self._init_bridge_channel()
        registered_objects = self.channel.registeredObjects()

        for obj in self.bridge_objects:
            if obj not in registered_objects:
                # pylint: disable=protected-access
                self.channel.registerObject(obj._name, obj)
                # print("Registered", obj._name)

    def load_script(self, path: Url, name: str):
        """Loads a script in page"""
        qt_api = self._get_channel_api_script()
        qt_api_source = qt_api.sourceCode()
        script = self._create_webengine_script(path, name)
        script.setSourceCode(qt_api_source + "\n" + script.sourceCode())
        # script.setWorldId(42)
        if not self.win_page.scripts().contains(script):
            self.win_page.scripts().insert(script)


class WindowAbstract:
    is_primary: bool
    display: QScreen
    window: BrowserWindow
    meta: WindowMetadata

    def __init__(self, is_primary, display, window, meta):
        self.is_primary = is_primary
        self.display = display
        self.window = window
        self.meta = meta
