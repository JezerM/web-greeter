# -*- coding: utf-8 -*-
#
#  ThemeUtils.py
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

# Standard Lib
import os
from glob import glob
import tempfile

# 3rd-Party Libs
from whither.bridge import (
    BridgeObject,
    bridge,
    Variant,
)


class ThemeUtils(BridgeObject):

    def __init__(self, greeter, config, *args, **kwargs):
        super().__init__(name='ThemeUtils', *args, **kwargs)

        self._config = config
        self._greeter = greeter
        self.after_init()

    def after_init(self):
        self._allowed_dirs = (
            self._config.themes_dir,
            self._config.branding.background_images_dir,
            self._greeter.shared_data_directory,
            tempfile.gettempdir(),
        )

    @bridge.method(str, bool, result=Variant)
    def dirlist(self, dir_path, only_images=True):
        if not dir_path or not isinstance(dir_path, str) or '/' == dir_path:
            return []

        dir_path = os.path.realpath(os.path.normpath(dir_path))

        if not os.path.isabs(dir_path) or not os.path.isdir(dir_path):
            return []

        allowed = False

        for allowed_dir in self._allowed_dirs:
            if dir_path.startswith(allowed_dir):
                allowed = True
                break

        if not allowed:
            return []

        if only_images:
            file_types = ('jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp')
            result = [
                glob('{0}/**/*.{1}'.format(dir_path, ftype), recursive=True)
                for ftype in file_types
            ]
            result = [image for image_list in result for image in image_list]

        else:
            result = [os.path.join(dir_path, f) for f in os.listdir(dir_path)]

        return result
