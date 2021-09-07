# -*- coding: utf-8 -*-
#
#  logger.py
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

from logging import (
    getLogger,
    DEBUG,
    Formatter,
    StreamHandler
)

log_format = ''.join([
    '%(asctime)s [ %(levelname)s ] %(module)s - %(filename)s:%(',
    'lineno)d : %(funcName)s | %(message)s'
])
formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
stream_handler = StreamHandler()

global logger
logger = getLogger("debug")

stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.propagate = False
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)
