class Accounts {
  constructor() {
    this._localStorage = window.localStorage
    this._userImage = document.querySelector("#user-image")
    this._userLabel = document.querySelector("#user-label")
    this._accountsList = document.querySelector("#users-list")
    this._accountsButton = document.querySelector("#users-button")
    this._defaultUser = null
    this._usersObject = null
    this._init()
  }

  getDefaultUserName() {
    return this._defaultUser.username
  }

  _setAccountDefault() {
    var img = this._userImage.querySelector("img")
    img.src = this._defaultUser.image
    img.onerror = function() {
      img.src = ""
    }
    this._userLabel.innerHTML = `<b>${this._defaultUser.display_name}</b>`
  }

  _updateOnStartup() {
    var username = this._localStorage.getItem('defaultUser') || this._usersObject[0].username
    var display_name = this._localStorage.getItem('defaultUserDisplayName') || this._usersObject[0].display_name
    var image = this._localStorage.getItem("defaultUserProfileImage") || this._usersObject[0].image
    this._defaultUser = {
      username,
      display_name,
      image,
    }
    this._setAccountDefault()
  }

  _setAccountList() {
    var dropdown = this._accountsList.querySelector(".dropdown")
    dropdown.innerHTML = ""
    for (let i = 0; i < this._usersObject.length; i++) {
      var name = this._usersObject[i].display_name
      var li = document.createElement("li")
      var button = document.createElement("button")
      button.innerHTML = name
      button.addEventListener("click", () => {
        this._updateDefaults(this._usersObject[i])
        this._setAccountDefault()
        authenticate.startAuthentication()
      })

      li.appendChild(button)
      dropdown.appendChild(li)
    }
  }

  _setButton() {
    var dropdown = this._accountsList.querySelector(".dropdown")
    this._accountsButton.addEventListener("click", (ev) => {
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

  _updateDefaults(userObject) {
    if (!userObject) return
    this._defaultUser = userObject

    this._localStorage.setItem("defaultUser", this._defaultUser.username)
    this._localStorage.setItem("defaultUserDisplayName", this._defaultUser.display_name)
    this._localStorage.setItem("defaultUserProfileImage", this._defaultUser.image)
  }

  _init() {
    this._usersObject = lightdm.users
    this._updateOnStartup()
    this._setAccountList()
    this._setButton()
  }

}
