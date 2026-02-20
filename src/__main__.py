# -*- coding: utf-8 -*-
#
#  __main__.py
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

# Standard lib
import sys

# 3rd-Party Libs
import config
import cli

if __name__ == "__main__":
    config.load_config()

    cli.parse(sys.argv[1:])

    import globales
    from browser.browser import Browser
    from bridge import Greeter, Config, ThemeUtils
    from PySide6.QtWidgets import QApplication
    from PySide6.QtCore import Qt, QCoreApplication

    app = QApplication(sys.argv)

    globales.LDMGreeter = Greeter()
    globales.LDMGreeterConfig = Config()
    globales.LDMThemeUtils = ThemeUtils(globales.LDMGreeter)

    config.load_theme_config()
    config.ensure_theme()

    globales.greeter = Browser(app)
    browser = globales.greeter

    # browser.load()
    browser.show()
    sys.exit(app.exec())
