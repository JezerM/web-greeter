# Web Greeter for LightDM

A modern, visually appealing greeter for LightDM, that allows to create web based themes with HTML, CSS and JavaScript.

This is a try to update the [Antergos web-greeter](https://github.com/Antergos/web-greeter), following what they left.

As this is based on the [master release](https://github.com/Antergos/web-greeter/tree/master), which does some API changes, actual themes would need to do changes to work correctly.

Checkout [nody-greeter][nody-greeter], a greeter made in **Node.js** with **Electron**! (Actually, faster than Web Greeter)

## [See Live Demo][live_demo]

Gruvbox and Dracula themes!

## Features

- Create themes with HTML, CSS and JavaScript!
- Should work everywhere.
- JavaScript error handling, allowing to load the default theme.
- Themes could be simple, or very complex.
- Battery and brightness control.
- Tab completion for zsh and bash.

## Dependencies
|                       |     arch      |        ubuntu        |       fedora        |       openSUSE        |
|-----------------------|---------------|----------------------|---------------------|-----------------------|
|**liblightdm-gobject** |lightdm        |liblightdm-gobject-dev|lightdm-gobject-devel|liblightdm-gobject-1-0 |
|**pygobject**          |python-gobject |python3-gi            |pygobject3           |python3-gobject        |
|**pyqt5**              |python-pyqt5   |python3-pyqt5         |python3-qt5          |python3-qt5            |
|**qt5-webengine**      |qt5-webengine  |libqt5webengine5      |qt5-qtwebengine      |libqt5-qtwebengine     |

### PIP
- PyGObject
- PyQt5
- PyQtWebEngine
- ruamel.yaml
- python-xlib
- [cx_freeze](https://cx-freeze.readthedocs.io/en/latest/installation.html) (and patchelf)

Install PIP dependencies with:
```sh
pip install -r requirements.txt
```

> ***NOTE*** Be sure to install pip libraries as root too, or use a venv to install these dependencies

## Download & Install
```sh
git clone https://github.com/JezerM/web-greeter.git
cd web-greeter
sudo pip install -r requirements.txt
sudo make install
```

This will build and install **web-greeter** with [cx_freeze][cx_freeze]. Either `sudo make install_old`, which will use the old zippy way to install **web-greeter**; it's strongly recommended to not use the last one, as it depends on the actual python interpreter and its libraries. Update python or delete a library, and **web-greeter** won't work.

See [latest release][releases].

## Theme JavaScript API
[Antergos][Antergos] documentation is no longer available, although it is accesible through [Web Archive][WebArchive]. Actual documentation is available in [gh-pages][gh-pages].

You can access the man-pages `man web-greeter` for some documentation and explanation. Also, you can explore the provided [themes](./themes) for real use cases.

## Enable features
### Brightness control
To control the brightness inside the greeter, I recommend to use [acpilight][acpilight] replacement for `xbacklight`.

udev rules are needed to be applied before using it. Then, lightdm will need to be allowed to change backlight values, to do so add lightdm user to **video** group: `sudo usermod -a -G video lightdm`

If you don't want to or don't have a compatible device, disable it inside `/etc/lightdm/web-greeter.yml` (disabled by default)

### Battery status
`acpi` is the only tool you need (and a battery).

You can disable it inside `/etc/lightdm/web-greeter.yml` (disabled by default)

## Debugging
You can run the greeter from within your desktop session if you add the following line to the desktop file for your session located in `/usr/share/xsessions/`: `X-LightDM-Allow-Greeter=true`.

You have to log out and log back in after adding that line. Then you can run the greeter from command line.

Themes can be opened with a debug console if you set `debug_mode` as `true` inside `/etc/lightdm/web-greeter.yml`. Or, you could run the `web-greeter` with the parameter `--debug`. I recommend to use the last one, as it is easier and handy.

```sh
web-greeter --debug
```

> ***Note:*** Do not use `lightdm --test-mode` as it is not supported.

[antergos]: https://github.com/Antergos "Antergos"
[nody-greeter]: https://github.com/JezerM/nody-greeter "Nody Greeter"
[cx_freeze]: https://github.com/marcelotduarte/cx_Freeze "cx_Freeze"
[acpilight]: https://gitlab.com/wavexx/acpilight "acpilight"
[WebArchive]: https://web.archive.org/web/20190524032923/https://doclets.io/Antergos/web-greeter/stable "Web Archive"
[gh-pages]: https://jezerm.github.io/web-greeter/ "API Documentation"
[live_demo]: https://jezerm.github.io/web-greeter-themes/ "Live Demo"
[releases]: https://github.com/JezerM/web-greeter/releases "Releases"
