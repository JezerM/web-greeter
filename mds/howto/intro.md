# Introduction

Web Greeter has a simple API, documented here, which allows to communicate to the Web Greeter itself and the LightDM API.

To create a theme, you will need these essential functions:

```javascript
lightdm.authenticate(username)

lightdm.respond(response)

lightdm.start_session(session)
```

### [lightdm.authenticate(username)](/api/Greeter#LightDM_Greeter-authenticate)
This method starts the authentication procedure for a user, allowing to start the user session.

### [lightdm.respond(response)](/api/Greeter#LightDM_Greeter-respond)
Provide a response to a prompt. Basically, this acts like a password provider. After the authentication is initiated, you need to provide the user password with this method. It could be "12345", "password", "strongpassword", y'know, a password.

> NOTE: If authentication is not initiated, this will cause an error.

### [lightdm.start_session(session)](/api/Greeter#LightDM_Greeter-start_session)
Starts a session for the authenticated user. After the user is authenticated, you will need to start the session with this method.

> NOTE: If user is not authenticated, this won't work.

And that's it. You can create a simple javascript file with this:
```javascript
lightdm.authenticate("superuser")
lightdm.respond("superpassword")
lightdm.start_session("ubuntu")
```

Although, if this could really work, it won't at first. The `lightdm` object is not available when the greeter is initiated, it is after a little delay. To make this work, an event is triggered when the API is ready to be used. Add an event listener to the `GreeterReady` event.

```javascript
window.addEventListener("GreeterReady", initGreeter)
```

And so, it will look like this:

```javascript
function initGreeter() {
  lightdm.authenticate("superuser")
  lightdm.respond("superpassword")
  lightdm.start_session("ubuntu")
}

window.addEventListener("GreeterReady", initGreeter)
```
