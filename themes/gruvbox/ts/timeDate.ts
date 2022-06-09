export class TimeDate {
  private _timeLabel: HTMLSpanElement | null;
  private _dateLabel: HTMLSpanElement | null;

  public constructor() {
    this._timeLabel = document.querySelector("#time-date #time-label");
    this._dateLabel = document.querySelector("#time-date #date-label");
    this.init();
  }

  public updateTimeDate(): void {
    if (!this._dateLabel || !this._timeLabel) return;
    const date = window.theme_utils?.get_current_localized_date() ?? "";
    const time = window.theme_utils?.get_current_localized_time() ?? "";

    this._dateLabel.innerText = date;
    this._timeLabel.innerText = time;
  }

  public setTimer(): void {
    this.updateTimeDate();
    setInterval(() => {
      this.updateTimeDate();
    }, 1000);
  }

  public init(): void {
    this.setTimer();
  }
}
