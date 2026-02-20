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
from PySide6.QtGui import QWindow
from config import web_greeter_config

import globales


def general_error_prompt(window: QWindow, message: str, detail: str, title: str):
    """General error prompt"""
    dialog = Dialog(
        parent=window,
        title=title,
        message=message,
        detail=detail,
        buttons=["Reload theme", "Use default theme", "Cancel"],
    )
    dialog.exec()
    result = dialog.result()

    if result == 2:  # Cancel
        pass
    elif result == 1:  # Default theme
        web_greeter_config.config.greeter.theme = "gruvbox"
        globales.greeter.load_theme()
    elif result == 0:  # Reload
        globales.greeter.load_theme()


def error_prompt(err: str):
    """Prompts a popup dialog on error"""
    if not web_greeter_config.config.greeter.detect_theme_errors:
        return

    general_error_prompt(
        globales.greeter.primary_window(),
        "An error ocurred. Do you want to change to default theme?",
        f"{err}",
        "An error ocurred",
    )
