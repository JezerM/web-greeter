import {
  Signal as SignalClass,
  Greeter as GreeterClass,
  GreeterConfig as GreeterConfigClass,
  ThemeUtils as ThemeUtilsClass,
} from "../../../js/preload";

class LightDMLanguage {
  public code: string;
  public name: string;
  public territory: string;
  public constructor(code: string, name: string, territory: string) {
    this.code = code;
    this.name = name;
    this.territory = territory;
  }
}
class LightDMLayout {
  public name: string;
  public description: string;
  public short_description: string;
  public constructor(
    name: string,
    description: string,
    short_description: string
  ) {
    this.name = name;
    this.description = description;
    this.short_description = short_description;
  }
}
class LightDMUser {
  public background = "";
  public display_name: string;
  public home_directory: string;
  public image: string;
  public language = "";
  public layout = "";
  public layouts: string[] = [];
  public logged_in = false;
  public session: string;
  public username: string;

  public constructor(
    username: string,
    display_name: string,
    image: string,
    session?: string
  ) {
    this.username = username;
    this.display_name = display_name;
    this.image = image;
    this.home_directory = "/home/" + username + "/";
    this.session = session ?? "";
  }
}

class LightDMSession {
  public key: string;
  public name: string;
  public type: string;
  public comment: string;
  public constructor(
    key: string,
    name: string,
    comment?: string,
    type?: string
  ) {
    this.key = key;
    this.name = name;
    this.comment = comment ?? "";
    this.type = type ?? "X";
  }
}

class Signal implements SignalClass {
  public _name: string;
  public _callbacks: ((...args: unknown[]) => void)[] = [];

  public constructor(name: string) {
    this._name = name;
  }

  // eslint-disable-next-line
  public connect(callback: (...args: any[]) => void): void {
    if (typeof callback !== "function") return;
    this._callbacks.push(callback);
  }

  public disconnect(callback: () => void): void {
    const ind = this._callbacks.findIndex((cb) => {
      return cb === callback;
    });
    if (ind == -1) return;
    this._callbacks.splice(ind, 1);
  }

  public _emit(...args: unknown[]): void {
    this._callbacks.forEach((cb) => {
      if (typeof cb !== "function") return;
      cb(...args);
    });
  }
}

const battery = {
  name: "BAT0",
  level: 85,
  status: "Discharging",
  ac_status: false,
  time: "00:00",
  capacity: 100,
  watt: 0,
};

class Greeter implements GreeterClass {
  public mock_password = "tepes";

  public authentication_complete = new Signal("authentication_complete");
  public autologin_timer_expired = new Signal("autologin_timer_expired");
  public idle = new Signal("idle");
  public reset = new Signal("reset");
  public show_message = new Signal("show_message");
  public show_prompt = new Signal("show_prompt");
  public brightness_update = new Signal("show_message");
  public battery_update = new Signal("battery_update");

  public authentication_user: string | null = null;
  public autologin_guest = false;
  public autologin_timeout = 0;
  public autologin_user = "";
  public batteryData = battery;
  public battery_data = battery;
  private _brightness = 50;
  public get brightness(): number {
    return this._brightness;
  }
  public set brightness(quantity: number) {
    if (quantity < 0) quantity = 0;
    else if (quantity > 100) quantity = 100;
    this._brightness = quantity;
    this.brightness_update._emit();
  }

  public can_access_battery = true;
  public can_access_brightness = true;
  public can_hibernate = true;
  public can_restart = true;
  public can_shutdown = true;
  public can_suspend = true;

  public default_session = "awesome";
  public has_guest_account = false;
  public hide_users_hint = false;
  public hostname = "mock-PC";
  public in_authentication = false;
  public is_authenticated = false;

  public language: LightDMLanguage | null = null;
  public languages: LightDMLanguage[] = [
    new LightDMLanguage("en_US.utf8", "English", "USA"),
    new LightDMLanguage("ca_ES.utf8", "Catalan", "Spain"),
    new LightDMLanguage("fr_FR.utf8", "French", "France"),
    new LightDMLanguage("es_NI.utf8", "Spanish", "Nicaragua"),
  ];
  public layout = new LightDMLayout("us", "English (US)", "en");
  public layouts = [
    new LightDMLayout("us", "English (US)", "en"),
    new LightDMLayout("latam", "Español (Latinoamericano)", "es"),
    new LightDMLayout("at", "German (Austria)", "de"),
    new LightDMLayout("us rus", "Russian (US, phonetic)", "ru"),
  ];
  public lock_hint = false;
  public remote_sessions = [];
  public select_guest_hint = false;
  public select_user_hint = "";
  public sessions = [
    new LightDMSession(
      "awesome",
      "Awesome wm",
      "Highly configurable framework window manager"
    ),
    new LightDMSession("ubuntu", "Ubuntu", "This session starts Ubuntu"),
    new LightDMSession(
      "ubuntu-wayland",
      "Ubuntu (on Wayland)",
      "This session starts Ubuntu on Wayland",
      "wayland"
    ),
    new LightDMSession("plasma", "Plasma (X11)", "Plasma, by KDE"),
    new LightDMSession("mate", "MATE", "This session logs you into MATE"),
    new LightDMSession(
      "cinnamon",
      "Cinnamon",
      "This session logs you into Cinnamon"
    ),
    new LightDMSession(
      "openbox",
      "Openbox",
      "This session logs you into Openbox"
    ),
  ];
  public show_manual_login_hint = true;
  public show_remote_login_hint = false;
  public users = [
    new LightDMUser("dracula", "Vlad Tepes", "", "openbox"),
    new LightDMUser("treffy", "Trevor Belmont", "", "cinnamon"),
    new LightDMUser("speaker", "Sypha Belnades", "", "ubuntu"),
  ];

  public authenticate(username: string | null): boolean {
    this.authentication_user = username;
    this.in_authentication = true;
    if (username == null) {
      this.show_prompt._emit("login:", 0);
    }
    return true;
  }

  public authenticate_as_guest(): boolean {
    return false;
  }

  public brightnessSet(quantity: number): void {
    this.brightness = quantity;
  }
  public brightnessIncrease(quantity: number): void {
    this.brightness += quantity;
  }
  public brightnessDecrease(quantity: number): void {
    this.brightness -= quantity;
  }
  public brightness_set(quantity: number): void {
    this.brightness = quantity;
  }
  public brightness_increase(quantity: number): void {
    this.brightness += quantity;
  }
  public brightness_decrease(quantity: number): void {
    this.brightness -= quantity;
  }

  public cancel_authentication(): boolean {
    this.authentication_user = null;
    this.in_authentication = false;
    return true;
  }
  public cancel_autologin(): boolean {
    return true;
  }

  public hibernate(): boolean {
    setTimeout(() => location.reload(), 2000);
    return true;
  }
  public restart(): boolean {
    setTimeout(() => location.reload(), 2000);
    return true;
  }
  public shutdown(): boolean {
    setTimeout(() => location.reload(), 2000);
    return true;
  }
  public suspend(): boolean {
    setTimeout(() => location.reload(), 2000);
    return true;
  }
  public respond(response: string): boolean {
    if (!this.in_authentication) return false;
    if (this.authentication_user == null) {
      this.authentication_user = response;
      this.show_prompt._emit("Password: ", 1);
    } else {
      if (response === this.mock_password) {
        this.is_authenticated = true;
        this.in_authentication = false;
        this.authentication_complete._emit();
      } else {
        setTimeout(() => {
          this.is_authenticated = false;
          this.authentication_complete._emit();
          this.show_prompt._emit("Password: ", 1);
        }, 3000);
      }
    }
    return true;
  }

  public set_language(language: string): boolean {
    if (this.is_authenticated) {
      this.language =
        this.languages.find((v) => {
          return v.code == language;
        }) ?? null;
      return this.language != null;
    }
    return false;
  }
  public start_session(session: string | null): boolean {
    console.log("Session:", session ?? this.default_session);
    setTimeout(() => location.reload(), 100);
    return true;
  }
}

class GreeterConfig implements GreeterConfigClass {
  public branding = {
    background_images_dir: "/usr/share/backgrounds",
    logo: "/usr/share/web-greeter/themes/default/img/antergos-logo-user.png",
    user_image: "/usr/share/web-greeter/themes/default/img/antergos.png",
  };

  public greeter = {
    debug_mode: true,
    detect_theme_errors: true,
    screensaver_timeout: 300,
    secure_mode: true,
    time_language: "",
    theme: "none",
  };

  public layouts = [
    new LightDMLayout("us", "English (US)", "en"),
    new LightDMLayout("latam", "Español (Latinoamericano)", "es"),
    new LightDMLayout("at", "German (Austria)", "de"),
    new LightDMLayout("us rus", "Russian (US, phonetic)", "ru"),
  ];

  public features = {
    battery: true,
    backlight: {
      enabled: true,
      value: 10,
      steps: 0,
    },
  };
}

let time_language = "";
class ThemeUtils implements ThemeUtilsClass {
  // eslint-disable-next-line
  public bind_this(context: Record<string, any>): Record<string, any> {
    const excluded_methods = ["constructor"];

    function not_excluded(
      _method: string,
      _context: Record<string, unknown>
    ): boolean {
      const is_excluded =
          excluded_methods.findIndex(
            (excluded_method) => _method === excluded_method
          ) > -1,
        is_method = "function" === typeof _context[_method];

      return is_method && !is_excluded;
    }

    for (let obj = context; obj; obj = Object.getPrototypeOf(obj)) {
      // Stop once we have traveled all the way up the inheritance chain
      if ("Object" === obj.constructor.name) {
        break;
      }

      for (const method of Object.getOwnPropertyNames(obj)) {
        if (not_excluded(method, context)) {
          context[method] = context[method].bind(context);
        }
      }
    }

    return context;
  }
  public dirlist(
    path: string,
    only_images = true, // eslint-disable-line
    callback: (files: string[]) => void
  ): void {
    if ("" === path || "string" !== typeof path) {
      console.error(`theme_utils.dirlist(): path must be a non-empty string!`);
      return callback([]);
    }
    if (null !== path.match(/\/\.+(?=\/)/)) {
      // No special directory names allowed (eg ../../)
      path = path.replace(/\/\.+(?=\/)/g, "");
    }

    try {
      // Should be changed here
      return callback([]);
    } catch (err) {
      console.error(`theme_utils.dirlist(): ${err}`);
      return callback([]);
    }
  }
  // eslint-disable-next-line
  public dirlist_sync(path: string, images_only = true): string[] {
    return [];
  }

  public get_current_localized_date(): string {
    const config = window.greeter_config?.greeter;
    const locale = [];

    if (time_language === null) {
      time_language = config?.time_language || "";
    }
    if (time_language != "") {
      locale.push(time_language);
    }

    const optionsDate: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };
    const fmtDate = Intl.DateTimeFormat(locale, optionsDate);
    return fmtDate.format(new Date());
  }
  public get_current_localized_time(): string {
    const config = window.greeter_config?.greeter;
    const locale = [];

    if (time_language === null) {
      time_language = config?.time_language || "";
    }
    if (time_language != "") {
      locale.push(time_language);
    }

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const fmtDate = Intl.DateTimeFormat(locale, optionsTime);
    return fmtDate.format(new Date());
  }
}

if (window._ready_event == undefined) {
  console.warn("Running with mock.js. LightDM is not accessible.");
  window.lightdm = new Greeter();
  window.greeter_config = new GreeterConfig();
  window.theme_utils = new ThemeUtils();
  window._ready_event = new Event("GreeterReady");

  window.lightdm.show_prompt.connect((message: string, type: number) => {
    console.log({ message, type });
  });

  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      if (window._ready_event) window.dispatchEvent(window._ready_event);
    }, 2);
  });
}
