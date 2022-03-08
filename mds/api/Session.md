<a id="LightDM_Session"></a>

## LightDM.Session
Interface for object that holds info about a session. Session objects are not
created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.

<a id="LightDM_Session-name"></a>

### session.name : <code>string</code>
The name for the session.

**Read only**: true
<a id="LightDM_Session-key"></a>

### session.key : <code>string</code>
The key for the session.

**Read only**: true
<a id="LightDM_Session-comment"></a>

### session.comment : <code>string</code>
The comment for the session.

**Read only**: true
<a id="LightDM_Session-type"></a>

### session.type : <code>string</code>
The session type (X11 or Wayland)

**Read only**: true
