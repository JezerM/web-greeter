<a id="LightDM.ThemeUtils"></a>

## LightDM.ThemeUtils
Provides various utility methods for use in greeter themes. The greeter will automatically
create an instance of this class when it starts. The instance can be accessed
with the global variable: [`theme_utils`](#dl-window-theme_utils).

<a id="LightDM.ThemeUtils+bind_this"></a>

### themeUtils.bind\_this(context) ⇒ <code>Object</code>
Binds `this` to class, `context`, for all of the class's methods.

**Returns**: <code>Object</code> - `context` with `this` bound to it for all of its methods.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | An ES6 class instance with at least one method. |

<a id="LightDM.ThemeUtils+dirlist"></a>

### themeUtils.dirlist(path, only_images, callback)
Returns the contents of directory found at `path` provided that the (normalized) `path`
meets at least one of the following conditions:
  * Is located within the greeter themes' root directory.
  * Has been explicitly allowed in the greeter's config file.
  * Is located within the greeter's shared data directory (`/var/lib/lightdm-data`).
  * Is located in `/tmp`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>String</code> |  | The abs path to desired directory. |
| only_images | <code>Boolean</code> | <code>true</code> | Include only images in the results. Default `true`. |
| callback | <code>function</code> |  | Callback function to be called with the result. |

<a id="LightDM.ThemeUtils+get_current_localized_time"></a>

### themeUtils.get\_current\_localized\_time() ⇒ <code>String</code>
Get the current time in a localized format. Time format and language are auto-detected
by default, but can be set manually in the greeter config file.
  * `language` defaults to the system's language, but can be set manually in the config file.
  * When `time_format` config file option has a valid value, time will be formatted
    according to that value.
  * When `time_format` does not have a valid value, the time format will be `LT`
    which is `1:00 PM` or `13:00` depending on the system's locale.

**Returns**: <code>String</code> - The current localized time.  
