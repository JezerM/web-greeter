FROM ubuntu:20.04
LABEL maintainer Jezer Mejía <amyuki4@gmail.com>

RUN apt-get update

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata

RUN DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        build-essential

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        liblightdm-gobject-1-dev \
        gobject-introspection \
        libgirepository1.0-dev \
        libqt5webengine5 \
        pyqt5-dev-tools \
        libxcb1 \
        libx11-6 \
        libcairo2

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        python3-gi \
        python3-pyqt5 \
        python3-pyqt5.qtwebengine \
        python3-ruamel.yaml \
        python3-pyinotify \
        python3-pip

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
        rsync \
        sudo

VOLUME /build
WORKDIR /build
