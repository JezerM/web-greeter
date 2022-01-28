# -*- coding: utf-8 -*-
#
#  config.py
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

import sys
import os
import ruamel.yaml as yaml

import globals
from logger import logger

path_to_config = "/etc/lightdm/web-greeter.yml"

global web_greeter_config
web_greeter_config = {
    "config": {
        "branding": {
            "background_images_dir": "/usr/share/backgrounds",
            "logo_image": "",
            "user_image": "",
        },
        "greeter": {
            "debug_mode": False,
            "detect_theme_errors": True,
            "screensaver_timeout": 300,
            "secure_mode": True,
            "theme": "gruvbox",
            "icon_theme": None,
            "time_language": None,
        },
        "layouts": ["us", "latam"],
        "features": {
            "battery": False,
            "backlight": {
                "enabled": False,
                "value": 10,
                "steps": 0,
            }
        }
    },
    "app": {
        "fullscreen": True,
        "frame": False,
        "debug_mode": False,
        "theme_dir": "/usr/share/web-greeter/themes/",
        "version": {
            "full": "3.3.0",
            "major": 3,
            "minor": 3,
            "micro": 0,
        },
    }
}

def load_config():
    try:
        if (not os.path.exists(path_to_config)):
            raise Exception("Config file not found")
        file = open(path_to_config, "r")
        web_greeter_config["config"] = yaml.safe_load(file)
    except Exception as err:
        logger.error("Config was not loaded:\n\t{0}".format(err))
    pass

load_config()
