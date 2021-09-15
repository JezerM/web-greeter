<a id="LightDM_Greeter"></a>

## LightDM.Greeter
Base class for the greeter's Theme JavaScript API. Greeter themes will interact
directly with an object derived from this class to facilitate the user log-in process.
The greeter will automatically create an instance when it starts.
The instance can be accessed using the global variable: `lightdm`.

<a id="LightDM_Greeter-authentication_user"></a>

### lightdm.authentication\_user : <code>string</code> \| <code>null</code>
The username of the user being authenticated or "null"
if no authentication is in progress

**Read only**: true  
<a id="LightDM_Greeter-autologin_guest"></a>

### lightdm.autologin\_guest : <code>boolean</code>
Whether or not the guest account should be automatically logged
into when the timer expires.

**Read only**: true  
<a id="LightDM_Greeter-autologin_timeout"></a>

### lightdm.autologin\_timeout : <code>number</code>
The number of seconds to wait before automatically logging in.

**Read only**: true  
<a id="LightDM_Greeter-autologin_user"></a>

### lightdm.autologin\_user : <code>string</code>
The username with which to automattically log in when the timer expires.

**Read only**: true  
<a id="LightDM_Greeter-batteryData"></a>

### lightdm.batteryData : [<code>Battery</code>](Battery)
Gets the battery data.

**Read only**: true  
<a id="LightDM_Greeter-brightness"></a>

### lightdm.brightness : <code>number</code>
The current brightness

<a id="LightDM_Greeter-can_access_battery"></a>

### lightdm.can\_access\_battery : <code>boolean</code>
Whether or not the greeter can access to battery data.

**Read only**: true  
<a id="LightDM_Greeter-can_access_brightness"></a>

### lightdm.can\_access\_brightness : <code>boolean</code>
Whether or not the greeter can control display brightness.

**Read only**: true  
<a id="LightDM_Greeter-can_hibernate"></a>

### lightdm.can\_hibernate : <code>boolean</code>
Whether or not the greeter can make the system hibernate.

**Read only**: true  
<a id="LightDM_Greeter-can_restart"></a>

### lightdm.can\_restart : <code>boolean</code>
Whether or not the greeter can make the system restart.

**Read only**: true  
<a id="LightDM_Greeter-can_shutdown"></a>

### lightdm.can\_shutdown : <code>boolean</code>
Whether or not the greeter can make the system shutdown.

**Read only**: true  
<a id="LightDM_Greeter-can_suspend"></a>

### lightdm.can\_suspend : <code>boolean</code>
Whether or not the greeter can make the system suspend/sleep.

**Read only**: true  
<a id="LightDM_Greeter-default_session"></a>

### lightdm.default\_session : <code>string</code>
The name of the default session.

**Read only**: true  
<a id="LightDM_Greeter-has_guest_account"></a>

### lightdm.has\_guest\_account : <code>boolean</code>
Whether or not guest sessions are supported.

**Read only**: true  
<a id="LightDM_Greeter-hide_users_hint"></a>

### lightdm.hide\_users\_hint : <code>boolean</code>
Whether or not user accounts should be hidden.

**Read only**: true  
<a id="LightDM_Greeter-hostname"></a>

### lightdm.hostname : <code>string</code>
The system's hostname.

**Read only**: true  
<a id="LightDM_Greeter-in_authentication"></a>

### lightdm.in\_authentication : <code>boolean</code>
Whether or not the greeter is in the process of authenticating.

**Read only**: true  
<a id="LightDM_Greeter-is_authenticated"></a>

### lightdm.is\_authenticated : <code>boolean</code>
Whether or not the greeter has successfully authenticated.

**Read only**: true  
<a id="LightDM_Greeter-language"></a>

### lightdm.language : [<code>Language</code>](Language) \| <code>null</code>
The current language or "null" if no language.

**Read only**: true  
<a id="LightDM_Greeter-languages"></a>

### lightdm.languages : [<code>Array.&lt;Language&gt;</code>](Language)
A list of languages to present to the user.

**Read only**: true  
<a id="LightDM_Greeter-layout"></a>

### lightdm.layout : [<code>Layout</code>](Layout)
The currently active layout for the selected user.

<a id="LightDM_Greeter-layouts"></a>

### lightdm.layouts : [<code>Array.&lt;Layout&gt;</code>](Layout)
A list of keyboard layouts to present to the user.

**Read only**: true  
<a id="LightDM_Greeter-lock_hint"></a>

### lightdm.lock\_hint : <code>boolean</code>
Whether or not the greeter was started as a lock screen.

**Read only**: true  
<a id="LightDM_Greeter-remote_sessions"></a>

### lightdm.remote\_sessions : [<code>Array.&lt;Session&gt;</code>](Session)
A list of remote sessions.

**Read only**: true  
<a id="LightDM_Greeter-select_guest_hint"></a>

### lightdm.select\_guest\_hint : <code>boolean</code>
Whether or not the guest account should be selected by default.

**Read only**: true  
<a id="LightDM_Greeter-select_user_hint"></a>

### lightdm.select\_user\_hint : <code>string</code>
The username to select by default.

**Read only**: true  
<a id="LightDM_Greeter-sessions"></a>

### lightdm.sessions : [<code>Array.&lt;Session&gt;</code>](Session)
List of available sessions.

**Read only**: true  
<a id="LightDM_Greeter-show_manual_login_hint"></a>

### lightdm.show\_manual\_login\_hint : <code>boolean</code>
Check if a manual login option should be shown. If "true", the theme should
provide a way for a username to be entered manually. Otherwise, themes that show
a user list may limit logins to only those users.

**Read only**: true  
<a id="LightDM_Greeter-show_remote_login_hint"></a>

### lightdm.show\_remote\_login\_hint : <code>boolean</code>
Check if a remote login option should be shown. If "true", the theme should provide
a way for a user to log into a remote desktop server.

**Read only**: true  
**Internal**:   
<a id="LightDM_Greeter-users"></a>

### lightdm.users : [<code>Array.&lt;User&gt;</code>](User)
List of available users.

**Read only**: true  
<a id="LightDM_Greeter-authentication_complete"></a>

### lightdm.authentication\_complete : [<code>Signal</code>](Signal)
Gets emitted when the greeter has completed authentication.

<a id="LightDM_Greeter-autologin_timer_expired"></a>

### lightdm.autologin\_timer\_expired : [<code>Signal</code>](Signal)
Gets emitted when the automatic login timer has expired.

<a id="LightDM_Greeter-brightness_update"></a>

### lightdm.brightness\_update : [<code>Signal</code>](Signal)
Gets emitted when brightness is updated

<a id="LightDM_Greeter-battery_update"></a>

### lightdm.battery\_update : [<code>Signal</code>](Signal)
Gets emitted when battery is updated

<a id="LightDM_Greeter-idle"></a>

### lightdm.idle : [<code>Signal</code>](Signal)
Gets emitted when the user has logged in and the greeter is no longer needed.

<a id="LightDM_Greeter-reset"></a>

### lightdm.reset : [<code>Signal</code>](Signal)
Gets emitted when the user is returning to a greeter that
was previously marked idle.

<a id="LightDM_Greeter-show_message"></a>

### lightdm.show\_message : [<code>Signal</code>](Signal)
Gets emitted when the greeter should show a message to the user.

<a id="LightDM_Greeter-show_prompt"></a>

### lightdm.show\_prompt : [<code>Signal</code>](Signal)
Gets emitted when the greeter should show a prompt to the user.

<a id="LightDM_Greeter-authenticate"></a>

### lightdm.authenticate(username)
Starts the authentication procedure for a user.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>username</td><td><code>string</code> | <code>null</code></td><td><p>A username or &quot;null&quot; to prompt for a username.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-authenticate_as_guest"></a>

### lightdm.authenticate\_as\_guest()
Starts the authentication procedure for the guest user.

<a id="LightDM_Greeter-brightnessSet"></a>

### lightdm.brightnessSet(quantity)
Set the brightness to quantity

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>quantity</td><td><code>number</code></td><td><p>The quantity to set</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-brightnessIncrease"></a>

### lightdm.brightnessIncrease(quantity)
Increase the brightness by quantity

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>quantity</td><td><code>number</code></td><td><p>The quantity to increase</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-brightnessDecrease"></a>

### lightdm.brightnessDecrease(quantity)
Decrease the brightness by quantity

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>quantity</td><td><code>number</code></td><td><p>The quantity to decrease</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-cancel_authentication"></a>

### lightdm.cancel\_authentication()
Cancel user authentication that is currently in progress.

<a id="LightDM_Greeter-cancel_autologin"></a>

### lightdm.cancel\_autologin()
Cancel the automatic login.

<a id="LightDM_Greeter-hibernate"></a>

### lightdm.hibernate() ⇒ <code>boolean</code>
Triggers the system to hibernate.

**Returns**: <code>boolean</code> - "true" if hibernation initiated, otherwise "false"  
<a id="LightDM_Greeter-respond"></a>

### lightdm.respond(response)
Provide a response to a prompt.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>response</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-restart"></a>

### lightdm.restart() ⇒ <code>boolean</code>
Triggers the system to restart.

**Returns**: <code>boolean</code> - "true" if restart initiated, otherwise "false"  
<a id="LightDM_Greeter-set_language"></a>

### lightdm.set\_language(language) ⇒ <code>boolean</code>
Set the language for the currently authenticated user.

**Returns**: <code>boolean</code> - "true" if successful, otherwise "false"  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>language</td><td><code>string</code></td><td><p>The language in the form of a locale specification (e.g.
    &#39;de_DE.UTF-8&#39;)</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-shutdown"></a>

### lightdm.shutdown() ⇒ <code>boolean</code>
Triggers the system to shutdown.

**Returns**: <code>boolean</code> - "true" if shutdown initiated, otherwise "false"  
<a id="LightDM_Greeter-start_session"></a>

### lightdm.start\_session(session) ⇒ <code>boolean</code>
Start a session for the authenticated user.

**Returns**: <code>boolean</code> - "true" if successful, otherwise "false"  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>session</td><td><code>string</code> | <code>null</code></td><td><p>The session to log into or &quot;null&quot; to use the default.</p>
</td>
    </tr>  </tbody>
</table>

<a id="LightDM_Greeter-suspend"></a>

### lightdm.suspend() ⇒ <code>boolean</code>
Triggers the system to suspend/sleep.

**Returns**: <code>boolean</code> - "true" if suspend/sleep initiated, otherwise "false"  
