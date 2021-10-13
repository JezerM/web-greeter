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

do_old_build() {
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

do_build() {
	cd "${BUILD_DIR}"

	echo "Building web-greeter with cx_freeze..."
	python3 "${BUILD_DIR}/${PKGNAME}/setup.py" build >& setup_log
	echo "setup.py log inside ${BUILD_DIR}/setup_log"

	mkdir -p "${INSTALL_ROOT}"/opt/web-greeter
	mv "${BUILD_DIR}/${PKGNAME}"/dist/* "${INSTALL_ROOT}"/opt/web-greeter/
}

do_install() {
	[[ -e "${DESTDIR}" ]] || mkdir -p "${DESTDIR}"
	cp -R "${INSTALL_ROOT}"/* "${DESTDIR}"
	ln -sf "${DESTDIR}"/opt/web-greeter/web-greeter "${DESTDIR}"/usr/bin/web-greeter
}

init_build_dir() {
	[[ -e "${BUILD_DIR}/web-greeter" ]] && rm -rf "${BUILD_DIR}/web-greeter"
	[[ -e "${BUILD_DIR}/dist" ]] && rm -rf "${BUILD_DIR}/dist"
	rsync -a "${REPO_DIR}/web-greeter" "${BUILD_DIR}" --exclude "dist" --exclude "__pycache__"
	rsync -a "${REPO_DIR}/dist" "${BUILD_DIR}"
	cp "${REPO_DIR}/README.md" "${BUILD_DIR}/web-greeter"
}

prepare_install() {
	cd "${BUILD_DIR}"
	mkdir -p \
		"${INSTALL_ROOT}${PREFIX}"/share/{man/man1,metainfo,web-greeter,xgreeters,applications,zsh/vendor-completions,bash-completion/completions} \
		"${INSTALL_ROOT}"/etc/{lightdm,xdg/lightdm/lightdm.conf.d}

	# Themes
	(cp -R "${REPO_DIR}/themes" "${INSTALL_ROOT}${PREFIX}/share/web-greeter" \
		&& cd "${INSTALL_ROOT}${PREFIX}/share/web-greeter" \
		&& mv themes/_vendor .)

	# Man Page
	cp "${BUILD_DIR}/dist/${PKGNAME}.1" "${INSTALL_ROOT}${PREFIX}/share/man/man1"

	# Command line completions
	if [[ -f /usr/bin/bash ]]; then
		cp "${BUILD_DIR}/dist/${PKGNAME}-bash" "${INSTALL_ROOT}${PREFIX}/share/bash-completion/completions/${PKGNAME}"
	fi
	if [[ -f /usr/bin/zsh ]]; then
		cp "${BUILD_DIR}/dist/${PKGNAME}-zsh" "${INSTALL_ROOT}${PREFIX}/share/zsh/vendor-completions/_${PKGNAME}"
	fi

	# Greeter Config
	cp "${BUILD_DIR}/dist/${PKGNAME}.yml" "${INSTALL_ROOT}/etc/lightdm"

	# AppData File
	cp "${BUILD_DIR}/dist/${PKGNAME}.appdata.xml" "${INSTALL_ROOT}${PREFIX}/share/metainfo"

	# Greeter desktop File
	cp "${BUILD_DIR}/dist/web-xgreeter.desktop" "${INSTALL_ROOT}${PREFIX}/share/xgreeters/web-greeter.desktop"

	# Application desktop File
	cp "${BUILD_DIR}/dist/web-greeter.desktop" "${INSTALL_ROOT}${PREFIX}/share/applications/web-greeter.desktop"

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

	build_old)
		PREFIX="$2"
		do_old_build
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
