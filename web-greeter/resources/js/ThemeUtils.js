/*
 * ThemeUtils.js
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


let time_language = null,
	_ThemeUtils = null;


/**
 * Provides various utility methods for use in greeter themes. The greeter will automatically
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: [`theme_utils`](#dl-window-theme_utils).
 *
 * @memberOf LightDM
 */
class ThemeUtils {

	constructor( instance ) {
		if ( null !== _ThemeUtils ) {
			return _ThemeUtils;
		}

		_ThemeUtils = instance;
	}

	/**
	 * Binds `this` to class, `context`, for all of the class's methods.
	 *
	 * @arg {object} context An ES6 class instance with at least one method.
	 *
	 * @return {object} `context` with `this` bound to it for all of its methods.
	 */
	bind_this( context ) {
		let excluded_methods = ['constructor'];

		function not_excluded( _method, _context ) {
			let is_excluded = excluded_methods.findIndex( excluded_method => _method === excluded_method ) > -1,
				is_method = 'function' === typeof _context[_method];

			return is_method && !is_excluded;
		}

		for ( let obj = context; obj; obj = Object.getPrototypeOf( obj ) ) {
			// Stop once we have traveled all the way up the inheritance chain
			if ( 'Object' === obj.constructor.name ) {
				break;
			}

			for ( let method of Object.getOwnPropertyNames( obj ) ) {
				if ( not_excluded( method, context ) ) {
					context[method] = context[method].bind( context );
				}
			}
		}

		return context;
	}


	/**
	 * Returns the contents of directory found at `path` provided that the (normalized) `path`
	 * meets at least one of the following conditions:
	 *   * Is located within the greeter themes' root directory.
	 *   * Has been explicitly allowed in the greeter's config file.
	 *   * Is located within the greeter's shared data directory (`/var/lib/lightdm-data`).
	 *   * Is located in `/tmp`.
	 *
	 * @param {string}              path        The abs path to desired directory.
	 * @param {boolean}             only_images Include only images in the results. Default `true`.
	 * @param {function(string[])}  callback    Callback function to be called with the result.
	 */
	dirlist( path, only_images = true, callback ) {
		if ( '' === path || 'string' !== typeof path ) {
			console.error(`theme_utils.dirlist(): path must be a non-empty string!`);
			return callback([]);

		} else if ( null !== path.match(/^[^/].+/) ) {
			console.error(`theme_utils.dirlist(): path must be absolute!`);
			return callback([]);
		}

		if ( null !== path.match(/\/\.+(?=\/)/) ) {
			// No special directory names allowed (eg ../../)
			path = path.replace(/\/\.+(?=\/)/g, '' );
		}

		try {
			return _ThemeUtils.dirlist( path, only_images, callback );
		} catch( err ) {
			console.error(`theme_utils.dirlist(): ${err}`);
			return callback([]);
		}
	}

	/**
	 * Get the current date in a localized format. Local language is autodetected by default, but can be set manually in the greeter config file.
	 * 	 * `language` defaults to the system's language, but can be set manually in the config file.
	 * 
	 * @returns {Object} The current date.
	 */
	get_current_localized_date() {
		let config = greeter_config.greeter

		var locale = []

		if (time_language === null) {
			time_language = config.time_language
		}

		if (time_language != "") {
			locale.push(time_language)
		}

		let optionsDate = { day: "2-digit", month: "2-digit", year: "2-digit" }

		let fmtDate = Intl.DateTimeFormat(locale, optionsDate)

		let now = new Date()
		var date = fmtDate.format(now)

		return date
	}

	/**
	 * Get the current time in a localized format. Local language is autodetected by default, but can be set manually in the greeter config file.
	 * 	 * `language` defaults to the system's language, but can be set manually in the config file.
	 * 
	 * @returns {Object} The current time.
	 */
	get_current_localized_time() {
		let config = greeter_config.greeter

		var locale = []

		if (time_language === null) {
			time_language = config.time_language
		}

		if (time_language != "") {
			locale.push(time_language)
		}

		let optionsTime = { hour: "2-digit", minute: "2-digit" }

		let fmtTime = Intl.DateTimeFormat(locale, optionsTime)

		let now = new Date()
		var time = fmtTime.format(now)

		return time
	}
}
