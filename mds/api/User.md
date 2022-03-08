<a id="LightDM_User"></a>

## LightDM.User
Interface for object that holds info about a user account on the system. User
objects are not created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.

<a id="LightDM_User-background"></a>

### user.background : <code>string</code>
The user background if any

**Read only**: true
<a id="LightDM_User-display_name"></a>

### user.display\_name : <code>string</code>
The display name for the user.

**Read only**: true
<a id="LightDM_User-language"></a>

### user.language : <code>string</code>
The language for the user.

**Read only**: true
<a id="LightDM_User-layout"></a>

### user.layout : <code>string</code>
The keyboard layout for the user.

**Read only**: true
<a id="LightDM_User-layouts"></a>

### user.layouts : <code>Array.&lt;string&gt;</code>
The keyboard layouts the user have. You should not depend on this property, use [`greeter_config.layouts`](/api/GreeterConfig#LightDM_GreeterConfig-layouts) instead.

**Read only**: true
<a id="LightDM_User-image"></a>

### user.image : <code>string</code>
The image for the user.

**Read only**: true
<a id="LightDM_User-home_directory"></a>

### user.home\_directory : <code>string</code>
The home_directory for the user.

**Read only**: true
<a id="LightDM_User-username"></a>

### user.username : <code>string</code>
The username for the user.

**Read only**: true
<a id="LightDM_User-logged_in"></a>

### user.logged\_in : <code>Boolean</code>
Whether or not the user is currently logged in.

**Read only**: true
<a id="LightDM_User-session"></a>

### user.session : <code>string</code>
The last session that the user logged into.

**Read only**: true
