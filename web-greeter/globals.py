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
from logging import (
    getLogger,
    DEBUG,
    ERROR,
    Formatter,
    StreamHandler,
)

from PyQt5.QtWidgets import QMainWindow
from PyQt5.QtGui import QColor
import subprocess

from utils import theme

# Typing Helpers
BridgeObj = Type[BridgeObject]


log_format = ''.join([
    '%(asctime)s [ %(levelname)s ] %(module)s - %(filename)s:%(',
    'lineno)d : %(funcName)s | %(message)s'
])
formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
stream_handler = StreamHandler()
logger = getLogger("debug")

stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.propagate = False
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)

initial_timeout = 0

def setScreenSaver(timeout: int):
    global initial_timeout
    timeout = timeout if timeout >= 0 else 300
    try:
        child = subprocess.Popen(["xset", "q"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        awk = subprocess.run(["awk", "/^  timeout: / {print $2}"], stdout=subprocess.PIPE, stdin=child.stdout, text=True)

        initial_timeout = int(awk.stdout.replace("\n", ""))

        subprocess.run(["xset", "s", str(timeout)], check=True)

    except Exception as err:
        logger.error("Screensaver timeout couldn't be set")
    else:
        logger.debug("Screensaver timeout set")

def resetScreenSaver():
    try:
        subprocess.run(["xset", "s", str(initial_timeout)])
    except Exception as err:
        logger.error("Screensaver reset failed")
    else:
        logger.debug("Screensaver reset")


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

        page = self._main_window.widget.centralWidget().page()
        page.setBackgroundColor(QColor(0,0,0))

        setScreenSaver(self.config.greeter["screensaver_timeout"])

        self._web_container.initialize_bridge_objects()
        self._web_container.load_script(':/_greeter/js/bundle.js', 'Web Greeter Bundle')
        self.load_theme()

    @classmethod
    def __pre_init__(cls):
        ConfigLoader.add_filter(cls.validate_greeter_config_data)

    def _before_main_window_init(self):
        self.get_and_apply_user_config()

    def _before_exit(self):
        resetScreenSaver()

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

        greeter_config.update(custom_config["app"]["greeter"])

        self.config.branding.update(branding_config)
        self.config.greeter.update(greeter_config)
        self.config.features.update(features_config)

        os.environ["XCURSOR_THEME"] = greeter_config["icon_theme"]

        self._config.debug_mode = greeter_config['debug_mode']
        self._config.allow_remote_urls = not greeter_config['secure_mode']
        self._config.context_menu.enabled = greeter_config['debug_mode']
        self._config.window.update(custom_config["whither"]["window"])

    def load_theme(self):
        self.logger.debug('Loading theme...')
        theme.checkTheme(self)
        theme_url = '/{0}/{1}/index.html'.format(self.config.themes_dir, self.config.greeter.theme)
        self._web_container.load(theme_url)

global custom_config
global greeter
custom_config = {
    "whither": {
        "window": {}
    },
    "app": {
        "greeter": {}
    }
}

