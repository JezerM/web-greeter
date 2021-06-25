class Sessions {
  constructor() {
    this._localStorage = window.localStorage
    this._sessionLabel = document.querySelector("#session-label")
    this._sessionList = document.querySelector("#sessions-list")
    this._sessionsButton = document.querySelector("#sessions-button")
    this._defaultSession = null
    this._sessionsObject = null
    this._init()
  }

  getDefaultSession() {
    return this._defaultSession.key
  }

  _setSessionDefault() {
    this._sessionLabel.innerHTML = `<b>${this._defaultSession.name}</b>`
  }

  _updateOnStartup() {
    var session_key = this._localStorage.getItem("defaultSession") || this._sessionsObject[0].key || lightdm.default_session

    var defaultSession = this._sessionsObject.find(el => el.key == session_key)

    var session_name = defaultSession ? defaultSession.name : "awesome wm"
    session_key = defaultSession ? defaultSession.key : "awesome"

    this._defaultSession = {
      key: session_key,
      name: session_name
    }
    this._setSessionDefault()
  }

  _setSessionList() {
    var dropdown = this._sessionList.querySelector(".dropdown")
    dropdown.innerHTML = ""
    for (let i = 0; i < this._sessionsObject.length; i++) {
      var name = this._sessionsObject[i].name
      var li = document.createElement("li")
      var button = document.createElement("button")
      button.innerHTML = name
      button.addEventListener("click", () => {
        this._updateDefaults(this._sessionsObject[i])
        this._setSessionDefault()
      })

      li.appendChild(button)
      dropdown.appendChild(li)
    }
  }

  _setButton() {
    var dropdown = this._sessionList.querySelector(".dropdown")
    this._sessionsButton.addEventListener("click", (ev) => {
      ev.stopPropagation()
      if (dropdown.classList.contains("hide")) {
        dropdown.classList.remove("hide")
      } else {
        dropdown.classList.add("hide")
      }
    })
    var screen = document.querySelector("#screen")
    screen.addEventListener("click", (ev) => {
      if (ev.target != dropdown) {
        dropdown.classList.add("hide")
      }
    })

  }

  _updateDefaults(sessionObj) {
    if (!sessionObj) return
    this._defaultSession = sessionObj
    this._localStorage.setItem("defaultSession", this._defaultSession.key)
  }

  _init() {
    this._sessionsObject = lightdm.sessions
    this._updateOnStartup()
    this._setSessionList()
    this._setButton()
  }
}
