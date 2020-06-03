chmod -R u+rw,g-rwx,o-rwx ~/.gpg2
export GNUPGHOME=~/.gpg2
export GPG_TTY="$(tty)"
export SSH_AUTH_SOCK=$(gpgconf --list-dirs agent-ssh-socket)
gpgconf --launch gpg-agent
