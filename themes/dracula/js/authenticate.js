class Authenticate {
	constructor() {
		this._form = document.querySelector("#login-form")
		this._username = ""
		this._password = ""
		this._init()
	}

	_setForm() {
		this._form.addEventListener("submit", (ev) => {
			ev.preventDefault()
			var inputs = this._form.querySelectorAll("input")
			var data = getArrayForm(inputs)
			if (!data) return false
			this._username = data.username
			this._password = data.password
			this._respond()
		})
	}

	async _respond() {
		let inputUser = document.querySelector("#input-username")
		let inputPass = document.querySelector("#input-password")
		inputUser.blur(); inputUser.disabled = true;
		inputPass.blur(); inputPass.disabled = true;

		lightdm.cancel_authentication()
		lightdm.authenticate(String(this._username))
		await wait(1000)
		lightdm.respond(this._password)
	}

	_showMessage(msg) {
		let message = document.querySelector("#auth-message")
		message.innerText = msg
		message.classList.remove("hide")
	}

	_hideMessage() {
		let message = document.querySelector("#auth-message")
		message.classList.add("hide")
	}

	async _authentication_done() {
		let body = document.querySelector("body")
		body.classList.add("success")

		this._showMessage("Welcome!")

		let form = document.querySelector("#pass-form")
		let topbar = document.querySelector("#top-bar")
		let bottombar = document.querySelector("#bottom-bar")
		form.style.transition = "0ms"
		form.classList.add("hide")
		topbar.classList.add("hide")
		bottombar.classList.add("hide")

		await wait(1000)
		let defSession = String(sessions.getDefaultSession())
		document.querySelector("body").style.opacity = 0

		await wait(1000)
		console.log("Session started with", defSession)
		lightdm.start_session(defSession)
	}

	async _authentication_failed() {
		lightdm.cancel_authentication()
		let body = document.querySelector("body")
		body.classList.add("failed")

		this._showMessage("Try again")

		let form = document.querySelector("#pass-form")
		let topbar = document.querySelector("#top-bar")
		let bottombar = document.querySelector("#bottom-bar")
		form.style.transition = "0ms"
		form.classList.add("hide")
		topbar.classList.add("hide")
		bottombar.classList.add("hide")

		await wait(1500)

		this._hideMessage()
		form.style.transition = ""
		form.classList.remove("hide")
		topbar.classList.remove("hide")
		bottombar.classList.remove("hide")

		let inputUser = document.querySelector("#input-username")
		let inputPass = document.querySelector("#input-password")
		inputUser.blur(); inputUser.disabled = false;
		inputPass.blur(); inputPass.disabled = false;
		inputPass.value = ""

		body.classList.remove("failed")
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

	_init() {
		this._setForm()
		this._setAuthentication_done()
	}
}
