<a id="window"></a>

## window : <code>object</code>
The global window object.

<a id="window_lightdm"></a>

### window.lightdm : [<code>Greeter</code>](Greeter)
Greeter Instance

<a id="window_greeter_config"></a>

### window.greeter\_config : [<code>GreeterConfig</code>](GreeterConfig)
Greeter Config - Access values from the greeter's config file.

<a id="window_theme_utils"></a>

### window.theme\_utils : [<code>ThemeUtils</code>](ThemeUtils)
Theme Utils - various utility methods for use in greeter themes.

<a id="window_Cookies"></a>

### window.Cookies : <code>object</code>
JS-Cookie instance - Themes must manually load the included vendor script in order to use this object.

**See**: [JS Cookie Documentation](https://github.com/js-cookie/js-cookie/tree/latest#readme)  
**Version**: 2.1.3  
<a id="window_event_GreeterReady"></a>

### "GreeterReady"
Greeter Ready Event. Themes should not initialize until this event has fired.
Event accesible through `window._ready_event`

