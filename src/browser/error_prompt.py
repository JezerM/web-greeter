# -*- coding: utf-8 -*-
#
#  error_prompt.py
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

# Standard lib

# 3rd-Party Libs
from typing import List
from logging import (
    getLogger,
    DEBUG,
    Formatter,
    StreamHandler,
)
from PyQt5.QtWebEngineWidgets import QWebEnginePage
from PyQt5.QtWidgets import (
    QAbstractButton,
    QDialogButtonBox,
    QDialog,
    QVBoxLayout,
    QLabel,
    QPushButton
)
from PyQt5.QtGui import QWindow
from config import web_greeter_config

import globales

LOG_FORMAT = ''.join([
    '%(asctime)s [ %(levelname)s ] %(filename)s %(',
    'lineno)d: %(message)s'
])
formatter = Formatter(fmt=LOG_FORMAT, datefmt="%Y-%m-%d %H:%M:%S")
logger = getLogger("javascript")
logger.propagate = False
stream_handler = StreamHandler()
stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)

class WebPage(QWebEnginePage):
    """web-greeter's webpage class"""

    def javaScriptConsoleMessage(
            self, level: QWebEnginePage.JavaScriptConsoleMessageLevel,
            message: str, line_number: int, source_id: str
        ):
        # pylint: disable = no-self-use,missing-function-docstring,invalid-name
        if source_id == "":
            source_id = "console"

        log_level = 0
        if level == WebPage.ErrorMessageLevel:
            log_level = 40
        elif level == WebPage.WarningMessageLevel:
            log_level = 30
        elif level == WebPage.InfoMessageLevel:
            return
        else:
            return

        record = logger.makeRecord(
            name="javascript",
            level=log_level,
            fn="",
            lno=line_number,
            msg=message,
            args=(),
            exc_info=None
        )
        record.filename = source_id
        logger.handle(record)

        if log_level == 40:
            errorMessage = f"{source_id} {line_number}: {message}"
            error_prompt(errorMessage)

    def increaseZoom(self, value = 0.1):
        """Increase zoom"""
        # pylint: disable=invalid-name
        self.setZoomFactor(
            self.zoomFactor() + (value if value else 0.1)
        )

    def decreaseZoom(self, value = 0.1):
        """Increase zoom"""
        # pylint: disable=invalid-name
        self.setZoomFactor(
            self.zoomFactor() - (value if value else 0.1)
        )

class Dialog(QDialog):
    """Popup dialog class"""

    def __init__(
            self, parent = None, title: str = "Dialog",
            message: str = "Message", detail: str = "",
            buttons: List[str] = None
        ):
        super().__init__(parent)
        self.setWindowTitle(title)

        self.button_box = QDialogButtonBox()
        if buttons is not None:
            for i, btn in enumerate(buttons, 0):
                button = QPushButton(btn)
                button.role = i
                self.button_box.addButton(button, QDialogButtonBox.NoRole)

        self.button_box.clicked.connect(self.handle_click)

        self.layout = QVBoxLayout()
        self.layout.addWidget(QLabel(message))
        self.layout.addWidget(QLabel(detail))
        self.layout.addWidget(self.button_box)

        self.setLayout(self.layout)

    def handle_click(self, button: QAbstractButton):
        # pylint: disable=missing-function-docstring
        self.done(button.role)

def general_error_prompt(window: QWindow, message: str, detail: str, title: str):
    """General error prompt"""
    dialog = Dialog(parent = window,
                    title = title,
                    message = message,
                    detail = detail,
                    buttons = ["Reload theme", "Use default theme", "Cancel"])
    dialog.exec()
    result = dialog.result()

    if result == 2:  # Cancel
        pass
    elif result == 1:  # Default theme
        web_greeter_config["config"]["greeter"]["theme"] = "gruvbox"
        globales.greeter.load_theme()
    elif result == 0:  # Reload
        globales.greeter.load_theme()


def error_prompt(err: str):
    """Prompts a popup dialog on error"""
    if not web_greeter_config["config"]["greeter"]["detect_theme_errors"]:
        return

    general_error_prompt(globales.greeter.window,
                         "An error ocurred. Do you want to change to default theme?",
                         f"{err}",
                         "An error ocurred")
