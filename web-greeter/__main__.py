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
import sys, argparse, os
from typing import List

# 3rd-Party Libs
import globals
import config

def list_themes() -> List[str]:
    themes_dir = config.web_greeter_config["app"]["theme_dir"]
    themes_dir = themes_dir if os.path.exists(themes_dir) else "/usr/share/web-greeter/themes"
    filenames = os.listdir(themes_dir)

    dirlist = []
    for file in filenames:
        if os.path.isdir(os.path.join(themes_dir, file)):
            dirlist.append(file)

    return dirlist

def print_themes():
    themes_dir = config.web_greeter_config["app"]["theme_dir"]
    themes_dir = themes_dir if os.path.exists(themes_dir) else "/usr/share/web-greeter/themes"
    themes = list_themes()
    print("Themes are located in {themes_dir}\n".format(themes_dir = themes_dir))
    for theme in themes:
        print("-", theme)


def set_theme(theme: str):
    config.web_greeter_config["config"]["greeter"]["theme"] = theme

def set_debug(value: bool):
    conf = config.web_greeter_config["config"]
    app = config.web_greeter_config["app"]
    conf["greeter"]["debug_mode"] = value
    app["frame"] = value
    app["fullscreen"] = not value

def parse(argv):
    version = config.web_greeter_config["app"]["version"]["full"]
    parser = argparse.ArgumentParser(prog="web-greeter", add_help=False)
    parser.add_argument("-h", "--help", action="help", help="Show this help message and exit")
    parser.add_argument("-v", "--version", action="version", version=version, help="Show version number")

    parser.add_argument("--debug", action="store_true", help="Run the greeter in debug mode", dest="debug", default=None)
    parser.add_argument("--normal", action="store_false", help="Run in non-debug mode", dest="debug")
    parser.add_argument("--list", action="store_true", help="List available themes")
    parser.add_argument("--theme", help="Set the theme to use", metavar="[name]")
    parser.add_argument("--no-sandbox", action="store_true", help=argparse.SUPPRESS)

    args: argparse.Namespace

    try:
        args = parser.parse_args(argv)
    except argparse.ArgumentError:
        sys.exit()

    # print(args)

    if (args.list):
        print_themes()
        sys.exit()
    if (args.theme):
        set_theme(args.theme)
    if (args.debug != None):
        set_debug(args.debug)

if __name__ == '__main__':
    parse(sys.argv[1:])

    from browser.browser import Browser

    globals.greeter = Browser()
    greeter = globals.greeter
    greeter.run()
