# -*- coding: utf-8 -*-
#
#  browser.py
#
#  Copyright © 2017 Antergos
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

# Standard lib

import math
import random
import re
import sys
import os
from typing import (
    List,
    Tuple,
    TypeVar,
)

# 3rd-Party Libs
from PyQt5.QtCore import (
    QUrl,
    Qt,
    QCoreApplication,
    QRect,
)
from PyQt5.QtWebEngineCore import QWebEngineUrlScheme
from PyQt5.QtWidgets import (
    QApplication
)
from PyQt5.QtWebEngineWidgets import (
    QWebEngineProfile
)
from PyQt5.QtGui import QScreen

from browser.url_scheme import QtUrlSchemeHandler
from browser.interceptor import QtUrlRequestInterceptor
from bridge.GreeterComm import GreeterComm
from browser.browser_interfaces import OverallBoundary, WindowMetadata, WindowPosition, WindowSize
from browser.window import BrowserWindow, WindowAbstract
import globales

from logger import logger
from config import load_primary_theme_path, load_secondary_theme_path, load_theme_dir, web_greeter_config
from bindings.screensaver import screensaver

# pylint: disable-next=unused-import
# Do not ever remove this import
import resources

# Typing Helpers
BridgeObjects = Tuple["BridgeObject"]
Url = TypeVar("Url", str, QUrl)

os.environ["QT_DEVICE_PIXEL_RATIO"] = "0"
os.environ["QT_AUTO_SCREEN_SCALE_FACTOR"] = "1"
os.environ["QT_SCREEN_SCALE_FACTORS"] = "1"
os.environ["QT_SCALE_FACTOR"] = "1"

def get_default_cursor():
    """Gets the default cursor theme"""
    default_theme = "/usr/share/icons/default/index.theme"
    cursor_theme = ""
    matched = None
    try:
        with open(default_theme, "r", encoding = "utf-8") as file:
            matched = re.search(r"Inherits=.*", file.read())
    except IOError:
        return ""
    if not matched:
        logger.error("Default cursor couldn't be get")
        return ""
    cursor_theme = matched.group().replace("Inherits=", "")
    return cursor_theme

class Application:
    """Main application"""
    app: QApplication
    windows: List[WindowAbstract]

    def __init__(self):
        QCoreApplication.setAttribute(Qt.AA_EnableHighDpiScaling)
        QApplication.setAttribute(Qt.AA_EnableHighDpiScaling)

        self.app = QApplication(sys.argv)

        self.set_protocol()

        self.windows = self.create_windows()

        timeout = web_greeter_config["config"]["greeter"]["screensaver_timeout"]
        screensaver.set_screensaver(timeout or 300)

        cursor_theme = web_greeter_config["config"]["greeter"]["icon_theme"]
        if cursor_theme is not None:
            os.environ["XCURSOR_THEME"] = cursor_theme
        else:
            os.environ["XCURSOR_THEME"] = get_default_cursor()

        self.app.aboutToQuit.connect(self._before_exit)

    def create_windows(self):
        """Initialize application windows"""
        screens: List[QScreen] = self.app.screens()
        primary_screen: QScreen = self.app.primaryScreen()

        overall_boundary: OverallBoundary = OverallBoundary(
            minX = math.inf,
            maxX = -math.inf,
            minY = math.inf,
            maxY = -math.inf
        )

        for screen in screens:
            overall_boundary.minX = min(overall_boundary.minX,
                                          screen.geometry().x())
            overall_boundary.minY = min(overall_boundary.minY,
                                          screen.geometry().y())
            overall_boundary.maxX = min(
                overall_boundary.maxX,
                screen.geometry().x() + screen.geometry().height()
            )
            overall_boundary.maxY = min(
                overall_boundary.maxY,
                screen.geometry().y() + screen.geometry().height()
            )

        windows: List[WindowAbstract] = []
        # screens.append(primary_screen)
        for screen in screens:
            is_primary: bool = screen == primary_screen

            window = BrowserWindow(
                QRect(
                    screen.geometry().x(),
                    screen.geometry().y(),
                    screen.geometry().width(),
                    screen.geometry().height()
                ),
                web_greeter_config["config"]["greeter"]["debug_mode"]
            )

            abstract = WindowAbstract(
                is_primary = is_primary,
                display = screen,
                window = window,
                meta = WindowMetadata(
                    id = random.randrange(1, 20000),
                    is_primary = is_primary,
                    size = WindowSize(
                        width = screen.geometry().width(),
                        height = screen.geometry().height(),
                    ),
                    position = WindowPosition(
                        x = screen.geometry().x(),
                        y = screen.geometry().y(),
                    ),
                    overallBoundary = overall_boundary
                )
            )
            window.bridge_objects.append(
                GreeterComm(abstract)
            )
            windows.append(abstract)
            window.closeEv.connect(self._remove_window)

        logger.debug("Browser Window created")

        return windows

    def _remove_window(self, window):
        wins = []
        for win in self.windows:
            if win.window != window:
                wins.append(win)
            else:
                comm: GreeterComm = win.window.bridge_objects[-1]
                comm.destroy()
        self.windows = wins

    def set_protocol(self):
        """Set protocol"""
        url_scheme = "web-greeter"
        self.url_scheme = QWebEngineUrlScheme(url_scheme.encode())
        self.url_scheme.setDefaultPort(QWebEngineUrlScheme.PortUnspecified)
        self.url_scheme.setFlags(QWebEngineUrlScheme.SecureScheme or
                                 QWebEngineUrlScheme.LocalScheme or
                                 QWebEngineUrlScheme.LocalAccessAllowed)
        QWebEngineUrlScheme.registerScheme(self.url_scheme)

        self.profile = QWebEngineProfile.defaultProfile()
        self.interceptor = QtUrlRequestInterceptor(url_scheme)
        self.url_scheme_handler = QtUrlSchemeHandler()

        self.profile.installUrlSchemeHandler(url_scheme.encode(), self.url_scheme_handler)

        if web_greeter_config["config"]["greeter"]["secure_mode"]:
            if hasattr(QWebEngineProfile, "setUrlRequestInterceptor"):
                self.profile.setUrlRequestInterceptor(self.interceptor)
            else: # Older Qt5 versions
                self.profile.setRequestInterceptor(self.interceptor)

    @classmethod
    def _before_exit(cls):
        """Runs before exit"""
        screensaver.reset_screensaver()

    def show(self):
        """Show window"""
        for win in self.windows:
            win.window.show()
            logger.debug("Web Greeter started win: %s", str(win.meta.id))

    def run(self) -> int:
        """Runs the application"""
        logger.debug("Web Greeter started")
        return self.app.exec_()

class Browser(Application):
    # pylint: disable=too-many-instance-attributes
    """The main browser"""

    def __init__(self):
        super().__init__()
        self.init()
        self.load_theme()

    def init(self):
        """Initialize browser"""
        logger.debug("Initializing Browser Window")

        if web_greeter_config["config"]["greeter"]["debug_mode"]:
            os.environ['QTWEBENGINE_REMOTE_DEBUGGING'] = '12345'

    def load_theme(self):
        """Load theme"""
        load_theme_dir()
        primary_html = load_primary_theme_path()
        secondary_html = load_secondary_theme_path()

        primary_url = QUrl(f"web-greeter://app/{primary_html}")
        secondary_url = QUrl(f"web-greeter://app/{secondary_html}")

        for win in self.windows:
            if win.is_primary:
                win.window.win_page.setUrl(primary_url)
            else:
                win.window.win_page.setUrl(secondary_url)

        logger.debug("Theme loaded")

    def primary_window(self):
        """Returns the primary window"""
        for win in self.windows:
            if win.is_primary:
                return win.window
        raise Exception("No primary window initialized")
