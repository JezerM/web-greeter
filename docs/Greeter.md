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

## get_hint(name)
Get the value of a hint.

**Arguments**:
- `name` [String]

**Returns**:
- [String | Boolean | Number | Null]

## hibernate()
Triggers the system to hibernate.

**Returns**:
- [Boolean]
  `true` if hibernation initiated, otherwise `false`

## layout(value)
Set the active layout for the selected user.

**Arguments**:
- `value` [LightDM.layout]

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

The username of the user being authenticated or null if there is no authentication in progress.

## autologin_guest
**Type**: [Boolean]

Whether or not the guest account should be automatically logged into when the timer expires.

## autologin_timeout
**Type**: [Number]

The number of seconds to wait before automatically loggin in.

## autologin_user
**Type**: [Boolean]

The username with which to automatically log in when the timer expires.

## can_hibernate
**Type**: [Boolean]

Whether or not the greeter can make the system hibernate.

## can_restart
**Type**: [Boolean]

Whether or not the greeter can make the system restart.

## can_shutdown
**Type**: [Boolean]

Whether or not the greeter can make the system shutdown.

## can_suspend
**Type**: [Boolean]

Whether or not the greeter can make the system suspend/sleep.

## default_session
**Type**: [String]

The name of the default session

## has_guest_account
**Type**: [Boolean]

Whether or not guest sessions are supported

## hide_users
**Type**: [Boolean]

Whether or not user accounts should be hidden

## hostname
**Type**: [String]

The system's hostname

## in_authentication
**Type**: [Boolean]

Whether or not the greeter is in the process of authenticating.

## is_authenticated
**Type**: [Boolean]

Whether or not the greeter has succesfully authenticated.

## language
**Type**: [LightDM.Language | Null]

The current language or `null` if no language.

## languages
**Type**: [Array&lt;LightDM.Language&gt;]

A list of languages to present to the user.

## layout
**Type**: [LightDM.Layout]

The currently active layout for the selected user.

## layouts
**Type**: [Array&lt;LightDM.Layout&gt;]

A list of keyboard layouts to present to the user.

## lock_hint
**Type**: [Boolean]

Whether or not the greeter was started as a lock screen.

## num_users
**Type**: [Number]

The number of users able to log in

## select_guest_hint
**Type**: [Boolean]

Whether or not the guest account should be selected by default

## select_user_hint
**Type**: [String]

The username to select by default.

## sessions
**Type**: [String]

List of available sessions.

## users
**Type**: [Array&lt;LightDM.User&gt;]

List of available users.
