FROM archlinux

LABEL "Name"="Hugo for GitHub Pages"
LABEL "Version"="0.2.0"

RUN pacman -Syu --noconfirm && pacman -S --noconfirm git openssh hugo nodejs npm

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
