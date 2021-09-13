class Sessions {
  constructor() {
    this._localStorage = window.localStorage;
    this._sessionLabel = document.querySelector("#session-label");
    this._sessionList = document.querySelector("#sessions-list");
    this._sessionsButton = document.querySelector("#sessions-button");
    this._defaultSession = null;
    this._sessionsObject = null;
    this._init();
  }

  getDefaultSession() {
    return this._defaultSession.key;
  }

  _setSessionDefault() {
    this._sessionLabel.innerHTML = `<b>${this._defaultSession.name}</b>`;
  }

  _updateOnStartup() {
    var session_key =
      this._localStorage.getItem("defaultSession") ||
      this._sessionsObject[0].key ||
      lightdm.default_session;

    var defaultSession = this._sessionsObject.find(
      (el) => el.key == session_key
    );

    var session_name = defaultSession ? defaultSession.name : "awesome wm";
    session_key = defaultSession ? defaultSession.key : "awesome";

    this._defaultSession = {
      key: session_key,
      name: session_name,
    };
    this._setSessionDefault();
  }

  _setSessionList() {
    var dropdown = this._sessionList.querySelector(".dropdown");
    dropdown.innerHTML = "";
    for (let i = 0; i < this._sessionsObject.length; i++) {
      var name = this._sessionsObject[i].name;
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.innerHTML = name;
      button.addEventListener("click", () => {
        this._updateDefaults(this._sessionsObject[i]);
        this._setSessionDefault();
      });

      li.appendChild(button);
      dropdown.appendChild(li);
    }
  }

  _setKeydown() {
    var dropdown = this._sessionList.querySelector(".dropdown");
    dropdown.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        dropdown.classList.add("hide");
        this._sessionsButton.focus();
      }
    });
  }

  _setButton() {
    var dropdown = this._sessionList.querySelector(".dropdown");
    document.querySelector("#screen").addEventListener("click", (ev) => {
      if (
        ev.target == this._sessionsButton ||
        ev.target.parentElement == this._sessionsButton
      ) {
        dropdown.classList.toggle("hide");
      } else if (
        ev.target != dropdown &&
        ev.target.closest(".dropdown") == null
      ) {
        dropdown.classList.add("hide");
      }
    });
    document.querySelector("#screen").addEventListener("focusin", (ev) => {
      if (
        !dropdown.contains(document.activeElement) &&
        document.activeElement != this._sessionsButton
      ) {
        dropdown.classList.add("hide");
      }
    });
  }

  _updateDefaults(sessionObj) {
    if (!sessionObj) return;
    this._defaultSession = sessionObj;
    this._localStorage.setItem("defaultSession", this._defaultSession.key);
  }

  _init() {
    this._sessionsObject = lightdm.sessions;
    this._updateOnStartup();
    this._setSessionList();
    this._setButton();
    this._setKeydown();
  }
}
