from Xlib.display import Display
from Xlib.error import DisplayError
from logger import logger

class Screensaver:
    """Screensaver class"""

    display: Display
    available: bool = False
    saved_data: dict[str, int]
    saved: bool = False

    def __init__(self):
        self.init_display()

    def init_display(self):
        """Init display"""
        try:
            self.display = Display()
            self.available = True
        except DisplayError as err:
            logger.error("Xlib error: %s", err)

    def set_screensaver(self, timeout: int):
        """Set screensaver timeout"""
        if self.saved or not self.available:
            return
        self.display.sync()
        self.display.sync()
        # pylint: disable-next=protected-access
        data: dict[str, int] = self.display.get_screen_saver()._data or {}
        self.saved_data = data
        self.saved = True

        self.display.set_screen_saver(timeout,
                                 data["interval"],
                                 data["prefer_blanking"],
                                 data["allow_exposures"])
        self.display.flush()
        logger.debug("Screensaver timeout set")

    def reset_screensaver(self):
        """Reset screensaver"""
        if not self.saved or not self.available:
            return
        self.display.sync()
        self.display.set_screen_saver(self.saved_data["timeout"],
                                 self.saved_data["interval"],
                                 self.saved_data["prefer_blanking"],
                                 self.saved_data["allow_exposures"])
        self.display.flush()
        self.saved = False
        logger.debug("Screensaver reset")

screensaver = Screensaver()
