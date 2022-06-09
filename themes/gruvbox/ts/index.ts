import { Accounts } from "./accounts.js";
import { Authenticate } from "./authenticate.js";
import { Sessions } from "./sessions.js";
import { TimeDate } from "./timeDate.js";
import { Layouts } from "./layouts.js";
import { Power } from "./power.js";
import { Battery } from "./battery.js";
import { Brightness } from "./brightness.js";
import "./mock.js";

declare global {
  interface Window {
    accounts: Accounts;
    sessions: Sessions;
    authenticate: Authenticate;
    timeDate: TimeDate;
    layouts: Layouts;
    power: Power;
    battery: Battery;
    brightness: Brightness;

    wait(ms: number): Promise<void>;
  }
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

window.wait = wait;

async function initGreeter(): Promise<void> {
  if (window.greeter_config?.greeter.debug_mode) {
    // Run debug
  }

  window.accounts = new Accounts();

  window.sessions = new Sessions();

  window.authenticate = new Authenticate();

  window.timeDate = new TimeDate();

  window.layouts = new Layouts();

  window.power = new Power();

  window.battery = new Battery();

  window.brightness = new Brightness();

  if (window.lightdm?.lock_hint) {
    document.querySelector("#lock-label")?.classList.remove("hide");
  }
}

window.addEventListener("GreeterReady", () => {
  initGreeter();
});
