#
#  Greeter.py
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

# pylint: disable=wrong-import-position


from typing import List

from PyQt5.QtCore import QVariant, QTimer

# This Application
from browser.window import WindowAbstract
from browser.bridge import Bridge, BridgeObject
from bridge import window_metadata_to_dict

import globales

communications: List = []

def communication_emit(window, data):
    """Emit broadcast_signal for each GreeterComm element in communications"""
    for comm in communications:
        # print(window)
        comm.broadcast_signal.emit(window, data)

class GreeterComm(BridgeObject):
    # pylint: disable=missing-function-docstring,too-many-public-methods,invalid-name
    """Greeter Communication bridge class, known as `greeter_comm` in javascript"""

    broadcast_signal = Bridge.signal(QVariant, QVariant, arguments=("window", "data"))
    metadata_signal = Bridge.signal(QVariant, arguments=("metadata"))

    property_changed = Bridge.signal()
    window: WindowAbstract

    def __init__(self, window, *args, **kwargs):
        super().__init__(name='Comm', *args, **kwargs)
        self.window = window

        communications.append(self)

    @Bridge.prop(QVariant, notify=property_changed)
    def window_metadata(self):
        for win in globales.greeter.windows:
            if self.window.meta.id == win.meta.id:
                meta = window_metadata_to_dict(win.meta)
                # print(meta)
                return meta

        return {}

    @Bridge.method(QVariant)
    def broadcast(self, data):
        self.property_changed.emit()
        QTimer().singleShot(60, lambda: communication_emit(self.window_metadata, data))

    @Bridge.method()
    def requestMetadata(self):
        for win in globales.greeter.windows:
            if self.window.meta.id == win.meta.id:
                meta = window_metadata_to_dict(win.meta)
                self.metadata_signal.emit(meta)

    def destroy(self):
        global communications
        comms = []
        for obj in communications:
            if obj != self:
                comms.append(obj)

        communications = comms
