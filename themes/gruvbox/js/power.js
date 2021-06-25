class Power {
  constructor() {
    this._shutdown = document.querySelector("#shutdown-btn")
    this._restart = document.querySelector("#restart-btn")
    this._hibernate = document.querySelector("#hibernate-btn")
    this._suspend = document.querySelector("#suspend-btn")
    this._cover = document.querySelector("#cover")
    this._covermsg = document.querySelector("#cover > #message")
    this._init()
  }

  _show_message(text) {
    this._covermsg.innerHTML = text
    this._cover.classList.remove("hide")
  }

  _do_shutdown() {
    this._show_message("Shutting down")
    lightdm.shutdown()
  }
  _do_restart() {
    this._show_message("Restarting")
    lightdm.restart()
  }
  _do_hibernate() {
    this._show_message("Hibernating")
    lightdm.hibernate()
  }
  _do_suspend() {
    this._show_message("Suspending")
    lightdm.suspend()
  }

  _setShutdown() {
    if (!lightdm.can_shutdown) return
    this._shutdown.addEventListener("click", () => {
      this._do_shutdown()
    })
    this._shutdown.classList.remove("hide")
  }
  _setRestart() {
    if (!lightdm.can_restart) return
    this._restart.addEventListener("click", () => {
      this._do_restart()
    })
    this._restart.classList.remove("hide")
  }
  _setHibernate() {
    if (!lightdm.can_hibernate) return
    this._hibernate.addEventListener("click", () => {
      this._do_hibernate()
    })
    this._hibernate.classList.remove("hide")
  }
  _setSuspend() {
    if (!lightdm.can_suspend) return
    this._suspend.addEventListener("click", () => {
      this._do_suspend()
    })
    this._suspend.classList.remove("hide")
  }
  _setCover() {
    this._cover.addEventListener("click", () => {
      this._cover.classList.add("hide")
    })
  }

  _setButtons() {
    this._setShutdown()
    this._setRestart()
    this._setHibernate()
    this._setSuspend()
    this._setCover()
  }

  _init() {
    this._setButtons()
  }
}
