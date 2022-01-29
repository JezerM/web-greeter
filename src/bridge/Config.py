# -*- coding: utf-8 -*-
#
#  Config.py
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

# Standard Lib
from typing import List

# 3rd-Party Libs
import gi
gi.require_version('LightDM', '1')
from gi.repository import LightDM

from PyQt5.QtCore import QVariant

# This application
from browser.bridge import Bridge, BridgeObject
from config import web_greeter_config

from . import layout_to_dict

def get_layouts(config_layouts: List[str]):
    """Get layouts from web-greeter's config"""
    layouts = LightDM.get_layouts()
    final_layouts: list[LightDM.Layout] = []
    for ldm_lay in layouts:
        for conf_lay in config_layouts:
            if not isinstance(conf_lay, str):
                return []
            conf_lay = conf_lay.replace(" ", "\t")
            if ldm_lay.get_name() == conf_lay:
                final_layouts.append(layout_to_dict(ldm_lay))
    return final_layouts


class Config(BridgeObject):
    # pylint: disable=no-self-use,missing-function-docstring,too-many-public-methods,invalid-name
    """Config bridge class, known as `greeter_config` in javascript"""

    noop_signal = Bridge.signal()

    def __init__(self, *args, **kwargs):
        super().__init__(name='Config', *args, **kwargs)

        _config = web_greeter_config["config"]
        self._branding = _config["branding"]
        self._greeter = _config["greeter"]
        self._features = _config["features"]
        self._layouts = get_layouts(_config["layouts"])

    @Bridge.prop(QVariant, notify=noop_signal)
    def branding(self):
        return self._branding

    @Bridge.prop(QVariant, notify=noop_signal)
    def greeter(self):
        return self._greeter

    @Bridge.prop(QVariant, notify=noop_signal)
    def features(self):
        return self._features

    @Bridge.prop(QVariant, notify=noop_signal)
    def layouts(self):
        return self._layouts

config = Config()
