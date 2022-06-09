import { LightDMBattery } from "../../../ts-types/ldm_interfaces";

export class Battery {
  private _batteryLabel: HTMLDivElement | null;
  private _batteryInfo: LightDMBattery | null;

  public constructor() {
    this._batteryLabel = document.querySelector("#battery-label");
    this._batteryInfo = null;
    this.init();
  }

  public updateData(): void {
    if (!window.lightdm || !this._batteryLabel) return;
    this._batteryInfo = window.lightdm.batteryData;
    const level = this._batteryInfo.level;
    //const state = this._info.state;
    const ac_status = this._batteryInfo.ac_status;
    let icon = "0";
    let charging = "";
    const blevel = Math.floor(level / 10) * 10;
    icon = `-${blevel}`;
    charging = ac_status ? "-charging" : "";

    if (blevel < 10) icon = "-outline";
    if (level == 100 && !ac_status) {
      icon = "";
    }
    if (level >= 0) {
      this._batteryLabel.style.visibility = "visible";
      this._batteryLabel.innerHTML = `<span class="mdi mdi-battery${charging}${icon}"></span> ${level}%`;
    } else {
      this._batteryLabel.innerHTML = "";
      this._batteryLabel.style.visibility = "hidden";
    }
  }

  public setCallback(): void {
    if (!window.lightdm?.can_access_battery) return;
    this.updateData();
    window.lightdm.battery_update.connect(() => {
      this.updateData();
    });
  }

  public init(): void {
    this.setCallback();
  }
}
