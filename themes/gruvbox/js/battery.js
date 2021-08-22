class Battery {
  constructor() {
    this._battery = document.querySelector("#battery-label")
    this._info = {}
    this._init()
  }

  _updateData() {
    this._info = lightdm.batteryData
    var level = this._info.level
    var state = this._info.state
    var ac = this._info.ac_status
    var icon = 0
    var charging = ""
    var blevel = Math.floor(level / 10) * 10
    icon = `-${blevel}`
    charging = ac == 1 ? "-charging" : ""

    if (blevel < 10) icon = "-outline"
    if (level == 100 && ac == 0) {icon = ""}
    if (level >= 0) {
      this._battery.style.visibility = "visible"
      this._battery.innerHTML = `<span class="mdi mdi-battery${charging}${icon}"></span> ${level}%`
    } else {
      this._battery.innerHTML = ""
      this._battery.style.visibility = "hidden"
    }
  }

  _setTimer() {
    if (!lightdm.can_access_battery) return
    this._updateData()
  }

  _init() {
    this._setTimer()
  }
}
