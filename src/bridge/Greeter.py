# -*- coding: utf-8 -*-
#
#  Greeter.py
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

# pylint: disable=wrong-import-position

# 3rd-Party Libs
import gi
gi.require_version('LightDM', '1')
from gi.repository import LightDM
from gi.repository.GLib import GError

from PyQt5.QtCore import QVariant, QTimer

# This Application
from logger import logger
from browser.error_prompt import Dialog, general_error_prompt
from browser.bridge import Bridge, BridgeObject

from config import web_greeter_config
from utils.battery import Battery
from bindings.screensaver import screensaver
from utils.brightness import BrightnessController
import globales

from . import (
    language_to_dict,
    layout_to_dict,
    session_to_dict,
    user_to_dict,
    battery_to_dict
)

# import utils.battery as battery

LightDMGreeter = LightDM.Greeter()
LightDMUsers = LightDM.UserList()

class Greeter(BridgeObject):
    # pylint: disable=no-self-use,missing-function-docstring,too-many-public-methods,invalid-name
    """Greeter bridge class, known as `lightdm` in javascript"""

    # LightDM.Greeter Signals
    authentication_complete = Bridge.signal()
    autologin_timer_expired = Bridge.signal()
    idle = Bridge.signal()
    reset = Bridge.signal()
    show_message = Bridge.signal(str, int, arguments=('text', 'type'))
    show_prompt = Bridge.signal(str, int, arguments=('text', 'type'))

    brightness_update = Bridge.signal()
    battery_update = Bridge.signal()

    noop_signal = Bridge.signal()
    property_changed = Bridge.signal()

    _battery = None

    def __init__(self, *args, **kwargs):
        super().__init__(name='LightDMGreeter', *args, **kwargs)

        self._config = web_greeter_config["config"]
        self._shared_data_directory = ''
        self._themes_directory = web_greeter_config["app"]["theme_dir"]

        if self._config["features"]["battery"]:
            self._battery = Battery()

        self._brightness_controller = BrightnessController()

        try:
            LightDMGreeter.connect_to_daemon_sync()
        except GError as err:
            logger.error(err)
            dia = Dialog(
                title = "An error ocurred",
                message = "Detected a problem that could interfere" \
                    " with the system login process",
                detail = f"LightDM: {err}\n" \
                    "You can continue without major problems, " \
                    "but you won't be able to log in",
                buttons = ["Okay"]
            )
            dia.exec()

        self._connect_signals()
        self._determine_shared_data_directory_path()

        if LightDMGreeter.get_lock_hint():
            screensaver.force_screensaver(True)

        logger.debug("LightDM API connected")

    def _determine_shared_data_directory_path(self):
        users = LightDMUsers.get_users()
        if not users:
            return
        user_data_dir = LightDMGreeter.ensure_shared_data_dir_sync(users[0].get_name())
        if user_data_dir is None:
            return
        self._shared_data_directory = user_data_dir.rpartition('/')[0]

    def _connect_signals(self):
        LightDMGreeter.connect(
            'authentication-complete',
            lambda _: self._emit_signal(self.authentication_complete)
        )
        LightDMGreeter.connect(
            'autologin-timer-expired',
            lambda _: self._emit_signal(self.autologin_timer_expired)
        )

        LightDMGreeter.connect('idle', lambda _: self._emit_signal(self.idle))
        LightDMGreeter.connect('reset', lambda _: self._emit_signal(self.reset))

        LightDMGreeter.connect(
            'show-message',
            lambda _, msg, mtype: self._emit_signal(self.show_message, msg, mtype.real)
        )
        LightDMGreeter.connect(
            'show-prompt',
            lambda _, msg, mtype: self._emit_signal(self.show_prompt, msg, mtype.real)
        )

    def _emit_signal(self, _signal, *args):
        self.property_changed.emit()
        # _signal.emit(*args)
        QTimer().singleShot(60, lambda: _signal.emit(*args))

    @Bridge.prop(str, notify=property_changed)
    def authentication_user(self):
        return LightDMGreeter.get_authentication_user() or ''

    @Bridge.prop(bool, notify=noop_signal)
    def autologin_guest(self):
        return LightDMGreeter.get_autologin_guest_hint()

    @Bridge.prop(int, notify=noop_signal)
    def autologin_timeout(self):
        return LightDMGreeter.get_autologin_timeout_hint()

    @Bridge.prop(str, notify=noop_signal)
    def autologin_user(self):
        return LightDMGreeter.get_autologin_user_hint()

    @Bridge.prop(QVariant, notify=battery_update)
    def batteryData(self):
        return battery_to_dict(self._battery)

    @Bridge.prop(QVariant, notify=battery_update)
    def battery_data(self):
        return battery_to_dict(self._battery)

    @Bridge.prop(int, notify=brightness_update)
    def brightness(self):
        return self._brightness_controller.brightness

    @brightness.setter
    def brightness(self, quantity):
        self._brightness_controller.brightness = quantity

    @Bridge.prop(bool, notify=noop_signal)
    def can_hibernate(self):
        return LightDM.get_can_hibernate()

    @Bridge.prop(bool, notify=noop_signal)
    def can_restart(self):
        return LightDM.get_can_restart()

    @Bridge.prop(bool, notify=noop_signal)
    def can_shutdown(self):
        return LightDM.get_can_shutdown()

    @Bridge.prop(bool, notify=noop_signal)
    def can_suspend(self):
        return LightDM.get_can_suspend()

    @Bridge.prop(bool, notify=noop_signal)
    def can_access_brightness(self):
        return self._config["features"]["backlight"]["enabled"]

    @Bridge.prop(bool, notify=noop_signal)
    def can_access_battery(self):
        return self._config["features"]["battery"]

    @Bridge.prop(str, notify=noop_signal)
    def default_session(self):
        return LightDMGreeter.get_default_session_hint()

    @Bridge.prop(bool, notify=noop_signal)
    def has_guest_account(self):
        return LightDMGreeter.get_has_guest_account_hint()

    @Bridge.prop(bool, notify=noop_signal)
    def hide_users_hint(self):
        return LightDMGreeter.get_hide_users_hint()

    @Bridge.prop(str, notify=noop_signal)
    def hostname(self):
        return LightDM.get_hostname()

    @Bridge.prop(bool, notify=property_changed)
    def in_authentication(self):
        return LightDMGreeter.get_in_authentication()

    @Bridge.prop(bool, notify=property_changed)
    def is_authenticated(self):
        return LightDMGreeter.get_is_authenticated()

    @Bridge.prop(QVariant, notify=property_changed)
    def language(self):
        return language_to_dict(LightDM.get_language())

    @Bridge.prop(QVariant, notify=noop_signal)
    def languages(self):
        return [language_to_dict(lang) for lang in LightDM.get_languages()]

    @Bridge.prop(QVariant, notify=noop_signal)
    def layout(self):
        return layout_to_dict(LightDM.get_layout())

    @layout.setter
    def layout(self, layout):
        if not isinstance(layout, dict):
            return False
        lay = dict(
            name = layout.get("name") or "",
            description = layout.get("description") or "",
            short_description = layout.get("short_description") or ""
        )
        return LightDM.set_layout(LightDM.Layout(**lay))

    @Bridge.prop(QVariant, notify=noop_signal)
    def layouts(self):
        return [layout_to_dict(layout) for layout in LightDM.get_layouts()]

    @Bridge.prop(bool, notify=noop_signal)
    def lock_hint(self):
        return LightDMGreeter.get_lock_hint()

    @Bridge.prop(QVariant, notify=property_changed)
    def remote_sessions(self):
        return [session_to_dict(session) for session in LightDM.get_remote_sessions()]

    @Bridge.prop(bool, notify=noop_signal)
    def select_guest_hint(self):
        return LightDMGreeter.get_select_guest_hint()

    @Bridge.prop(str, notify=noop_signal)
    def select_user_hint(self):
        return LightDMGreeter.get_select_user_hint() or ''

    @Bridge.prop(QVariant, notify=noop_signal)
    def sessions(self):
        return [session_to_dict(session) for session in LightDM.get_sessions()]

    @Bridge.prop(str, notify=noop_signal)
    def shared_data_directory(self):
        return self._shared_data_directory or ''

    @Bridge.prop(bool, notify=noop_signal)
    def show_manual_login_hint(self):
        return LightDMGreeter.get_show_manual_login_hint()

    @Bridge.prop(bool, notify=noop_signal)
    def show_remote_login_hint(self):
        return LightDMGreeter.get_show_remote_login_hint()

    @Bridge.prop(str, notify=noop_signal)
    def themes_directory(self):
        return self._themes_directory

    @Bridge.prop(QVariant, notify=noop_signal)
    def users(self):
        return [user_to_dict(user) for user in LightDMUsers.get_users()]

    @Bridge.method(str)
    def authenticate(self, username):
        LightDMGreeter.authenticate(username)
        self.property_changed.emit()

    @Bridge.method()
    def authenticate_as_guest(self):
        LightDMGreeter.authenticate_as_guest()
        self.property_changed.emit()

    @Bridge.method(int)
    def brightnessSet(self, quantity):
        self._brightness_controller.set_brightness(quantity)

    @Bridge.method(int)
    def brightness_set(self, quantity):
        self._brightness_controller.inc_brightness(quantity)

    @Bridge.method(int)
    def brightnessIncrease(self, quantity):
        self._brightness_controller.inc_brightness(quantity)

    @Bridge.method(int)
    def brightness_increase(self, quantity):
        self._brightness_controller.inc_brightness(quantity)

    @Bridge.method(int)
    def brightnessDecrease(self, quantity):
        self._brightness_controller.dec_brightness(quantity)

    @Bridge.method(int)
    def brightness_decrease(self, quantity):
        self._brightness_controller.dec_brightness(quantity)

    @Bridge.method()
    def cancel_authentication(self):
        LightDMGreeter.cancel_authentication()
        self.property_changed.emit()

    @Bridge.method()
    def cancel_autologin(self):
        LightDMGreeter.cancel_autologin()
        self.property_changed.emit()

    @Bridge.method(result=bool)
    def hibernate(self):
        return LightDM.hibernate()

    @Bridge.method(str)
    def respond(self, response):
        LightDMGreeter.respond(response)
        self.property_changed.emit()

    @Bridge.method(result=bool)
    def restart(self):
        return LightDM.restart()

    @Bridge.method(str)
    def set_language(self, lang):
        if self.is_authenticated is True:
            LightDMGreeter.set_language(lang)
            self.property_changed.emit()

    @Bridge.method(result=bool)
    def shutdown(self):
        return LightDM.shutdown()

    @Bridge.method(str, result=bool)
    def start_session(self, session):
        if not session.strip():
            return False
        try:
            started: bool = LightDMGreeter.start_session_sync(session)
            if started or self.is_authenticated:
                logger.debug("Session \"%s\" started", session)
                screensaver.reset_screensaver()
            return started
        except GError as err:
            logger.error(err)
            general_error_prompt(
                globales.greeter.window,
                "LightDM couldn't start session",
                f"The provided session: \"{session}\" couldn't be started\n" \
                f"{err}",
                "An error ocurred"
            )
            return False

    @Bridge.method(result=bool)
    def suspend(self):
        return LightDM.suspend()
