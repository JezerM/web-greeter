#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  __init__.py
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

import re
import threading, time

from logging import (
    getLogger,
    DEBUG,
    ERROR,
    Formatter,
    StreamHandler,
)

log_format = ''.join([
    '%(asctime)s [ %(levelname)s ] %(filename)s %(',
    'lineno)d : %(funcName)s | %(message)s'
])
formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
logger = getLogger("greeter")
logger.propagate = False
stream_handler = StreamHandler()
stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)


class setInterval:
    def __init__(self, interval, action):
        self.interval = interval
        self.action = action
        self.stopEvent = threading.Event()
        thread = threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self):
        nextTime = time.time() + self.interval
        while not self.stopEvent.wait(nextTime - time.time()):
            nextTime += self.interval
            self.action()


def language_to_dict(lang):
    if (not lang):
        return dict()
    return dict(code=lang.get_code(), name=lang.get_name(), territory=lang.get_territory())


def layout_to_dict(layout):
    if (not layout):
        return dict()
    return dict(
        description=layout.get_description(),
        name=layout.get_name(),
        short_description=layout.get_short_description()
    )


def session_to_dict(session):
    if (not session):
        return dict()
    return dict(
        comment=session.get_comment(),
        key=session.get_key(),
        name=session.get_name(),
        type=session.get_session_type(),
    )


def user_to_dict(user):
    if (not user):
        return dict()
    return dict(
        display_name=user.get_display_name(),
        home_directory=user.get_home_directory(),
        image=user.get_image(),
        language=user.get_language(),
        layout=user.get_layout(),
        logged_in=user.get_logged_in(),
        session=user.get_session(),
        username=user.get_name(),
    )


def battery_to_dict(battery):
    if (not battery):
        return dict()
    return dict(
        name = battery.get_name(),
        level = battery.get_level(),
        state = battery.get_state(),
        capacity = battery.get_capacity(),
        time = battery.get_time(),
        watt = battery.get_watt()
    )


from .Greeter import Greeter
from .Config import Config
from .ThemeUtils import ThemeUtils
