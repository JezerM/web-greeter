import os
import subprocess
import shlex
import re
import math
from threading import Thread
import time

from logging import (
    getLogger,
    DEBUG,
    Formatter,
    StreamHandler,
)

log_format = ''.join([
    '%(asctime)s [ %(levelname)s ] %(filename)s %(',
    'lineno)d: %(message)s'
])
formatter = Formatter(fmt=log_format, datefmt="%Y-%m-%d %H:%M:%S")
logger = getLogger("battery")
logger.propagate = False
stream_handler = StreamHandler()
stream_handler.setLevel(DEBUG)
stream_handler.setFormatter(formatter)
logger.setLevel(DEBUG)
logger.addHandler(stream_handler)

running = False

class Battery:

    _batteries = []
    ac = "AC0"
    pspath = "/sys/class/power_supply/"
    perc = -1
    status = "N/A"
    capacity = 0
    time = ""
    watt = 0

    callbacks = []

    def __init__(self):
        if self._batteries.__len__() == 0:
            scandir_line(self.pspath, self._update_batteries)
        start_timer(self.full_update, self.onerror)
        self.full_update()

    def connect(self, callback):
        self.callbacks.append(callback)

    def disconnect(self, callback):
        self.callbacks.remove(callback)

    def onerror(self):
        self._batteries = []
        for cb in self.callbacks:
            cb()

    def _update_batteries(self, line):
        bstr = re.match(r"BAT\w+", line)
        if bstr:
            self._batteries.append(dict(
                name = bstr.group(),
                status = "N/A",
                perc = 0,
                capacity = 0,
            ))
        else:
            self.ac = re.match(r"A\w+", line).group() or self.ac

    # Based on "bat" widget from "lain" awesome-wm library
	# * (c) 2013,      Luca CPZ
	# * (c) 2010-2012, Peter Hofmann
    # @see https://github.com/lcpz/lain/blob/master/widget/bat.lua
    def full_update(self):
        global running
        if running:
            return
        running = True

        sum_rate_current = 0
        sum_rate_voltage = 0
        sum_rate_power = 0
        sum_rate_energy = 0
        sum_energy_now = 0
        sum_energy_full = 0
        sum_charge_full = 0
        sum_charge_design = 0

        for i in range(len(self._batteries)):
            battery = self._batteries[i]
            bstr = self.pspath + battery["name"]
            present = read_first_line(bstr + "/present")

            if tonumber(present) == 1:
                rate_current = tonumber(read_first_line(bstr + "/current_now"))
                rate_voltage = tonumber(read_first_line(bstr + "/voltage_now"))
                rate_power = tonumber(read_first_line((bstr + "/power_now")))
                charge_full = tonumber(read_first_line(bstr + "/charge_full"))
                charge_design = tonumber(read_first_line(bstr + "/charge_full_design"))

                energy_now = tonumber(read_first_line(bstr + "/energy_now")
                                 or read_first_line(bstr + "/charge_now"))
                energy_full = tonumber(read_first_line(bstr + "/energy_full") or charge_full)
                energy_percentage = tonumber(read_first_line(bstr + "/capacity")
                                 or math.floor(energy_now / energy_full * 100))

                self._batteries[i]["status"] = read_first_line(bstr + "/status") or "N/A"
                self._batteries[i]["perc"] = energy_percentage or self._batteries[i].perc

                if not charge_design or charge_design == 0:
                    self._batteries[i]["capacity"] = 0
                else:
                    self._batteries[i]["capacity"] = math.floor(
                        charge_full / charge_design * 100)

                sum_rate_current  = sum_rate_current + (rate_current or 0)
                sum_rate_voltage  = sum_rate_voltage + (rate_voltage or 0)
                sum_rate_power    = sum_rate_power + (rate_power or 0)
                sum_rate_energy   = sum_rate_energy + (rate_power or (((rate_voltage or 0) * (rate_current or 0)) / 1e6))
                sum_energy_now    = sum_energy_now + (energy_now or 0)
                sum_energy_full   = sum_energy_full + (energy_full or 0)
                sum_charge_full   = sum_charge_full + (charge_full or 0)
                sum_charge_design = sum_charge_design + (charge_design or 0)

        self.capacity = math.floor(min(100, sum_charge_full / sum_charge_design * 100))
        self.status = len(self._batteries) > 0 and self._batteries[0]["status"] or "N/A"

        for i in range(len(self._batteries)):
            battery = self._batteries[i]
            if battery["status"] == "Discharging" or battery["status"] == "Charging":
                self.status = battery["status"]

        self.ac_status = tonumber(read_first_line(self.pspath + self.ac + "/online")) or "N/A"

        if self.status != "N/A":
            if self.status != "Full" and sum_rate_power == 0 and self.ac_status == 1:
                self.perc = math.floor(min(100,
                            sum_energy_now / sum_energy_full * 100 + 0.5))
                self.time = "00:00"
                self.watt = 0
            elif self.status != "Full":
                rate_time = 0
            if (sum_rate_power > 0 or sum_rate_current > 0):
                div = (sum_rate_power > 0 and sum_rate_power) or sum_rate_current

                if self.status == "Charging":
                    rate_time = (sum_energy_full - sum_energy_now) / div
                else:
                    rate_time = sum_energy_now / div

                if 0 < rate_time and rate_time < 0.01:
                    rate_time_magnitude = tonumber(abs(math.floor(math.log10(rate_time))))
                    rate_time = rate_time * 10 ^ (rate_time_magnitude - 2)

                hours   = math.floor(rate_time)
                minutes = math.floor((rate_time - hours) * 60)
                self.perc  = math.floor(min(100, (sum_energy_now / sum_energy_full) * 100) + 0.5)
                self.time = "{:02d}:{:02d}".format(hours, minutes)
                self.watt = "{:.2f}".format(sum_rate_energy / 1e6)

        self.perc = self.perc == None and 0 or self.perc

        for cb in self.callbacks:
            cb()

        time.sleep(0.1)

        running = False

    def get_name(self):
        return self._batteries[0]["name"]

    def get_level(self):
        return self.perc

    def get_state(self):
        return self.status

    def get_capacity(self):
        return self.capacity

    def get_time(self):
        return self.time

    def get_watt(self):
        return self.watt

acpi_tries = 0
acpi_running = False

def acpi_listen(callback, onerror):
    global acpi_running
    global acpi_tries
    if acpi_running: return
    acpi_running = True

    try:
        main = subprocess.Popen(shlex.split("acpi_listen"),
                                stdout=subprocess.PIPE, text=True)
        awky = subprocess.Popen(shlex.split("grep --line-buffered -E 'battery|ac_adapter'"),
                                stdout=subprocess.PIPE, stdin=main.stdout, text=True)
        while True:
            output = awky.stdout.readline()
            if acpi_running == False:
                main.terminate()
                awky.terminate()
                return
            if output == "" and awky.poll() != None:
                break
            if output:
                callback()
        logger.warning("acpi_listen terminated")

        if acpi_tries < 5:
            acpi_tries += 1
            logger.debug("Restarting acpi_listen")
            return acpi_listen(callback, onerror)
        else:
            raise Exception("acpi_listen exceeded 5 restarts")
    except Exception as err:
        logger.error("Battery error: " + err.__str__())
        onerror()
        acpi_running = False

def scandir_line(path, callback):
    main = subprocess.Popen(shlex.split("ls -1 {}".format(path)),
                            stdout=subprocess.PIPE, text=True)
    while True:
        line = main.stdout.readline()
        if line == "" and main.poll() != None:
            break
        if line:
            callback(line)

def read_first_line(path):
    try:
        file = open(path, "r")
        first = None
        if file:
            first = file.readline()
            first = first.replace("\n", "")
            file.close()
        return first
    except Exception:
        return None

def tonumber(asa):
    try:
        return int(asa)
    except Exception:
        return None

def start_timer(callback, onerror):
    thread = Thread(target = acpi_listen, args=(callback, onerror,))
    thread.daemon = True
    thread.start()

def stop_timer():
    global acpi_running
    acpi_running = False
