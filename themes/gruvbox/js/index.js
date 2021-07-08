
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

  accounts = new Accounts()

  sessions = new Sessions()

  authenticate = new Authenticate()

  power = new Power()

  battery = new Battery()
  
  brightness = new Brightness()

}

const notGreeter = false

if (notGreeter) {
  debug = new Debug()
  initGreeter()
} else {
  window.addEventListener("GreeterReady", initGreeter)
}
