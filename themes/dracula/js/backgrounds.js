class Backgrounds {
	constructor() {
		this._localStorage = window.localStorage
		this._defaultBackgroundArr = ["assets/dracula.png", "assets/window-blurred.png"]
		this._sidebar = document.querySelector("#sidebar")
		this._backgroundsList = document.querySelector("#background-selector")
		this._background = document.querySelector("#background")
		this._backgroundImages = null
		this._backgroundImagesDir = null
		this._backgroundPath = ""
	}

	_createImage(path) {
		let image = document.createElement("img")
		let button = document.createElement("button")
		let imageName = path.replace(/^.*[\\\/]/, '')
		button.classList.add("image")
		image.src = path
		image.alt = imageName
		button.appendChild(image)
		return button
	}

	async _createBackgroundArray() {
		let images = await this._getImages()
		this._backgroundImages = this._defaultBackgroundArr.concat(images)
		this._setBackgroundImages()
		return new Promise((resolve) => resolve())
	}

	_updateOnStartup() {
		this._backgroundPath = this._localStorage.getItem("defaultBackgroundImage") || this._backgroundImages[0]
		this._updateBackgroundImages()
	}

	_updateBackgroundImages() {
		let img = this._background.querySelector("img")
		img.src = this._backgroundPath
		this._localStorage.setItem("defaultBackgroundImage", String(this._backgroundPath))
	}

	_setBackgroundImages() {
		this._backgroundsList.innerHTML = ""
		for (let i = 0; i < this._backgroundImages.length; i++) {
			const path = this._backgroundImages[i]
			let button = this._createImage(path)
			button.addEventListener("click", () => {
				this._backgroundPath = path
				this._updateBackgroundImages()
			})
			this._backgroundsList.appendChild(button)
		}
	}

	_getImages(path) {
		this._backgroundImagesDir = greeter_config.branding.background_images_dir || '/usr/share/backgrounds'
		return new Promise( (resolve) => {
			theme_utils.dirlist(path ? path : this._backgroundImagesDir, true, result => {
				resolve(result)
			})
		})
	}

	async _init() {	
		await this._createBackgroundArray()
		this._updateOnStartup()

		return new Promise( resolve => resolve() )
	}
}
