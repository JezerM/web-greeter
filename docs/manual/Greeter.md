Base class for the greeter's Theme JavaScript API. Greeter themes will interact directly with an object derived from this class to facilitate the user log-in process. The greeter will automatically create an instance when it starts. The instance can be accessed using the global variable: `lightdm`

# Methods

## authenticate(username)
Starts the authentication with the given `username`.
**Arguments**:
- `username` [String]

## authenticate_as_guest()
Authenticates as the guest user.

## batteryUpdate()
Updates the battery data.

## brightnessSet(quantity)
Set the brightness to `quantity`.

## brightnessIncrease(quantity)
Increase the brightness by `quantity`

## brightnessDecrease(quantity)
Decrease the brightness by `quantity`

## cancel_authentication()
Cancel the user authentication that is currently in progress.

## cancel_autologin()
Cancels the automatic login.

## hibernate()
Triggers the system to hibernate.

**Returns**:
- [Boolean]
  `true` if hibernation initiated, otherwise `false`

## respond(response)
Provide a response to a greeter

**Arguments**:
- `response` [String]

## restart()
Triggers the system to restart.

**Returns**:
- [Boolean]
  `true` if restart initiated, otherwise `false`

## set_language(language)
Set the language for the currently authenticated user.

**Arguments**:
- language [String]
  The language specification (e.g 'de\_DE.UTF-8')

**Returns**:
- Boolean
  `true` if successful, otherwise `false`

## shutdown()
Triggers the system to shutdown.

**Returns**:
- Boolean
  `true` if successful, otherwise `false`

## start_session(session)
Starts a session for the authenticated user.

**Arguments**:
- `session` [String | Null]
  The session to log into or null to use the default

**Returns**:
- Boolean
  `true` if successful, otherwise `false`

## suspend()
Triggers the system to suspend/sleep.

**Returns**
- [Boolean]
  `true` if suspend/sleep initiated, otherwise `false`

# Members

## authentication_user
**Type**: [String | Null]
**Readonly**

The username of the user being authenticated or null if there is no authentication in progress.

## autologin_guest
**Type**: [Boolean]
**Readonly**

Whether or not the guest account should be automatically logged into when the timer expires.

## autologin_timeout
**Type**: [Number]
**Readonly**

The number of seconds to wait before automatically loggin in.

## autologin_user
**Type**: [Boolean]
**Readonly**

The username with which to automatically log in when the timer expires.

## batteryData
**Type**: [LightDM.Battery]
**Readonly**

The battery data.

## brightness
**Type**: [Number]

The display brightness.

## can_access_battery
**Type**: [Boolean]
**Readonly**

Wheter or not the greeter can access to battery data.

## can_access_brightness
**Type**: [Boolean]
**Readonly**

Whether or not the greeter can control display brightness.

## can_hibernate
**Type**: [Boolean]
**Readonly**

Whether or not the greeter can make the system hibernate.

## can_restart
**Type**: [Boolean]
**Readonly**

Whether or not the greeter can make the system restart.

## can_shutdown
**Type**: [Boolean]
**Readonly**

Whether or not the greeter can make the system shutdown.

## can_suspend
**Type**: [Boolean]
**Readonly**

Whether or not the greeter can make the system suspend/sleep.

## default_session
**Type**: [String]
**Readonly**

The name of the default session

## has_guest_account
**Type**: [Boolean]
**Readonly**

Whether or not guest sessions are supported

## hide_users_hint
**Type**: [Boolean]
**Readonly**

Whether or not user accounts should be hidden

## hostname
**Type**: [String]
**Readonly**

The system's hostname

## in_authentication
**Type**: [Boolean]
**Readonly**

Whether or not the greeter is in the process of authenticating.

## is_authenticated
**Type**: [Boolean]
**Readonly**

Whether or not the greeter has succesfully authenticated.

## language
**Type**: [LightDM.Language | Null]
**Readonly**

The current language or `null` if no language.

## languages
**Type**: [Array&lt;LightDM.Language&gt;]
**Readonly**

A list of languages to present to the user.

## layout
**Type**: [LightDM.Layout]
**Readonly**

The currently active layout for the selected user.

## layouts
**Type**: [Array&lt;LightDM.Layout&gt;]
**Readonly**

A list of keyboard layouts to present to the user.

## lock_hint
**Type**: [Boolean]
**Readonly**

Whether or not the greeter was started as a lock screen.

## select_guest_hint
**Type**: [Boolean]
**Readonly**

Whether or not the guest account should be selected by default

## select_user_hint
**Type**: [String]
**Readonly**

The username to select by default.

## sessions
**Type**: [String]
**Readonly**

List of available sessions.

## show_manual_login_hint
**Type**: [Boolean]
**Readonly**

Check if manual login should be shown. If `true`, the theme should provide a way for username to be entered manually. Otherwise, themes that show a user list may limit logins to only those users.

## show_remote_login_hint
**Type**: [Boolean]
**Readonly**

Check if a remote login option should be shown. If `true`, the theme should provide a way for a user to log into a remote desktop server.

## users
**Type**: [Array&lt;LightDM.User&gt;]
**Readonly**

List of available users.

# Signals

## authentication_complete
**Type**: [Signal]

Gets emitted when the greeter has completed authentication.

## autologin_timer_expired
**Type**: [Signal]

Gets emitted when the automatic login timer has expired.

## brightness_update
**Type**: [Signal]

Gets emitted when brightness is updated.

## idle
**Type**: [Signal]

Gets emitted when the user has logged in and the greeter is no longer needed.

## reset
**Type**: [Signal]

Gets emitted when the user is returning to a greeter that was previously marked idle.

## show_message
**Type**: [Signal]

Get emitted when the greeter should show a message to the user.

## show_prompt
**Type**: [Signal]

Gets emitted when the greeter should show a prompt to the user.
