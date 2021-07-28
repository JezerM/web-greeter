/*
 * LightDMGreeter.js
 *
 * Copyright © 2017 Antergos Developers <dev@antergos.com>
 *
 * This file is part of Web Greeter.
 *
 * Web Greeter is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * Web Greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with web-greeter; If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Base class for the greeter's Theme JavaScript API. Greeter themes will interact
 * directly with an object derived from this class to facilitate the user log-in process.
 * The greeter will automatically create an instance when it starts.
 * The instance can be accessed using the global variable: `lightdm`.
 *
 * @memberOf LightDM
 */
class Greeter {

	constructor() {
		if ( 'lightdm' in window ) {
			return window.lightdm;
		}

		window.lightdm = ThemeUtils.bind_this( this );

		return window.lightdm;
	}

	/**
	 * The username of the user being authenticated or {@link null}
	 * if no authentication is in progress
	 * @type {String|Null}
	 * @readonly
	 */
	get authentication_user() {}

	/**
	 * Whether or not the guest account should be automatically logged
	 * into when the timer expires.
	 * @type {Boolean}
	 * @readonly
	 */
	get autologin_guest() {}

	/**
	 * The number of seconds to wait before automatically logging in.
	 * @type {Number}
	 * @readonly
	 */
	get autologin_timeout() {}

	/**
	 * The username with which to automattically log in when the timer expires.
	 * @type {String}
	 * @readonly
	 */
	get autologin_user() {}

	/**
	 * The battery data
	 * @type {Battery}
	 * @readonly
	 */
	get batteryData() {}

	/**
	 * The display brightness
	 * @type {Number}
	 */
	get brightness() {}
	set brightness( quantity ) {}

	/**
	 * Whether or not the greeter can access to battery data.
	 * @type {boolean}
	 * @readonly
	 */
	get can_access_battery() {}

	/**
	 * Whether or not the greeter can control display brightness.
	 * @type {boolean}
	 * @readonly
	 */
	get can_access_brightness() {}

	/**
	 * Whether or not the greeter can make the system hibernate.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_hibernate() {}

	/**
	 * Whether or not the greeter can make the system restart.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_restart() {}

	/**
	 * Whether or not the greeter can make the system shutdown.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_shutdown() {}

	/**
	 * Whether or not the greeter can make the system suspend/sleep.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_suspend() {}

	/**
	 * The name of the default session.
	 * @type {String}
	 * @readonly
	 */
	get default_session() {}

	/**
	 * Whether or not guest sessions are supported.
	 * @type {Boolean}
	 * @readonly
	 */
	get has_guest_account() {}

	/**
	 * Whether or not user accounts should be hidden.
	 * @type {boolean}
	 * @readonly
	 */
	get hide_users_hint() {}

	/**
	 * The system's hostname.
	 * @type {String}
	 * @readonly
	 */
	get hostname() {}

	/**
	 * Whether or not the greeter is in the process of authenticating.
	 * @type {Boolean}
	 * @readonly
	 */
	get in_authentication() {}

	/**
	 * Whether or not the greeter has successfully authenticated.
	 * @type {Boolean}
	 * @readonly
	 */
	get is_authenticated() {}

	/**
	 * The current language or {@link null} if no language.
	 * @type {Language|Null}
	 * @readonly
	 */
	get language() {}

	/**
	 * A list of languages to present to the user.
	 * @type {Language[]}
	 * @readonly
	 */
	get languages() {}

	/**
	 * The currently active layout for the selected user.
	 * @type {Layout}
	 */
	get layout() {}
	set layout(layout) {}

	/**
	 * A list of keyboard layouts to present to the user.
	 * @type {Layout[]}
	 * @readonly
	 */
	get layouts() {}

	/**
	 * Whether or not the greeter was started as a lock screen.
	 * @type {Boolean}
	 * @readonly
	 */
	get lock_hint() {}

	/**
	 * Whether or not the guest account should be selected by default.
	 * @type {Boolean}
	 * @readonly
	 */
	get select_guest_hint() {}

	/**
	 * The username to select by default.
	 * @type {String}
	 * @readonly
	 */
	get select_user_hint() {}

	/**
	 * List of available sessions.
	 * @type {Session[]}
	 * @readonly
	 */
	get sessions() {}

	/**
	 * Check if a manual login option should be shown. If {@link true}, the theme should
	 * provide a way for a username to be entered manually. Otherwise, themes that show
	 * a user list may limit logins to only those users.
	 * @type {Boolean}
	 * @readonly
	 */
	get show_manual_login_hint() {}

	/**
	 * Check if a remote login option should be shown. If {@link true}, the theme should provide
	 * a way for a user to log into a remote desktop server.
	 * @type {Boolean}
	 * @readonly
	 * @internal
	 */
	get show_remote_login_hint() {}

	/**
	 * List of available users.
	 * @type {User[]}
	 * @readonly
	 */
	get users() {}


	/**
	 * Starts the authentication procedure for a user.
	 *
	 * @param {String|Null} username A username or {@link null} to prompt for a username.
	 */
	authenticate( username ) {}

	/**
	 * Starts the authentication procedure for the guest user.
	 */
	authenticate_as_guest() {}

	/**
	 * Updates the battery data
	 */
	batteryUpdate() {}

	/**
	 * Set the brightness to quantity
	 * @param {Number} quantity The quantity to set
	 */
	brightnessSet( quantity ) {}

	/**
	 * Increase the brightness by quantity
	 * @param {Number} quantity The quantity to increase
	 */
	brightnessIncrease( quantity ) {}

	/**
	 * Decrease the brightness by quantity
	 * @param {Number} quantity The quantity to decrease
	 */
	brightnessDecrease( quantity ) {}

	/**
	 * Cancel user authentication that is currently in progress.
	 */
	cancel_authentication() {}

	/**
	 * Cancel the automatic login.
	 */
	cancel_autologin() {}

	/**
	 * Triggers the system to hibernate.
	 * @returns {Boolean} {@link true} if hibernation initiated, otherwise {@link false}
	 */
	hibernate() {}

	/**
	 * Provide a response to a prompt.
	 * @param {*} response
	 */
	respond( response ) {}

	/**
	 * Triggers the system to restart.
	 * @returns {Boolean} {@link true} if restart initiated, otherwise {@link false}
	 */
	restart() {}

	/**
	 * Set the language for the currently authenticated user.
	 * @param {String} language The language in the form of a locale specification (e.g.
	 *     'de_DE.UTF-8')
	 * @returns {Boolean} {@link true} if successful, otherwise {@link false}
	 */
	set_language( language ) {}

	/**
	 * Triggers the system to shutdown.
	 * @returns {Boolean} {@link true} if shutdown initiated, otherwise {@link false}
	 */
	shutdown() {}

	/**
	 * Start a session for the authenticated user.
	 * @param {String|null} session The session to log into or {@link null} to use the default.
	 * @returns {Boolean} {@link true} if successful, otherwise {@link false}
	 */
	start_session( session ) {}

	/**
	 * Triggers the system to suspend/sleep.
	 * @returns {Boolean} {@link true} if suspend/sleep initiated, otherwise {@link false}
	 */
	suspend() {}

	/**
	 * Gets emitted when the greeter has completed authentication.
	 * @type {Signal}
	 */
	authentication_complete;

	/**
	 * Gets emitted when the automatic login timer has expired.
	 * @type {Signal}
	 */
	autologin_timer_expired;

	/**
	 * Gets emitted when brightness is updated
	 * @type {Signal}
	 */
	brightness_update;

	/**
	 * Gets emitted when the user has logged in and the greeter is no longer needed.
	 * @type {Signal}
	 */
	idle;

	/**
	 * Gets emitted when the user is returning to a greeter that
	 * was previously marked idle.
	 * @type {Signal}
	 */
	reset;

	/**
	 * Gets emitted when the greeter should show a message to the user.
	 * @type {Signal}
	 */
	show_message;

	/**
	 * Gets emitted when the greeter should show a prompt to the user.
	 * @type {Signal}
	 */
	show_prompt;

}

/**
 * JS-Cookie instance - Themes must manually load the included vendor script in order to use this object.
 * @name Cookies
 * @type {object}
 * @version 2.1.3
 * @memberOf window
 * @see [JS Cookie Documentation](https://github.com/js-cookie/js-cookie/tree/latest#readme)
 */



