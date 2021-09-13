class Sessions {
  constructor() {
    this._localStorage = window.localStorage;
    this._sessionsButton = document.querySelector("#sessions-button");
    this._sessionList = document.querySelector("#sessions-dropdown");
    this._sessionLabel = document.querySelector("#sessions-button > .text");
    this._defaultSession = null;
    this._sessionsObject = null;
    this._init();
  }

  getDefaultSession() {
    return this._defaultSession.key;
  }

  _setSessionDefault() {
    this._sessionLabel.innerText = this._defaultSession.name;
  }

  _updateOnStartup() {
    var key =
      this._localStorage.getItem("defaultSession") ||
      this._sessionsObject[0].key ||
      lightdm.default_session;

    var session = this._sessionsObject.find((val) => {
      return val.key === key;
    });
    if (session === undefined) {
      // This should never happen
      this._defaultSession = { key: "awesome", name: "Awesome WM" };
    } else {
      this._defaultSession = session;
    }
    this._setSessionDefault();
  }

  _updateDefaults(sessionObj) {
    if (!sessionObj) return;
    this._defaultSession = sessionObj;
    this._localStorage.setItem("defaultSession", this._defaultSession.key);
  }

  _setSessionList() {
    var dropdown = this._sessionList;
    dropdown.innerHTML = "";
    for (let i = 0; i < this._sessionsObject.length; i++) {
      var name = this._sessionsObject[i].name;
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.innerText = name;
      button.addEventListener("click", () => {
        this._updateDefaults(this._sessionsObject[i]);
        this._setSessionDefault();
      });

      li.appendChild(button);
      dropdown.appendChild(li);
    }
  }

  _setKeydown() {
    var dropdown = this._sessionList;
    dropdown.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        sessions_dropdown.classList.add("hide");
        this._sessionsButton.focus();
      }
    });
  }

  _setButton() {
    var dropdown = this._sessionList;
    document.querySelector("#screen").addEventListener("click", (ev) => {
      if (
        ev.target == this._sessionsButton ||
        ev.target.parentElement == this._sessionsButton
      ) {
        dropdown.classList.toggle("hide");
      } else if (
        ev.target != this._sessionList &&
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

  _init() {
    this._sessionsObject = lightdm.sessions;
    this._updateOnStartup();
    this._setSessionList();
    this._setButton();
    this._setKeydown();
  }
}
