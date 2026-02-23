<div align="center">
  <a>
    <img
      alt="Web Greeter Icon"
      width="125"
      src="./dist/com.github.jezerm.web-greeter.svg"
    />
  </a>
  <h1><strong>Web Greeter</strong></h1>
  <p>
    <strong>A LightDM greeter made with PyQt6</strong>
  </p>
  <p>
    <a href="#">
      <img alt="License Information" src="https://img.shields.io/github/license/JezerM/web-greeter.svg">
    </a>
  </p>
</div>

A modern, visually appealing greeter for LightDM, that allows to create web based themes with HTML,
CSS and JavaScript.

Also, check out [nody-greeter][nody-greeter], a greeter made in **Node.js** with **Electron**!

## [See Live Demo][live_demo]

Gruvbox and Dracula themes!

## Features

- Create themes with HTML, CSS and JavaScript!
- Should work everywhere.
- JavaScript error handling, allowing to load the default theme.
- Themes could be simple, or very complex.
- Battery and brightness control.
- Tab completion for zsh and bash.

## Available distro packages

### Arch

- AUR: https://aur.archlinux.org/packages/web-greeter/

```sh
yay -S web-greeter
```

### Ubuntu/Debian

Download from the [latest release](https://github.com/JezerM/web-greeter/releases/latest) and
install with apt.

```sh
apt install ./web-greeter-VER-DISTRO.deb
```

## Dependencies
|                          |        arch          |          ubuntu         |       fedora        |        openSUSE       |          debian         |
|--------------------------|----------------------|-------------------------|---------------------|-----------------------|-------------------------|
|**liblightdm-gobject**    |lightdm               |liblightdm-gobject-1-dev |lightdm-gobject-devel|typelib-1_0-LightDM-1  |liblightdm-gobject-dev   |
|**pygobject**             |python-gobject        |python3-gi               |pygobject3           |python3-gobject        |python3-gi               |
|**gobject-introspection** |gobject-introspection |gobject-introspection    |gobject-introspection|gobject-introspection  |gobject-introspection    |
|**libxcb**                |libxcb                |libxcb1-dev              |libxcb-devel         |libxcb                 |libxcb1-dev              |
|**libx11**                |libx11                |libx11-dev               |libX11-devel         |libX11                 |libx11-dev               |

### Build dependencies

- Python 3.13 or above
- uv ([astral.sh][astral-uv])
- Meson
- Ninja
- tsc (`npm i -g typescript`)
- base-devel (build-essential)

## Download & Install
```sh
git clone --recursive https://github.com/JezerM/web-greeter.git
cd web-greeter
meson build -Dprefix=/usr/
ninja -C build
sudo ninja -C build install
```

This will build **web-greeter** with Pyside6 and Nuitka, and then package all the files to be installed.

See [latest release][releases].

### Uninstall

Use `sudo ninja -C build uninstall` to uninstall all files.

## Theme JavaScript API

Documentation is available at [web-greeter-page/docs][web-greeter-docs].

You can access the man-pages `man web-greeter` for some documentation and explanation. Also, you can
explore the provided [themes](https://github.com/JezerM/web-greeter-themes/tree/master/themes) for real use cases.

Additionally, you can install the TypeScript types definitions inside your theme with npm:

```sh
npm install nody-greeter-types
```

## Additional features

### Brightness control

`acpi` is the only tool needed to control the brightness, besides a compatible device.
This functionality is based on [acpilight][acpilight] replacement for `xbacklight`.

udev rules are needed to be applied before using it, check [acpilight rules][acpilight_rules].
Then, lightdm will need to be allowed to change backlight values, to do so add lightdm user
to the **video** group: `sudo usermod -a -G video lightdm`

Enable it inside `/etc/lightdm/web-greeter.toml`

### Battery status
`acpi` and `acpi_listen` are the only tools you need (and a battery).
This functionality is based on ["bat" widget][bat_widget] from ["lain" awesome-wm library][lain].

You can enable it inside `/etc/lightdm/web-greeter.toml`

## Debugging
You can run the greeter from within your desktop session if you add the following line to the desktop
file for your session located in `/usr/share/xsessions/`: `X-LightDM-Allow-Greeter=true`.

You have to log out and log back in after adding that line. Then you can run the greeter
from command line.

Themes can be opened with a debug console if you set `debug_mode` as `true`
inside `/etc/lightdm/web-greeter.toml`. Or, you could run the `web-greeter` with
the parameter `--debug`. I recommend to use the last one, as it is easier and handy.

```sh
web-greeter --debug
```

Check `web-greeter --help` for more commands.

> ***Note:*** Do not use `lightdm --test-mode` as it is not supported.

## Troubleshooting

Before setting **web-greeter** as your LightDM Greeter, you should make sure it does work also with LightDM:

- Run **web-greeter** as root with `--no-sandbox` flag ("Unable to determine socket to daemon" and "XLib" related errors are expected)
- Run `lightdm --test-mode`. Although it's not supported, if it does work then it could help to debug lightdm.

### LightDM crashes and tries to recover over and over again

LightDM does this when the greeter crashes, so it could mean **web-greeter** was not installed
correctly, or some dependencies were updated/removed after a distro update.

[nody-greeter]: https://github.com/JezerM/nody-greeter "Nody Greeter"
[astral-uv]: https://docs.astral.sh/uv/ "Astral UV"
[acpilight]: https://gitlab.com/wavexx/acpilight/ "acpilight"
[acpilight_rules]: https://gitlab.com/wavexx/acpilight/-/blob/master/90-backlight.rules "udev rules"
[bat_widget]: https://github.com/lcpz/lain/blob/master/widget/bat.lua "Battery widget"
[lain]: https://github.com/lcpz/lain "Lain awesome library"
[web-greeter-docs]: https://web-greeter-page.vercel.app "Documentation"
[live_demo]: https://jezerm.github.io/web-greeter-themes/ "Live Demo"
[releases]: https://github.com/JezerM/web-greeter/releases "Releases"
