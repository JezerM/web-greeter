export class Authenticate {
  private _inputPassword: HTMLInputElement | null;
  private _form: HTMLFormElement | null;
  private _inputEye: HTMLButtonElement | null;
  private _password: string;

  public constructor() {
    this._inputPassword = document.querySelector("#input-password");
    this._form = document.querySelector("#pass-form > form");
    this._inputEye = document.querySelector("#pass-eye");
    this._password = "";
    this.init();
  }

  public setForm(): void {
    this._form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this._password = this._inputPassword?.value ?? "";
      this.doRespond();
    });
  }
  public setAuthentication_done(): void {
    window.lightdm?.authentication_complete.connect(() => {
      if (window.lightdm?.is_authenticated) {
        this._authentication_done();
      } else {
        this._authentication_failed();
      }
    });
  }
  public setPasswordEye(): void {
    this._inputEye?.addEventListener("click", () => {
      if (!this._inputPassword) return;
      if (this._inputPassword?.type === "password") {
        this._inputPassword.type = "text";
      } else {
        this._inputPassword.type = "password";
      }
    });
  }

  public doRespond(): void {
    if (!this._inputPassword) return;
    const user = window.accounts.getDefaultAccount();

    this._inputPassword.blur();
    this._inputPassword.disabled = true;

    if (
      user == window.accounts.guestUser &&
      window.lightdm?.has_guest_account
    ) {
      window.lightdm.authenticate_as_guest();
    } else {
      window.lightdm?.respond(this._password);
    }
  }

  public startAuthentication(): void {
    window.lightdm?.cancel_authentication();
    const user = window.accounts.getDefaultAccount();
    if (user == window.accounts.guestUser && window.lightdm?.has_guest_account)
      return;
    window.lightdm?.authenticate(user?.username ?? null);
  }

  public async _authentication_done(): Promise<void> {
    const form = document.querySelector("#login-form");
    form?.classList.add("success");

    await window.wait(500);
    const defSession = window.sessions.getDefaultSession();
    const body = document.querySelector("body");
    if (body) body.style.opacity = "0";

    await window.wait(1000);
    console.log("Session started with", defSession?.key);
    window.lightdm?.start_session(defSession?.key ?? null);
  }

  public async _authentication_failed(): Promise<void> {
    this.startAuthentication();
    document.querySelector("#login-form")?.classList.add("failed");
    if (this._inputPassword) {
      this._inputPassword.blur();
      this._inputPassword.value = "";
      this._inputPassword.disabled = false;
    }

    await window.wait(2000);
    document.querySelector("#login-form")?.classList.remove("failed");
  }

  public init(): void {
    this.setForm();
    this.setAuthentication_done();
    this.setPasswordEye();
    console.log("Start authentication");
    this.startAuthentication();
  }
}
