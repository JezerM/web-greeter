# -*- coding: utf-8 -*-
#
# devtools.py
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

# 3rd-Party Libs
from PyQt5.QtCore import QUrl
from PyQt5.QtWebEngineWidgets import (
    QWebEngineView,
    QWebEnginePage,
)


class DevTools:

    def __init__(self):
        super().__init__()

        self.view = QWebEngineView()
        self.page = self.view.page()  # type: QWebEnginePage

        self.view.load(QUrl('http://127.0.0.1:12345'))
        self.view.show()

