FROM archlinux

LABEL "Name"="Hugo for GitHub Pages"
LABEL "Version"="0.2.0"

ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN pacman -Syu && pacman -S git openssh hugo

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
