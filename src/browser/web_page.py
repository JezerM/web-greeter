# -*- coding: utf-8 -*-
#
#  web_page.py
#
#  Copyright © 2026 JezerM
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

from PySide6.QtWidgets import (
    QAbstractButton,
    QDialogButtonBox,
    QDialog,
    QVBoxLayout,
    QLabel,
    QPushButton,
)

from typing import List
from PySide6.QtWebEngineCore import QWebEnginePage
from web_logger import logger

class WebPage(QWebEnginePage):
    """web-greeter's webpage class"""

    def javaScriptConsoleMessage(
        self,
        level: QWebEnginePage.JavaScriptConsoleMessageLevel,
        message: str,
        line_number: int,
        source_id: str,
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
            exc_info=None,
        )
        record.filename = source_id
        logger.handle(record)

        if log_level == 40:
            errorMessage = f"{source_id} {line_number}: {message}"
            # error_prompt(errorMessage)

    def increaseZoom(self, value=0.1):
        """Increase zoom"""
        # pylint: disable=invalid-name
        self.setZoomFactor(self.zoomFactor() + (value if value else 0.1))

    def decreaseZoom(self, value=0.1):
        """Increase zoom"""
        # pylint: disable=invalid-name
        self.setZoomFactor(self.zoomFactor() - (value if value else 0.1))


class Dialog(QDialog):
    """Popup dialog class"""

    def __init__(
        self,
        parent=None,
        title: str = "Dialog",
        message: str = "Message",
        detail: str = "",
        buttons: List[str] = None,
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
        """Handle click of button"""
        self.done(button.role)


