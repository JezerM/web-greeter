const defaultBackgrounds = [
  "assets/bubbles.svg",
  "assets/topography.svg",
  "assets/death star.svg",
];

interface BackgroundData {
  type: string;
  path: string;
}

export class Backgrounds {
  private _backgroundSelector: HTMLDivElement | null;
  private _backgroundSelectorBackButton: HTMLButtonElement | null;
  private _backgroundSelectorEnterButton: HTMLButtonElement | null;
  private _screenDiv: HTMLDivElement | null;

  private _backgroundSelectorList: HTMLDivElement | null;
  private _backgroundSelectorCurrent: HTMLDivElement | null;
  private _backgroundSelectorCurrentLabel: HTMLHeadingElement | null;
  private _backgroundElement: HTMLDivElement | null;

  private _backgroundBlurInput: HTMLInputElement | null;
  private _backgroundBlur = 0;

  private _backgroundImages: string[];
  private _backgroundImagesDir: string;
  private _backgroundPath: string;

  public constructor() {
    this._backgroundSelectorList = document.querySelector(
      "#background-selector-list"
    );
    this._backgroundSelectorCurrent = document.querySelector(
      "#current-background"
    );
    this._backgroundSelectorCurrentLabel = document.querySelector(
      "#current-background-label"
    );
    this._backgroundElement = document.querySelector("#background");

    this._backgroundSelector = document.querySelector("#background-selector");
    this._backgroundSelectorBackButton = document.querySelector(
      "#background-selector-back"
    );
    this._backgroundSelectorEnterButton = document.querySelector(
      "#background-selector-enter"
    );
    this._screenDiv = document.querySelector("#screen");

    this._backgroundBlurInput = document.querySelector(
      "#background-blur > input"
    );

    this._backgroundImages = [];
    this._backgroundImagesDir = "";
    this._backgroundPath = "";

    /**
     * Background change requests are handled via broadcast events so that all
     * windows correctly update.
     */
    window.addEventListener("GreeterBroadcastEvent", (ev) => {
      const data: BackgroundData = ev.data as BackgroundData;
      if (data.type == "change-background") {
        this._backgroundPath = data.path;
        this.updateBackgroundImages();
      }
    });
  }

  public createImageElement(path: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add("image");
    if (path == "userBackground") {
      button.innerText = "User Background";
    } else {
      button.style.backgroundImage = `url("${path}")`;
    }

    return button;
  }

  public async createBackgroundArray(): Promise<void> {
    const images = await this.findImages(this._backgroundImages);
    const userBackground = ["userBackground"];
    this._backgroundImages = userBackground
      .concat(defaultBackgrounds)
      .concat(images);
    this.setBackgroundImages();
    return new Promise((resolve) => resolve());
  }

  public updateOnStartup(): void {
    this._backgroundPath =
      window.localStorage.getItem("defaultBackgroundImage") ||
      defaultBackgrounds[0];
    this.updateBackground(this._backgroundPath);

    this._backgroundBlur =
      Number(window.localStorage.getItem("backgroundBlur")) || 0;
    this.setBackgroundBlur();
  }

  public updateBackgroundImages(): void {
    if (!this._backgroundElement) return;

    let imagePath = this._backgroundPath;
    const imageName = imagePath.replace(/^.*[\\/]/, "");

    if (imagePath == "userBackground") {
      const user = window.lightdm?.users.find(
        (v) => v.username == window.lightdm?.authentication_user
      );
      imagePath =
        user?.background && user?.background.trim().length != 0
          ? user?.background
          : defaultBackgrounds[0];
    }

    if (this._backgroundSelectorCurrent) {
      this._backgroundSelectorCurrent.style.backgroundImage = `url("${imagePath}")`;
      if (defaultBackgrounds.includes(imagePath)) {
        this._backgroundSelectorCurrent.style.backgroundSize = "auto";
      } else {
        this._backgroundSelectorCurrent.style.backgroundSize = "";
      }
    }
    if (this._backgroundSelectorCurrentLabel) {
      this._backgroundSelectorCurrentLabel.innerText = imageName;
    }

    this._backgroundElement.style.backgroundImage = `url("${imagePath}")`;
    if (defaultBackgrounds.includes(imagePath)) {
      this._backgroundElement.style.backgroundSize = "";
    } else {
      this._backgroundElement.style.backgroundSize = "cover";
    }
    window.localStorage.setItem("defaultBackgroundImage", this._backgroundPath);
  }

  public updateBackground(path: string): void {
    if (window.greeter_comm) {
      window.greeter_comm.broadcast({
        type: "change-background",
        path,
      });
    } else {
      this._backgroundPath = path;
      this.updateBackgroundImages();
    }
  }

  public setBackgroundImages(): void {
    if (!this._backgroundSelectorList) return;
    this._backgroundSelectorList.innerHTML = "";

    for (const path of this._backgroundImages) {
      const button = this.createImageElement(path);
      button.addEventListener("click", () => {
        this.updateBackground(path);
      });
      this._backgroundSelectorList.appendChild(button);
    }
  }

  // Taken from @manilarome/lightdm-webkit2-theme-glorious
  public async findImages(dirlist: string[]): Promise<string[]> {
    const images: string[] = [];
    const subdirs: string[] = [];
    let recursion = 0;

    // Check image files/dir, and push it to its respective array
    for (const file of dirlist) {
      if (file.match(/.+\.(jpe?g|png|gif|bmp|webp|svg)/)) {
        images.push(file);
      } else if (!file.match(/\w+\.\w+/)) {
        subdirs.push(file);
      }
    }
    // Search recursively
    if (subdirs.length && recursion < 3) {
      recursion++;
      for (const dir of subdirs) {
        const list = await this.getBackgroundImages(dir);

        if (list && list.length) {
          const toadd = await this.findImages(list);
          images.push(...toadd);
        }
      }
    }

    return images;
  }

  public getBackgroundImages(path?: string): Promise<string[]> {
    if (!window.greeter_config || !window.theme_utils)
      return new Promise((resolve) => resolve([]));

    this._backgroundImagesDir =
      window.greeter_config.branding.background_images_dir ||
      "/usr/share/backgrounds";

    return new Promise((resolve) => {
      window.theme_utils?.dirlist(
        path ? path : this._backgroundImagesDir,
        false,
        (result) => {
          resolve(result);
        }
      );
    });
  }

  public showBackgroundSelector(): void {
    if (!this._backgroundSelector || !this._screenDiv) return;
    this._backgroundSelector.classList.remove("hide");
    this._screenDiv.classList.add("hide");

    this.setBackgroundSelectorKeydown();
  }
  public hideBackgroundSelector(): void {
    if (!this._backgroundSelector || !this._screenDiv) return;
    this._backgroundSelector.classList.add("hide");
    this._screenDiv.classList.remove("hide");
  }

  public setBackgroundSelectorBackButton(): void {
    if (!this._backgroundSelectorBackButton) return;

    this._backgroundSelectorBackButton.addEventListener("click", () => {
      this.hideBackgroundSelector();
    });
  }
  public setBackgroundSelectorEnterButton(): void {
    if (!this._backgroundSelectorEnterButton) return;

    this._backgroundSelectorEnterButton.addEventListener("click", () => {
      this.showBackgroundSelector();
    });
  }
  public setBackgroundSelectorKeydown(): void {
    const callback = (ev: KeyboardEvent): void => {
      if (ev.key == "Escape") {
        this.hideBackgroundSelector();
        document
          .querySelector("body")
          ?.removeEventListener("keydown", callback);
      }
    };
    document.querySelector("body")?.addEventListener("keydown", callback);
  }

  public setBackgroundBlur(): void {
    if (!this._backgroundBlurInput || !this._backgroundElement) return;
    this._backgroundElement.style.filter = `blur(${this._backgroundBlur}px)`;
    this._backgroundBlurInput.valueAsNumber = this._backgroundBlur;
  }

  public setBackgroundBlurInputEvent(): void {
    if (!this._backgroundBlurInput) return;

    this._backgroundBlurInput.addEventListener("input", () => {
      this._backgroundBlur = this._backgroundBlurInput?.valueAsNumber ?? 0;
      window.localStorage.setItem(
        "backgroundBlur",
        this._backgroundBlur.toString()
      );
      this.setBackgroundBlur();
    });
  }

  public async init(): Promise<void> {
    this.setBackgroundSelectorBackButton();
    this.setBackgroundSelectorEnterButton();
    this.setBackgroundBlurInputEvent();
    this._backgroundImages = await this.getBackgroundImages();
    await this.createBackgroundArray();
    this.updateOnStartup();

    return new Promise((resolve) => resolve());
  }
}
