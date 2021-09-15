<a id="LightDM_GreeterConfig"></a>

## LightDM.GreeterConfig
Provides greeter themes with a way to access values from the greeter's config
file located at `/etc/lightdm/web-greeter.yml`. The greeter will
create an instance of this class when it starts. The instance can be accessed
with the global variable: `greeter_config`.

<a id="LightDM_GreeterConfig-branding"></a>

### greeter_config.branding : <code>object</code>
Holds keys/values from the `branding` section of the config file.

**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>background_images_dir</td><td><code>string</code></td><td><p>Path to directory that contains background images
                                     for use in greeter themes.</p>
</td>
    </tr><tr>
    <td>logo</td><td><code>string</code></td><td><p>Path to distro logo image for use in greeter themes.</p>
</td>
    </tr><tr>
    <td>user_image</td><td><code>string</code></td><td><p>Default user image/avatar. This is used by greeter themes
                                     for users that have not configured a <code>.face</code> image.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_GreeterConfig-greeter"></a>

### greeter_config.greeter : <code>object</code>
Holds keys/values from the `greeter` section of the config file.

**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>debug_mode</td><td><code>boolean</code></td><td><p>Greeter theme debug mode.</p>
</td>
    </tr><tr>
    <td>detect_theme_errors</td><td><code>boolean</code></td><td><p>Provide an option to load a fallback theme when theme
                                    errors are detected.</p>
</td>
    </tr><tr>
    <td>screensaver_timeout</td><td><code>number</code></td><td><p>Blank the screen after this many seconds of inactivity.</p>
</td>
    </tr><tr>
    <td>secure_mode</td><td><code>boolean</code></td><td><p>Don&#39;t allow themes to make remote http requests.
                                    generate localized time for display.</p>
</td>
    </tr><tr>
    <td>time_language</td><td><code>string</code></td><td><p>Language to use when displaying the time or &quot;&quot;
                                    to use the system&#39;s language.</p>
</td>
    </tr><tr>
    <td>theme</td><td><code>string</code></td><td><p>The name of the theme to be used by the greeter.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_GreeterConfig-features"></a>

### greeter_config.features : <code>Object</code>
Holds keys/values from the `features` section of the config file.

**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>battery</td><td><code>boolean</code></td><td><p>Enable greeter and themes to ger battery status.</p>
</td>
    </tr><tr>
    <td>backlight</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>enabled</td><td><code>boolean</code></td><td><p>Enable greeter and themes to control display backlight.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>number</code></td><td><p>The amount to increase/decrease brightness by greeter.</p>
</td>
    </tr><tr>
    <td>steps</td><td><code>number</code></td><td><p>How many steps are needed to do the change.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_GreeterConfig-layouts"></a>

### greeter_config.layouts : [<code>Array.&lt;Layout&gt;</code>](Layout)
Holds a list of preferred layouts from the `layouts` section of the config file.

**Read only**: true  
