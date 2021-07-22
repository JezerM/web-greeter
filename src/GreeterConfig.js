/*
 * GreeterConfig.js
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
 * Provides greeter themes with a way to access values from the greeter's config
 * file located at `/etc/lightdm/web-greeter.yml`. The greeter will
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: `greeter_config`.
 *
 * @typicalname greeter_config
 * @memberOf LightDM
 */
class GreeterConfig  {
	/**
	 * Holds keys/values from the `branding` section of the config file.
	 *
	 * @type {Object}
	 * @property {String} background_images_dir Path to directory that contains background images
	 *                                      for use in greeter themes.
	 * @property {String} logo                  Path to distro logo image for use in greeter themes.
	 * @property {String} user_image            Default user image/avatar. This is used by greeter themes
	 *                                      for users that have not configured a `.face` image.
	 * @readonly
	 */
	get branding() {}

	/**
	 * Holds keys/values from the `greeter` section of the config file.
	 *
	 * @type {Object}
	 * @property {Boolean} debug_mode          Greeter theme debug mode.
	 * @property {Boolean} detect_theme_errors Provide an option to load a fallback theme when theme
	 *                                     errors are detected.
	 * @property {Number}  screensaver_timeout Blank the screen after this many seconds of inactivity.
	 * @property {Boolean} secure_mode         Don't allow themes to make remote http requests.
	 * @property {String}  theme               The name of the theme to be used by the greeter.
	 * @property {String|Null}  icon_theme		 Icon/cursor theme to use, located in /usr/share/icons, i.e "Adwaita". Set to Null to use default icon theme.
	 * @property {String|Null}  time_language  Language to use when displaying the date or time, i.e "en-us", "es-419", "ko", "ja". Set to Null to use system's language.
	 * @readonly
	 */
	get greeter() {}


	/**
	 * Holds keys/values from the `features` section of the config file.
	 *
	 * @type {Object}
	 * @property {Boolean} battery				 Enable greeter and themes to ger battery status.
	 * @property {Object}  backlight
	 * @property {Boolean} backlight.enabled				 Enable greeter and themes to control display backlight.
	 * @property {Number}  backlight.value					 The amount to increase/decrease brightness by greeter.
	 * @property {Number}  backlight.steps					 How many steps are needed to do the change.
	 */
	get features() {}
}

