<a id="LightDM"></a>

## LightDM : <code>object</code>
The greeter's Theme JavaScript API.
Accesible through `lightdm` global variable.


* [LightDM](LightDM) : <code>object</code>
    * [.Greeter](Greeter)
        * [lightdm.authentication_user](Greeter#LightDM_Greeter-authentication_user) : <code>String</code> \| <code>Null</code>
        * [lightdm.autologin_guest](Greeter#LightDM_Greeter-autologin_guest) : <code>Boolean</code>
        * [lightdm.autologin_timeout](Greeter#LightDM_Greeter-autologin_timeout) : <code>Number</code>
        * [lightdm.autologin_user](Greeter#LightDM_Greeter-autologin_user) : <code>String</code>
        * [lightdm.batteryData](Greeter#LightDM_Greeter-batteryData) : [<code>Battery</code>](Battery)
        * [lightdm.brightness](Greeter#LightDM_Greeter-brightness) : <code>Number</code>
        * [lightdm.can_access_battery](Greeter#LightDM_Greeter-can_access_battery) : <code>boolean</code>
        * [lightdm.can_access_brightness](Greeter#LightDM_Greeter-can_access_brightness) : <code>boolean</code>
        * [lightdm.can_hibernate](Greeter#LightDM_Greeter-can_hibernate) : <code>Boolean</code>
        * [lightdm.can_restart](Greeter#LightDM_Greeter-can_restart) : <code>Boolean</code>
        * [lightdm.can_shutdown](Greeter#LightDM_Greeter-can_shutdown) : <code>Boolean</code>
        * [lightdm.can_suspend](Greeter#LightDM_Greeter-can_suspend) : <code>Boolean</code>
        * [lightdm.default_session](Greeter#LightDM_Greeter-default_session) : <code>String</code>
        * [lightdm.has_guest_account](Greeter#LightDM_Greeter-has_guest_account) : <code>Boolean</code>
        * [lightdm.hide_users_hint](Greeter#LightDM_Greeter-hide_users_hint) : <code>boolean</code>
        * [lightdm.hostname](Greeter#LightDM_Greeter-hostname) : <code>String</code>
        * [lightdm.in_authentication](Greeter#LightDM_Greeter-in_authentication) : <code>Boolean</code>
        * [lightdm.is_authenticated](Greeter#LightDM_Greeter-is_authenticated) : <code>Boolean</code>
        * [lightdm.language](Greeter#LightDM_Greeter-language) : [<code>Language</code>](Language) \| <code>Null</code>
        * [lightdm.languages](Greeter#LightDM_Greeter-languages) : [<code>Array.&lt;Language&gt;</code>](Language)
        * [lightdm.layout](Greeter#LightDM_Greeter-layout) : [<code>Layout</code>](Layout)
        * [lightdm.layouts](Greeter#LightDM_Greeter-layouts) : [<code>Array.&lt;Layout&gt;</code>](Layout)
        * [lightdm.lock_hint](Greeter#LightDM_Greeter-lock_hint) : <code>Boolean</code>
        * [lightdm.select_guest_hint](Greeter#LightDM_Greeter-select_guest_hint) : <code>Boolean</code>
        * [lightdm.select_user_hint](Greeter#LightDM_Greeter-select_user_hint) : <code>String</code>
        * [lightdm.sessions](Greeter#LightDM_Greeter-sessions) : [<code>Array.&lt;Session&gt;</code>](Session)
        * [lightdm.show_manual_login_hint](Greeter#LightDM_Greeter-show_manual_login_hint) : <code>Boolean</code>
        * [lightdm.show_remote_login_hint](Greeter#LightDM_Greeter-show_remote_login_hint) : <code>Boolean</code>
        * [lightdm.users](Greeter#LightDM_Greeter-users) : [<code>Array.&lt;User&gt;</code>](User)
        * [lightdm.authentication_complete](Greeter#LightDM_Greeter-authentication_complete) : [<code>Signal</code>](Signal)
        * [lightdm.autologin_timer_expired](Greeter#LightDM_Greeter-autologin_timer_expired) : [<code>Signal</code>](Signal)
        * [lightdm.brightness_update](Greeter#LightDM_Greeter-brightness_update) : [<code>Signal</code>](Signal)
        * [lightdm.idle](Greeter#LightDM_Greeter-idle) : [<code>Signal</code>](Signal)
        * [lightdm.reset](Greeter#LightDM_Greeter-reset) : [<code>Signal</code>](Signal)
        * [lightdm.show_message](Greeter#LightDM_Greeter-show_message) : [<code>Signal</code>](Signal)
        * [lightdm.show_prompt](Greeter#LightDM_Greeter-show_prompt) : [<code>Signal</code>](Signal)
        * [lightdm.authenticate(username)](Greeter#LightDM_Greeter-authenticate)
        * [lightdm.authenticate_as_guest()](Greeter#LightDM_Greeter-authenticate_as_guest)
        * [lightdm.batteryUpdate()](Greeter#LightDM_Greeter-batteryUpdate)
        * [lightdm.brightnessSet(quantity)](Greeter#LightDM_Greeter-brightnessSet)
        * [lightdm.brightnessIncrease(quantity)](Greeter#LightDM_Greeter-brightnessIncrease)
        * [lightdm.brightnessDecrease(quantity)](Greeter#LightDM_Greeter-brightnessDecrease)
        * [lightdm.cancel_authentication()](Greeter#LightDM_Greeter-cancel_authentication)
        * [lightdm.cancel_autologin()](Greeter#LightDM_Greeter-cancel_autologin)
        * [lightdm.hibernate()](Greeter#LightDM_Greeter-hibernate) ⇒ <code>Boolean</code>
        * [lightdm.respond(response)](Greeter#LightDM_Greeter-respond)
        * [lightdm.restart()](Greeter#LightDM_Greeter-restart) ⇒ <code>Boolean</code>
        * [lightdm.set_language(language)](Greeter#LightDM_Greeter-set_language) ⇒ <code>Boolean</code>
        * [lightdm.shutdown()](Greeter#LightDM_Greeter-shutdown) ⇒ <code>Boolean</code>
        * [lightdm.start_session(session)](Greeter#LightDM_Greeter-start_session) ⇒ <code>Boolean</code>
        * [lightdm.suspend()](Greeter#LightDM_Greeter-suspend) ⇒ <code>Boolean</code>
    * [.GreeterConfig](GreeterConfig)
        * [greeter_config.branding](GreeterConfig#LightDM_GreeterConfig-branding) : <code>Object</code>
        * [greeter_config.greeter](GreeterConfig#LightDM_GreeterConfig-greeter) : <code>Object</code>
        * [greeter_config.features](GreeterConfig#LightDM_GreeterConfig-features) : <code>Object</code>
    * [.Session](Session)
        * [session.name](Session#LightDM_Session-name) : <code>String</code>
        * [session.key](Session#LightDM_Session-key) : <code>String</code>
        * [session.comment](Session#LightDM_Session-comment) : <code>String</code>
    * [.Language](Language)
        * [language.code](Language#LightDM_Language-code) : <code>String</code>
        * [language.name](Language#LightDM_Language-name) : <code>String</code>
        * [language.territory](Language#LightDM_Language-territory) : <code>String</code>
    * [.Layout](Layout)
        * [layout.description](Layout#LightDM_Layout-description) : <code>String</code>
        * [layout.name](Layout#LightDM_Layout-name) : <code>String</code>
        * [layout.short_description](Layout#LightDM_Layout-short_description) : <code>String</code>
    * [.User](User)
        * [user.display_name](User#LightDM_User-display_name) : <code>String</code>
        * [user.language](User#LightDM_User-language) : <code>String</code>
        * [user.layout](User#LightDM_User-layout) : <code>String</code>
        * [user.image](User#LightDM_User-image) : <code>String</code>
        * [user.home_directory](User#LightDM_User-home_directory) : <code>String</code>
        * [user.username](User#LightDM_User-username) : <code>String</code>
        * [user.logged_in](User#LightDM_User-logged_in) : <code>Boolean</code>
        * [user.session](User#LightDM_User-session) : <code>String</code> \| <code>Null</code>
    * [.Battery](Battery)
        * [battery.level](Battery#LightDM_Battery-level) : <code>String</code> \| <code>Null</code>
        * [battery.name](Battery#LightDM_Battery-name) : <code>String</code> \| <code>Null</code>
        * [battery.state](Battery#LightDM_Battery-state) : <code>String</code> \| <code>Null</code>
    * [.Signal](Signal)
        * [signal.connect(callback)](Signal#LightDM_Signal-connect)
        * [signal.disconnect(callback)](Signal#LightDM_Signal-disconnect)
    * [.ThemeUtils](ThemeUtils)
        * [theme_utils.bind_this(context)](ThemeUtils#LightDM_ThemeUtils-bind_this) ⇒ <code>object</code>
        * [theme_utils.dirlist(path, only_images, callback)](ThemeUtils#LightDM_ThemeUtils-dirlist)
        * [theme_utils.get_current_localized_date()](ThemeUtils#LightDM_ThemeUtils-get_current_localized_date) ⇒ <code>String</code>
        * [theme_utils.get_current_localized_time()](ThemeUtils#LightDM_ThemeUtils-get_current_localized_time) ⇒ <code>String</code>

