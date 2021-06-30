# -*- coding: utf-8 -*-
#
#  Greeter.py
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
import subprocess
import re
import threading

# 3rd-Party Libs
import gi
gi.require_version('LightDM', '1')
from gi.repository import LightDM
from whither.bridge import (
    BridgeObject,
    bridge,
    Variant,
)
from PyQt5.QtCore import QTimer

# This Application
from . import (
    language_to_dict,
    layout_to_dict,
    session_to_dict,
    user_to_dict,
    battery_to_dict,
    debugLog
)

LightDMGreeter = LightDM.Greeter()
LightDMUsers = LightDM.UserList()

def changeBrightness(self, method: str, quantity: int):
    if self._config.features.backlight["enabled"] != True:
        return
    try:
        steps = self._config.features.backlight["steps"]
        child = subprocess.run(["xbacklight", method, str(quantity), "-steps", str(steps)])
        if child.returncode == 1:
            raise ChildProcessError("xbacklight returned 1")
    except Exception as err:
        debugLog("Brightness: {}".format(err), 4)
    else:
        self.brightness_update.emit()
    pass

def getBrightness(self):
    if self._config.features.backlight["enabled"] != True:
        return -1
    try:
        level = subprocess.run(["xbacklight", "-get"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return int(level.stdout)
    except Exception as err:
        debugLog("Battery: {}".format(err), 4)
        return -1

def updateBattery(self):
    if self._config.features.battery != True:
        return
    try:
        acpi = subprocess.run(["acpi", "-b"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)

        battery = acpi.stdout.split(": ")
        data = re.sub("%|,", "", battery[1])
        level = data.split(" ")[1]

        self._battery = int(level)
        self._acpi = acpi.stdout
    except Exception as err:
        debugLog("Battery: {}".format(err), 4)
    else:
        self.property_changed.emit()

class Greeter(BridgeObject):

    # LightDM.Greeter Signals
    authentication_complete = bridge.signal()
    autologin_timer_expired = bridge.signal()
    idle = bridge.signal()
    reset = bridge.signal()
    show_message = bridge.signal(str, LightDM.MessageType, arguments=('text', 'type'))
    show_prompt = bridge.signal(str, LightDM.PromptType, arguments=('text', 'type'))

    brightness_update = bridge.signal()

    noop_signal = bridge.signal()
    property_changed = bridge.signal()

    _battery = -1
    _acpi = ""

    def __init__(self, config, *args, **kwargs):
        super().__init__(name='LightDMGreeter', *args, **kwargs)

        self._config = config
        self._shared_data_directory = ''
        self._themes_directory = config.themes_dir

        LightDMGreeter.connect_to_daemon_sync()

        self._connect_signals()
        self._determine_shared_data_directory_path()

    def _determine_shared_data_directory_path(self):
        user = LightDMUsers.get_users()[0]
        user_data_dir = LightDMGreeter.ensure_shared_data_dir_sync(user.get_name())
        self._shared_data_directory = user_data_dir.rpartition('/')[0]

    def _connect_signals(self):
        LightDMGreeter.connect(
            'authentication-complete',
            lambda greeter: self._emit_signal(self.authentication_complete)
        )
        LightDMGreeter.connect(
            'autologin-timer-expired',
            lambda greeter: self._emit_signal(self.autologin_timer_expired)
        )

        LightDMGreeter.connect('idle', lambda greeter: self._emit_signal(self.idle))
        LightDMGreeter.connect('reset', lambda greeter: self._emit_signal(self.reset))

        LightDMGreeter.connect(
            'show-message',
            lambda greeter, msg, mtype: self._emit_signal(self.show_message, msg, mtype)
        )
        LightDMGreeter.connect(
            'show-prompt',
            lambda greeter, msg, mtype: self._emit_signal(self.show_prompt, msg, mtype)
        )


    def _emit_signal(self, _signal, *args):
        self.property_changed.emit()
        QTimer().singleShot(300, lambda: _signal.emit(*args))

    @bridge.prop(str, notify=property_changed)
    def authentication_user(self):
        return LightDMGreeter.get_authentication_user() or ''

    @bridge.prop(bool, notify=noop_signal)
    def autologin_guest(self):
        return LightDMGreeter.get_autologin_guest_hint()

    @bridge.prop(int, notify=noop_signal)
    def autologin_timeout(self):
        return LightDMGreeter.get_autologin_timeout_hint()

    @bridge.prop(str, notify=noop_signal)
    def autologin_user(self):
        return LightDMGreeter.get_autologin_user_hint()

    @bridge.prop(Variant, notify=property_changed)
    def batteryData(self):
        return battery_to_dict(self._acpi)

    @bridge.prop(int, notify=brightness_update)
    def brightness(self):
        return getBrightness(self)

    @brightness.setter
    def brightness(self, quantity):
        thread = threading.Thread(target=changeBrightness,
                                  args=(self, "-set", quantity))
        thread.start()

    @bridge.prop(bool, notify=noop_signal)
    def can_hibernate(self):
        return LightDM.get_can_hibernate()

    @bridge.prop(bool, notify=noop_signal)
    def can_restart(self):
        return LightDM.get_can_restart()

    @bridge.prop(bool, notify=noop_signal)
    def can_shutdown(self):
        return LightDM.get_can_shutdown()

    @bridge.prop(bool, notify=noop_signal)
    def can_suspend(self):
        return LightDM.get_can_suspend()

    @bridge.prop(bool, notify=noop_signal)
    def can_access_brightness(self):
        return self._config.features.backlight["enabled"]

    @bridge.prop(bool, notify=noop_signal)
    def can_access_battery(self):
        return self._config.features.battery

    @bridge.prop(str, notify=noop_signal)
    def default_session(self):
        return LightDMGreeter.get_default_session_hint()

    @bridge.prop(bool, notify=noop_signal)
    def has_guest_account(self):
        return LightDMGreeter.get_has_guest_account_hint()

    @bridge.prop(bool, notify=noop_signal)
    def hide_users_hint(self):
        return LightDMGreeter.get_hide_users_hint()

    @bridge.prop(str, notify=noop_signal)
    def hostname(self):
        return LightDM.get_hostname()

    @bridge.prop(bool, notify=property_changed)
    def in_authentication(self):
        return LightDMGreeter.get_in_authentication()

    @bridge.prop(bool, notify=property_changed)
    def is_authenticated(self):
        return LightDMGreeter.get_is_authenticated()

    @bridge.prop(Variant, notify=property_changed)
    def language(self):
        return language_to_dict(LightDM.get_language())

    @bridge.prop(Variant, notify=noop_signal)
    def languages(self):
        return [language_to_dict(lang) for lang in LightDM.get_languages()]

    @bridge.prop(Variant, notify=noop_signal)
    def layout(self):
        return layout_to_dict(LightDM.get_layout())

    @bridge.prop(Variant, notify=noop_signal)
    def layouts(self):
        return [layout_to_dict(layout) for layout in LightDM.get_layouts()]

    @bridge.prop(bool, notify=noop_signal)
    def lock_hint(self):
        return LightDMGreeter.get_lock_hint()

    @bridge.prop(Variant, notify=property_changed)
    def remote_sessions(self):
        return [session_to_dict(session) for session in LightDM.get_remote_sessions()]

    @bridge.prop(bool, notify=noop_signal)
    def select_guest_hint(self):
        return LightDMGreeter.get_select_guest_hint()

    @bridge.prop(str, notify=noop_signal)
    def select_user_hint(self):
        return LightDMGreeter.get_select_user_hint() or ''

    @bridge.prop(Variant, notify=noop_signal)
    def sessions(self):
        return [session_to_dict(session) for session in LightDM.get_sessions()]

    @bridge.prop(str, notify=noop_signal)
    def shared_data_directory(self):
        return self._shared_data_directory

    @bridge.prop(bool, notify=noop_signal)
    def show_manual_login_hint(self):
        return LightDMGreeter.get_show_manual_login_hint()

    @bridge.prop(bool, notify=noop_signal)
    def show_remote_login_hint(self):
        return LightDMGreeter.get_show_remote_login_hint()

    @bridge.prop(str, notify=noop_signal)
    def themes_directory(self):
        return self._themes_directory

    @bridge.prop(Variant, notify=noop_signal)
    def users(self):
        return [user_to_dict(user) for user in LightDMUsers.get_users()]

    @bridge.method(str)
    def authenticate(self, username):
        LightDMGreeter.authenticate(username)
        self.property_changed.emit()

    @bridge.method()
    def authenticate_as_guest(self):
        LightDMGreeter.authenticate_as_guest()
        self.property_changed.emit()

    @bridge.method()
    def batteryUpdate(self):
        return updateBattery(self)

    @bridge.method(int)
    def brightnessSet(self, quantity):
        thread = threading.Thread(target=changeBrightness,
                                  args=(self, "-set", quantity))
        thread.start()

    @bridge.method(int)
    def brightnessIncrease(self, quantity):
        thread = threading.Thread(target=changeBrightness,
                                  args=(self, "-inc", quantity))
        thread.start()

    @bridge.method(int)
    def brightnessDecrease(self, quantity):
        thread = threading.Thread(target=changeBrightness,
                                  args=(self, "-dec", quantity))
        thread.start()

    @bridge.method()
    def cancel_authentication(self):
        LightDMGreeter.cancel_authentication()
        self.property_changed.emit()

    @bridge.method()
    def cancel_autologin(self):
        LightDMGreeter.cancel_autologin()
        self.property_changed.emit()

    @bridge.method(result=bool)
    def hibernate(self):
        return LightDM.hibernate()

    @bridge.method(str)
    def respond(self, response):
        LightDMGreeter.respond(response)
        self.property_changed.emit()

    @bridge.method(result=bool)
    def restart(self):
        return LightDM.restart()

    @bridge.method(str)
    def set_language(self, lang):
        if self.is_authenticated:
            LightDMGreeter.set_language(lang)
            self.property_changed.emit()

    @bridge.method(result=bool)
    def shutdown(self):
        return LightDM.shutdown()

    @bridge.method(str, result=bool)
    def start_session(self, session):
        if not session.strip():
            return
        return LightDMGreeter.start_session_sync(session)

    @bridge.method(result=bool)
    def suspend(self):
        return LightDM.suspend()

