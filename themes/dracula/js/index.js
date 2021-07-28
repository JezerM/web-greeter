
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

  sidebar = new Sidebar()

  time_date = new TimeDate()

  backgrounds = new Backgrounds()
  await backgrounds._init()

  power = new Power()

  //battery = new Battery()

  //brightness = new Brightness()

}

if (window._ready_event === undefined) {
  _ready_event = new Event("GreeterReady")
  window.dispatchEvent(_ready_event)
}

window.addEventListener("GreeterReady", initGreeter)
