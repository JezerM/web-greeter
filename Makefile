#!/bin/make -f

DO            := ./build/utils.sh
SET_CONFIG    := $(DO) set-config
DESTDIR       ?= /
PREFIX        ?= /usr
MAYBE_SUDO_DO := $(DO)

define colorecho
	@tput setaf 118 || true
	@echo $1        || true
	@tput sgr0      || true
endef


ifeq ($(DESTDIR),/)
MAYBE_SUDO_DO := sudo $(DO)
endif


# Configuration: Use values from command line if provided, default values otherwise.
at_spi_service        ?= False
background_images_dir ?= $(abspath $(PREFIX)/share/backgrounds)
config_dir            ?= $(abspath /etc/lightdm)
debug_mode            := False
decorated             := False
greeters_dir          ?= $(abspath $(PREFIX)/share/xgreeters)
locale_dir            ?= $(abspath $(PREFIX)/share/locale)
themes_dir            ?= $(abspath $(PREFIX)/share/web-greeter/themes)
logo_image            ?= $(themes_dir)/default/img/antergos-logo-user.png
stays_on_top          := True
user_image            ?= $(themes_dir)/default/img/antergos.png
battery_enabled				:= False
backlight_enabled			:= False


ifeq ($(MAKECMDGOALS),build_dev)
debug_mode   := True
decorated    := True
stays_on_top := False
endif


_apply_config:
	@$(SET_CONFIG) at_spi_service        $(at_spi_service)
	@$(SET_CONFIG) background_images_dir $(background_images_dir)
	@$(SET_CONFIG) config_dir            $(config_dir)
	@$(SET_CONFIG) debug_mode            $(debug_mode)
	@$(SET_CONFIG) decorated             $(decorated)
	@$(SET_CONFIG) greeters_dir          $(greeters_dir)
	@$(SET_CONFIG) locale_dir            $(locale_dir)
	@$(SET_CONFIG) themes_dir            $(themes_dir)
	@$(SET_CONFIG) logo_image            $(logo_image)
	@$(SET_CONFIG) stays_on_top          $(stays_on_top)
	@$(SET_CONFIG) user_image            $(user_image)
	@$(SET_CONFIG) battery_enabled       $(battery_enabled)
	@$(SET_CONFIG) backlight_enabled     $(backlight_enabled)

_build_init: clean
	$(DO) build-init

all: install

build: _build_init _apply_config
	$(DO) build $(PREFIX)
	$(DO) prepare-install $(PREFIX)

build_dev: build
	$(call colorecho, Built for dev)

clean:
	$(DO) clean

install: build
	$(MAYBE_SUDO_DO) install $(DESTDIR) $(PREFIX)
	$(call colorecho, SUCCESS!)


.PHONY: all _apply_config _build_init build build_dev clean install
