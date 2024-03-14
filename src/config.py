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

import os
from ruamel import yaml

from logger import logger

PATH_TO_CONFIG = "/etc/lightdm/web-greeter.yml"

yaml_loader = yaml.YAML(typ='safe', pure=True)

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
            "full": "3.5.2",
            "major": 3,
            "minor": 5,
            "micro": 2,
        },
        "api_version": {
            "full": "1.0.0",
            "major:": 1,
            "minor": 0,
            "micro": 0,
        },
    },
    "theme": {
        "primary_html": "index.html",
        "secondary_html": "",
    }
}

path_to_config = os.getenv("WEB_GREETER_CONFIG") or "/etc/lightdm/web-greeter.yml"

theme_dir = None

def load_theme_dir() -> str:
    """Loads the theme directory"""
    theme: str = web_greeter_config["config"]["greeter"]["theme"]
    directory: str = web_greeter_config["app"]["theme_dir"]
    def_theme = "gruvbox"

    theme_dir = os.path.join(directory, theme)

    if theme.startswith("/"):
        theme_dir = theme
    elif theme.__contains__(".") or theme.__contains__("/"):
        theme_dir = os.path.join(os.getcwd(), theme)

    if theme_dir.endswith(".html"):
        theme_dir = os.path.dirname(theme_dir)

    if not os.path.exists(theme_dir):
        logger.warn("\"%s\" theme does not exists. Using \"%s\" theme",
                    theme, def_theme)
        theme_dir = os.path.join(directory, def_theme)

    return theme_dir

def load_primary_theme_path() -> str:
    """
    Loads the primary theme path
    The provided theme with `--theme` flag is preferred over index.yml
    """
    global theme_dir
    if not theme_dir:
        theme_dir = load_theme_dir()
    abs_theme: str = web_greeter_config["config"]["greeter"]["theme"]
    abs_theme_name = abs_theme.split("/").pop()
    directory: str = web_greeter_config["app"]["theme_dir"]
    def_theme = "gruvbox"

    if abs_theme_name.endswith(".html"):
        web_greeter_config["theme"]["primary_html"] = abs_theme_name

    primary = web_greeter_config["theme"]["primary_html"]
    path_to_theme = os.path.join(theme_dir, primary)

    if not path_to_theme.endswith(".html"):
        path_to_theme = os.path.join(path_to_theme, "index.html")

    if not os.path.exists(path_to_theme):
        logger.warn("\"%s\" theme does not exists. Using \"%s\" theme",
                    path_to_theme, def_theme)
        path_to_theme = os.path.join(directory, def_theme, "index.html")

    web_greeter_config["config"]["greeter"]["theme"] = path_to_theme
    return path_to_theme

def load_secondary_theme_path() -> str:
    """
    Loads the secondary theme path
    This can only be set with index.yml, either it defaults to primary html
    """
    global theme_dir
    if not theme_dir:
        theme_dir = load_theme_dir()
    primary = web_greeter_config["theme"]["primary_html"]
    secondary = web_greeter_config["theme"]["secondary_html"]
    path_to_theme = os.path.join(theme_dir, secondary or primary)

    if not path_to_theme.endswith(".html"):
        path_to_theme = os.path.join(path_to_theme, "index.html")

    if not os.path.exists(path_to_theme):
        logger.warn("\"%s\" does not exists. Using \"%s\" for secondary monitors",
                    secondary, primary)
        path_to_theme = load_primary_theme_path()

    return path_to_theme

def load_theme_config():
    """Loads the theme config inside "index.yml" """
    global theme_dir
    if not theme_dir:
        theme_dir = load_theme_dir()
    path_to_theme_config = os.path.join(theme_dir, "index.yml")

    try:
        if not os.path.exists(path_to_theme_config):
            raise Exception("index.yml file not found")
        with open(path_to_theme_config, "r", encoding="utf-8") as file:
            theme_config = yaml_loader.load(file)
            web_greeter_config["theme"] = theme_config

    except Exception as err:
        logger.warn("Theme config was not loaded:\n\t%s", err)
        logger.debug("Using default theme config")

def ensure_theme():
    """
    Ensures that the theme does exists
    If it doesn't, default theme (gruvbox) is used
    """
    global theme_dir
    if not theme_dir:
        theme_dir = load_theme_dir()
    primary = web_greeter_config["theme"]["primary_html"]
    directory = web_greeter_config["app"]["theme_dir"]
    def_theme = "gruvbox"

    primary_exists = os.path.exists(os.path.join(theme_dir, primary))

    if not primary_exists:
        theme_dir = os.path.join(directory, def_theme)
        load_theme_config()

def load_config():
    """Load web-greeter's config"""
    try:
        if not os.path.exists(PATH_TO_CONFIG):
            raise Exception("Config file not found")
        with open(PATH_TO_CONFIG, "r", encoding="utf-8") as file:
            web_greeter_config["config"] = yaml_loader.load(file)
    except Exception as err:
        logger.error("Config was not loaded:\n\t%s", err)

load_config()
