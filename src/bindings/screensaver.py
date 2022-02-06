import ctypes
import os
from typing import Union
from logger import logger


class ScreenSaverData(ctypes.Structure):
    """Screensaver data"""
    _fields_ = [
        ("timeout", ctypes.c_int),
        ("interval", ctypes.c_int),
        ("prefer_blank", ctypes.c_int),
        ("allow_exp", ctypes.c_int),
    ]

    def __str__(self):
        timeout = getattr(self, "timeout")
        interval = getattr(self, "interval")
        prefer_blank = getattr(self, "prefer_blank")
        allow_exp = getattr(self, "allow_exp")
        return f"{timeout} {interval} {prefer_blank} {allow_exp}"

ScreenSaverDataPointer = ctypes.POINTER(ScreenSaverData)

class ScreenSaver:
    """Screensaver wrapper"""

    saved_data: Union[ScreenSaverData, None]
    saved: bool = False

    def __init__(self):
        dir = os.path.dirname(os.path.realpath(__file__))
        libname = os.path.join(dir, "_screensaver.so")
        self.clib = ctypes.CDLL(libname)
        self.clib.get_screensaver.restype = ScreenSaverDataPointer

    def get_screensaver(self):
        """Gets screensaver data"""
        data: ScreenSaverDataPointer = self.clib.get_screensaver()
        if data is None:
            return
        contents: ScreenSaverData = data.contents
        return contents

    def set_screensaver(self, timeout = -1, interval = -1, prefer_blank = -1, allow_exp = -1):
        """Sets screensaver properties"""
        if self.saved:
            return
        self.saved_data = self.get_screensaver()
        self.saved = True
        self.clib.set_screensaver(
            ctypes.c_int(timeout),
            ctypes.c_int(interval),
            ctypes.c_int(prefer_blank),
            ctypes.c_int(allow_exp)
        )
        logger.debug("Screensaver timeout set")

    def reset_screensaver(self):
        """Reset screensaver"""
        if not self.saved or not self.saved_data:
            return
        self.clib.set_screensaver(
            ctypes.c_int(getattr(self.saved_data, "timeout")),
            ctypes.c_int(getattr(self.saved_data, "interval")),
            ctypes.c_int(getattr(self.saved_data, "prefer_blank")),
            ctypes.c_int(getattr(self.saved_data, "allow_exp"))
        )
        self.saved = False
        logger.debug("Screensaver reset")

    def force_screensaver(self, value: bool):
        """Force screensaver"""
        self.clib.force_screensaver(ctypes.c_bool(value))

screensaver = ScreenSaver()
