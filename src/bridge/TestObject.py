# -*- coding: utf-8 -*-
#
#  Greeter.py
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

# pylint: disable=wrong-import-position

# 3rd-Party Libs
import gi
gi.require_version('LightDM', '1')
from gi.repository import LightDM
from gi.repository.GLib import GError

from PySide6.QtCore import QObject, QTimer, Signal, Slot, Property

# This Application
from logger import logger
from browser.error_prompt import Dialog, general_error_prompt
from browser.bridge import Bridge, BridgeObject

from config import web_greeter_config
from utils.battery import Battery
from bindings.screensaver import screensaver
from utils.brightness import BrightnessController
import globales

from . import (
    language_to_dict,
    layout_to_dict,
    session_to_dict,
    user_to_dict,
    battery_to_dict
)

# import utils.battery as battery

class TestObject(QObject):
    # pylint: disable=no-self-use,missing-function-docstring,too-many-public-methods,invalid-name
    """Greeter bridge class, known as `lightdm` in javascript"""

    noop_signal = Signal()
    prop_changed = Signal()

    def __init__(self, *args, **kwargs):
        super().__init__(parent=None)
        self._name = 'test_object'

        self._user_name = "unknown"

    @Slot(str, result=str)
    def hello(self, user_name):
        self._user_name = user_name
        self.prop_changed.emit()
        return "Hello " + user_name

    @Property(str, notify=prop_changed)
    def user_name_message(self):
        return "HOLA " + self._user_name

    @Property(str, notify=prop_changed)
    def user_name(self):
        return self._user_name


# test_object.property_changed.connect((v) => console.log("CHANGED", v))
