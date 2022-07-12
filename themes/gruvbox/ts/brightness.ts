export class Brightness {
  private _brightnessLabel: HTMLDivElement | null;
  private _level: number;

  public constructor() {
    this._brightnessLabel = document.querySelector("#brightness-label");
    this._level = 0;
    this.init();
  }

  public updateData(): void {
    if (!this._brightnessLabel) return;
    this._level = window.lightdm?.brightness ?? 0;
    if (this._level >= 0) {
      this._brightnessLabel.style.display = "";
      const icon = this._level > 50 ? 7 : this._level > 10 ? 6 : 5;
      this._brightnessLabel.innerHTML = `<span class="mdi mdi-brightness-${icon}"></span> ${this._level}%`;
    } else {
      this._brightnessLabel.innerHTML = "";
      this._brightnessLabel.style.display = "none";
    }
  }

  public setCallback(): void {
    if (!window.lightdm?.can_access_brightness) {
      if (!this._brightnessLabel) return;
      this._brightnessLabel.innerHTML = "";
      this._brightnessLabel.style.display = "none";
      return;
    }
    this.updateData();
    window.lightdm?.brightness_update.connect(() => {
      this.updateData();
    });
  }

  public init(): void {
    this.setCallback();
  }
}
