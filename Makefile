DESTDIR ?= /
PREFIX ?= /usr
ENABLE_BASH_COMPLETION ?= true
ENABLE_ZSH_COMPLETION ?= true


BUILD_DIR := $(abspath build)
REPO_DIR := $(abspath ./)
INSTALL_ROOT := $(abspath build/install_root)
INSTALL_PREFIX :=$(abspath $(shell echo ${INSTALL_ROOT}/${PREFIX}))
DESTDIR_PREFIX :=$(abspath $(shell echo ${DESTDIR}/${PREFIX}))

ifeq (${ENABLE_BASH_COMPLETION}, true)
    ifeq ($(shell pkg-config --exists bash-completion && echo 0), 0)
        bashcompletiondir := $(shell pkg-config --variable=completionsdir bash-completion)
    endif
endif

ifeq (${ENABLE_ZSH_COMPLETION}, true)
    ifeq ($(shell which zsh 2>/dev/null 1>&2 && echo 0), 0)
        zshcompletiondir := /usr/share/zsh/site-functions/
    endif
endif

ifdef bashcompletiondir
    bashcompletiondir_local := ${INSTALL_ROOT}/${bashcompletiondir}
    $(info Bash completion to install at: ${bashcompletiondir})
else
    $(info No Bash completion)
endif
ifdef zshcompletiondir
    zshcompletiondir_local := ${INSTALL_ROOT}/${zshcompletiondir}
    $(info ZSH completion to install at: ${zshcompletiondir})
else
    $(info No ZSH completion)
endif

all: build

# Virtual Environment
venv/bin/activate: requirements.txt
	python3 -m venv venv
	./venv/bin/pip install -r requirements.txt

# Dist and web-greeter directories
build/dist := ${BUILD_DIR}/dist
build/web-greeter := ${BUILD_DIR}/web-greeter

$(build/dist): dist/*
	@rm -rf "${BUILD_DIR}/dist"
	@rsync -a "${REPO_DIR}/dist" "${BUILD_DIR}"
	@cp "${REPO_DIR}/NEWS.md" "${BUILD_DIR}/dist/NEWS.md"
	@echo "✔ Dist directory created at ${build/dist}"

$(build/web-greeter): src/*
	@rsync -a "${REPO_DIR}/src/" "${BUILD_DIR}/web-greeter" --exclude "dist" --exclude "__pycache__"
	@cp "${REPO_DIR}/README.md" "${BUILD_DIR}/web-greeter/"
	@echo "✔ Build directory created at ${build/web-greeter}"

# Resources
bundle.js := ${BUILD_DIR}/web-greeter/resources/js/bundle.js

$(bundle.js): $(build/web-greeter)
	@cd build/web-greeter/resources/js; \
	cat ThemeUtils.js bootstrap.js > bundle.js

resources.py := ${BUILD_DIR}/web-greeter/resources.py

$(resources.py): venv/bin/activate $(bundle.js)
	@./venv/bin/pyrcc5 -o ${BUILD_DIR}/web-greeter/resources.py\
		${BUILD_DIR}/web-greeter/resources/resources.qrc
	@cp ${resources.py} src/
	@echo "✔ Resources compiled with pyrcc5"

# Install root, where everything will be copied to
$(INSTALL_ROOT):
	@for d in man/man1 metainfo doc/web-greeter web-greeter \
		xgreeters applications; do \
		mkdir -p "${INSTALL_PREFIX}/share/$$d"; \
	done
	@for d in lightdm xdg/lightdm/lightdm.conf.d; do \
		mkdir -p "${INSTALL_ROOT}/etc/$$d"; \
	done
	@for d in lib/web-greeter bin; do \
		mkdir -p "${INSTALL_PREFIX}/$$d"; \
	done
	@echo "✔ Install root created at ${INSTALL_ROOT}"

# ZSH completion install
$(zshcompletiondir_local): $(INSTALL_ROOT)
	@if [ -n "${zshcompletiondir}" ]; then \
		mkdir -p "${zshcompletiondir_local}"; \
		cp "${BUILD_DIR}/dist/web-greeter-zsh" "${zshcompletiondir_local}/_web-greeter"; \
		echo " ZSH completion copied"; \
	fi

# Bash completion install
$(bashcompletiondir_local): $(INSTALL_ROOT)
	@if [ -n "${bashcompletiondir}" ]; then \
		mkdir -p "${bashcompletiondir_local}"; \
		cp "${BUILD_DIR}/dist/web-greeter-bash" "${bashcompletiondir_local}/web-greeter"; \
		echo " Bash completion copied"; \
	fi

build_completions: $(zshcompletiondir_local) $(bashcompletiondir_local)

# Theme installation
THEMES_DIR := $(abspath ${DESTDIR_PREFIX}/share/web-greeter/themes)
THEMES_DIR_LOCAL := $(abspath ${INSTALL_ROOT}/${THEMES_DIR})
themes/gruvbox := $(abspath ${THEMES_DIR_LOCAL}/gruvbox)
themes/dracula := $(abspath ${THEMES_DIR_LOCAL}/dracula)
themes/simple := $(abspath ${THEMES_DIR_LOCAL}/simple)
themes/_vendor := $(abspath ${INSTALL_PREFIX}/share/web-greeter/_vendor)

$(THEMES_DIR_LOCAL): $(INSTALL_ROOT)
	@mkdir -p "${THEMES_DIR_LOCAL}"

$(themes/gruvbox): $(THEMES_DIR_LOCAL) themes/gruvbox/*
	@cp -r "${REPO_DIR}/themes/gruvbox" "${themes/gruvbox}"
	@echo " Gruvbox theme copied"
$(themes/dracula): $(THEMES_DIR_LOCAL) themes/dracula/*
	@cp -r "${REPO_DIR}/themes/dracula" "${themes/dracula}"
	@echo " Dracula theme copied"
$(themes/simple): $(THEMES_DIR_LOCAL) themes/simple/*
	@cp -r "${REPO_DIR}/themes/simple" "${themes/simple}"
	@echo " Simple theme copied"
$(themes/_vendor): $(INSTALL_ROOT) themes/_vendor/*
	@cp -r "${REPO_DIR}/themes/_vendor" "${themes/_vendor}"
	@echo " Theme vendors copied"

build_themes: $(themes/gruvbox) $(themes/dracula) $(themes/simple) $(themes/_vendor)

# Dist files
dist/web-greeter.1 := $(abspath ${DESTDIR_PREFIX}/share/man/man1/web-greeter.1.gz)
dist/news := $(abspath ${DESTDIR_PREFIX}/share/doc/web-greeter/NEWS.gz)
dist/metainfo := $(abspath ${DESTDIR_PREFIX}/share/metainfo/web-greeter.appdata.xml)
dist/xg-desktop := $(abspath ${DESTDIR_PREFIX}/share/xgreeters/web-greeter.desktop)
dist/app-desktop := $(abspath ${DESTDIR_PREFIX}/share/applications/web-greeter.desktop)

dist_local/web-greeter.1 := $(abspath ${INSTALL_PREFIX}/share/man/man1/web-greeter.1.gz)
dist_local/news := $(abspath ${INSTALL_PREFIX}/share/doc/web-greeter/NEWS.gz)
dist_local/metainfo := $(abspath ${INSTALL_PREFIX}/share/metainfo/web-greeter.appdata.xml)
dist_local/xg-desktop := $(abspath ${INSTALL_PREFIX}/share/xgreeters/web-greeter.desktop)
dist_local/app-desktop := $(abspath ${INSTALL_PREFIX}/share/applications/web-greeter.desktop)

$(dist_local/web-greeter.1): $(build/dist) $(INSTALL_ROOT) ${BUILD_DIR}/dist/web-greeter.1
	@gzip -c9 "${BUILD_DIR}/dist/web-greeter.1" > \
		"${dist_local/web-greeter.1}"

$(dist_local/news): $(build/dist) $(INSTALL_ROOT) ${BUILD_DIR}/dist/NEWS.md
	@gzip -c9 "${BUILD_DIR}/dist/NEWS.md" > \
		"${dist_local/news}"

$(dist_local/metainfo): $(build/dist) $(INSTALL_ROOT) ${BUILD_DIR}/dist/web-greeter.appdata.xml
	@cp "${BUILD_DIR}/dist/web-greeter.appdata.xml" \
		"${dist_local/metainfo}"

$(dist_local/xg-desktop): $(build/dist) $(INSTALL_ROOT) ${BUILD_DIR}/dist/web-xgreeter.desktop
	@cp "${BUILD_DIR}/dist/web-xgreeter.desktop" \
		"${dist_local/xg-desktop}"

$(dist_local/app-desktop): $(build/dist) $(INSTALL_ROOT) ${BUILD_DIR}/dist/web-greeter.desktop
	@cp "${BUILD_DIR}/dist/web-greeter.desktop" \
		"${dist_local/app-desktop}"

build_dist_files: $(dist_local/web-greeter.1) $(dist_local/news) $(dist_local/metainfo) $(dist_local/xg-desktop) $(dist_local/app-desktop)
	@echo "✔ Dist files copied"

# Config files
config/web-greeter := $(abspath ${DESTDIR}/etc/lightdm/web-greeter.yml)
config/lightdm-wrapper := $(abspath ${DESTDIR}/etc/xdg/lightdm/lightdm.conf.d/90-greeter.wrapper.conf)
config/Xgreeter := $(abspath ${DESTDIR}/etc/lightdm/Xgreeter)

config_local/web-greeter := $(abspath ${INSTALL_ROOT}/etc/lightdm/web-greeter.yml)
config_local/lightdm-wrapper := $(abspath ${INSTALL_ROOT}/etc/xdg/lightdm/lightdm.conf.d/90-greeter.wrapper.conf)
config_local/Xgreeter := $(abspath ${INSTALL_ROOT}/etc/lightdm/Xgreeter)

$(config_local/web-greeter): $(INSTALL_ROOT) ${BUILD_DIR}/dist/web-greeter.yml
	@cp "${BUILD_DIR}/dist/web-greeter.yml" "${config_local/web-greeter}"
$(config_local/lightdm-wrapper): $(INSTALL_ROOT) ${BUILD_DIR}/dist/90-greeter-wrapper.conf
	@cp "${BUILD_DIR}/dist/90-greeter-wrapper.conf" "${config_local/lightdm-wrapper}"
$(config_local/Xgreeter): $(INSTALL_ROOT) ${BUILD_DIR}/dist/Xgreeter
	@install -Dm755 "${BUILD_DIR}/dist/Xgreeter" "${config_local/Xgreeter}"

build_config: $(config_local/web-greeter) $(config_local/ligtdm-wrapper) $(config_local/Xgreeter)
	@echo "✔ Config copied"

build_install_root: $(INSTALL_ROOT) build_dist_files build_config build_themes build_completions

# Binaries
bin/web-greeter := $(abspath ${DESTDIR}/bin/web-greeter)
bin_local/web-greeter := $(abspath ${INSTALL_PREFIX}/bin/web-greeter)

bin/screensaver.so := ${BUILD_DIR}/web-greeter/bindings/_screensaver.so
bin/screensaver.c := ${BUILD_DIR}/web-greeter/bindings/screensaver.c

$(bin/screensaver.so): $(build/web-greeter)
	@gcc ${bin/screensaver.c} -o ${bin/screensaver.so} -shared -lX11 -lxcb
	@cp ${bin/screensaver.so} src/bindings/
	@echo "✔ Screensaver.so compiled"

$(bin_local/web-greeter): build_install_root $(resources.py) $(bin/screensaver.so)
	@rm -rf "${INSTALL_PREFIX}/lib/web-greeter/*"
	@cp -R "${BUILD_DIR}/web-greeter"/* "${INSTALL_PREFIX}/lib/web-greeter"
	@printf "#!/usr/bin/env bash\npython3 ${DESTDIR_PREFIX}/lib/web-greeter \$$@" > \
		"${bin_local/web-greeter}"
	@chmod +x "${bin_local/web-greeter}"
	@echo "✔ web-greeter binary copied"

# Useful rules
.PHONY: build
build: venv/bin/activate $(bin_local/web-greeter)
	@echo "✔ Build succeded"

.PHONY: install
install: build
	[ -e "${DESTDIR}" ] || mkdir -p "${DESTDIR}"
	cp -R "${INSTALL_ROOT}"/* "${DESTDIR}"
	@echo "✔ Install succeded"

# Uninstall everything except themes and web-greeter.yml
uninstall_preserve:
	@rm -f "${dist/web-greeter.1}"
	@rm -f "${dist/app-desktop}"
	@rm -f "${dist/xg-desktop}"
	@rm -f "${dist/metainfo}"
	@rm -f "${dist/news}"
	@rm -f "${config/lightdm-wrapper}"
	@rm -f "${config/Xgreeter}"
	@rm -f "${bin/web-greeter}"
	@if [ -n "${bashcompletiondir}" ]; then \
		rm -f "${bashcompletiondir}/web-greeter"; \
	fi
	@if [ -n "${zshcompletiondir}" ]; then \
		rm -f "${zshcompletiondir}/_web-greeter"; \
	fi

# Uninstall everything
uninstall_all: uninstall_preserve
	@rm -rf "${config/web-greeter}"
	@rm -rf "${DESTDIR_PREFIX}/web-greeter/"

.PHONY: uninstall
uninstall: uninstall_preserve
	@echo " Themes are not uninstalled. Remove them manually or use \`make uninstall_all\`:\
		\n${DESTDIR_PREFIX}/share/web-greeter"
	@echo " web-greeter config was not uninstalled. Remove it manually or use \`make uninstall_all\`:\
		\n${config/web-greeter}"

run: venv/bin/activate $(resources.py)
	./venv/bin/python3 src

run_debug: venv/bin/activate $(resources.py)
	./venv/bin/python3 src --debug

clean:
	rm -rf venv ${INSTALL_ROOT} ${BUILD_DIR}/dist ${BUILD_DIR}/web-greeter
