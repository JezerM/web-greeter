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
 * @typicalname lightdm
 * @memberOf LightDM
 */
class Greeter {
  constructor() {}
  /**
   * The username of the user being authenticated or "null"
   * if no authentication is in progress
   * @type {string|null}
   * @readonly
   */
  get authentication_user() {}
  /**
   * Whether or not the guest account should be automatically logged
   * into when the timer expires.
   * @type {boolean}
   * @readonly
   */
  get autologin_guest() {}
  /**
   * The number of seconds to wait before automatically logging in.
   * @type {number}
   * @readonly
   */
  get autologin_timeout() {}
  /**
   * The username with which to automattically log in when the timer expires.
   * @type {string}
   * @readonly
   */
  get autologin_user() {}
  /**
   * Gets the battery data.
   * @type {LightDM.Battery}
   * @readonly
   */
  get batteryData() {}
  /**
   * The current brightness
   * @type {number}
   */
  get brightness() {}
  set brightness(quantity) {}
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
   * @type {boolean}
   * @readonly
   */
  get can_hibernate() {}
  /**
   * Whether or not the greeter can make the system restart.
   * @type {boolean}
   * @readonly
   */
  get can_restart() {}
  /**
   * Whether or not the greeter can make the system shutdown.
   * @type {boolean}
   * @readonly
   */
  get can_shutdown() {}
  /**
   * Whether or not the greeter can make the system suspend/sleep.
   * @type {boolean}
   * @readonly
   */
  get can_suspend() {}
  /**
   * The name of the default session.
   * @type {string}
   * @readonly
   */
  get default_session() {}
  /**
   * Whether or not guest sessions are supported.
   * @type {boolean}
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
   * @type {string}
   * @readonly
   */
  get hostname() {}
  /**
   * Whether or not the greeter is in the process of authenticating.
   * @type {boolean}
   * @readonly
   */
  get in_authentication() {}
  /**
   * Whether or not the greeter has successfully authenticated.
   * @type {boolean}
   * @readonly
   */
  get is_authenticated() {}
  /**
   * The current language or "null" if no language.
   * @type {LightDM.Language|null}
   * @readonly
   */
  get language() {}
  /**
   * A list of languages to present to the user.
   * @type {LightDM.Language[]}
   * @readonly
   */
  get languages() {}
  /**
   * The currently active layout for the selected user.
   * @type {LightDM.Layout}
   */
  get layout() {}
  set layout(layout) {}
  /**
   * A list of keyboard layouts to present to the user.
   * @type {LightDM.Layout[]}
   * @readonly
   */
  get layouts() {}
  /**
   * Whether or not the greeter was started as a lock screen.
   * @type {boolean}
   * @readonly
   */
  get lock_hint() {}
  /**
   * A list of remote sessions.
   * @type {LightDM.Session[]}
   * @readonly
   */
  get remote_sessions() {}
  /**
   * Whether or not the guest account should be selected by default.
   * @type {boolean}
   * @readonly
   */
  get select_guest_hint() {}
  /**
   * The username to select by default.
   * @type {string}
   * @readonly
   */
  get select_user_hint() {}
  /**
   * List of available sessions.
   * @type {LightDM.Session[]}
   * @readonly
   */
  get sessions() {}
  /**
   * Check if a manual login option should be shown. If "true", the theme should
   * provide a way for a username to be entered manually. Otherwise, themes that show
   * a user list may limit logins to only those users.
   * @type {boolean}
   * @readonly
   */
  get show_manual_login_hint() {}
  /**
   * Check if a remote login option should be shown. If "true", the theme should provide
   * a way for a user to log into a remote desktop server.
   * @type {boolean}
   * @readonly
   * @internal
   */
  get show_remote_login_hint() {}
  /**
   * List of available users.
   * @type {LightDM.User[]}
   * @readonly
   */
  get users() {}
  /**
   * Starts the authentication procedure for a user.
   *
   * @param {string|null} username A username or "null" to prompt for a username.
   */
  authenticate(username) {}
  /**
   * Starts the authentication procedure for the guest user.
   */
  authenticate_as_guest() {}
  /**
   * Set the brightness to quantity
   * @param {number} quantity The quantity to set
   */
  brightnessSet(quantity) {}
  /**
   * Increase the brightness by quantity
   * @param {number} quantity The quantity to increase
   */
  brightnessIncrease(quantity) {}
  /**
   * Decrease the brightness by quantity
   * @param {number} quantity The quantity to decrease
   */
  brightnessDecrease(quantity) {}
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
   * @returns {boolean} "true" if hibernation initiated, otherwise "false"
   */
  hibernate() {}
  /**
   * Provide a response to a prompt.
   * @param {string} response
   */
  respond(response) {}
  /**
   * Triggers the system to restart.
   * @returns {boolean} "true" if restart initiated, otherwise "false"
   */
  restart() {}
  /**
   * Set the language for the currently authenticated user.
   * @param {string} language The language in the form of a locale specification (e.g.
   *     'de_DE.UTF-8')
   * @returns {boolean} "true" if successful, otherwise "false"
   */
  set_language(language) {}
  /**
   * Triggers the system to shutdown.
   * @returns {boolean} "true" if shutdown initiated, otherwise "false"
   */
  shutdown() {}
  /**
   * Start a session for the authenticated user.
   * @param {string|null} session The session to log into or "null" to use the default.
   * @returns {boolean} "true" if successful, otherwise "false"
   */
  start_session(session) {}
  /**
   * Triggers the system to suspend/sleep.
   * @returns {boolean} "true" if suspend/sleep initiated, otherwise "false"
   */
  suspend() {}
  /**
   * Gets emitted when the greeter has completed authentication.
   * @type {LightDM.Signal}
   */
  authentication_complete;
  /**
   * Gets emitted when the automatic login timer has expired.
   * @type {LightDM.Signal}
   */
  autologin_timer_expired;
  /**
   * Gets emitted when brightness is updated
   * @type {LightDM.Signal}
   */
  brightness_update;
  /**
   * Gets emitted when battery is updated
   * @type {LightDM.Signal}
   */
  battery_update;
  /**
   * Gets emitted when the user has logged in and the greeter is no longer needed.
   * @type {LightDM.Signal}
   */
  idle;
  /**
   * Gets emitted when the user is returning to a greeter that
   * was previously marked idle.
   * @type {LightDM.Signal}
   */
  reset;
  /**
   * Gets emitted when the greeter should show a message to the user.
   * @type {LightDM.Signal}
   */
  show_message;
  /**
   * Gets emitted when the greeter should show a prompt to the user.
   * @type {LightDM.Signal}
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
