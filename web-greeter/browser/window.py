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

from PyQt5.QtCore import QFileSystemWatcher, Qt
from PyQt5.QtWidgets import QAction, QMainWindow
from PyQt5.QtGui import QKeyEvent
from config import web_greeter_config

import globals

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.init_actions()

    def init_actions(self):
        devAct = QAction(text="&Toggle Devtools", parent=self)
        devAct.setShortcut("Shift+Ctrl+I")
        devAct.triggered.connect(self.toggle_devtools)

        monBUp = QAction(text="&Increase brightness", parent=self)
        monBDo = QAction(text="&Decrease brightness", parent=self)
        monBUp.setShortcut(Qt.Key.Key_MonBrightnessUp)
        monBDo.setShortcut(Qt.Key.Key_MonBrightnessDown)
        monBUp.triggered.connect(self.inc_brightness)
        monBDo.triggered.connect(self.dec_brightness)

        self.addAction(devAct)
        self.addAction(monBUp)
        self.addAction(monBDo)

    def toggle_devtools(self):
        globals.greeter.toggle_devtools()

    def inc_brightness(self):
        if globals.greeter:
            value = web_greeter_config["config"]["features"]["backlight"]["value"]
            globals.greeter.greeter.inc_brightness(value)
    def dec_brightness(self):
        if globals.greeter:
            value = web_greeter_config["config"]["features"]["backlight"]["value"]
            globals.greeter.greeter.dec_brightness(value)

    def updateBrightness(self):
        if globals.greeter:
            globals.greeter.greeter.brightness_update.emit()
