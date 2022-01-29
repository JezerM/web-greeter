
import subprocess
from threading import Thread
from typing import List, Callable, Any
from shutil import which
from logger import logger

Callback = Callable[[str], Any]

class ACPIController:
    """ACPI controller"""

    tries = 0
    callbacks: List[Callback] = []

    def __init__(self):
        if self.check_acpi():
            self.listen()
        else:
            logger.error("ACPI: acpi_listen does not exists")

    @staticmethod
    def check_acpi() -> bool:
        """Checks if acpi_listen does exists"""
        if which("acpi_listen"):
            return True
        return False

    def connect(self, callback: Callback):
        """Connect callback to ACPI controller"""
        self.callbacks.append(callback)

    def disconnect(self, callback: Callback):
        """Disconnect callback from ACPI controller"""
        self.callbacks.remove(callback)

    def _listen(self):
        try:
            with subprocess.Popen("acpi_listen",
                                  stdout = subprocess.PIPE,
                                  text = True) as process:
                if not process.stdout:
                    raise IOError("No stdout")
                while True:
                    line = process.stdout.readline().strip()
                    if not line:
                        continue
                    for _, callback in enumerate(self.callbacks):
                        callback(line)
        except IOError as err:
            logger.error("ACPI: %s", err)
            if self.tries < 5:
                self.tries += 1
                logger.debug("Restarting acpi_listen")
                self._listen()

    def listen(self):
        """Listens to acpi_listen"""
        self.thread = Thread(target = self._listen)
        self.thread.daemon = True
        self.thread.start()

ACPI = ACPIController()
