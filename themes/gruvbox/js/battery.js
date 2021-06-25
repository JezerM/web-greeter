class Battery {
  constructor() {
    this._battery = document.querySelector("#battery-label")
    this._info = {}
    this._init()
  }

  _updateData() {
    lightdm.batteryUpdate()
    this._info = lightdm.batteryData
    var level = this._info.level
    var state = this._info.state
    var icon = 0
    var charging = ""
    var blevel = Math.floor(level / 10) * 10
    icon = `-${blevel}`
    charging = state == "Charging" ? "-charging" : ""

    if (blevel < 10) icon = "-outline"
    if (state == "Full" ) { icon = ""; charging = ""}
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
    setTimeout(() => {
      this._updateData()
    }, 5 * 1000)
    setInterval(() => {
      this._updateData()
    }, 20 * 1000) // Every 20 seconds
  }

  _init() {
    this._setTimer()
  }
}
