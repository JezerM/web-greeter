<a id="LightDM_ThemeUtils"></a>

## LightDM.ThemeUtils
Provides various utility methods for use in greeter themes. The greeter will automatically
create an instance of this class when it starts. The instance can be accessed
with the global variable: `theme_utils`

<a id="LightDM_ThemeUtils-bind_this"></a>

### theme_utils.bind\_this(context) ⇒ <code>object</code>
Binds `this` to class, `context`, for all of the class's methods.

**Returns**: <code>object</code> - `context` with `this` bound to it for all of its methods.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>context</td><td><code>object</code></td><td><p>An ES6 class instance with at least one method.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_ThemeUtils-dirlist"></a>

### theme_utils.dirlist(path, only_images, callback)
Returns the contents of directory found at `path` provided that the (normalized) `path`
meets at least one of the following conditions:
  * Is located within the greeter themes' root directory.
  * Has been explicitly allowed in the greeter's config file.
  * Is located within the greeter's shared data directory (`/var/lib/lightdm-data`).
  * Is located in `/tmp`.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>path</td><td><code>string</code></td><td></td><td><p>The abs path to desired directory.</p>
</td>
    </tr><tr>
    <td>only_images</td><td><code>boolean</code></td><td><code>true</code></td><td><p>Include only images in the results. Default <code>true</code>.</p>
</td>
    </tr><tr>
    <td>callback</td><td><code>function</code></td><td></td><td><p>Callback function to be called with the result.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_ThemeUtils-get_current_localized_date"></a>

### theme_utils.get\_current\_localized\_date() ⇒ <code>String</code>
Get the current date in a localized format. Local language is autodetected by default, but can be set manually in the greeter config file.
	 * `language` defaults to the system's language, but can be set manually in the config file.

**Returns**: <code>String</code> - The current date.  
<a id="LightDM_ThemeUtils-get_current_localized_time"></a>

### theme_utils.get\_current\_localized\_time() ⇒ <code>String</code>
Get the current time in a localized format. Local language is autodetected by default, but can be set manually in the greeter config file.
	 * `language` defaults to the system's language, but can be set manually in the config file.

**Returns**: <code>String</code> - The current time.  
