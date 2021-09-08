#!/usr/bin/env bash

BUILD_DIR="$(realpath $(dirname "${BASH_SOURCE[0]}"))"
REPO_DIR="$(dirname "${BUILD_DIR}")"
INSTALL_ROOT="${BUILD_DIR}/install_root"
PKGNAME='web-greeter'
DESTDIR=''
PREFIX=''

clean_build_dir() {
	find "${BUILD_DIR}" -type f ! -path '**/ci/**' ! -name '*.yml' ! -path "**/DEBIAN/**" ! -name utils.sh -delete
	find "${BUILD_DIR}" -type d ! -name build ! -path '**/ci' -delete 2>/dev/null || true
}

combine_javascript_sources() {
	cd "${BUILD_DIR}/${PKGNAME}/resources/js"
	cat ThemeUtils.js \
		bootstrap.js > bundle.js
}

do_build() {
	cd "${BUILD_DIR}"

	# Compile Resources
	(combine_javascript_sources \
		&& pyrcc5 -o "${BUILD_DIR}/${PKGNAME}/resources.py" ../resources.qrc \
		&& cp "${BUILD_DIR}/${PKGNAME}/resources.py" "${REPO_DIR}/web-greeter")

	# Create "Zip Application"
	(cd "${PKGNAME}" \
		&& zip -rq ../"${PKGNAME}.zip" . -x '**__pycache__**' 'resources/*' \
		&& cd - >/dev/null \
		&& mkdir -p "${INSTALL_ROOT}${PREFIX}"/{bin,share} \
		&& echo '#!/usr/bin/env python3' >> "${INSTALL_ROOT}${PREFIX}/bin/web-greeter" \
		&& cat web-greeter.zip >> "${INSTALL_ROOT}${PREFIX}/bin/web-greeter" \
		&& chmod +x "${INSTALL_ROOT}${PREFIX}/bin/web-greeter")
}

do_install() {
	[[ -e "${DESTDIR}" ]] || mkdir -p "${DESTDIR}"
	cp -R "${INSTALL_ROOT}"/* "${DESTDIR}"
}

# Not used
generate_pot_file() {
	REPO_ROOT="$(dirname "${REPO_DIR}")"
	xgettext --from-code UTF-8 -o "${REPO_ROOT}/po/web-greeter.pot" -d web-greeter "${REPO_ROOT}"/src/*.c
}

init_build_dir() {
	[[ -e "${BUILD_DIR}/web-greeter" ]] && rm -rf "${BUILD_DIR}/web-greeter"
	[[ -e "${BUILD_DIR}/dist" ]] && rm -rf "${BUILD_DIR}/dist"
	cp -R -t "${BUILD_DIR}" "${REPO_DIR}/web-greeter" "${REPO_DIR}/dist"
}

prepare_install() {
	cd "${BUILD_DIR}"
	mkdir -p \
		"${INSTALL_ROOT}${PREFIX}"/share/{man/man1,metainfo,web-greeter,xgreeters,zsh/vendor-completions,bash-completion/completions} \
		"${INSTALL_ROOT}"/etc/{lightdm,xdg/lightdm/lightdm.conf.d}

	# Themes
	(cp -R "${REPO_DIR}/themes" "${INSTALL_ROOT}${PREFIX}/share/web-greeter" \
		&& cd "${INSTALL_ROOT}${PREFIX}/share/web-greeter" \
		&& mv themes/_vendor .)

	# Man Page
	cp "${BUILD_DIR}/dist/${PKGNAME}.1" "${INSTALL_ROOT}${PREFIX}/share/man/man1"

	# Command line completions
	cp "${BUILD_DIR}/dist/${PKGNAME}-bash" "${INSTALL_ROOT}${PREFIX}/share/bash-completion/completions/${PKGNAME}"
	cp "${BUILD_DIR}/dist/${PKGNAME}-zsh" "${INSTALL_ROOT}${PREFIX}/share/zsh/vendor-completions/_${PKGNAME}"

	# Greeter Config
	cp "${BUILD_DIR}/dist/${PKGNAME}.yml" "${INSTALL_ROOT}/etc/lightdm"

	# AppData File
	cp "${BUILD_DIR}/dist/${PKGNAME}.appdata.xml" "${INSTALL_ROOT}${PREFIX}/share/metainfo"

	# Desktop File
	cp "${BUILD_DIR}/dist/${PKGNAME}.desktop" "${INSTALL_ROOT}${PREFIX}/share/xgreeters"

	# Xgreeter wrapper
	cp "${BUILD_DIR}/dist/90-greeter-wrapper.conf" \
		"${INSTALL_ROOT}/etc/xdg/lightdm/lightdm.conf.d/90-greeter-wrapper.conf"

	install -Dm755 "${BUILD_DIR}/dist/Xgreeter" "${INSTALL_ROOT}/etc/lightdm/Xgreeter"

	# Don't install hidden files
	find "${INSTALL_ROOT}" -type f -name '.git*' -delete
	rm -rf "${INSTALL_ROOT}/usr/share/web-greeter/themes/default/.tx"

	if [[ "${DESTDIR}" != '/' ]]; then
		# Save a list of installed files for uninstall command
		find "${INSTALL_ROOT}" -fprint /tmp/.installed_files

		while read _file
		do
			[[ -d "${_file}" && *'/web-greeter/'* != "${_file}" ]] && continue

			echo "${_file##*/install_root}" >> "${INSTALL_ROOT}${PREFIX}/share/web-greeter/.installed_files"

		done < /tmp/.installed_files

		rm /tmp/.installed_files
	fi
}

set_config() {
	[[ -z "$1" || -z "$2" ]] && return 1

	sed -i "s|'@$1@'|$2|g" \
		"${BUILD_DIR}/dist/web-greeter.yml"
}



cd "${REPO_DIR}/build" >/dev/null

case "$1" in
	combine-js)
		combine_javascript_sources
	;;

	clean)
		clean_build_dir
	;;

	build)
		PREFIX="$2"
		do_build
	;;

	build-init)
		init_build_dir
	;;

	gen-pot)
		generate_pot_file
	;;

	install)
		DESTDIR="$2"
		PREFIX="$3"
		do_install
		clean_build_dir
	;;

	prepare-install)
		PREFIX="$2"
		prepare_install
	;;

	set-config)
		set_config "$2" "$3"
	;;
esac
