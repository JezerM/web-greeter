class Authenticate {
  constructor() {
    this._input = document.querySelector("#input-password")
    this._form = document.querySelector("#pass-form > form")
    this._password = ""
    this._init()
  }

  _setForm() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault()
      var inputs = this._form.querySelectorAll('input')
      var data = getArrayForm(inputs)
      if (!data) return false
      this._password = data.password
      this._respond()
    })
  }
  _setAuthentication_done() {
    window.authentication_done = () => {
      if (lightdm.is_authenticated) {
        this._authentication_done()
      } else {
        this._authentication_failed()
      }
    }
  }

  _setReset_Greeter() {
    window.reset_greeter = () => {
      var form = document.querySelector("#login-form")
      var input = document.querySelector("#input-password")
      var body = document.querySelector("body")

      form.classList.remove("success")
      input.value = ""
      input.disabled = false
      body.style.opacity = 1
      this.startAuthentication()
    }
  }

  _respond() {
    var input = document.querySelector("#input-password")
    input.blur()
    input.disabled = true
    lightdm.respond(this._password)
  }

  startAuthentication() {
    lightdm.cancel_authentication()
    lightdm.authenticate(String(accounts.getDefaultUserName()))
  }

  async _authentication_done() {
    var form = document.querySelector("#login-form")
    var input = document.querySelector("#input-password")
    form.classList.add("success")

    await wait(500)
    var defSession = String(sessions.getDefaultSession())
    var body = document.querySelector("body")
    body.style.opacity = 0

    await wait(1000)
    console.log("Session started with", defSession)
    lightdm.start_session(defSession)
  }

  async _authentication_failed() {
    this.startAuthentication()
    var input = document.querySelector("#input-password")
    document.querySelector("#login-form").classList.add("failed")
    input.blur()
    input.value = ""
    input.disabled = false

    await wait(2000)
    document.querySelector("#login-form").classList.remove("failed")
  }

  _init() {
    this._setForm()
    this._setAuthentication_done()
    this._setReset_Greeter()
    console.log("Start authentication")
    this.startAuthentication()
  }
}
