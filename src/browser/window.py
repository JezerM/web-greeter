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

from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QAction, QMainWindow
from config import web_greeter_config

import globales

class MainWindow(QMainWindow):
    """Main window for web-greeter"""

    def __init__(self):
        super().__init__()
        self.init_actions()

    def init_actions(self):
        """Initialize window actions and their shortcuts"""
        dev_act = QAction(text="&Toggle Devtools", parent=self)
        dev_act.setShortcut("Shift+Ctrl+I")
        dev_act.triggered.connect(self.toggle_devtools)

        mon_bright_up = QAction(text="&Increase brightness", parent=self)
        mon_bright_down = QAction(text="&Decrease brightness", parent=self)
        mon_bright_up.setShortcut(Qt.Key_MonBrightnessUp)
        mon_bright_down.setShortcut(Qt.Key_MonBrightnessDown)
        mon_bright_up.triggered.connect(self.inc_brightness)
        mon_bright_down.triggered.connect(self.dec_brightness)

        self.addAction(dev_act)
        self.addAction(mon_bright_up)
        self.addAction(mon_bright_down)

    @classmethod
    def toggle_devtools(cls):
        """Toggle devtools"""
        globales.greeter.toggle_devtools()

    @classmethod
    def inc_brightness(cls):
        """Increase brightness"""
        if globales.greeter:
            value = web_greeter_config["config"]["features"]["backlight"]["value"]
            globales.greeter.greeter.inc_brightness(value)
    @classmethod
    def dec_brightness(cls):
        """Decrease brightness"""
        if globales.greeter:
            value = web_greeter_config["config"]["features"]["backlight"]["value"]
            globales.greeter.greeter.dec_brightness(value)

    @classmethod
    def update_brightness(cls):
        """Updates brightness"""
        if globales.greeter:
            globales.greeter.greeter.brightness_update.emit()
