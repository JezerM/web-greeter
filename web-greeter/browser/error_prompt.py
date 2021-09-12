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
from PyQt5.QtWebEngineWidgets import QWebEnginePage
from PyQt5.QtWidgets import QAbstractButton, QDialogButtonBox, QDialog, QVBoxLayout, QLabel, QPushButton
from config import web_greeter_config

import globals
from logging import (
    getLogger,
    DEBUG,
    Formatter,
    StreamHandler,
)

log_format = ''.join([
    '%(asctime)s [ %(levelname)s ] %(filename)s %(',
    'lineno)d: %(message)s'
])
formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
logger = getLogger("javascript")
logger.propagate = False
stream_handler = StreamHandler()
stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)

class WebPage(QWebEnginePage):

    def javaScriptConsoleMessage(self, level: QWebEnginePage.JavaScriptConsoleMessageLevel, message: str, lineNumber: int, sourceID: str):
        if sourceID == "":
            sourceID = "console"

        logLevel = 0
        if level == WebPage.JavaScriptConsoleMessageLevel.ErrorMessageLevel:
            logLevel = 40
        elif level == WebPage.JavaScriptConsoleMessageLevel.WarningMessageLevel:
            logLevel = 30
        elif level == WebPage.JavaScriptConsoleMessageLevel.InfoMessageLevel:
            return
        else:
            return

        record = logger.makeRecord(
            name="javascript",
            level=logLevel,
            fn="",
            lno=lineNumber,
            msg=message,
            args=(),
            exc_info=None
        )
        record.filename = sourceID
        logger.handle(record)

        if logLevel == 40:
            errorMessage = "{source} {line}: {msg}".format(
                source=sourceID, line=lineNumber, msg=message)
            errorPrompt(errorMessage)

class Dialog(QDialog):
    def __init__(self, parent=None, title:str = "Dialog", message:str = "Message", detail:str = "", buttons: List[str] = []):
        super().__init__(parent)
        self.setWindowTitle(title)

        self.buttonBox = QDialogButtonBox()
        for i in range(0, len(buttons)):
            button = QPushButton(buttons[i])
            button.role = i
            self.buttonBox.addButton(button, QDialogButtonBox.ButtonRole.NoRole)

        self.buttonBox.clicked.connect(self.handle_click)

        self.layout = QVBoxLayout()
        self.layout.addWidget(QLabel(message))
        self.layout.addWidget(QLabel(detail))
        self.layout.addWidget(self.buttonBox)

        self.setLayout(self.layout)

    def handle_click(self, button: QAbstractButton):
        self.done(button.role)

def errorPrompt(err):
    if not web_greeter_config["config"]["greeter"]["detect_theme_errors"]:
        return

    dia = Dialog(parent=globals.greeter.window, title="Error",
                 message="An error ocurred. Do you want to change to default theme?",
                 detail=err,
                 buttons=["Reload theme", "Set default theme", "Cancel"],
                 )

    dia.exec()
    result = dia.result()

    if result == 2:  # Cancel
        return
    elif result == 1:  # Default theme
        web_greeter_config["config"]["greeter"]["theme"] = "gruvbox"
        globals.greeter.load_theme()
        return
    elif result == 0:  # Reload
        globals.greeter.load_theme()
        return

    return
