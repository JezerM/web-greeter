# -*- coding: utf-8 -*-
#
#  url_scheme.py
#
#  Copyright © 2016-2018 Antergos
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

""" Custom Url Scheme Handler """

# Standard Lib
import os
import mimetypes

# 3rd-Party Libs
from PyQt5.QtCore import QBuffer, QIODevice
from PyQt5.QtWebEngineCore import QWebEngineUrlSchemeHandler, QWebEngineUrlRequestJob


class QtUrlSchemeHandler(QWebEngineUrlSchemeHandler):
    """URL Scheme Handler for web-greeter's protocol"""

    def requestStarted(self, job: QWebEngineUrlRequestJob) -> None:
        # pylint: disable=invalid-name,missing-function-docstring
        path = job.requestUrl().path()
        path = os.path.realpath(path)

        # print("PATH", job.requestUrl().path())

        if not path:
            # print("JOB FAIL", path)
            job.fail(QWebEngineUrlRequestJob.UrlInvalid)
            return

        if not os.path.exists(path):
            # print("NOT FOUND", path)
            job.fail(QWebEngineUrlRequestJob.UrlNotFound)
            return

        try:
            with open(path, 'rb') as file:
                content_type = mimetypes.guess_type(path)
                if content_type[0] is None:
                    content_type = ("text/plain", None)
                buffer = QBuffer(parent=self)

                buffer.open(QIODevice.WriteOnly)
                buffer.write(file.read())
                buffer.seek(0)
                buffer.close()

                if content_type[0] is None:
                    job.reply("text/plain", "")
                else:
                    job.reply(content_type[0].encode(), buffer)

        except Exception as err:
            raise err
