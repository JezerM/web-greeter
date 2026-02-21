tsc = find_program('tsc', '/usr/bin/tsc', '/usr/lib/node_modules/typescript/bin/tsc', required: true)

custom_target(
  'theme_gruvbox',
  build_always_stale: true,
  build_by_default: true,
  command: [tsc, '--build', '@INPUT@'],
  console: true,
  input: '../themes/themes/gruvbox/tsconfig.json',
  output: 'gruvbox'
)
custom_target(
  'theme_dracula',
  build_always_stale: true,
  build_by_default: true,
  command: [tsc, '--build', '@INPUT@'],
  console: true,
  input: '../themes/themes/dracula/tsconfig.json',
  output: 'dracula'
)

install_subdir(
  '../themes/themes/gruvbox',
  install_dir: '/usr/share/web-greeter/themes',
  strip_directory: false
)
install_subdir(
  '../themes/themes/dracula',
  install_dir: '/usr/share/web-greeter/themes',
  strip_directory: false
)
install_subdir(
  '../themes/themes/simple',
  install_dir: '/usr/share/web-greeter/themes',
  strip_directory: false
)
install_subdir(
  '../themes/themes/_vendor',
  install_dir: '/usr/share/web-greeter/',
  strip_directory: false
)

icon = 'com.github.jezerm.web-greeter.svg'
install_data(
  icon,
  install_dir: '/usr/share/icons/hicolor/scalable/apps',
)

install_data('web-greeter.toml', install_dir: '/etc/lightdm')
install_data('web-xgreeter.desktop', install_dir: '/usr/share/xgreeters/', rename: 'web-greeter.desktop')
