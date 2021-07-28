FROM ubuntu:17.04
MAINTAINER Antergos Linux Project <dev@antergos.com>

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
	&& apt-get install -y \
		liblightdm-gobject-1-dev \
		libqt5webengine5 \
		python3-gi \
		python3-pyqt5 \
		python3-pip \
		zip \
		sudo \
	&& pip3 install whither

VOLUME /build
WORKDIR /build
