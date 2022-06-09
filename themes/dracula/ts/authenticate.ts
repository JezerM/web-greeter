export class Authenticate {
  private _form: HTMLFormElement | null;
  private _inputUser: HTMLInputElement | null;
  private _inputPass: HTMLInputElement | null;
  private _inputEye: HTMLButtonElement | null;
  public _username: string;
  public _password: string;

  public constructor() {
    this._form = document.querySelector("#login-form");
    this._inputUser = document.querySelector("#input-username");
    this._inputPass = document.querySelector("#input-password");
    this._inputEye = document.querySelector("#pass-eye");
    this._username = "";
    this._password = "";
    this.init();
  }

  public setForm(): void {
    if (!this._form) return;
    this._form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (this._inputUser) {
        this._inputUser.blur();
        this._inputUser.disabled = true;
      }
      if (this._inputPass) {
        this._inputPass.blur();
        this._inputPass.disabled = true;
      }

      this._username = this._inputUser?.value ?? "";
      this._password = this._inputPass?.value ?? "";

      // This should prompt for the user
      window.lightdm?.authenticate(null);
      //this._respond();
    });
  }
  public setPasswordEye(): void {
    if (!this._inputEye) return;
    this._inputEye.addEventListener("click", () => {
      if (!this._inputPass) return;
      if (this._inputPass.type === "password") {
        this._inputPass.type = "text";
      } else {
        this._inputPass.type = "password";
      }
    });
  }

  public showMessage(msg: string): void {
    const message: HTMLDivElement | null =
      document.querySelector("#auth-message");
    if (!message) return;
    message.innerText = msg;
    message.classList.remove("hide");
  }

  public hideMessage(): void {
    const message: HTMLDivElement | null =
      document.querySelector("#auth-message");
    message?.classList.add("hide");
  }

  public async _authentication_done(): Promise<void> {
    const body = document.querySelector("body");
    if (body) body.classList.add("success");

    this.showMessage("Welcome!");

    const form: HTMLFormElement | null = document.querySelector("#pass-form");
    const topbar = document.querySelector("#top-bar");
    const bottombar = document.querySelector("#bottom-bar");
    if (!form || !topbar || !bottombar) return;
    form.style.transition = "0ms";
    form.classList.add("hide");
    topbar.classList.add("hide");
    bottombar.classList.add("hide");

    await window.wait(1000);
    const defSession = window.sessions.getDefaultSession();
    if (body) body.style.opacity = "0";

    await window.wait(1000);
    console.log("Session started with", defSession);
    window.lightdm?.start_session(
      defSession?.key ?? window.lightdm.default_session
    );
  }

  public async _authentication_failed(): Promise<void> {
    window.lightdm?.cancel_authentication();
    const body = document.querySelector("body");
    if (body) body.classList.add("failed");

    this.showMessage("Try again");

    const form: HTMLFormElement | null = document.querySelector("#pass-form");
    const topbar = document.querySelector("#top-bar");
    const bottombar = document.querySelector("#bottom-bar");
    if (!form || !topbar || !bottombar) return;
    form.style.transition = "0ms";
    form.classList.add("hide");
    topbar.classList.add("hide");
    bottombar.classList.add("hide");

    await window.wait(1500);

    this.hideMessage();
    form.style.transition = "";
    form.classList.remove("hide");
    topbar.classList.remove("hide");
    bottombar.classList.remove("hide");

    if (!this._inputUser || !this._inputPass) return;

    this._inputUser.blur();
    this._inputUser.disabled = false;
    this._inputPass.blur();
    this._inputPass.disabled = false;
    this._inputPass.value = "";

    if (body) body.classList.remove("failed");
  }

  public setAuthenticationDone(): void {
    window.lightdm?.authentication_complete.connect(() => {
      if (window.lightdm?.is_authenticated) {
        this._authentication_done();
      } else {
        this._authentication_failed();
      }
    });
  }

  public setSignalHandler(): void {
    window.lightdm?.show_prompt.connect((_message, type) => {
      if (!window.lightdm) return;
      if (type == 0) {
        // Prompt username
        window.lightdm.respond(this._username);
      } else if (type == 1 && window.lightdm.in_authentication) {
        // Prompt password
        window.lightdm.respond(this._password);
      }
    });
  }

  public init(): void {
    this.setSignalHandler();
    this.setForm();
    this.setAuthenticationDone();
    this.setPasswordEye();
  }
}
