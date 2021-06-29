Provides greeter themes with a way to access values from the greeter's config file located at **/etc/lightdm/web-greeter.yml**. The greeter will create an instance of this class when it starts. The instance can be accessed with the global variable: `greeter_config`

# Members

## branding
**Type**: [Object]

Holds keys&values from the **branding** section of the config file.

**Properties**:
- **background_images_dir**
  Path to directory that contains background images for use in greeter themes.
- **logo_image**
  Path to distro logo image for use in greeter themes
- **user_image**
  Default user image/avatar.

## greeter
**Type**: [Object]

Holds keys/values from the **greeter** section of the config file.

**Properties**:
- **debug_mode**
  Greeter theme debug mode.
- **detect_theme_errors**
  Provide an option to load default theme when theme errors are detected.
- **screensaver_timeout**
  Blank the screen after this seconds of inactivity.
- **secure_mode**
  Don't allow themes to make http requests.
- **time_format**
  A moment.js format string to be used by the greeter to generate localized time for display.
- **time_language**
  Language to use when displaying the time, or **auto** to use the system's language.
- **theme**
  The name of the theme to be used by the greeter.

## features
**Type**: [Object]

Holds keys/values from the **features** section of the config file.

**Properties**:
- **battery**
  Enable greeter and themes to get battery status.
- **backlight**
  - **enabled**
    Enable greeter and themes to control display backlight.
  - **value**
    The amount to increase/decrease brightness by greeter.
  - **steps**
    How many steps are needed to do the change. **0** for instant change
