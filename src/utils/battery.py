import os
import re
import math
import time
from typing import Union
import globales
from utils.acpi import ACPI

class Battery:
    # pylint: disable=too-many-instance-attributes
    """Battery controller"""

    batteries = []
    ac_path = "AC0"
    pspath = "/sys/class/power_supply/"
    perc = -1
    status = "N/A"
    capacity = 0
    time = ""
    watt = 0
    running_update = False

    def __init__(self):
        if len(self.batteries) == 0:
            scandir_line(self.pspath, self._update_batteries)
        ACPI.connect(self.acpi_listen)
        self.full_update()

    def acpi_listen(self, data: str):
        """Listens"""
        if re.match(r"battery|ac_adapter", data):
            self.full_update()

    def _update_batteries(self, line):
        bstr = re.match(r"BAT\w+", line)
        if bstr:
            self.batteries.append(dict(
                name = bstr.group(),
                status = "N/A",
                perc = 0,
                capacity = 0,
            ))
        else:
            match = re.match(r"A\w+", line)
            self.ac_path = match.group() if match else self.ac_path

    # Based on "bat" widget from "lain" awesome-wm library
    # * (c) 2013,      Luca CPZ
    # * (c) 2010-2012, Peter Hofmann
    # @see https://github.com/lcpz/lain/blob/master/widget/bat.lua
    def full_update(self):
        # pylint: disable=too-many-locals,too-many-statements,too-many-branches
        """Do a full update"""
        if self.running_update:
            return
        self.running_update = True

        sum_rate_current = 0
        sum_rate_voltage = 0
        sum_rate_power = 0
        sum_rate_energy = 0
        sum_energy_now = 0
        sum_energy_full = 0
        sum_charge_full = 0
        sum_charge_design = 0

        for i, battery in enumerate(self.batteries):
            bstr = self.pspath + battery["name"]
            present = read_first_line(bstr + "/present")

            if tonumber(present) == 1:
                rate_current = tonumber(read_first_line(bstr + "/current_now")) or 0
                rate_voltage = tonumber(read_first_line(bstr + "/voltage_now")) or 0
                rate_power = tonumber(read_first_line((bstr + "/power_now"))) or 0
                charge_full = tonumber(read_first_line(bstr + "/charge_full")) or 0
                charge_design = tonumber(read_first_line(bstr + "/charge_full_design")) or 0

                energy_now = tonumber(read_first_line(bstr + "/energy_now")
                                 or read_first_line(bstr + "/charge_now")) or 0
                energy_full = tonumber(read_first_line(bstr + "/energy_full") or charge_full) or 0
                energy_percentage = tonumber(read_first_line(bstr + "/capacity")
                                 or math.floor(energy_now / energy_full * 100)) or 0

                self.batteries[i]["status"] = read_first_line(bstr + "/status") or "N/A"
                self.batteries[i]["perc"] = energy_percentage or self.batteries[i].perc

                if not charge_design or charge_design == 0:
                    self.batteries[i]["capacity"] = 0
                else:
                    self.batteries[i]["capacity"] = math.floor(
                        charge_full / charge_design * 100)

                sum_rate_current = sum_rate_current + rate_current
                sum_rate_voltage = sum_rate_voltage + rate_voltage
                sum_rate_power = sum_rate_power + rate_power
                sum_rate_energy = sum_rate_energy + (
                    rate_power or (rate_voltage * rate_current / 1e6)
                )
                sum_energy_now = sum_energy_now + energy_now
                sum_energy_full = sum_energy_full + energy_full
                sum_charge_full = sum_charge_full + charge_full
                sum_charge_design = sum_charge_design + charge_design

        self.capacity = math.floor(min(100, sum_charge_full / (sum_charge_design or 1) * 100))
        self.status = self.batteries[0]["status"] if len(self.batteries) > 0 else "N/A"

        for i, battery in enumerate(self.batteries):
            if battery["status"] == "Discharging" or battery["status"] == "Charging":
                self.status = battery["status"]

        self.ac_status = tonumber(read_first_line(self.pspath + self.ac_path + "/online")) or 0

        if self.status != "N/A":
            if self.status != "Full" and sum_rate_power == 0 and self.ac_status == 1:
                self.perc = math.floor(min(100,
                            sum_energy_now / sum_energy_full * 100 + 0.5))
                self.time = "00:00"
                self.watt = 0
            elif self.status != "Full":
                rate_time = 0
                if (sum_rate_power > 0 or sum_rate_current > 0):
                    div = sum_rate_power > 0 or sum_rate_current

                    if self.status == "Charging":
                        rate_time = (sum_energy_full - sum_energy_now) / div
                    else:
                        rate_time = sum_energy_now / div

                    if rate_time and rate_time < 0.01:
                        rate_time_magnitude = tonumber(abs(math.floor(math.log10(rate_time)))) or 0
                        rate_time = int(rate_time * 10) ^ (rate_time_magnitude - 2)

                    hours   = math.floor(rate_time)
                    minutes = math.floor((rate_time - hours) * 60)
                    self.perc  = math.floor(
                        min(100, (sum_energy_now / sum_energy_full) * 100) + 0.5
                    )
                    self.time = f"{hours:02d}:{minutes:02d}"
                    self.watt = f"{sum_rate_energy/1e6:.2f}"
            elif self.status == "Full":
                self.perc = 100
                self.time = "00:00"
                self.watt = 0

        self.perc = self.perc if self.perc is not None else 0

        if hasattr(globales, "greeter"):
            globales.greeter.greeter.battery_update.emit()

        time.sleep(0.1)

        self.running_update = False

    def get_name(self):
        """Get name"""
        return self.batteries[0]["name"]

    def get_level(self):
        """Get level"""
        return self.perc

    def get_status(self):
        """Get status"""
        return self.status

    def get_ac_status(self):
        """Get AC status"""
        return self.ac_status

    def get_capacity(self):
        """Get capacity"""
        return self.capacity

    def get_time(self):
        """Get time"""
        return self.time

    def get_watt(self):
        """Get watt"""
        return self.watt

def scandir_line(path, callback):
    """List directory"""
    lines = os.listdir(path)
    for _, line in enumerate(lines):
        callback(line)

def read_first_line(path) -> Union[str, None]:
    """Just read the first line of file"""
    try:
        first = None
        with open(path, "r", encoding = "utf-8") as file:
            first = file.readline()
            first = first.replace("\n", "")
        return first
    except IOError:
        return None

def tonumber(string) -> Union[int, None]:
    """Converts string to int or None"""
    try:
        return int(string)
    except (ValueError, TypeError):
        return None
