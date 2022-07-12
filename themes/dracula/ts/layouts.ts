import { LightDMLayout } from "../../../ts-types/ldm_interfaces";

export class Layouts {
  private _layoutListButton: HTMLButtonElement | null;
  private _layoutsDropdown: HTMLUListElement | null;
  private _layoutsObject: LightDMLayout[] | null;
  public currentLayout: LightDMLayout | null;

  public constructor() {
    this._layoutListButton = document.querySelector("#layout-list-button");
    this._layoutsDropdown = document.querySelector("#layouts-dropdown");
    this._layoutsObject = [];

    this.currentLayout = null;

    this.init();
  }

  public setDefaultLayout(): void {
    if (!this.currentLayout || !this._layoutListButton) return;
    const name = this.currentLayout.name;
    //const description = this.currentLayout.description;
    const short = this.currentLayout.short_description;
    this._layoutListButton.innerText =
      name.toUpperCase() + (short ? ` (${short})` : "");
    //this._button.name = description
  }

  public setLayoutList(): void {
    if (!this._layoutsDropdown || !this._layoutsObject) return;
    this._layoutsDropdown.innerHTML = "";
    for (const v of this._layoutsObject) {
      const name = v.name;
      const description = v.description;
      const short = v.short_description;
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.innerHTML = name + (short ? ` (${short})` : "");
      button.name = description;
      button.addEventListener("click", () => {
        this.currentLayout = v;
        if (window.lightdm) window.lightdm.layout = v;
        this.setDefaultLayout();
      });
      li.appendChild(button);
      this._layoutsDropdown.appendChild(li);
    }
  }

  public setKeydown(): void {
    this._layoutsDropdown?.addEventListener("keydown", (ev) => {
      if (!this._layoutsDropdown || !this._layoutListButton) return;
      if (ev.keyCode == 27) {
        this._layoutsDropdown.classList.add("hide");
        this._layoutListButton.focus();
      }
    });
  }

  public setButton(): void {
    document.querySelector("#screen")?.addEventListener("click", (ev) => {
      if (!this._layoutsDropdown) return;
      if (
        ev.target == this._layoutListButton ||
        (ev.target as Element).parentElement == this._layoutListButton
      ) {
        this._layoutsDropdown.classList.toggle("hide");
      } else if (
        ev.target != this._layoutsDropdown &&
        (ev.target as Element).closest(".dropdown") == null
      ) {
        this._layoutsDropdown.classList.add("hide");
      }
    });
    document.querySelector("#screen")?.addEventListener("focusin", () => {
      if (!this._layoutsDropdown) return;
      if (
        !this._layoutsDropdown.contains(document.activeElement) &&
        document.activeElement != this._layoutListButton
      ) {
        this._layoutsDropdown.classList.add("hide");
      }
    });
  }

  public init(): void {
    if (!window.lightdm || !window.greeter_config) return;
    this.currentLayout = window.lightdm.layout;
    this._layoutsObject = window.greeter_config.layouts;
    this.setDefaultLayout();
    this.setLayoutList();
    this.setButton();
    this.setKeydown();
  }
}
