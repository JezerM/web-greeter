class TimeDate {
	constructor() {
		this._timeDateButton = document.querySelector("#time-date")
		this._timeLabel = document.querySelector("#time-date #time-label")
		this._dateLabel = document.querySelector("#time-date #date-label")
		this._passForm = document.querySelector("#pass-form")
		this._init()
	}

	_updateTimeDate() {
		let date = theme_utils.get_current_localized_date()
		let time = theme_utils.get_current_localized_time()

		this._dateLabel.innerText = date
		this._timeLabel.innerText = time
	}

	_setTimer() {
		this._updateTimeDate()
		setInterval(() => {
			this._updateTimeDate()
		}, 1000)
	}

	_setButtons() {
		this._timeDateButton.addEventListener("click", (ev) => {
			this.toggleTimeDate()
		})
		this._passForm.addEventListener("keydown", (ev) => {
			if (ev.keyCode == 27) {
				this.toggleTimeDate()
			}
		})
	}

	async toggleTimeDate() {
		this._timeDateButton.blur()
		this._passForm.blur()
		if (this._timeDateButton.classList.contains("hide")) {
			this._passForm.classList.add("hide")
			await wait(300)
			this._timeDateButton.classList.remove("hide")
			await wait(100)
			this._timeDateButton.focus()
		} else {
			this._timeDateButton.classList.add("hide")
			await wait(300)
			this._passForm.classList.remove("hide")
		}
	}
	
	_init() {
		this._setTimer()
		this._setButtons()
	}
}
