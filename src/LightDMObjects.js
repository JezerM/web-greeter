/*
 * Copyright © 2015-2017 Antergos
 *
 * LightDMObjects.js
 *
 * This file is part of Web Greeter
 *
 * Web Greeter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * Web Greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The global window object.
 *
 * @namespace window
 * @global
 */

/**
 * The greeter's Theme JavaScript API.
 * Accesible through `lightdm` global variable.
 *
 * @namespace LightDM
 */

/**
 * Interface for object that holds info about a session. Session objects are not
 * created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.
 *
 * @memberOf LightDM
 */
class Session {
  constructor({ comment, key, name }) {}
  /**
   * The name for the session.
   * @type {string}
   * @readonly
   */
  get name() {}
  /**
   * The key for the session.
   * @type {string}
   * @readonly
   */
  get key() {}
  /**
   * The comment for the session.
   * @type {string}
   * @readonly
   */
  get comment() {}
  /**
   * The session type (X11 or Wayland)
   * @type {string}
   * @readonly
   */
  get type() {}
}

/**
 * Interface for object that holds info about a language on the system. Language objects are not
 * created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.
 *
 * @memberOf LightDM
 */
class Language {
  constructor({ code, name, territory }) {}
  /**
   * The code for the language.
   * @type {string}
   * @readonly
   */
  get code() {}
  /**
   * The name for the layout.
   * @type {string}
   * @readonly
   */
  get name() {}
  /**
   * The territory for the language.
   * @type {string}
   * @readonly
   */
  get territory() {}
}

/**
 * Interface for object that holds info about a keyboard layout on the system. Language
 * objects are not created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.
 *
 * @memberOf LightDM
 */
class Layout {
  constructor({ description, name, short_description }) {}
  /**
   * The description for the layout.
   * @type {string}
   * @readonly
   */
  get description() {}
  /**
   * The name for the layout.
   * @type {string}
   * @readonly
   */
  get name() {}
  /**
   * The territory for the layout.
   * @type {string}
   * @readonly
   */
  get short_description() {}
}

/**
 * Interface for object that holds info about a user account on the system. User
 * objects are not created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.
 *
 * @memberOf LightDM
 */
class User {
  /**
   * The user background if any
   * @type {string}
   * @readonly
   */
  get background() {}
  /**
   * The display name for the user.
   * @type {string}
   * @readonly
   */
  get display_name() {}
  /**
   * The language for the user.
   * @type {string}
   * @readonly
   */
  get language() {}
  /**
   * The keyboard layout for the user.
   * @type {string}
   * @readonly
   */
  get layout() {}
  /**
   * The keyboard layouts the user have. You should not depend on this property, use [`greeter_config.layouts`](/api/GreeterConfig#LightDM_GreeterConfig-layouts) instead.
   * @type {string[]}
   * @readonly
   */
  get layouts() {}
  /**
   * The image for the user.
   * @type {string}
   * @readonly
   */
  get image() {}
  /**
   * The home_directory for the user.
   * @type {string}
   * @readonly
   */
  get home_directory() {}
  /**
   * The username for the user.
   * @type {string}
   * @readonly
   */
  get username() {}
  /**
   * Whether or not the user is currently logged in.
   * @type {Boolean}
   * @readonly
   */
  get logged_in() {}
  /**
   * The last session that the user logged into.
   * @type {string}
   * @readonly
   */
  get session() {}
}

/**
 * Interface for object that holds info about the battery on the system. This object is not created by the theme's code, but rather by the [`LightDM.Greeter`](Greeter) class.
 *
 * @memberOf LightDM
 */
class Battery {
  constructor({ level, name, state }) {}
  /**
   * The battery's name.
   * @type {string}
   * @readonly
   */
  get name() {}
  /**
   * The battery level.
   * @type {string}
   * @readonly
   */
  get level() {}
  /**
   * The state for the battery
   * @type {string}
   * @readonly
   */
  get status() {}
  /**
   * Whether the AC adapter is connected
   * @type {boolean}
   * @readonly
   */
  get ac_status() {}
  /**
   * The battery total capacity
   * @type {number}
   * @readonly
   */
  get capacity() {}
  /**
   * The time until discharge
   * @type {string}
   * @readonly
   */
  get time() {}
  /**
   * The battery watts level
   * @type {boolean}
   * @readonly
   */
  get watt() {}
}

/**
 * Interface for signals connected to LightDM itself. This is not created by the theme's code, but rather by Web Greeter.
 * When Web Greeter triggers the signal, all calbacks are executed.
 *
 * @memberOf LightDM
 */
class Signal {
  /**
   * Connects a callback to the signal.
   * @param {Function} callback The callback to attach.
   */
  connect(callback) {}

  /**
   * Disconnects a callback to the signal.
   * @param {Function} callback The callback to disattach.
   */
  disconnect(callback) {}
}
