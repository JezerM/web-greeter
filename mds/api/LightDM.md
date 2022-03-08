<a id="LightDM"></a>

## LightDM : <code>object</code>
The greeter's Theme JavaScript API.
Accesible through `lightdm` global variable.


* [LightDM](LightDM) : <code>object</code>
    * [.Greeter](Greeter)
        * [lightdm.authentication_user](Greeter#LightDM_Greeter-authentication_user) : <code>string</code> \| <code>null</code>
        * [lightdm.autologin_guest](Greeter#LightDM_Greeter-autologin_guest) : <code>boolean</code>
        * [lightdm.autologin_timeout](Greeter#LightDM_Greeter-autologin_timeout) : <code>number</code>
        * [lightdm.autologin_user](Greeter#LightDM_Greeter-autologin_user) : <code>string</code>
        * <del>[lightdm.batteryData](Greeter#LightDM_Greeter-batteryData) : [<code>Battery</code>](Battery)</del>
        * [lightdm.battery_data](Greeter#LightDM_Greeter-battery_data) : [<code>Battery</code>](Battery)
        * [lightdm.brightness](Greeter#LightDM_Greeter-brightness) : <code>number</code>
        * [lightdm.can_access_battery](Greeter#LightDM_Greeter-can_access_battery) : <code>boolean</code>
        * [lightdm.can_access_brightness](Greeter#LightDM_Greeter-can_access_brightness) : <code>boolean</code>
        * [lightdm.can_hibernate](Greeter#LightDM_Greeter-can_hibernate) : <code>boolean</code>
        * [lightdm.can_restart](Greeter#LightDM_Greeter-can_restart) : <code>boolean</code>
        * [lightdm.can_shutdown](Greeter#LightDM_Greeter-can_shutdown) : <code>boolean</code>
        * [lightdm.can_suspend](Greeter#LightDM_Greeter-can_suspend) : <code>boolean</code>
        * [lightdm.default_session](Greeter#LightDM_Greeter-default_session) : <code>string</code>
        * [lightdm.has_guest_account](Greeter#LightDM_Greeter-has_guest_account) : <code>boolean</code>
        * [lightdm.hide_users_hint](Greeter#LightDM_Greeter-hide_users_hint) : <code>boolean</code>
        * [lightdm.hostname](Greeter#LightDM_Greeter-hostname) : <code>string</code>
        * [lightdm.in_authentication](Greeter#LightDM_Greeter-in_authentication) : <code>boolean</code>
        * [lightdm.is_authenticated](Greeter#LightDM_Greeter-is_authenticated) : <code>boolean</code>
        * [lightdm.language](Greeter#LightDM_Greeter-language) : [<code>Language</code>](Language) \| <code>null</code>
        * [lightdm.languages](Greeter#LightDM_Greeter-languages) : [<code>Array.&lt;Language&gt;</code>](Language)
        * [lightdm.layout](Greeter#LightDM_Greeter-layout) : [<code>Layout</code>](Layout)
        * [lightdm.layouts](Greeter#LightDM_Greeter-layouts) : [<code>Array.&lt;Layout&gt;</code>](Layout)
        * [lightdm.lock_hint](Greeter#LightDM_Greeter-lock_hint) : <code>boolean</code>
        * [lightdm.remote_sessions](Greeter#LightDM_Greeter-remote_sessions) : [<code>Array.&lt;Session&gt;</code>](Session)
        * [lightdm.select_guest_hint](Greeter#LightDM_Greeter-select_guest_hint) : <code>boolean</code>
        * [lightdm.select_user_hint](Greeter#LightDM_Greeter-select_user_hint) : <code>string</code> \| <code>undefined</code>
        * [lightdm.sessions](Greeter#LightDM_Greeter-sessions) : [<code>Array.&lt;Session&gt;</code>](Session)
        * [lightdm.show_manual_login_hint](Greeter#LightDM_Greeter-show_manual_login_hint) : <code>boolean</code>
        * [lightdm.show_remote_login_hint](Greeter#LightDM_Greeter-show_remote_login_hint) : <code>boolean</code>
        * [lightdm.users](Greeter#LightDM_Greeter-users) : [<code>Array.&lt;User&gt;</code>](User)
        * [lightdm.authentication_complete](Greeter#LightDM_Greeter-authentication_complete) : [<code>Signal</code>](Signal)
        * [lightdm.autologin_timer_expired](Greeter#LightDM_Greeter-autologin_timer_expired) : [<code>Signal</code>](Signal)
        * [lightdm.brightness_update](Greeter#LightDM_Greeter-brightness_update) : [<code>Signal</code>](Signal)
        * [lightdm.battery_update](Greeter#LightDM_Greeter-battery_update) : [<code>Signal</code>](Signal)
        * [lightdm.idle](Greeter#LightDM_Greeter-idle) : [<code>Signal</code>](Signal)
        * [lightdm.reset](Greeter#LightDM_Greeter-reset) : [<code>Signal</code>](Signal)
        * [lightdm.show_message](Greeter#LightDM_Greeter-show_message) : [<code>Signal</code>](Signal)
        * [lightdm.show_prompt](Greeter#LightDM_Greeter-show_prompt) : [<code>Signal</code>](Signal)
        * [lightdm.authenticate(username)](Greeter#LightDM_Greeter-authenticate) ⇒ <code>boolean</code>
        * [lightdm.authenticate_as_guest()](Greeter#LightDM_Greeter-authenticate_as_guest) ⇒ <code>boolean</code>
        * <del>[lightdm.brightnessSet(quantity)](Greeter#LightDM_Greeter-brightnessSet)</del>
        * [lightdm.brightness_set(quantity)](Greeter#LightDM_Greeter-brightness_set)
        * <del>[lightdm.brightnessIncrease(quantity)](Greeter#LightDM_Greeter-brightnessIncrease)</del>
        * [lightdm.brightness_increase(quantity)](Greeter#LightDM_Greeter-brightness_increase)
        * <del>[lightdm.brightnessDecrease(quantity)](Greeter#LightDM_Greeter-brightnessDecrease)</del>
        * [lightdm.brightness_decrease(quantity)](Greeter#LightDM_Greeter-brightness_decrease)
        * [lightdm.cancel_authentication()](Greeter#LightDM_Greeter-cancel_authentication) ⇒ <code>boolean</code>
        * [lightdm.cancel_autologin()](Greeter#LightDM_Greeter-cancel_autologin) ⇒ <code>boolean</code>
        * [lightdm.hibernate()](Greeter#LightDM_Greeter-hibernate) ⇒ <code>boolean</code>
        * [lightdm.respond(response)](Greeter#LightDM_Greeter-respond) ⇒ <code>boolean</code>
        * [lightdm.restart()](Greeter#LightDM_Greeter-restart) ⇒ <code>boolean</code>
        * [lightdm.set_language(language)](Greeter#LightDM_Greeter-set_language) ⇒ <code>boolean</code>
        * [lightdm.shutdown()](Greeter#LightDM_Greeter-shutdown) ⇒ <code>boolean</code>
        * [lightdm.start_session(session)](Greeter#LightDM_Greeter-start_session) ⇒ <code>boolean</code>
        * [lightdm.suspend()](Greeter#LightDM_Greeter-suspend) ⇒ <code>boolean</code>
    * [.GreeterConfig](GreeterConfig)
        * [greeter_config.branding](GreeterConfig#LightDM_GreeterConfig-branding) : <code>object</code>
        * [greeter_config.greeter](GreeterConfig#LightDM_GreeterConfig-greeter) : <code>object</code>
        * [greeter_config.features](GreeterConfig#LightDM_GreeterConfig-features) : <code>Object</code>
        * [greeter_config.layouts](GreeterConfig#LightDM_GreeterConfig-layouts) : [<code>Array.&lt;Layout&gt;</code>](Layout)
    * [.Session](Session)
        * [session.name](Session#LightDM_Session-name) : <code>string</code>
        * [session.key](Session#LightDM_Session-key) : <code>string</code>
        * [session.comment](Session#LightDM_Session-comment) : <code>string</code>
        * [session.type](Session#LightDM_Session-type) : <code>string</code>
    * [.Language](Language)
        * [language.code](Language#LightDM_Language-code) : <code>string</code>
        * [language.name](Language#LightDM_Language-name) : <code>string</code>
        * [language.territory](Language#LightDM_Language-territory) : <code>string</code>
    * [.Layout](Layout)
        * [layout.description](Layout#LightDM_Layout-description) : <code>string</code>
        * [layout.name](Layout#LightDM_Layout-name) : <code>string</code>
        * [layout.short_description](Layout#LightDM_Layout-short_description) : <code>string</code>
    * [.User](User)
        * [user.background](User#LightDM_User-background) : <code>string</code>
        * [user.display_name](User#LightDM_User-display_name) : <code>string</code>
        * [user.language](User#LightDM_User-language) : <code>string</code>
        * [user.layout](User#LightDM_User-layout) : <code>string</code>
        * [user.layouts](User#LightDM_User-layouts) : <code>Array.&lt;string&gt;</code>
        * [user.image](User#LightDM_User-image) : <code>string</code>
        * [user.home_directory](User#LightDM_User-home_directory) : <code>string</code>
        * [user.username](User#LightDM_User-username) : <code>string</code>
        * [user.logged_in](User#LightDM_User-logged_in) : <code>Boolean</code>
        * [user.session](User#LightDM_User-session) : <code>string</code>
    * [.Battery](Battery)
        * [battery.name](Battery#LightDM_Battery-name) : <code>string</code>
        * [battery.level](Battery#LightDM_Battery-level) : <code>string</code>
        * [battery.status](Battery#LightDM_Battery-status) : <code>string</code>
        * [battery.ac_status](Battery#LightDM_Battery-ac_status) : <code>boolean</code>
        * [battery.capacity](Battery#LightDM_Battery-capacity) : <code>number</code>
        * [battery.time](Battery#LightDM_Battery-time) : <code>string</code>
        * [battery.watt](Battery#LightDM_Battery-watt) : <code>boolean</code>
    * [.Signal](Signal)
        * [signal.connect(callback)](Signal#LightDM_Signal-connect)
        * [signal.disconnect(callback)](Signal#LightDM_Signal-disconnect)
    * [.ThemeUtils](ThemeUtils)
        * <del>[theme_utils.bind_this(context)](ThemeUtils#LightDM_ThemeUtils-bind_this) ⇒ <code>object</code></del>
        * [theme_utils.dirlist(path, only_images, callback)](ThemeUtils#LightDM_ThemeUtils-dirlist)
        * [theme_utils.get_current_localized_date()](ThemeUtils#LightDM_ThemeUtils-get_current_localized_date) ⇒ <code>string</code>
        * [theme_utils.get_current_localized_time()](ThemeUtils#LightDM_ThemeUtils-get_current_localized_time) ⇒ <code>string</code>

