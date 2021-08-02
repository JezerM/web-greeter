
form = document.querySelector("#form > form")

function getArrayForm(inputs) {
	if (!inputs) return false
	var data = {}
	inputs.forEach((x) => {
		data[x.name] = x.value
	})
	return data
}

async function wait(ms) {
  return new Promise( resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function initGreeter() {

  if (greeter_config.greeter.debug_mode) {
    debug = new Debug()
  }

  lightdm.authentication_complete?.connect(() => authentication_done())

  lightdm.brightness_update?.connect(() => brightness._updateData())

  lightdm.battery_update?.connect(() => battery._updateData())

  accounts = new Accounts()

  sessions = new Sessions()

  authenticate = new Authenticate()

  time_date = new TimeDate()

  power = new Power()

  battery = new Battery()
  
  brightness = new Brightness()

  var lock = lightdm.lock_hint
  if (lock) {
    document.querySelector("#lock-label").classList.remove("hide")
  }
}

const notGreeter = false

if (window._ready_event === undefined) {
  _ready_event = new Event("GreeterReady")
  window.dispatchEvent(_ready_event)
}

window.addEventListener("GreeterReady", initGreeter)
