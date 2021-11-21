# Different methods of authentication

You have many ways to create an authentication flow, which will be partially covered here.

## Delay method

As said before, doing a `lightdm.respond` inmediately after `lightdm.authenticate` provokes a failed authentication. You need to add a delay of 100ms or more.

```javascript
async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

// Inside an async environment

lightdm.authenticate("user");
await wait(100);
lightdm.respond("password");
lightdm.start_session("session");
```

## Signals approach

**web-greeter** provides signals to do automatic stuff when something happens from LightDM or web-greeter itself. The most relevant for this case are:

- `lightdm.show_prompt` to provide the password automatically.
- `lightdm.authentication_complete` to start_session automatically.

So, you could have something like this:

```javascript
lightdm.show_prompt.connect((text, type) => {
  lightdm.respond("password");
})
lightdm.authentication_complete.connect(() => {
  lightdm.start_session("session");
})

lightdm.authenticate("user");
// Everything is handled by signals from here
```

### lightdm.respond and lightdm.show_prompt

Aditionally, you could check the type provided to the callback of `lightdm.show_prompt` to either **respond** with the user or **respond** with the password.

`lightdm.respond`, as documented, provides a response to a prompt. Therefore, if you do not start the authentication process with an user, LightDM will prompt to provide it. You can experiment with it on `--debug` mode:

```javascript
> lightdm.show_prompt.connect((text, type) => {console.log({text, type})});
> lightdm.authentication_complete.connect(() => {console.log("Authenticated")});
> lightdm.authenticate();
{"login:", 0}
> lightdm.respond("user");
{"Password:", 1}
> lightdm.respond("password");
"Authenticated"
```

According to this, LightDM provides two kind of prompts:

- `{text: "login:", type: 0}` when no **user** provided to `lightdm.authenticate`
    - Then, use `lightdm.respond("user")`
    - If user provided with `lightdm.authenticate`, LightDM will prompt for a password
- `{text: "Password:", type: 1}` after providing an **user**
    - Use `lightdm.respond("password")`

And so, you could have something like this:

```javascript
lightdm.show_prompt.connect((text, type) => {
  if (type == 0) // Login
    lightdm.respond("user");
  else if (type == 1) // Password
    lightdm.respond("password");
})
lightdm.authentication_complete.connect(() => {
  lightdm.start_session("session");
})

lightdm.authenticate();
```

## Manual approach

This might be the simplest to implement, but will require a nice web design to not mess everything up.

Basically, the authentication flow is "managed" by the user:

1. The user selects their user, and run `lightdm.authenticate(user)`
2. They will provide their password, and run `lightdm.respond(password)`
3. And so, they click on something that will run their selected session: `lightdm.start_session(session)`
