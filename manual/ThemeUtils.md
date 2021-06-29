Provides various utility methods for use in greeter themes. The greeter will automatically create an instance of this class when it starts. The instance can be accessed with the global variable: `theme_utils`

# Methods

## bind_this(context)
Bind **this** to class, **context**, for all of the class's methods.

**Arguments**:
- `context` [Object]
  An ES6 class instance with at least one method.

**Returns**:
- Object
  **context** with **this** bound to it for all of its methods.

## dirlist(path)
Returns the contents of a directory found at **path**, only if the **path** meets at least one of the following conditions:
- Is located whithin the greeter theme's root directory.
- Has been explicitly allowed in the greeter's config file.
- Is located within the greeter's shared data directory (**/var/lib/lightdm-data/**)
- Is located in **/tmp**.

**Arguments**:
- `path` [String]
  The abs path to desired directory.

**Returns**:
- Array&lt;String&gt;
  List of abs paths for the files and directories found in **path**

## get_current_localized_time()
Get the current time in a localized format. Time format and language are auto-detected by default, but can be set manually in the greeter config file.
- **language** defaults to the system's language, but can be set manually in the config gile.
- When **time_format** config file option has a valid value, time will be formatted according to that value.
- When **time_format** does not have a valid value, the time format will be **LT** which is **1:00 PM** or **13:00** depending on the system's locale.

**Returns**:
- String
  The current localized time.
