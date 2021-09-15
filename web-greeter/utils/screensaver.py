from logger import logger
from Xlib.display import Display

saved_data: dict[str, int]
saved = False
available = False

display = None

def init_display():
    global display, available
    try:
        display = Display()
        available = True
    except Exception as err:
        logger.error(f"Xlib error: {err}")

def set_screensaver(timeout: int):
    global saved_data, saved, available, display
    if saved or not available:
        return
    display.sync()
    data: dict[str, int] = display.get_screen_saver()._data or {}
    saved_data = data
    saved = True

    display.set_screen_saver(timeout, data["interval"], data["prefer_blanking"], data["allow_exposures"])
    display.flush()
    logger.debug("Screensaver timeout set")

def reset_screensaver():
    global saved_data, saved, available, display
    if not saved or not available:
        return
    display.sync()
    display.set_screen_saver(saved_data["timeout"], saved_data["interval"], saved_data["prefer_blanking"], saved_data["allow_exposures"])
    display.flush()
    saved = False
    logger.debug("Screensaver reset")
