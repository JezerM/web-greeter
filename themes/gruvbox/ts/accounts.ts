import { LightDMUser } from "../../../ts-types/ldm_interfaces";

export class Accounts {
  private _userImage: HTMLDivElement | null;
  private _userLabel: HTMLDivElement | null;
  private _userList: HTMLDivElement | null;
  private _userListButton: HTMLButtonElement | null;
  private _userListDropdown: HTMLUListElement | null;
  private _defaultUser: LightDMUser | null;
  private _usersObject: LightDMUser[] | null;
  public guestUser: LightDMUser | null = null;

  public constructor() {
    this._userImage = document.querySelector("#user-image");
    this._userLabel = document.querySelector("#user-label");
    this._userList = document.querySelector("#user-list");
    this._userListButton = document.querySelector("#user-list-button");
    this._userListDropdown = document.querySelector("#users-dropdown");
    this._defaultUser = null;
    this._usersObject = null;
    this.init();
  }

  public getDefaultUserName(): string | undefined {
    return this._defaultUser?.username;
  }
  public getDefaultAccount(): LightDMUser | null {
    return this._defaultUser;
  }
  public setDefaultAccount(): void {
    const img = this._userImage?.querySelector("img");
    if (!img) return;
    img.src = this._defaultUser?.image ?? "";
    img.onerror = function (): void {
      img.src = "";
    };

    if (this._userLabel) {
      const name =
        this._defaultUser?.display_name ??
        this._defaultUser?.username ??
        "No user";
      this._userLabel.innerHTML = `<b>${name}</b>`;
    }
  }

  public updateOnStartup(): void {
    if (!this._usersObject) return;
    const dfUserName = window.localStorage.getItem("defaultUserName");

    let user = window.lightdm?.users.find(
      (value) => value.username == dfUserName
    );
    if (!user) {
      user = this._usersObject.length > 0 ? this._usersObject[0] : undefined;
    }

    this._defaultUser = user ?? null;
    this.setDefaultAccount();
  }

  public setGuestAccount(): void {
    if (window.lightdm?.has_guest_account) {
      const guestName = `guest-account-${Math.floor(Math.random() * 1000)}`;
      this.guestUser = {
        username: guestName,
        display_name: "Guest",
        image: "",
        background: "",
        layout: "",
        layouts: [],
        session: "",
        language: "",
        logged_in: false,
        home_directory: "",
      };
      this._usersObject?.push(this.guestUser);
    }
  }

  public setAccountList(): void {
    if (!this._usersObject || !this._userListDropdown) return;
    this._userListDropdown.innerHTML = "";
    for (const v of this._usersObject) {
      const name = v.display_name;
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.innerText = name;
      button.addEventListener("click", () => {
        this.updateDefaults(v);
        this.setDefaultAccount();
        window.authenticate.startAuthentication();
      });

      li.appendChild(button);
      this._userListDropdown.appendChild(li);
    }
  }

  public updateDefaults(user: LightDMUser): void {
    if (!user) return;

    this._defaultUser = user;

    window.localStorage.setItem("defaultUserName", user.username);
  }

  public setKeydown(): void {
    this._userListDropdown?.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        this._userListDropdown?.classList.add("hide");
        this._userListButton?.focus();
      }
    });
  }
  public setButton(): void {
    document.querySelector("#screen")?.addEventListener("click", (ev) => {
      if (!ev.target) return;
      if (
        ev.target == this._userListButton ||
        (ev.target as Element).parentElement == this._userListButton
      ) {
        this._userListDropdown?.classList.toggle("hide");
      } else if (
        ev.target != this._userList &&
        (ev.target as Element).closest(".dropdown") == null
      ) {
        this._userListDropdown?.classList.add("hide");
      }
    });
    document.querySelector("#screen")?.addEventListener("focusin", () => {
      if (
        !this._userListDropdown?.contains(document.activeElement) &&
        document.activeElement != this._userListButton
      ) {
        this._userListDropdown?.classList.add("hide");
      }
    });
  }

  public init(): void {
    if (!window.lightdm) return;
    this._usersObject = window.lightdm.users;
    this.updateOnStartup();
    this.setAccountList();
    this.setButton();
    this.setKeydown();
  }
}
