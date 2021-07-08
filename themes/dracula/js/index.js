
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

  //power = new Power()

  //battery = new Battery()

  //brightness = new Brightness()

}

window.addEventListener("GreeterReady", initGreeter)

//const panel_button = document.querySelector("#panel-button")
//const close_panel_button = document.querySelector("#close-panel-button")
const panel = document.querySelector(".panel")
const screen = document.querySelector("#screen")

const sessions_button = document.querySelector("#sessions-button")
const sessions_dropdown = document.querySelector("#sessions-dropdown")

const time_date_button = document.querySelector("#time-date")
const pass_form = document.querySelector("#pass-form")

//screen.addEventListener("click", (ev) => {
  //if (ev.target == panel_button || ev.target.parentElement == panel_button) {
    //panel.classList.toggle("hide")
    //panel_button.blur()
    //wait(100).then(() => {close_panel_button.focus()})
  //} else
  //if (ev.target != panel && ev.target.closest(".panel") == null) {
    //panel.classList.add("hide")
  //}

  //if (ev.target == close_panel_button || ev.target.parentElement == close_panel_button) {
    //panel.classList.toggle("hide")
    //panel_button.focus()
  //}

  //if (ev.target == sessions_button || ev.target.parentElement == sessions_button) {
    //sessions_dropdown.classList.toggle("hide")
  //} else
  //if (ev.target != sessions_dropdown && ev.target.closest(".dropdown") == null) {
    //sessions_dropdown.classList.add("hide")
  //}
//})

async function toggleTimeDate() {
  time_date_button.blur()
  pass_form.blur()
  if (time_date_button.classList.contains("hide")) {
    pass_form.classList.add("hide")
    await wait(300)
    time_date_button.classList.remove("hide")
    await wait(100)
    time_date_button.focus()
  } else {
    time_date_button.classList.add("hide")
    await wait(300)
    pass_form.classList.remove("hide")
  }
}

time_date_button.addEventListener("click", async (ev) => {
  toggleTimeDate()
})

pass_form.addEventListener("keydown", (ev) => {
  if (ev.keyCode == 27) {
    toggleTimeDate()
  }
})

//sessions_dropdown.addEventListener("keydown", (ev) => {
  //if (ev.keyCode == 27) {
    //sessions_dropdown.classList.toggle("hide")
    //sessions_button.focus()
  //}
//})

//panel.addEventListener("keydown", (ev) => {
  //if (ev.keyCode == 27) {
    //panel.classList.toggle("hide")
    //panel_button.focus()
  //}
//})

//const time_label = document.querySelector("#time-label")
//const date_label = document.querySelector("#date-label")

//function updateTimeDate() {
  //time_label.innerText = theme_utils.get_current_localized_time()
  //date_label.innerText = theme_utils.get_current_localized_date()
//}

//setInterval(updateTimeDate, 1000)
