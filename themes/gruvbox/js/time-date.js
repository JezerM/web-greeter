class TimeDate {
	constructor() {
		this._timeLabel = document.querySelector("#time-date #time-label")
		this._dateLabel = document.querySelector("#time-date #date-label")
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
	
	_init() {
		this._setTimer()
	}
}
