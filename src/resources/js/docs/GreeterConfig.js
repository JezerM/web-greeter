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
 * with the global variable: [`greeter_config`](#dl-window-greeter_config).
 *
 * @memberOf LightDM
 */
class GreeterConfig  {
	/**
	 * Holds keys/values from the `branding` section of the config file.
	 *
	 * @type {object} branding
	 * @prop {string} background_images_dir Path to directory that contains background images
	 *                                      for use in greeter themes.
	 * @prop {string} logo                  Path to distro logo image for use in greeter themes.
	 * @prop {string} user_image            Default user image/avatar. This is used by greeter themes
	 *                                      for users that have not configured a `.face` image.
	 * @readonly
	 */
	get branding() {}

	/**
	 * Holds keys/values from the `greeter` section of the config file.
	 *
	 * @type {object}  greeter
	 * @prop {boolean} debug_mode          Greeter theme debug mode.
	 * @prop {boolean} detect_theme_errors Provide an option to load a fallback theme when theme
	 *                                     errors are detected.
	 * @prop {number}  screensaver_timeout Blank the screen after this many seconds of inactivity.
	 * @prop {boolean} secure_mode         Don't allow themes to make remote http requests.
	 * @prop {string}  time_format         A moment.js format string to be used by the greeter to
	 *                                     generate localized time for display.
	 * @prop {string}  time_language       Language to use when displaying the time or `auto`
	 *                                     to use the system's language.
	 * @prop {string}  theme               The name of the theme to be used by the greeter.
	 * @readonly
	 */
	get greeter() {}
}





