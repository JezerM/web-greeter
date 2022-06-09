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

import math
import sys
from typing import Literal

def language_to_dict(lang):
    """Returns a dict from LightDMLanguage object"""
    if not lang:
        return {}
    return {
        "code": lang.get_code(),
        "name": lang.get_name(),
        "territory": lang.get_territory()
    }


def layout_to_dict(layout):
    """Returns a dict from LightDMLayout object"""
    if not layout:
        return {}
    return {
        "description": layout.get_description(),
        "name": layout.get_name(),
        "short_description": layout.get_short_description()
    }


def session_to_dict(session):
    """Returns a dict from LightDMSession object"""
    if not session:
        return {}
    return {
        "comment": session.get_comment(),
        "key": session.get_key(),
        "name": session.get_name(),
        "type": session.get_session_type(),
    }


def user_to_dict(user):
    """Returns a dict from LightDMUser object"""
    if not user:
        return {}
    return {
        "background": user.get_background(),
        "display_name": user.get_display_name(),
        "home_directory": user.get_home_directory(),
        "image": user.get_image(),
        "language": user.get_language(),
        "layout": user.get_layout(),
        "layouts": user.get_layouts(),
        "logged_in": user.get_logged_in(),
        "session": user.get_session(),
        "username": user.get_name(),
    }


def battery_to_dict(battery):
    """Returns a dict from Battery object"""
    if not battery:
        return {}
    if len(battery.batteries) == 0:
        return {}
    return {
        "name": battery.get_name(),
        "level": battery.get_level(),
        "status": battery.get_status(),
        "ac_status": battery.get_ac_status(),
        "capacity": battery.get_capacity(),
        "time": battery.get_time(),
        "watt": battery.get_watt()
    }

def inf_to_infinity(num: float):
    """Converts a math.inf to "infinity" or "-infinity" """
    if not math.isinf(num):
        return num
    if num > 0:
        return "infinity"
    return "-infinity"

def window_metadata_to_dict(metadata):
    """Returns a dict from WindowMetadata object"""
    if not metadata:
        return {}
    return {
        "id": metadata.id,
        "is_primary": metadata.is_primary,
        "overallBoundary": {
            "minX": metadata.overallBoundary.minX,
            "maxX": inf_to_infinity(metadata.overallBoundary.maxX),
            "minY": metadata.overallBoundary.minY,
            "maxY": inf_to_infinity(metadata.overallBoundary.maxY),
        },
        "position": {
            "x": metadata.position.x,
            "y": metadata.position.y,
        },
        "size": {
            "width": metadata.size.width,
            "height": metadata.size.height,
        },
    }

# pylint: disable=wrong-import-position
from .Greeter import Greeter
from .Config import Config
from .ThemeUtils import ThemeUtils
from .GreeterComm import GreeterComm
