class Brightness {
  constructor() {
    this._brightness = document.querySelector("#brightness-label");
    this._level = 0;
    this._init();
  }

  _updateData() {
    this._level = lightdm.brightness;
    if (this._level >= 0) {
      this._brightness.style.visibility = "visible";
      var icon = this._level > 50 ? 7 : this._level > 10 ? 6 : 5;
      this._brightness.innerHTML = `<span class="mdi mdi-brightness-${icon}"></span> ${this._level}%`;
    } else {
      this._brightness.innerHTML = "";
      this._brightness.style.visibility = "hidden";
    }
  }

  _setTimer() {
    if (!lightdm.can_access_brightness) return;
    this._updateData();
  }

  _init() {
    this._setTimer();
  }
}
