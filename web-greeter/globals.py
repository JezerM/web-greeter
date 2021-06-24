# -*- coding: utf-8 -*-
#
#  globals.py
#
#  Copyright © 2017 Antergos
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

import sys
import yaml
import pkg_resources
import os
from typing import (
    ClassVar,
    Type,
    List,
    Tuple,
)

# 3rd-Party Libs
from whither.app import App
from whither.base.config_loader import ConfigLoader
from whither.bridge import BridgeObject

# This Application
import resources
from bridge import (
    Config,
    Greeter,
    ThemeUtils,
)

# Typing Helpers
BridgeObj = Type[BridgeObject]


BASE_DIR = os.path.dirname(os.path.realpath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'whither.yml')

class WebGreeter(App):
    greeter = None         # type: ClassVar[BridgeObj] | None
    greeter_config = None  # type: ClassVar[BridgeObj] | None
    theme_utils = None     # type: ClassVar[BridgeObj] | None

    def __init__(self, *args, **kwargs) -> None:
        super().__init__('WebGreeter', *args, **kwargs)
        self.logger.debug('Web Greeter started.')
        self.greeter = Greeter(self.config)
        self.greeter_config = Config(self.config)
        self.theme_utils = ThemeUtils(self.greeter, self.config)
        self._web_container.bridge_objects = (self.greeter, self.greeter_config, self.theme_utils)

        self._web_container.initialize_bridge_objects()
        self._web_container.load_script(':/_greeter/js/bundle.js', 'Web Greeter Bundle')
        self.load_theme()

    @classmethod
    def __pre_init__(cls):
        ConfigLoader.add_filter(cls.validate_greeter_config_data)

    def _before_web_container_init(self):
        self.get_and_apply_user_config()

    @classmethod
    def validate_greeter_config_data(cls, key: str, data: str) -> str:
        if "'@" not in data:
            return data

        if 'WebGreeter' == key:
            path = '../build/web-greeter/whither.yml'
        else:
            path = '../build/dist/web-greeter.yml'

        return open(path, 'r').read()

    def get_and_apply_user_config(self):
        self.logger.debug("Aplying config")
        config_file = os.path.join(self.config.config_dir, 'web-greeter.yml')
        branding_config = ConfigLoader('branding', config_file).config
        greeter_config = ConfigLoader('greeter', config_file).config
        features_config = ConfigLoader('features', config_file).config

        greeter_config.update(custom_config)

        self.config.branding.update(branding_config)
        self.config.greeter.update(greeter_config)
        self.config.features.update(features_config)

        self._config.debug_mode = greeter_config['debug_mode']
        self._config.allow_remote_urls = not greeter_config['secure_mode']

    def load_theme(self):
        self.logger.debug('Loading theme...')
        theme_url = '/{0}/{1}/index.html'.format(self.config.themes_dir, self.config.greeter.theme)
        self._web_container.load(theme_url)

global custom_config
global greeter
custom_config = {}

