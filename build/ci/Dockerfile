FROM ubuntu:20.04
MAINTAINER Jezer Mejía <amyuki4@gmail.com>

RUN apt-get update

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata

RUN DEBIAN_FRONTEND=noninteractive \
	apt-get install -y \
		liblightdm-gobject-1-dev \
		libqt5webengine5 \
		pyqt5-dev-tools \
		python3-gi \
		python3-pyqt5 \
		python3-ruamel.yaml \
		python3-xlib \
		python3-pip

RUN DEBIAN_FRONTEND=noninteractive \
	apt-get install -y \
		patchelf \
		rsync \
		zip \
		sudo

RUN DEBIAN_FRONTEND=noninteractive \
	pip3 install PyGObject \
		PyQt5 \
		PyQtWebEngine \
		ruamel.yaml \
		python-xlib \
		cx_Freeze

VOLUME /build
WORKDIR /build
