# -*- coding: utf-8 -*-
#
# pkg_json.py
#
# Copyright © 2016-2017 Antergos
#
# This file is part of Web Greeter for LightDM.
#
# Web Greeter is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# Web Greeter is distributed in the hope that it will be useful,
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
# along with Web Greeter; If not, see <http://www.gnu.org/licenses/>.

""" Utility class used to manage greeter themes' package.json files. """

# Standard Lib
import json
import os


class MissingKeyError(KeyError):

    def __init__(self, keys: list):
        self.keys = keys
        msg_part = ' is' if len(keys) == 1 else 's are'
        msg = 'Required key{0} missing: {1}'.format(msg_part, keys)

        super().__init__(msg)


class PackageJSON:
    """
    Holds data from a theme's package.json file.

    Attributes:
        _optional_keys (tuple): Top-level keys that aren't required.
        _required_keys (tuple): Top-level keys that are required.
        _wg_theme_keys (tuple): Keys nested under `wg_theme` key. All are required.

        author      (dict): Author's info. Required: `name`. Optional: `email`, `url`.
        bugs         (str): Issue tracker url.
        config      (dict): Theme configuration data.
        description  (str): Short description.
        display_name (str): Display name.
        entry_point  (str): Path to HTML file relative to theme's root directory.
        homepage     (str): Homepage url.
        name         (str): Package name.
        scripts     (list): All JavaScript files required by the theme. Paths should be relative
                            to the theme's root directory. Vendor scripts provided by the greeter
                            should be listed by their name instead of file path.
        styles      (list): All CSS files required by the theme. Paths should be relative
                            to the theme's root directory. Vendor styles provided by the greeter
                            should be listed by their name instead of file path.
        supports    (list): List of greeter versions supported by the theme. The version format
                            is MAJOR[.MINOR[.PATCH]] where MINOR and PATCH are optional.
                            Examples:
                                `3`    : `2.9.9` < compatible versions < `4.0.0`
                                `3.0`  : `3` < compatible versions < `3.1`
                                `3.0.1`: compatible version == `3.0.1`
        version     (str):  Theme version.
    """
    _optional_keys = (
        'config',
        'description',
        'name',
    )

    _required_keys = (
        'author',
        'bugs',
        'homepage',
        'version',
        'wg_theme',
    )

    _wg_theme_keys = (
        'display_name',
        'entry_point',
        'scripts',
        'styles',
        'supports',
    )

    def __init__(self, path: str) -> None:
        """
        Args:
            path (str): Absolute path to `package.json` file.
        """
        self.path = path

        self._initialize()

    def _initialize(self):
        package_json = os.path.join(self.path, 'package.json')

        if not os.path.exists(package_json):
            raise FileNotFoundError

        data = json.loads(package_json)
        missing_keys = [k for k in self._required_keys if k not in data]

        if missing_keys:
            raise MissingKeyError(missing_keys)

        if not isinstance(data['wg_theme'], dict):
            raise TypeError('wg_theme: Expected type(dict)!')

        missing_keys = [k for k in self._wg_theme_keys if k not in data['wg_theme']]

        if missing_keys:
            raise MissingKeyError(missing_keys)

        for key, value in data['wg_theme'].items():
            setattr(self, key, value)

        del data['wg_theme']

        for key, value in data.items():
            setattr(self, key, value)
