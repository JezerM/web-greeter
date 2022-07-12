#include <stdlib.h>
#include <stdbool.h>
#include <X11/Xos.h>
#include <X11/Xlib.h>

Display* OpenDisplay() {
  char *disp = NULL;
  Display *display = XOpenDisplay(disp);
  return display;
}

typedef struct {
  int timeout;
  int interval;
  int prefer_blank;
  int allow_exp;
} ScreenSaver;

ScreenSaver *get_screensaver() {
  int timeout, interval, prefer_blank, allow_exp;

  Display *display = OpenDisplay();
  if (display == NULL) return NULL;

  XGetScreenSaver(display, &timeout, &interval, &prefer_blank, &allow_exp);
  XCloseDisplay(display);

  ScreenSaver *data = malloc(sizeof *data);
  data->timeout = timeout;
  data->interval = interval;
  data->prefer_blank = prefer_blank;
  data->allow_exp = allow_exp;

  return data;
}

void set_screensaver(int timeout, int interval, int prefer_blank, int allow_exp) {
  int timeout_i, interval_i, prefer_blank_i, allow_exp_i;

  Display *display = OpenDisplay();
  if (display == NULL) return;
  XGetScreenSaver(display, &timeout_i, &interval_i, &prefer_blank_i, &allow_exp_i);

  if (timeout != -1) timeout_i = timeout;
  if (interval != -1) interval_i = interval;
  if (prefer_blank != -1) prefer_blank_i = prefer_blank;
  if (allow_exp != -1) allow_exp_i = allow_exp;

  XSetScreenSaver(display, timeout_i, interval_i, prefer_blank_i, allow_exp_i);

  XCloseDisplay(display);
}

void force_screensaver(bool value) {
  Display *display = OpenDisplay();
  if (display == NULL) return;

  if (value == true)
    XForceScreenSaver(display, ScreenSaverActive);
  else
    XForceScreenSaver(display, ScreenSaverReset);

  XCloseDisplay(display);
}
