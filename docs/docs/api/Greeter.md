<a id="LightDM.Greeter"></a>

## LightDM.Greeter
Base class for the greeter's Theme JavaScript API. Greeter themes will interact
directly with an object derived from this class to facilitate the user log-in process.
The greeter will automatically create an instance when it starts.
The instance can be accessed using the global variable: `lightdm`.

<a id="LightDM.Greeter+authentication_user"></a>

### greeter.authentication\_user : <code>String</code> \| <code>Null</code>
The username of the user being authenticated or [null](null)
if no authentication is in progress

**Read only**: true  
<a id="LightDM.Greeter+autologin_guest"></a>

### greeter.autologin\_guest : <code>Boolean</code>
Whether or not the guest account should be automatically logged
into when the timer expires.

**Read only**: true  
<a id="LightDM.Greeter+autologin_timeout"></a>

### greeter.autologin\_timeout : <code>Number</code>
The number of seconds to wait before automatically logging in.

**Read only**: true  
<a id="LightDM.Greeter+autologin_user"></a>

### greeter.autologin\_user : <code>String</code>
The username with which to automattically log in when the timer expires.

**Read only**: true  
<a id="LightDM.Greeter+batteryData"></a>

### greeter.batteryData : <code>Battery</code>
The battery data

**Read only**: true  
<a id="LightDM.Greeter+brightness"></a>

### greeter.brightness : <code>Number</code>
The display brightness

<a id="LightDM.Greeter+can_access_battery"></a>

### greeter.can\_access\_battery : <code>boolean</code>
Whether or not the greeter can access to battery data.

**Read only**: true  
<a id="LightDM.Greeter+can_access_brightness"></a>

### greeter.can\_access\_brightness : <code>boolean</code>
Whether or not the greeter can control display brightness.

**Read only**: true  
<a id="LightDM.Greeter+can_hibernate"></a>

### greeter.can\_hibernate : <code>Boolean</code>
Whether or not the greeter can make the system hibernate.

**Read only**: true  
<a id="LightDM.Greeter+can_restart"></a>

### greeter.can\_restart : <code>Boolean</code>
Whether or not the greeter can make the system restart.

**Read only**: true  
<a id="LightDM.Greeter+can_shutdown"></a>

### greeter.can\_shutdown : <code>Boolean</code>
Whether or not the greeter can make the system shutdown.

**Read only**: true  
<a id="LightDM.Greeter+can_suspend"></a>

### greeter.can\_suspend : <code>Boolean</code>
Whether or not the greeter can make the system suspend/sleep.

**Read only**: true  
<a id="LightDM.Greeter+default_session"></a>

### greeter.default\_session : <code>String</code>
The name of the default session.

**Read only**: true  
<a id="LightDM.Greeter+has_guest_account"></a>

### greeter.has\_guest\_account : <code>Boolean</code>
Whether or not guest sessions are supported.

**Read only**: true  
<a id="LightDM.Greeter+hide_users_hint"></a>

### greeter.hide\_users\_hint : <code>boolean</code>
Whether or not user accounts should be hidden.

**Read only**: true  
<a id="LightDM.Greeter+hostname"></a>

### greeter.hostname : <code>String</code>
The system's hostname.

**Read only**: true  
<a id="LightDM.Greeter+in_authentication"></a>

### greeter.in\_authentication : <code>Boolean</code>
Whether or not the greeter is in the process of authenticating.

**Read only**: true  
<a id="LightDM.Greeter+is_authenticated"></a>

### greeter.is\_authenticated : <code>Boolean</code>
Whether or not the greeter has successfully authenticated.

**Read only**: true  
<a id="LightDM.Greeter+language"></a>

### greeter.language : <code>Language</code> \| <code>null</code>
The current language or [null](null) if no language.

**Read only**: true  
<a id="LightDM.Greeter+languages"></a>

### greeter.languages : <code>Array.&lt;Language&gt;</code>
A list of languages to present to the user.

**Read only**: true  
<a id="LightDM.Greeter+layout"></a>

### greeter.layout : <code>Layout</code>
The currently active layout for the selected user.

<a id="LightDM.Greeter+layouts"></a>

### greeter.layouts : <code>Array.&lt;Layout&gt;</code>
A list of keyboard layouts to present to the user.

**Read only**: true  
<a id="LightDM.Greeter+lock_hint"></a>

### greeter.lock\_hint : <code>Boolean</code>
Whether or not the greeter was started as a lock screen.

**Read only**: true  
<a id="LightDM.Greeter+select_guest_hint"></a>

### greeter.select\_guest\_hint : <code>Boolean</code>
Whether or not the guest account should be selected by default.

**Read only**: true  
<a id="LightDM.Greeter+select_user_hint"></a>

### greeter.select\_user\_hint : <code>String</code>
The username to select by default.

**Read only**: true  
<a id="LightDM.Greeter+sessions"></a>

### greeter.sessions : <code>Array.&lt;Session&gt;</code>
List of available sessions.

**Read only**: true  
<a id="LightDM.Greeter+show_manual_login_hint"></a>

### greeter.show\_manual\_login\_hint : <code>Boolean</code>
Check if a manual login option should be shown. If [true](true), the theme should
provide a way for a username to be entered manually. Otherwise, themes that show
a user list may limit logins to only those users.

**Read only**: true  
<a id="LightDM.Greeter+show_remote_login_hint"></a>

### greeter.show\_remote\_login\_hint : <code>Boolean</code>
Check if a remote login option should be shown. If [true](true), the theme should provide
a way for a user to log into a remote desktop server.

**Read only**: true  
**Internal**:   
<a id="LightDM.Greeter+users"></a>

### greeter.users : <code>Array.&lt;User&gt;</code>
List of available users.

**Read only**: true  
<a id="LightDM.Greeter+authentication_complete"></a>

### greeter.authentication\_complete : <code>Signal</code>
Gets emitted when the greeter has completed authentication.

<a id="LightDM.Greeter+autologin_timer_expired"></a>

### greeter.autologin\_timer\_expired : <code>Signal</code>
Gets emitted when the automatic login timer has expired.

<a id="LightDM.Greeter+brightness_update"></a>

### greeter.brightness\_update : <code>Signal</code>
Gets emitted when brightness is updated

<a id="LightDM.Greeter+idle"></a>

### greeter.idle : <code>Signal</code>
Gets emitted when the user has logged in and the greeter is no longer needed.

<a id="LightDM.Greeter+reset"></a>

### greeter.reset : <code>Signal</code>
Gets emitted when the user is returning to a greeter that
was previously marked idle.

<a id="LightDM.Greeter+show_message"></a>

### greeter.show\_message : <code>Signal</code>
Gets emitted when the greeter should show a message to the user.

<a id="LightDM.Greeter+show_prompt"></a>

### greeter.show\_prompt : <code>Signal</code>
Gets emitted when the greeter should show a prompt to the user.

<a name="LightDM.Greeter+authenticate"></a>

### greeter.authenticate(username)
Starts the authentication procedure for a user.


| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> \| <code>null</code> | A username or [null](null) to prompt for a username. |

<a id="LightDM.Greeter+authenticate_as_guest"></a>

### greeter.authenticate\_as\_guest()
Starts the authentication procedure for the guest user.

<a id="LightDM.Greeter+batteryUpdate"></a>

### greeter.batteryUpdate()
Updates the battery data

<a id="LightDM.Greeter+brightnessSet"></a>

### greeter.brightnessSet(quantity)
Set the brightness to quantity


| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>Number</code> | The quantity to set |

<a id="LightDM.Greeter+brightnessIncrease"></a>

### greeter.brightnessIncrease(quantity)
Increase the brightness by quantity


| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>Number</code> | The quantity to increase |

<a id="LightDM.Greeter+brightnessDecrease"></a>

### greeter.brightnessDecrease(quantity)
Decrease the brightness by quantity


| Param | Type | Description |
| --- | --- | --- |
| quantity | <code>Number</code> | The quantity to decrease |

<a id="LightDM.Greeter+cancel_authentication"></a>

### greeter.cancel\_authentication()
Cancel user authentication that is currently in progress.

<a id="LightDM.Greeter+cancel_autologin"></a>

### greeter.cancel\_autologin()
Cancel the automatic login.

<a id="LightDM.Greeter+hibernate"></a>

### greeter.hibernate() ⇒ <code>Boolean</code>
Triggers the system to hibernate.

**Returns**: <code>Boolean</code> - [true](true) if hibernation initiated, otherwise [false](false)  
<a id="LightDM.Greeter+respond"></a>

### greeter.respond(response)
Provide a response to a prompt.


| Param | Type |
| --- | --- |
| response | <code>\*</code> | 

<a id="LightDM.Greeter+restart"></a>

### greeter.restart() ⇒ <code>Boolean</code>
Triggers the system to restart.

**Returns**: <code>Boolean</code> - [true](true) if restart initiated, otherwise [false](false)  
<a id="LightDM.Greeter+set_language"></a>

### greeter.set\_language(language) ⇒ <code>Boolean</code>
Set the language for the currently authenticated user.

**Returns**: <code>Boolean</code> - [true](true) if successful, otherwise [false](false)  

| Param | Type | Description |
| --- | --- | --- |
| language | <code>String</code> | The language in the form of a locale specification (e.g.     'de_DE.UTF-8') |

<a id="LightDM.Greeter+shutdown"></a>

### greeter.shutdown() ⇒ <code>Boolean</code>
Triggers the system to shutdown.

**Returns**: <code>Boolean</code> - [true](true) if shutdown initiated, otherwise [false](false)  
<a id="LightDM.Greeter+start_session"></a>

### greeter.start\_session(session) ⇒ <code>Boolean</code>
Start a session for the authenticated user.

**Returns**: <code>Boolean</code> - [true](true) if successful, otherwise [false](false)  

| Param | Type | Description |
| --- | --- | --- |
| session | <code>String</code> \| <code>null</code> | The session to log into or [null](null) to use the default. |

<a id="LightDM.Greeter+suspend"></a>

### greeter.suspend() ⇒ <code>Boolean</code>
Triggers the system to suspend/sleep.

**Returns**: <code>Boolean</code> - [true](true) if suspend/sleep initiated, otherwise [false](false)  
