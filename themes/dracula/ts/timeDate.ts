export class TimeDate {
  private _timeDateButton: HTMLButtonElement | null;
  private _timeLabel: HTMLHeadingElement | null;
  private _dateLabel: HTMLHeadingElement | null;
  private _passFormWrapper: HTMLDivElement | null;

  public constructor() {
    this._timeDateButton = document.querySelector("#time-date");
    this._timeLabel = document.querySelector("#time-date #time-label");
    this._dateLabel = document.querySelector("#time-date #date-label");
    this._passFormWrapper = document.querySelector("#pass-form");
    this.init();
  }

  public _updateTimeDate(): void {
    if (!window.theme_utils || !this._dateLabel || !this._timeLabel) return;
    const date = window.theme_utils.get_current_localized_date();
    const time = window.theme_utils.get_current_localized_time();

    this._dateLabel.innerText = date;
    this._timeLabel.innerText = time;
  }

  public setTimer(): void {
    this._updateTimeDate();
    setInterval(() => {
      this._updateTimeDate();
    }, 1000);
  }

  public setButtons(): void {
    this._timeDateButton?.addEventListener("click", () => {
      this.toggleTimeDate();
    });
    this._passFormWrapper?.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        this.toggleTimeDate();
      }
    });
  }

  public async toggleTimeDate(): Promise<void> {
    this._timeDateButton?.blur();
    this._passFormWrapper?.blur();

    if (this._timeDateButton?.classList.contains("hide")) {
      this._passFormWrapper?.classList.add("hide");
      await window.wait(300);
      this._timeDateButton.classList.remove("hide");
      await window.wait(100);
      this._timeDateButton.focus();
    } else {
      this._timeDateButton?.classList.add("hide");
      await window.wait(300);
      this._passFormWrapper?.classList.remove("hide");
    }
  }

  public init(): void {
    this.setTimer();
    this.setButtons();
  }
}
