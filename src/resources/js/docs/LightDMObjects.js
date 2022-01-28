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
 * @name window
 * @type {object}
 * @global
 */

/**
 * The greeter's Theme JavaScript API.
 *
 * @namespace LightDM
 */


/**
 * Interface for object that holds info about a session. Session objects are not
 * created by the theme's code, but rather by the [`LightDM.Greeter`](#dl-LightDM-Greeter) class.
 *
 * @memberOf LightDM
 */
class Session  {
	constructor( { comment, key, name } ) {
		this._comment = comment;
		this._key = key;
		this._name = name;
	}

	/**
	 * The name for the session.
	 * @type {string}
	 * @readonly
	 */
	get name() {
		return this._name;
	}

	/**
	 * The key for the session.
	 * @type {string}
	 * @readonly
	 */
	get key() {
		return this._key;
	}

	/**
	 * The comment for the session.
	 * @type {string}
	 * @readonly
	 */
	get comment() {
		return this._comment;
	}
}


/**
 * Interface for object that holds info about a language on the system. Language objects are not
 * created by the theme's code, but rather by the [`LightDM.Greeter`](#dl-LightDM-Greeter) class.
 *
 * @memberOf LightDM
 */
class Language {
	constructor( { code, name, territory } ) {
		this._code = code;
		this._name = name;
		this._territory = territory;
	}

	/**
	 * The code for the language.
	 * @type {string}
	 * @readonly
	 */
	get code() {
		return this._code;
	}

	/**
	 * The name for the layout.
	 * @type {string}
	 * @readonly
	 */
	get name() {
		return this._name;
	}

	/**
	 * The territory for the language.
	 * @type {string}
	 * @readonly
	 */
	get territory() {
		return this._territory;
	}
}


/**
 * Interface for object that holds info about a keyboard layout on the system. Language
 * objects are not created by the theme's code, but rather by the [`LightDM.Greeter`](#dl-LightDM-Greeter) class.
 *
 * @memberOf LightDM
 */
class Layout {
	constructor( { description, name, short_description } ) {
		this._description = description;
		this._name = name;
		this._short_description = short_description;
	}

	/**
	 * The description for the layout.
	 * @type {string}
	 * @readonly
	 */
	get description() {
		return this._description;
	}

	/**
	 * The name for the layout.
	 * @type {string}
	 * @readonly
	 */
	get name() {
		return this._name;
	}

	/**
	 * The territory for the layout.
	 * @type {string}
	 * @readonly
	 */
	get short_description() {
		return this._short_description;
	}
}


/**
 * Interface for object that holds info about a user account on the system. User
 * objects are not created by the theme's code, but rather by the [`LightDM.Greeter`](#dl-LightDM-Greeter) class.
 *
 * @memberOf LightDM
 */
class User {
	constructor( user_info ) {
		Object.keys(user_info).forEach( key => {
			this[`_${key}`] = user_info[key];
		} );
	}

	/**
	 * The display name for the user.
	 * @type {string}
	 * @readonly
	 */
	get display_name() {
		return this._display_name;
	}

	/**
	 * The language for the user.
	 * @type {string}
	 * @readonly
	 */
	get language() {
		return this._language;
	}

	/**
	 * The keyboard layout for the user.
	 * @type {string}
	 * @readonly
	 */
	get layout() {
		return this._layout;
	}

	/**
	 * The image for the user.
	 * @type {string}
	 * @readonly
	 */
	get image() {
		return this._image;
	}

	/**
	 * The home_directory for the user.
	 * @type {string}
	 * @readonly
	 */
	get home_directory() {
		return this._home_directory;
	}

	/**
	 * The username for the user.
	 * @type {string}
	 * @readonly
	 */
	get username() {
		return this._username;
	}

	/**
	 * Whether or not the user is currently logged in.
	 * @type {boolean}
	 * @readonly
	 */
	get logged_in() {
		return this._logged_in;
	}

	/**
	 * The last session that the user logged into.
	 * @type {string|null}
	 * @readonly
	 */
	get session() {
		return this._session;
	}
}

