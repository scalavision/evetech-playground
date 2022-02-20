# creates isolated dev env similar
# to Docker and virtualenv in Python
# requires nix to be installed,
# see https://nixos.org/download.html
# launch nix-shell by:
# nix-shell ./default.nix
with import <nixpkgs> { };

mkShell rec {

  name = "typescript-dev-env";

  # packages to install in isolated dev env
  buildInputs = [
    bash
    gnumake
    nodejs-16_x
    inotify-tools
    # google-chrome
    # chromedriver
    nodePackages.typescript
  ];

  shellHook = ''
    echo "environtment loaded and ready .."
    if [[ ! -d ./node_modules ]]; then
      npm install
    fi
    export DEVELOP="true"
  '';

}
