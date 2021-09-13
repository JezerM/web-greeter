class Authenticate {
  constructor() {
    this._input = document.querySelector("#input-password");
    this._form = document.querySelector("#pass-form > form");
    this._input_eye = document.querySelector("#pass-eye");
    this._password = "";
    this._init();
  }

  _setForm() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      var inputs = this._form.querySelectorAll("input");
      var data = getArrayForm(inputs);
      if (!data) return false;
      this._password = data.password;
      this._respond();
    });
  }
  _setAuthentication_done() {
    window.authentication_done = () => {
      if (lightdm.is_authenticated) {
        this._authentication_done();
      } else {
        this._authentication_failed();
      }
    };
  }
  _setPasswordEye() {
    this._input_eye.addEventListener("click", () => {
      if (this._input.type === "password") {
        this._input.type = "text";
      } else {
        this._input.type = "password";
      }
    });
  }

  _respond() {
    var input = document.querySelector("#input-password");
    let username = accounts.getDefaultUserName();
    input.blur();
    input.disabled = true;
    if (username == accounts._guestAccount && lightdm.has_guest_account) {
      lightdm.authenticate_as_guest();
    } else {
      lightdm.respond(this._password);
    }
  }

  startAuthentication() {
    lightdm.cancel_authentication();
    let username = accounts.getDefaultUserName();
    if (username == accounts._guestAccount && lightdm.has_guest_account) return;
    lightdm.authenticate(String(accounts.getDefaultUserName()));
  }

  async _authentication_done() {
    var form = document.querySelector("#login-form");
    form.classList.add("success");

    await wait(500);
    var defSession = String(sessions.getDefaultSession());
    var body = document.querySelector("body");
    body.style.opacity = 0;

    await wait(1000);
    console.log("Session started with", defSession);
    lightdm.start_session(defSession);
  }

  async _authentication_failed() {
    this.startAuthentication();
    var input = document.querySelector("#input-password");
    document.querySelector("#login-form").classList.add("failed");
    input.blur();
    input.value = "";
    input.disabled = false;

    await wait(2000);
    document.querySelector("#login-form").classList.remove("failed");
  }

  _init() {
    this._setForm();
    this._setAuthentication_done();
    this._setPasswordEye();
    console.log("Start authentication");
    this.startAuthentication();
  }
}
