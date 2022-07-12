export class Sidebar {
  private _sidebar: HTMLDivElement | null;
  private _sidebarButton: HTMLButtonElement | null;
  private _closeButton: HTMLButtonElement | null;
  private _visible: boolean;

  public constructor() {
    this._sidebar = document.querySelector("#sidebar");
    this._sidebarButton = document.querySelector("#panel-button");
    this._closeButton = document.querySelector("#close-panel-button");
    this._visible = false;
    this.init();
  }

  public showSidebar(): void {
    this._sidebar?.classList.remove("hide");
    window.wait(100).then(() => {
      this._closeButton?.focus();
    });
    this._visible = true;
  }

  public hideSidebar(): void {
    this._sidebar?.classList.add("hide");
    this._sidebarButton?.focus();
    this._visible = false;
  }

  public toggleSidebar(): void {
    if (this._visible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  public setKeydown(): void {
    this._sidebar?.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        this.hideSidebar();
      }
    });
  }

  public setSidebar(): void {
    document.querySelector("#screen")?.addEventListener("click", (ev) => {
      if (
        ev.target == this._sidebarButton ||
        (ev.target as Element).parentElement == this._sidebarButton
      ) {
        this.toggleSidebar();
      } else if (
        ev.target != this._sidebar &&
        (ev.target as Element).closest(".panel") == null
      ) {
        this._sidebar?.classList.add("hide");
        this._visible = false;
      }

      if (
        ev.target == this._closeButton ||
        (ev.target as Element).parentElement == this._closeButton
      ) {
        this.hideSidebar();
      }
    });

    document.querySelector("#screen")?.addEventListener("focusin", () => {
      if (!this._sidebar?.contains(document.activeElement)) {
        this._sidebar?.classList.add("hide");
        this._visible = false;
      }
    });
  }

  public init(): void {
    this.setSidebar();
    this.setKeydown();
  }
}
