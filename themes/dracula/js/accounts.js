class Accounts {
	constructor() {
		this._localStorage = window.localStorage
		this._userWrapper = document.querySelector("#user-wrapper")
		this._accountsList = document.querySelector("#users-dropdown")
		this._accountsButton = document.querySelector("#users-button")
		this._defaultUser = null
		this._usersObject = null
		this._init()
	}

	getDefaultUserName() {
		return this._defaultUser.username
	}

	_setAccountDefault() {
		let input = this._userWrapper.querySelector("input")
		if (this._defaultUser.username != "") {
			//input.classList.add("hide")
			input.value = this._defaultUser.username
		} else {
			input.value = ""
		}
		if (this._usersObject.length > 0) {
			this._accountsButton.classList.remove("hide")
		}
	}

	_updateOnStartup() {
		var username = ""
		if (this._usersObject.length > 0) {
			username = this._localStorage.getItem("defaultUser") || this._usersObject[0].username
		}
		var user = this._usersObject.find((val) => {return val.username === username})
		if (user === undefined) {
			this._defaultUser = {username: "", display_name: ""}
		} else {
			this._defaultUser = user
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
			button.type = "button"
			button.innerText = name
			button.addEventListener("click", () => {
				this._updateDefaults(this._usersObject[i])
				this._setAccountDefault()
				//authenticate.startAuthentication()
			})

			li.appendChild(button)
			dropdown.appendChild(li)
		}
	}

	_setButton() {
		var dropdown = this._accountsList.querySelector(".dropdown")
		document.querySelector("#screen").addEventListener("click", (ev) => {
			if (ev.target == this._accountsButton || ev.target.parentElement == this._accountsButton) {
				dropdown.classList.toggle("hide")
			} else
			if (ev.target != this._accountsList && ev.target.closest(".dropdown") == null) {
				dropdown.classList.add("hide")
			}
		})
	}

	_updateDefaults(userObject) {
		if (!userObject) return
		this._defaultUser = userObject

		this._localStorage.setItem("defaultUser", this._defaultUser.username)
	}

	_init() {
		this._usersObject = lightdm.users
		this._updateOnStartup()
		this._setAccountList()
		this._setButton()
	}
}
