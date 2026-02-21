project(
    'web-greeter', 'c',
    version: '4.0.0',
    license: 'GPL-3.0-or-later',
    default_options: ['warning_level=3']
)

as_version = meson.project_version()

conf = configuration_data()

conf.set('VERSION', '"@0@"'.format(as_version))
conf.set('API_VERSION', '"@0@"'.format('1.0.0'))

uv = find_program('uv', required: true)

custom_target(
    'uv sync',
    output: 'uv_sync_stamp',
    command: [uv, 'sync'],
    build_by_default: true
)

subdirs = ['src', 'data']

foreach s : subdirs
  subdir(s)
endforeach
