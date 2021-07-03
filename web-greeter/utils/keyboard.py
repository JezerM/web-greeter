# -*- coding: utf-8 -*-
#
#  keyboard.py
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

from whither.toolkits.bootstrap import WebPage, MainWindow

from PyQt5.QtCore import QUrl, pyqtSignal, Qt
from PyQt5.QtGui import QKeyEvent

def keyPressEvent(self, keyEvent: QKeyEvent):
    super(MainWindow, self).keyPressEvent(keyEvent)
    if (keyEvent.key() == Qt.Key.Key_MonBrightnessUp):
        globals.greeter.greeter.brightnessIncrease(globals.greeter.config.features.backlight["value"])
    if (keyEvent.key() == Qt.Key.Key_MonBrightnessDown):
        globals.greeter.greeter.brightnessDecrease(globals.greeter.config.features.backlight["value"])


MainWindow.keyPressEvent = keyPressEvent


