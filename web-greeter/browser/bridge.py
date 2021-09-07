# -*- coding: utf-8 -*-
#
#  bridge.py
#
#  Copyright © 2016-2017 Antergos
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

from PyQt5.QtCore import QObject, pyqtSignal, pyqtSlot, pyqtProperty

class Bridge:
    @staticmethod
    def method(*args, **kwargs):
        return pyqtSlot(*args, **kwargs)

    @staticmethod
    def prop(*args, **kwargs):
        return pyqtProperty(*args, **kwargs)

    @staticmethod
    def signal(*args, **kwargs):
        return pyqtSignal(*args, **kwargs)

class BridgeObject(QObject):
    def __init__(self, name: str):
        super().__init__(parent=None)
        self._name = name
