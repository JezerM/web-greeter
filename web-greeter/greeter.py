#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
#  greeter.py
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
import sys
import yaml
import pkg_resources
import os
from typing import (
    ClassVar,
    Type,
    List,
    Tuple,
)
from logging import (
    getLogger,
    DEBUG,
    Formatter,
    StreamHandler,
)

# 3rd-Party Libs

# This Application
from utils import config

import globals
from globals import WebGreeter

def loadWhitherConf():
    global whither_yaml
    global webGreeter_conf
    global file_test
    try:
        file_test = pkg_resources.resource_string("__main__", 'whither.yml').decode('utf-8')
    except Exception:
        file_test = pkg_resources.resource_string(__file__, 'whither.yml').decode('utf-8')

    whither_yaml = yaml.safe_load(file_test)
    webGreeter_conf = whither_yaml["WebGreeter"]


def debugLog(txt: str):
    log_format = ''.join([
        '%(asctime)s [ %(levelname)s ] %(module)s - %(filename)s:%(',
        'lineno)d : %(funcName)s | %(message)s'
    ])

    formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
    stream_handler = StreamHandler()
    logger = getLogger()

    stream_handler.setLevel(DEBUG)
    stream_handler.setFormatter(formatter)
    logger.setLevel(DEBUG)
    logger.addHandler(stream_handler)
    logger.debug(txt)

def show_help():
    version = webGreeter_conf["app"]["version"]["full"]
    help_text = """Usage:
  web-greeter [OPTION...] - LightDM Web Greeter

  --debug                   Runs the greeter in debug mode
  --normal                  Runs in non-debug mode

  --list                    Lists available themes
  --theme                   Sets the theme to use

  -h, --help                Show this help list
  -v, --version             Print program version""".format(
    version = version
)
    print(help_text)


def show_version():
    version = webGreeter_conf["app"]["version"]["full"]
    print("{version}".format(version = version))

def changeConfig(option: str, value):
    custom_config[option] = value
    return

def debugMode(value: bool):
    if value:
        custom_config["debug_mode"] = True
        custom_config["decorated"] = True
        custom_config["stays_on_top"] = False
    else:
        custom_config["debug_mode"] = False
        custom_config["decorated"] = False
        custom_config["stays_on_top"] = True
    pass

def changeTheme(theme: str):
    dirlist = listThemes(True)

    if theme in dirlist:
        custom_config["theme"] = theme
    else:
        debugLog("Theme not found. Going with config theme")
    return

def listThemes(quiet = False):
    themes_dir = webGreeter_conf["app"]["themes_dir"]
    themes_dir = themes_dir if os.path.exists(themes_dir) else "/usr/share/web-greeter/themes"
    filenames = os.listdir(themes_dir)

    dirlist = []
    for file in filenames:
        if os.path.isdir(os.path.join(themes_dir, file)):
            dirlist.append(file)

    if not quiet:
        print("Themes are located in {themes_dir}\n".format(themes_dir = themes_dir))
        for theme in dirlist:
            print("-", theme)

    return dirlist

args_lenght = sys.argv.__len__()

def yargs(args: List[str]):
    loadWhitherConf()
    used = 0

    if args[0] == "--help" or args[0] == "-h":
        show_help()
        used+=1
        exit()
    elif args[0] == "--version" or args[0] == "-v":
        show_version()
        used+=1
        exit()
    elif args[0] == "--debug":
        changeConfig("debug_mode", True)
        used+=1
        pass
    elif args[0] == "--normal":
        changeConfig("debug_mode", False)
        used+=1
        pass
    elif args[0] == "--theme":
        if args.__len__() > 1 :
            changeTheme(args[1])
            used+=2
        else:
            print("No theme provided")
            used+=1
            exit(1)
    elif args[0] == "--list":
        listThemes()
        used+=1
        exit()
    else:
        show_help()
        used+=1
        exit(1)
    for x in range(used):
        args.pop(0)
    if args.__len__() != 0:
        yargs(args)
    pass

if __name__ == '__main__':
    custom_config = globals.custom_config

    if args_lenght > 1:
        args = sys.argv
        args.pop(0)
        yargs(args)


    globals.greeter = WebGreeter()

    globals.greeter.run()
