# -*- coding: utf-8 -*-
#
# theme.py
#
# Copyright © 2016-2017 Antergos
#
# This file is part of whither.
#
# whither is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# whither is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# The following additional terms are in effect as per Section 7 of the license:
#
# The preservation of all legal notices and author attributions in
# the material or in the Appropriate Legal Notices displayed
# by works containing it is required.
#
# You should have received a copy of the GNU General Public License
# along with whither; If not, see <http://www.gnu.org/licenses/>.

""" Utility class used to find and manage greeter themes. """

# Standard Lib
import os
from os.path import abspath

# This Application
from .pkg_json import PackageJSON

from logging import (
    getLogger,
    DEBUG,
    Formatter,
    StreamHandler,
)

log_format = ''.join([
    '%(asctime)s [ %(levelname)s ] %(filename)s %(',
    'lineno)d: %(message)s'
])
formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
logger = getLogger("theme")
logger.propagate = False
stream_handler = StreamHandler()
stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)


def checkTheme(self):
    theme: str = self.config.greeter.theme
    dir = self.config.themes_dir
    path_to_theme: str = os.path.join(dir, theme, "index.html")
    def_theme = "gruvbox"

    if theme.startswith("/"): path_to_theme = theme;
    elif "." in theme or "/" in theme:
        path_to_theme = os.path.abspath(theme)

    if not path_to_theme.endswith(".html"):
        path_to_theme = os.path.join(path_to_theme, "index.html")

    if not os.path.exists(path_to_theme):
        logger.error("\"{0}\" theme does not exists. Using \"{1}\"".format(theme, def_theme))
        path_to_theme = os.path.join(dir, def_theme, "index.html")

    return path_to_theme


def listThemes(self):
    themes_dir = self.config.themes_dir
    themes_dir = themes_dir if os.path.exists(themes_dir) else "/usr/share/web-greeter/themes"
    filenames = os.listdir(themes_dir)

    dirlist = []
    for file in filenames:
        if os.path.isdir(os.path.join(themes_dir, file)):
            dirlist.append(file)

    return dirlist


class Theme:
    """
    Represents a greeter theme installed on the local system.

    Args:
        path (str): The absolute path to the theme's directory.

    Attributes:
        data (PackageJSON): The theme's data sourced from its `package.json` file.
    """

    def __init__(self, path: str) -> None:
        self.path = path

        self._initialize()

    def _initialize(self) -> None:
        package_json = os.path.join(self.path, 'package.json')

        try:
            self.data = PackageJSON(package_json)
        except Exception:
            self.data = None
