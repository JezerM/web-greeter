# -*- coding: utf-8 -*-
#
#  brightness.py
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

import os
import stat
import time
import pyinotify
from typing import List
from threading import Thread
import globals
from logger import logger
from config import web_greeter_config

sys_path = ["/sys/class/backlight/"]

def get_controllers() -> List[str]:
    ctrls: List[str] = []
    for dev in sys_path:
        if os.path.exists(dev) and stat.S_ISDIR(os.stat(dev).st_mode):
            drs = os.listdir(dev)
            for name in drs:
                ctrls.append(os.path.join(dev, name))
    return ctrls

class EventHandler(pyinotify.ProcessEvent):
    def process_IN_MODIFY(self, event):
        if globals.greeter:
            globals.greeter.greeter.brightness_update.emit()


# Behavior based on "acpilight"
# Copyright(c) 2016-2019 by wave++ "Yuri D'Elia" <wavexx@thregr.org>
# See https://gitlab.com/wavexx/acpilight
class BrightnessController:

    _controllers: List[str] = []
    _available: bool = False
    _brightness_path: str
    _max_brightness_path: str
    steps: int
    delay: int
    _brightness: int
    _max_brightness: int = -1

    def __init__(self):
        self._controllers = get_controllers()
        if (len(self._controllers) == 0 or
            self._controllers[0] == None or
            web_greeter_config["config"]["features"]["backlight"]["enabled"] == False):
            self._available = False
            return
        b_path = self._controllers[0]
        self._available = True
        self._brightness_path = os.path.join(b_path, "brightness")
        self._max_brightness_path = os.path.join(b_path, "max_brightness")

        with open(self._max_brightness_path, "r") as f:
            self._max_brightness = int(f.read())

        steps = web_greeter_config["config"]["features"]["backlight"]["steps"]
        self.steps = 1 if steps <= 1 else steps
        self.delay = 200
        self.watch_brightness()

    def _watch(self):
        wm = pyinotify.WatchManager()
        handler = EventHandler()
        wm.add_watch(self._brightness_path, pyinotify.IN_MODIFY)

        notifier = pyinotify.Notifier(wm, handler)

        notifier.loop()

    def watch_brightness(self):
        if not self._available:
            return
        thread = Thread(target = self._watch)
        thread.daemon = True
        thread.start()

    @property
    def max_brightness(self) -> int:
        return self._max_brightness

    @property
    def real_brightness(self) -> int:
        if not self._available: return -1
        try:
            with open(self._brightness_path, "r") as f:
                return int(f.read())
        except OSError:
            logger.error("Couldn't read from \"" + self._brightness_path + "\"")
            return -1

    @real_brightness.setter
    def real_brightness(self, v: int):
        if not self._available: return
        if v > self.max_brightness: v = self.max_brightness
        elif v <= 0: v = 0

        if not os.path.exists(self._brightness_path): return

        try:
            with open(self._brightness_path, "w") as f:
                f.write(str(round(v)))
        except OSError:
            logger.error("Couldn't write to \"" + self._brightness_path + "\"")

    @property
    def brightness(self) -> int:
        if not self._available: return -1
        return round(self.real_brightness * 100 / self.max_brightness)

    @brightness.setter
    def brightness(self, v: int):
        self.real_brightness = round(v * self.max_brightness / 100)

    def _set_brightness(self, value: int):
        if not self._available: return
        steps = self.steps or 1
        sleep = self.delay / steps
        current = self.brightness

        if steps <= 1:
            self.brightness = value
            return

        for i in range(steps + 1):
            time.sleep(sleep / 1000)
            brigh = current + ((value - current) * i) / steps
            self.brightness = round(brigh)

    def set_brightness(self, value: int):
        thread = Thread(target = self._set_brightness, args = (value,))
        thread.start()

    def inc_brightness(self, value: int):
        self.set_brightness(self.brightness + value)

    def dec_brightness(self, value: int):
        self.set_brightness(self.brightness - value)
