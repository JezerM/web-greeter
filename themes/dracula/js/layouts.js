class Layouts {
  constructor() {
    this._layoutList = document.querySelector("#layouts-list");
    this._dropdown = document.querySelector("#layouts-dropdown");
    this._button = document.querySelector("#layouts-button");
    this._layouts = [];

    this.layout = {};

    this._init();
  }

  _setDefault() {
    let name = this.layout.name;
    let description = this.layout.description;
    let short = this.layout.short_description;
    this._button.innerHTML = name.toUpperCase() + (short ? ` (${short})` : "");
    //this._button.name = description
  }

  _setLayoutList() {
    let dropdown = this._dropdown;
    dropdown.innerHTML = "";
    for (let i = 0; i < this._layouts.length; i++) {
      let name = this._layouts[i].name;
      let description = this._layouts[i].description;
      let short = this._layouts[i].short_description;
      let li = document.createElement("li");
      let button = document.createElement("button");
      button.innerHTML = name + (short ? ` (${short})` : "");
      button.name = description;
      button.addEventListener("click", () => {
        this.layout = this._layouts[i];
        this._setDefault();
        lightdm.layout = this.layout;
      });
      li.appendChild(button);
      dropdown.appendChild(li);
    }
  }

  _setKeydown() {
    let dropdown = this._dropdown;
    dropdown.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        dropdown.classList.add("hide");
        this._button.focus();
      }
    });
  }

  _setButton() {
    let dropdown = this._dropdown;
    document.querySelector("#screen").addEventListener("click", (ev) => {
      if (
        ev.target == this._button ||
        ev.target.parentElement == this._button
      ) {
        dropdown.classList.toggle("hide");
      } else if (
        ev.target != dropdown &&
        ev.target.closest(".dropdown") == null
      ) {
        dropdown.classList.add("hide");
      }
    });
    document.querySelector("#screen").addEventListener("focusin", (ev) => {
      if (
        !dropdown.contains(document.activeElement) &&
        document.activeElement != this._button
      ) {
        dropdown.classList.add("hide");
      }
    });
  }

  _init() {
    this.layout = lightdm.layout;
    this._layouts = greeter_config.layouts;
    this._setDefault();
    this._setLayoutList();
    this._setButton();
    this._setKeydown();
  }
}
