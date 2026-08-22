# Nix package for web-greeter
#
# Runs the Python sources directly rather than reproducing the meson build: upstream drives that through
# uv, which cannot fetch inside the Nix sandbox. Every dependency but dataclass-binder is already in nixpkgs.
#
{
  lib,
  stdenv,
  fetchPypi,
  linkFarm,
  makeWrapper,
  python3Packages,
  qt6,
  typescript,
  lightdm,
  glib,
  libx11,
  acpid,
  src ? lib.cleanSource ../.,
}:
let
  dataclass-binder = python3Packages.buildPythonPackage rec {
    pname = "dataclass-binder";
    version = "0.3.5";
    pyproject = true;
    src = fetchPypi {
      pname = "dataclass_binder";
      inherit version;
      hash = "sha256-nk5F1CLVhQU/VBk+/HYUTRHqHvkBMwctYs+gngN1PvU=";
    };
    build-system = [ python3Packages.poetry-core ];
    doCheck = false;
    pythonImportsCheck = [ "dataclass_binder" ];
  };

  pythonEnv = python3Packages.python.withPackages (ps: [
    ps.pygobject3
    ps.pyside6
    ps.inotify
    dataclass-binder
  ]);
in
stdenv.mkDerivation (finalAttrs: {
  pname = "web-greeter";
  version = "4.0.0";

  inherit src;

  nativeBuildInputs = [
    makeWrapper
    qt6.wrapQtAppsHook
    typescript
  ];

  buildInputs = [
    libx11
    qt6.qtbase
    qt6.qtwebengine
  ];

  dontWrapQtApps = true; # The wrapper below applies qtWrapperArgs itself

  postPatch = ''
    substituteInPlace src/cli.py src/config.py \
        --replace-fail '/usr/share/web-greeter/themes' "$out/share/web-greeter/themes"
    substituteInPlace data/web-xgreeter.desktop \
        --replace-fail 'Exec=web-greeter' "Exec=$out/bin/web-greeter"
  '';

  buildPhase = ''
    runHook preBuild

    # Nix skips submodules unless asked, and the themes are one; say so rather than failing inside tsc
    if [ ! -d themes/themes ]; then
        echo "themes submodule missing: fetch this flake with ?submodules=1" >&2
        exit 1
    fi

    $CC -shared -fPIC -o src/bindings/_screensaver.so src/bindings/screensaver.c -lX11

    # rcc resolves the qrc entries relative to its own working directory
    (cd src/resources && ${qt6.qtbase}/libexec/rcc -g python resources.qrc -o rc_resources.py)

    for theme in gruvbox dracula; do
        tsc --build themes/themes/$theme/tsconfig.json
    done

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share/web-greeter/themes
    cp -r src $out/share/web-greeter/app
    cp -r themes/themes/_vendor $out/share/web-greeter/_vendor
    cp -r themes/themes/gruvbox themes/themes/dracula themes/themes/simple $out/share/web-greeter/themes/

    install -Dm644 data/web-greeter.toml -t $out/share/web-greeter
    install -Dm644 data/web-xgreeter.desktop $out/share/xgreeters/web-greeter.desktop
    install -Dm644 data/com.github.jezerm.web-greeter.svg -t $out/share/icons/hicolor/scalable/apps
    install -Dm644 data/web-greeter.1 -t $out/share/man/man1

    makeWrapper ${pythonEnv}/bin/python $out/bin/web-greeter \
        --add-flags $out/share/web-greeter/app/__main__.py \
        "''${qtWrapperArgs[@]}" \
        --prefix GI_TYPELIB_PATH : "${
          lib.makeSearchPath "lib/girepository-1.0" [
            lightdm
            glib.out
          ]
        }" \
        --prefix LD_LIBRARY_PATH : "${lib.makeLibraryPath [ lightdm ]}" \
        --prefix PATH : "${lib.makeBinPath [ acpid ]}" # acpi_listen, without which the battery reading never refreshes

    runHook postInstall
  '';

  # LightDM points greeters-directory at a bare directory of .desktop files, not at a package
  passthru.xgreeters = linkFarm "web-greeter-xgreeters" [
    {
      path = "${finalAttrs.finalPackage}/share/xgreeters/web-greeter.desktop";
      name = "web-greeter.desktop";
    }
  ];

  meta = {
    description = "LightDM greeter themeable with HTML, CSS and JavaScript";
    homepage = "https://github.com/JezerM/web-greeter";
    license = lib.licenses.gpl3Plus;
    platforms = lib.platforms.linux;
    mainProgram = "web-greeter";
  };
})
