/*
 * greeter.js
 *
 * Copyright © 2015-2017 Antergos
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
 * This is used to access our classes from within jQuery callbacks.
 */
let _self = null,
	_bg_self = null,
	_config = null;


/**
 * Capitalize a string.
 *
 * @returns {string}
 */
String.prototype.capitalize = function () {
	return this.charAt( 0 ).toUpperCase() + this.slice( 1 );
};


function is_empty( value ) {
	if ( value instanceof Array ) {
		return value.length === 0;
	}

	return ['', null, 'null', undefined, 'undefined', false, 'false'].includes( value );
}


/**
 * Add text to the debug log element (accessible from the login screen).
 *
 * @param {string} text - To be added to the log.
 */
function log( text ) {
	if ( _config.debug ) {
		console.debug( text );
	}

	$( '#logArea' ).append( `${text}<br/>` );
}


/**
 * The base class for all theme components. It handles accessing cached settings in
 * local storage and also initializes config values.
 */
class ThemeConfig {

	constructor() {
		if ( null !== _config ) {
			return _config;
		}

		_config = theme_utils.bind_this( this );

		this.debug             = false;
		this.lang              = window.navigator.language.split( '-' )[0].toLowerCase();
		this.translations      = window.ant_translations;
		this.$log_container    = $( '#logArea' );
		this.cache_backend     = '';

		this.setup_cache_backend();

		return _config;
	}

	/**
	 * Determine which background image should be displayed and apply it.
	 *
	 * @return {Promise}
	 */
	initialize() {
		return new Promise( resolve => this.init_config_values( resolve ) );
	}

	setup_cache_backend() {
		// Do we have access to localStorage?
		try {
			localStorage.setItem( 'testing', 'test' );

			if ( 'test' === localStorage.getItem( 'testing' ) ) {
				// We have access to localStorage
				this.cache_backend = 'localStorage';
			}

			localStorage.removeItem( 'testing' );

		} catch ( err ) {
			// We do not have access to localStorage. Use cookies instead.
			log( err );
			log( 'INFO: localStorage is not available. Using cookies for cache backend.' );
			this.cache_backend = 'Cookies';
		}

		log( `AntergosThemeUtils.cache_backend is: ${this.cache_backend}` );
	}


	/**
	 * Get a key's value from localStorage. Keys can have two or more parts.
	 * For example: "ant:user:john:session".
	 *
	 * @param {...string} key_parts Strings that are combined to form the key.
	 *
	 * @return {string|null}
	 */
	_get( ...key_parts ) {
		let key = `ant`,
			value = null;

		for ( let part of key_parts ) {
			key += `:${part}`;
		}

		if ( 'localStorage' === this.cache_backend ) {
			value = localStorage.getItem( key );

		} else if ( 'Cookies' === this.cache_backend ) {
			value = Cookies.get( key ) || null;
		}

		log( `ThemeSettings._get() key: ${key} value is: ${value}` );

		return value;
	}


	/**
	 * Set a key's value in localStorage. Keys can have two or more parts.
	 * For example: "ant:user:john:session".
	 *
	 * @param {string}    value     The value to set.
	 * @param {...string} key_parts Strings that are combined to form the key.
	 *
	 * @return {string} Always returns `value` (regardless of whether it was set successfully).
	 */
	_set( value, ...key_parts ) {
		let key = `ant`;

		for ( let part of key_parts ) {
			key += `:${part}`;
		}

		log( `ThemeSettings._set() called with key: ${key} and value: ${value}` );

		if ( 'localStorage' === this.cache_backend ) {
			localStorage.setItem( key, value );

		} else if ( 'Cookies' === this.cache_backend ) {
			Cookies.set( key, value );
		}

		return value;
	}


	/**
	 * Get some values from `web-greeter.conf` and save them for later.
	 *
	 * @param {Promise.resolve} callback
	 */
	init_config_values( callback ) {
		if ( 'undefined' === typeof( greeter_config ) ) {
			window.greeter_config = { branding: {}, greeter: {} };
		}

		this.logo                  = greeter_config.branding.logo || 'img/antergos.png';
		this.user_image            = greeter_config.branding.user_image || 'img/antergos-logo-user.png';
		this.background_images_dir = greeter_config.branding.background_images_dir || '/usr/share/backgrounds';
		this.debug                 = greeter_config.greeter.debug_mode || false;
		this.background_images     = this._get( 'background_manager', 'background_images' );
		this.images_cache_expires  = moment.unix( parseInt( this._get( 'background_manager', 'cache_expires' ) ) );

		let expired = ( null === this.background_images || ! this.images_cache_expires.isValid() || moment().isAfter( this.images_cache_expires ) );

		if ( this.background_images && this.background_images.length > 0 && ! expired ) {
			this.background_images = JSON.parse( this.background_images );
			return callback();
		}

		theme_utils.dirlist( this.background_images_dir, true, result => {
			this.cache_background_images( result );
			return callback();
		} );
	}

	cache_background_images( result ) {
		this.background_images = result;

		if ( is_empty( this.background_images ) ) {
			return;
		}

		this._set( JSON.stringify( this.background_images ), 'background_manager', 'background_images' );

		let expires = moment().add( 7, 'days' ).unix().toString();
		this.images_cache_expires = this._set( expires, 'background_manager', 'cache_expires' );
	}
}




/**
 * This class handles the theme's background switcher.
 */
class BackgroundManager {

	constructor() {
		if ( null !== _bg_self ) {
			return _bg_self;
		}

		_bg_self = theme_utils.bind_this( this );

		this.current_background = _config._get( 'background_manager', 'current_background' );
		this.random_background = _config._get( 'background_manager', 'random_background' );

		if ( is_empty( _config.background_images ) ) {
			log( 'BackgroundManager: [ERROR] No background images detected.' );

			$( '.header' ).fadeTo( 300, 0.5, function () {
				$( '.header' ).css( 'background-image', 'url(img/fallback_bg.jpg)' );
			} ).fadeTo( 300, 1 );
		}

		return _bg_self;
	}


	/**
	 * Determine which background image should be displayed and apply it.
	 *
	 * @return {Promise}
	 */
	initialize() {
		return new Promise( (resolve, reject) => {
			if ( is_empty( _bg_self.current_background ) ) {
				_bg_self.random_background = _config._set( 'true', 'background_manager', 'random_background' );
			}

			if ( 'true' === _bg_self.random_background ) {
				_bg_self.current_background = _config._set( _bg_self.get_random_image(), 'background_manager', 'current_background' );
			}

			return _bg_self.do_background( resolve );
		});
	}


	/**
	 * Sets the background image to the value of {@link this.current_background}.
	 *
	 * @param {?Promise.resolve} resolve
	 */
	do_background( resolve = null ) {
		let background = _bg_self.current_background,
			tpl = background.startsWith( 'url(' ) ? background : `url(${background})`;

		$( '.header' ).css( 'background-image', tpl );

		if ( null !== resolve ) {
			return resolve();
		}
	}


	/**
	 * Get a random background image from our images array.
	 *
	 * @returns {string} The absolute path to a background image.
	 */
	get_random_image() {
		let random_bg;

		if ( is_empty( _config.background_images ) ) {
			return 'img/fallback_bg.jpg';
		}

		random_bg = Math.floor( Math.random() * _config.background_images.length );
		let image = _config.background_images[random_bg];

		return image;
	}


	/**
	 * Setup the background switcher widget.
	 */
	setup_background_thumbnails() {
		if ( _config.background_images && _config.background_images.length ) {
			let current_bg_url = `url(${this.current_background})`,
				$random_thumbnail = $( '[data-img="random"]' ),
				$thumbs_container = $( '.bgs' );

			// TODO: Implement some form of pagination
			if ( _config.background_images.length > 100 ) {
				_config.background_images = _config.background_images.splice( 0, 100 );
			}

			$random_thumbnail.on( 'click', event => this.background_selected_handler(event) );

			for ( let image_file of _config.background_images ) {
				let $link = $( '<a href="#"><div>' ),
					$img_el = $link.children( 'div' ),
					img_url = `url(web-greeter://${image_file})`;

				if ( image_file === this.current_background || img_url === current_bg_url ) {
					$link.addClass( 'active' );
				}

				$img_el.css( 'background-image', img_url );

				$link.addClass( 'bg clearfix' ).attr( 'data-img', img_url );
				$link.appendTo( $thumbs_container ).on( 'click', event => this.background_selected_handler(event) );
			}

			if ( ! $( '.bg.active' ).length ) {
				$random_thumbnail.addClass( 'active' );
			}
		}
	}


	/**
	 * Handle background image selected event.
	 *
	 * @param {Object} event jQuery event object.
	 */
	background_selected_handler( event ) {
		let $target = $( event.target ),
			image = event.target.parentElement.dataset.img

		$( '.bg.active' ).removeClass( 'active' );
		$target.addClass( 'active' );

		if ( 'random' === image ) {
			_bg_self.random_background = _config._set( 'true', 'background_manager', 'random_background' );
			_bg_self.current_background = _bg_self.get_random_image();
		} else {
			_bg_self.random_background = _config._set( 'false', 'background_manager', 'random_background' );
			_bg_self.current_background = image;
		}

		_config._set( image, 'background_manager', 'current_background' );
		this.do_background();
	}
}


/**
 * This is the theme's main class object. It contains most of the theme's logic.
 */
class Theme {

	constructor() {
		if ( null !== _self ) {
			return _self;
		}

		_self = theme_utils.bind_this( this );

		this.tux                 = 'img/antergos-logo-user.png';
		this.user_list_visible   = false;
		this.auth_pending        = false;
		this.showing_message     = false;
		this.selected_user       = null;
		this.$user_list          = $( '#user-list2' );
		this.$session_list       = $( '#sessions' );
		this.$clock_container    = $( '#collapseOne' );
		this.$clock              = $( '#current_time' );
		this.$actions_container  = $( '#actionsArea' );
		this.$msg_area_container = $( '#statusArea' );
		this.$alert_msg_tpl      = this.$msg_area_container.children( '.alert-dismissible' ).clone();

		this.background_manager = new BackgroundManager();

		this.background_manager.initialize().then( () => this.initialize() );

		return _self;
	}


	/**
	 * Initialize the theme.
	 */
	initialize() {
		this.prepare_translations();
		this.do_static_translations();
		this.initialize_clock();
		this.prepare_login_panel_header();
		this.prepare_system_action_buttons();

		$( '#login' ).css( 'opacity', '1' );

		this.prepare_user_list();
		this.prepare_session_list();
		this.register_callbacks();
		this.background_manager.setup_background_thumbnails();
	}


	/**
	 * Register callbacks for the LDM Greeter as well as any others that haven't
	 * been registered elsewhere.
	 */
	register_callbacks() {
		this.$user_list
			.parents( '.collapse' )
			.on( 'shown.bs.collapse hidden.bs.collapse', event => this.user_list_collapse_handler(event) );

		$( document ).on( 'keydown', event => this.key_press_handler(event) );
		$( '.cancel_auth:not(.alert .cancel_auth)' ).on( 'click', event => this.cancel_authentication(event) );

		$( '.submit_passwd' ).on( 'click', event => this.submit_password(event) );
		$( '[data-i18n="debug_log"]' ).on( 'click', event => this.show_log_handler(event) );

		lightdm.show_prompt.connect( (prompt, type) => this.show_prompt(prompt, type) );
		lightdm.show_message.connect( (msg, type) => this.show_message(msg, type) );

		window.start_authentication    = event => this.start_authentication(event);
		window.cancel_authentication   = event => this.cancel_authentication(event);

		lightdm.authentication_complete.connect( () => this.authentication_complete() );
		lightdm.autologin_timer_expired.connect( event => this.cancel_authentication(event) );
	}

	/**
	 * Initialize the user list.
	 */
	prepare_user_list() {
		let template;

		// Loop through the array of LightDMUser objects to create our user list.
		for ( let user of lightdm.users ) {
			let last_session = _config._get( 'user', user.username, 'session' ),
				image_src = ( user.image && user.image.length ) ? user.image : _config.user_image;

			if ( null === last_session ) {
				// This user has never logged in before let's enable the system's default session.
				last_session = _config._set( lightdm.default_session, 'user', user.username, 'session' );
			}

			log( `Last session for ${user.username} was: ${last_session}` );

			template = `
				<a href="#" id="${user.username}" class="list-group-item ${user.username}" data-session="${last_session}">
					<img src="${image_src}" class="img-circle" alt="${user.display_name}" />
					<span>${user.display_name}</span>
					<span class="badge"><i class="fa fa-check"></i></span>
				</a>`;

			// Insert the template into the DOM and then register event handlers so we don't
			// have to iterate over the users again later.
			$( template )
				.appendTo( this.$user_list )
				.on( 'click', event => this.start_authentication(event) )
				.on( 'error.antergos', err => this.user_image_error_handler(err) );

		} // END for ( let user of lightdm.users )

		if ( this.$user_list.children().length > 3 ) {
			// Make the user list two columns instead of one.
			this.$user_list.css( 'column-count', '2' ).parent().css( 'max-width', '85%' );
		}

	}

	/**
	 * Initialize the session selection dropdown.
	 */
	prepare_session_list() {
		// Loop through the array of LightDMSession objects to create our session list.
		for ( let session of lightdm.sessions ) {
			let css_class = session.name.replace( / /g, '' ),
				template;

			log( `Adding ${session.name} to the session list...` );

			template = `
				<li>
					<a href="#" data-session-id="${session.key}" class="${css_class}">${session.name}</a>
				</li>`;

			$( template )
				.appendTo( this.$session_list )
				.on( 'click', event => this.session_toggle_handler(event) );

		} // END for (var session of lightdm.sessions)

		$( '.dropdown-toggle' ).dropdown();
	}

	/**
	 * Initialize the system action buttons
	 */
	prepare_system_action_buttons() {
		let template,
			actions = {
			shutdown: 'power-off',
			hibernate: 'asterisk',
			suspend: 'arrow-down',
			restart: 'refresh'
		};

		for ( let action of Object.keys( actions ) ) {
			let cmd = `can_${action}`;

			template = `
				<a href="#" id="${action}" class="btn btn-default ${action}" data-toggle="tooltip" data-placement="top" title="${action.capitalize()}" data-container="body">
					<i class="fa fa-${actions[action]}"></i>
				</a>`;

			if ( ! lightdm[cmd] ) {
				// This action is either not available on this system or we don't have permission to use it.
				continue;
			}

			$( template )
				.appendTo( this.$actions_container )
				.on( 'click', event => this.system_action_handler(event) );

		} // END for (let action of actions)

		$( '[data-toggle=tooltip]' ).tooltip();
		$( '.modal' ).modal( { show: false } );
	}


	/**
	 * Setup the clock widget.
	 */
	initialize_clock() {
		this.$clock.html( theme_utils.get_current_localized_time() );

		setInterval( () => _self.$clock.html( theme_utils.get_current_localized_time() ), 60000 );
	}


	/**
	 * Show the user list if its not already shown. This is used to allow the user to
	 * display the user list by pressing Enter or Spacebar.
	 */
	show_user_list( show = true ) {
		let delay = 0;

		if ( false === show ) {
			return;
		}

		if ( this.$clock_container.hasClass( 'in' ) ) {
			delay = 500;

			$( '#trigger' ).trigger( 'click' );
		}

		if ( this.$user_list.children().length <= 1 ) {
			setTimeout( () => this.$user_list.find( 'a' ).trigger( 'click', this ), delay );
		}
	}


	prepare_login_panel_header() {
		let greeting = _config.translations.greeting ? _config.translations.greeting : 'Welcome!',
			logo = is_empty( _config.logo ) ? 'img/antergos.png' : _config.logo;

		$( '.welcome' ).text( greeting );
		$( '#hostname' ).append( lightdm.hostname );
		$( '[data-greeter-config="logo"]' ).attr( 'src', logo );
	}


	prepare_translations() {
		if ( ! _config.translations.hasOwnProperty( this.lang ) ) {
			this.lang = 'en';

			for ( let lang of window.navigator.languages ) {
				if ( _config.translations.hasOwnProperty( lang ) ) {
					this.lang = lang;
					break;
				}
			}
		}

		_config.translations = _config.translations[ this.lang ];
	}


	/**
	 * Replace '${i18n}' with translated string for all elements that
	 * have the data-i18n attribute. This is for elements that are not generated
	 * dynamically (they can be found in index.html).
	 */
	do_static_translations() {
		$( '[data-i18n]' ).each( function () {
			let key = $( this ).attr( 'data-i18n' ),
				html = $( this ).html(),
				translated = _config.translations[ key ],
				new_html = html.replace( '${i18n}', translated );

			$( this ).html( new_html );
		} );
	}


	/**
	 * Start the authentication process for the selected user.
	 *
	 * @param {object} event - jQuery.Event object from 'click' event.
	 */
	start_authentication( event ) {
		let user_id = $( event.target ).attr( 'id' ),
			selector = `.${user_id}`,
			user_session_cached = _config._get( 'user', user_id, 'session' ),
			user_session = is_empty( user_session_cached ) ? lightdm.default_session : user_session_cached;

		if ( this.auth_pending || null !== this.selected_user ) {
			lightdm.cancel_authentication();
			log( `Authentication cancelled for ${this.selected_user}` );
			this.selected_user = null;
			this.auth_pending = false;
		}

		log( `Starting authentication for ${user_id}.` );

		this.selected_user = user_id;

		if ( this.$user_list.children().length > 3 ) {
			// Reset columns since only the selected user is visible right now.
			this.$user_list.css( 'column-count', 'initial' ).parent().css( 'max-width', '50%' );
		}

		$( selector ).addClass( 'hovered' ).siblings().hide();
		$( '.fa-toggle-down' ).hide();

		log( `Session for ${user_id} is ${user_session}` );

		$( `[data-session-id="${user_session}"]` ).parent().trigger( 'click', this );

		$( '#session-list' ).removeClass( 'hidden' ).show();
		$( '#passwordArea' ).show();
		$('#passwordField').focus();
		$( '.dropdown-toggle' ).dropdown();

		this.auth_pending = true;

		lightdm.authenticate( user_id );
	}


	/**
	 * Cancel the pending authentication.
	 *
	 * @param {object} event - jQuery.Event object from 'click' event.
	 */
	cancel_authentication( event ) {
		let selectors = ['#statusArea', '#timerArea', '#passwordArea', '#session-list'];

		selectors.forEach( selector => $( selector ).hide() );

		lightdm.cancel_authentication();

		log( 'Cancelled authentication.' );

		this.selected_user = null;
		this.auth_pending  = false;

		if ( event && $( event.target ).hasClass( 'alert' ) ) {
			/* We were triggered by the authentication failed message being dismissed.
			 * Keep the same account selected so user can retry without re-selecting an account.
			 */
			$( '#collapseTwo .user-wrap2' ).show( () => {
				$( '.list-group-item.hovered' ).trigger( 'click' );
			} );

		} else {
			if ( this.$user_list.children().length > 3 ) {
				// Make the user list two columns instead of one.
				this.$user_list.css( 'column-count', '2' ).parent().css( 'max-width', '85%' );
			}

			$( '.hovered' ).removeClass( 'hovered' ).siblings().show();
			$( '.fa-toggle-down' ).show();
		}
	}


	/**
	 * Called when the user attempts to authenticate (submits password).
	 * We check to see if the user successfully authenticated and if so tell the LDM
	 * Greeter to log them in with the session they selected.
	 */
	authentication_complete() {
		let selected_session = $( '#session-list .selected' ).attr( 'data-session-id' ),
			err_msg          = _config.translations.auth_failed;

		this.auth_pending = false;

		_config._set( selected_session, 'user', lightdm.authentication_user, 'session' );

		$( '#timerArea' ).hide();

		if ( lightdm.is_authenticated ) {
			// The user entered the correct password. Let's start the session.
			$( 'body' ).fadeOut( 1000, () => lightdm.start_session( selected_session ) );

		} else {
			// The user did not enter the correct password. Show error message.
			this.showing_message = true;
			this.show_message( err_msg, 'error' );
		}
	}


	submit_password( event ) {
		let passwd = $( '#passwordField' ).val();
		console.log(lightdm.authentication_user);

		$( '#passwordArea' ).hide();
		$( '#timerArea' ).show();

		lightdm.respond( passwd );
	}


	session_toggle_handler( event ) {
		let $session = $( event.target ),
			session_name = $session.text(),
			session_key = $session.attr( 'data-session-id' );

		$session
			.parents( '.btn-group' )
			.find( '.selected' )
			.attr( 'data-session-id', session_key )
			.html( session_name );
	}


	key_press_handler( event ) {
		let action = this.showing_message ? this.dismiss_message : null;

		if ( null === action ) {
			switch ( event.which ) {
				case 13:
					if ( this.auth_pending ) {
						action = this.submit_password;
					} else if ( ! this.user_list_visible ) {
						action = this.show_user_list;
					}
					break;
				case 27:
					action = this.auth_pending ? this.cancel_authentication : null;
					break;
				case 32:
					action = ( !this.user_list_visible && !this.auth_pending ) ? this.show_user_list : null;
					break;
			}
		}

		if ( null !== action ) {
			action();
		}
	}


	system_action_handler( event ) {
		let action = $( event.currentTarget ).attr( 'id' ),
			$modal = $( '.modal' );

		$modal
			.find( '.btn-primary' )
			.text( _config.translations[ action ] )
			.on( 'click', action, function( event ) {
				$( this ).off( 'click' );
				$( 'body' ).fadeOut( 1000, () => lightdm[ event.data ]() );
			} );

		$modal
			.find( '.btn-default' )
			.on( 'click', function( event ) {
				$( this ).next().off( 'click' );
			} );

		$modal.modal( 'toggle' );
	}


	user_list_collapse_handler( event ) {
		this.user_list_visible = $( event.target ).hasClass( 'in' );
		this.show_user_list( this.user_list_visible );
	}


	user_image_error_handler( event ) {
		$( event.target ).off( 'error.antergos' );
		$( event.target ).attr( 'src', this.tux );
	}


	show_log_handler( event ) {
		if ( _config.$log_container.is( ':visible' ) ) {
			_config.$log_container.hide();
		} else {
			_config.$log_container.show();
		}
	}


	/**
	 * LightDM Callback - Show prompt to user.
	 *
	 * @param text
	 * @param type
	 */
	show_prompt( text, type ) {
		if ( 'password' === type ) {
			$( '#passwordField' ).val( '' );
			$( '#passwordArea' ).show();
			$( '#passwordField' ).focus();
		}
	}

	/**
	 * LightDM Callback - Show message to user.
	 *
	 * @param text
	 * @param type
	 */
	show_message( text, type ) {
		if ( ! text.length ) {
			log( 'show_message() called without a message to show!' );
			return;
		}

		let $msg_container = this.$msg_area_container.children( '.alert-dismissible' );

		if ( ! $msg_container.length ) {
			$msg_container = this.$alert_msg_tpl.clone();
			$msg_container.appendTo( this.$msg_area_container );
		}

		$msg_container.on( 'closed.bs.alert', event => this.cancel_authentication( event ) );

		$msg_container.html( $msg_container.html() + text );
		$( '#collapseTwo .user-wrap2' ).hide();
		this.$msg_area_container.show();
	}

	dismiss_message() {
		this.$msg_area_container
			.children( '.alert-dismissible' )
			.find('.close')
			.trigger('click');

		this.showing_message = false;
	}
}


/**
 * Initialize the theme once the window has loaded.
 */
$( window ).on( 'GreeterReady', () => {
	const config = new ThemeConfig();

	config.initialize().then( () => new Theme() );
} );
