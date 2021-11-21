# Signals

Signals were introduced in `web-greeter 3.0.0`, although they were a thing in LightDM. These signals allow a communication between LightDM and the theme itself, which aditionally allows to create more complex and well defined themes.

- [authentication_complete](#authentication_complete)
- [autologin_timer_expired](#autologin_timer_expired)

## authentication_complete

This signal gets emitted when the greeter has completed authentication. So, when the user is authenticated, this signall will be emitted and run all its callbacks.

```javascript
lightdm.authentication_complete.connect(() => {
  console.log("User authenticated!");
});
```

## autologin_timer_expired

This signal gets emitted when the automatic login timer has expired.

> TODO

## idle

## reset

## show_message

## show_prompt
