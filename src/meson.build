python = find_program('uv', required: true)

x11_dep = dependency('x11')
xcb_dep = dependency('xcb')

# Build C shared lib
screensaver = shared_library(
    '_screensaver',
    'bindings/screensaver.c',
    name_prefix: '',
    dependencies: [ x11_dep, xcb_dep ],
    install: false
)

# Build Qt resources
qt_build = custom_target(
    'qt_build',
    output: 'qt_stamp',
    command: ['uv', 'run', 'pyside6-project', 'build', '@SOURCE_ROOT@'],
    build_by_default: true
)

include_data_files = [
    'src/_screensaver.so' + '=' + 'bindings/_screensaver.so',
]

qt_plugins = [
    'networkinformation',
    'platforminputcontexts',
    'position',
]

gi_modules = [
    'gi._gi',
    'gi._enum',
    'gi._error',
    'gi._option',
]

# Nuitka standalone build (NOT onefile)
nuitka = custom_target(
    'nuitka',
    input: '__main__.py',
    output: 'greeter_stamp',
    depends: [screensaver, qt_build],
    command: [
        'uv', 'run', 'python', '-m', 'nuitka',
        '--standalone',
        '--follow-imports',
        '--output-filename=' + meson.project_name(),
        '--output-folder-name=' + meson.project_name(),
        '--output-dir=@BUILD_ROOT@/src',
        '--product-name=' + meson.project_name(),
        '--product-version=' + meson.project_version(),
        '--copyright=' + meson.project_license().get(0),
        '--enable-plugin=pyside6',
        '--noinclude-qt-translations',
        '--include-qt-plugins=' + ','.join(qt_plugins),
        '--include-module=' + ','.join(gi_modules),
        '--include-data-files=' + ','.join(include_data_files),
        '--noinclude-data-files=**/*.typelib', # Do not include girepository typelibs
        '@INPUT@',
    ],
    build_by_default: true
)
