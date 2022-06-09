import { Backgrounds } from "./backgrounds.js";

declare global {
  interface Window {
    backgrounds: Backgrounds;
  }
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function _authentication_done(): Promise<void> {
  await wait(1000);
  const body = document.querySelector("body");
  if (body) body.style.opacity = "0";
}

function authentication_done(): void {
  if (window.lightdm?.is_authenticated) _authentication_done();
}

function initGreeter(): void {
  window.lightdm?.authentication_complete?.connect(() => authentication_done());

  window.backgrounds = new Backgrounds();
  window.backgrounds.init();
}

if (window._ready_event === undefined) {
  window._ready_event = new Event("GreeterReady");
  window.dispatchEvent(window._ready_event);
}

window.addEventListener("GreeterReady", initGreeter);
