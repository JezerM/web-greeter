import { LightDMUser } from "../../../js/ldm_interfaces";

export class Accounts {
  private _userWrapper: HTMLDivElement | null;
  private _usersDropdown: HTMLUListElement | null;
  private _userListButton: HTMLButtonElement | null;
  private _defaultUser: LightDMUser | null;
  private _usersObject: LightDMUser[] | null;

  public constructor() {
    this._userWrapper = document.querySelector("#user-wrapper");
    this._usersDropdown = document.querySelector("#users-dropdown > ul");
    this._userListButton = document.querySelector("#users-button");
    this._defaultUser = null;
    this._usersObject = null;
    this.init();
  }

  public getDefaultUserName(): string | null {
    return this._defaultUser?.username ?? null;
  }

  public getDefaultAccount(): LightDMUser | null {
    return this._defaultUser;
  }

  public setDefaultAccount(): void {
    const input = this._userWrapper?.querySelector("input");
    if (!input) return;
    if (this._defaultUser?.username != "") {
      //input.classList.add("hide")
      input.value = this._defaultUser?.username ?? "";
    } else {
      input.value = "";
    }
    if (this._usersObject && this._usersObject.length > 0) {
      this._userListButton?.classList.remove("hide");
    }
  }

  public updateOnStartup(): void {
    if (!this._usersObject) return;
    const dfUser = window.localStorage.getItem("defaultUser");
    let user: LightDMUser;

    try {
      user = JSON.parse(dfUser ?? "");
    } catch (e) {
      user = this._usersObject[0];
    }

    this._defaultUser = user;
    this.setDefaultAccount();
  }

  public setAccountList(): void {
    if (!this._usersDropdown || !this._usersObject) return;
    this._usersDropdown.innerHTML = "";

    for (const v of this._usersObject) {
      const name = v.username;
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.innerText = name;
      button.addEventListener("click", () => {
        this.updateDefaults(v);
        this.setDefaultAccount();
        //authenticate.startAuthentication()
      });

      li.appendChild(button);
      this._usersDropdown.appendChild(li);
    }
  }

  public setButton(): void {
    document.querySelector("#screen")?.addEventListener("click", (ev) => {
      if (
        ev.target == this._userListButton ||
        (ev.target as Element).parentElement == this._userListButton
      ) {
        this._usersDropdown?.classList.toggle("hide");
      } else if (
        ev.target != this._usersDropdown &&
        (ev.target as Element).closest(".dropdown") == null
      ) {
        this._usersDropdown?.classList.add("hide");
      }
    });
  }

  public updateDefaults(user: LightDMUser): void {
    if (!user) return;
    this._defaultUser = user;

    window.localStorage.setItem("defaultUser", JSON.stringify(user));
  }

  public init(): void {
    if (!window.lightdm) return;
    this._usersObject = window.lightdm.users;
    this.updateOnStartup();
    this.setAccountList();
    this.setButton();
  }
}
