class Authenticate {
  constructor() {
    this._form = document.querySelector("#login-form");
    this._inputUser = document.querySelector("#input-username");
    this._inputPass = document.querySelector("#input-password");
    this._input_eye = document.querySelector("#pass-eye");
    this._username = "";
    this._password = "";
    this._init();
  }

  _setForm() {
    this._form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      var inputs = this._form.querySelectorAll("input");
      var data = getArrayForm(inputs);
      if (!data) return false;
      this._username = data.username;
      this._password = data.password;
      this._respond();
    });
  }
  _setPasswordEye() {
    this._input_eye.addEventListener("click", () => {
      if (this._inputPass.type === "password") {
        this._inputPass.type = "text";
      } else {
        this._inputPass.type = "password";
      }
    });
  }

  async _respond() {
    this._inputUser.blur();
    this._inputUser.disabled = true;
    this._inputPass.blur();
    this._inputPass.disabled = true;

    lightdm.cancel_authentication();
    lightdm.authenticate(String(this._username));
    await wait(1000);
    lightdm.respond(this._password);
  }

  _showMessage(msg) {
    let message = document.querySelector("#auth-message");
    message.innerText = msg;
    message.classList.remove("hide");
  }

  _hideMessage() {
    let message = document.querySelector("#auth-message");
    message.classList.add("hide");
  }

  async _authentication_done() {
    let body = document.querySelector("body");
    body.classList.add("success");

    this._showMessage("Welcome!");

    let form = document.querySelector("#pass-form");
    let topbar = document.querySelector("#top-bar");
    let bottombar = document.querySelector("#bottom-bar");
    form.style.transition = "0ms";
    form.classList.add("hide");
    topbar.classList.add("hide");
    bottombar.classList.add("hide");

    await wait(1000);
    let defSession = String(sessions.getDefaultSession());
    document.querySelector("body").style.opacity = 0;

    await wait(1000);
    console.log("Session started with", defSession);
    lightdm.start_session(defSession);
  }

  async _authentication_failed() {
    lightdm.cancel_authentication();
    let body = document.querySelector("body");
    body.classList.add("failed");

    this._showMessage("Try again");

    let form = document.querySelector("#pass-form");
    let topbar = document.querySelector("#top-bar");
    let bottombar = document.querySelector("#bottom-bar");
    form.style.transition = "0ms";
    form.classList.add("hide");
    topbar.classList.add("hide");
    bottombar.classList.add("hide");

    await wait(1500);

    this._hideMessage();
    form.style.transition = "";
    form.classList.remove("hide");
    topbar.classList.remove("hide");
    bottombar.classList.remove("hide");

    this._inputUser.blur();
    this._inputUser.disabled = false;
    this._inputPass.blur();
    this._inputPass.disabled = false;
    this._inputPass.value = "";

    body.classList.remove("failed");
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

  _init() {
    this._setForm();
    this._setAuthentication_done();
    this._setPasswordEye();
  }
}
