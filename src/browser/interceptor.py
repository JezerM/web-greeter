# -*- coding: utf-8 -*-
#
#  interceptor.py
#
#  Copyright © 2016-2017 Antergos
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

# 3rd-Party Libs
from PyQt5.QtWebEngineCore import QWebEngineUrlRequestInterceptor, QWebEngineUrlRequestInfo

class QtUrlRequestInterceptor(QWebEngineUrlRequestInterceptor):
    """Url request interceptor for web-greeter's protocol"""

    def __init__(self, url_scheme: str):
        super().__init__()
        self._url_scheme = url_scheme

    def intercept_request(self, info: QWebEngineUrlRequestInfo) -> None:
        """Intercept request"""
        url = info.requestUrl().toString()
        not_webg_uri = self._url_scheme != info.requestUrl().scheme()
        not_data_uri = 'data' != info.requestUrl().scheme()
        not_local_file = not info.requestUrl().isLocalFile()

        # print(url)

        not_devtools = (
            not url.startswith('http://127.0.0.1') and
            not url.startswith('ws://127.0.0.1')
            and not url.startswith('devtools')
        )

        block_request = (
            not_devtools and not_data_uri and
            not_webg_uri and not_local_file
        )

        info.block(block_request) # Block everything that is not allowed

    def interceptRequest(self, info: QWebEngineUrlRequestInfo) -> None:
        # pylint: disable=invalid-name,missing-function-docstring
        self.intercept_request(info)
