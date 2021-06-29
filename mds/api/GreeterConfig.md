<a id="LightDM.GreeterConfig"></a>

## LightDM.GreeterConfig
Provides greeter themes with a way to access values from the greeter's config
file located at `/etc/lightdm/web-greeter.yml`. The greeter will
create an instance of this class when it starts. The instance can be accessed
with the global variable: `greeter_config`.

<a id="LightDM.GreeterConfig+branding"></a>

### greeterConfig.branding : <code>object</code>
Holds keys/values from the `branding` section of the config file.

**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| background_images_dir | <code>string</code> | Path to directory that contains background images                                      for use in greeter themes. |
| logo | <code>string</code> | Path to distro logo image for use in greeter themes. |
| user_image | <code>string</code> | Default user image/avatar. This is used by greeter themes                                      for users that have not configured a `.face` image. |

<a id="LightDM.GreeterConfig+greeter"></a>

### greeterConfig.greeter : <code>object</code>
Holds keys/values from the `greeter` section of the config file.

**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| debug_mode | <code>boolean</code> | Greeter theme debug mode. |
| detect_theme_errors | <code>boolean</code> | Provide an option to load a fallback theme when theme                                     errors are detected. |
| screensaver_timeout | <code>number</code> | Blank the screen after this many seconds of inactivity. |
| secure_mode | <code>boolean</code> | Don't allow themes to make remote http requests. |
| time_format | <code>string</code> | A moment.js format string to be used by the greeter to                                     generate localized time for display. |
| time_language | <code>string</code> | Language to use when displaying the time or `auto`                                     to use the system's language. |
| theme | <code>string</code> | The name of the theme to be used by the greeter. |

<a id="LightDM.GreeterConfig+features"></a>

### greeterConfig.features : <code>Object</code>
Holds keys/values from the `features` section of the config file.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| battery | <code>Boolean</code> | Enable greeter and themes to ger battery status. |
| backlight | <code>Object</code> |  |
| backlight.enabled | <code>Boolean</code> | Enable greeter and themes to control display backlight. |
| backlight.value | <code>Number</code> | The amount to increase/decrease brightness by greeter. |
| backlight.steps | <code>Number</code> | How many steps are needed to do the change. |

