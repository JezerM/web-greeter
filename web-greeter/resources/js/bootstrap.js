/*
 * bootstrap.js
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


(() => {
	let _channel;

	/**
	 * Greeter Ready Event. Themes should not initialize until this event has fired.
	 * @event window#GreeterReady
	 * @name GreeterReady
	 * @type Event
	 * @memberOf window
	 */
	window._ready_event = new Event( 'GreeterReady' );

	function channel_ready_cb( channel ) {
		_channel = channel;

		/**
		 * Greeter Instance
		 * @name lightdm
		 * @type {LightDM.Greeter}
		 * @memberOf window
		 */
		window.lightdm = _channel.objects.LightDMGreeter;

		/**
		 * Greeter Config - Access values from the greeter's config file.
		 * @name greeter_config
		 * @type {LightDM.GreeterConfig}
		 * @memberOf window
		 */
		window.greeter_config = _channel.objects.Config;

		/**
		 * Theme Utils - various utility methods for use in greeter themes.
		 * @name theme_utils
		 * @type {LightDM.ThemeUtils}
		 * @memberOf window
		 */
		window.theme_utils = new ThemeUtils( _channel.objects.ThemeUtils );

		setTimeout( function () {
			window.dispatchEvent( _ready_event );
		}, 2 );
	}

	document.addEventListener( 'DOMContentLoaded', ( event ) => {
		new QWebChannel( qt.webChannelTransport, channel_ready_cb );
	});

})();

