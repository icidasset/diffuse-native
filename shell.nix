let

  sources = import ./.nix/sources.nix;
  pkgs = import sources.nixpkgs {};

in

  pkgs.mkShell {
    buildInputs = [

      # Dev Tools
      pkgs.just

      # Language Specific
      pkgs.nodejs-13_x
      pkgs.rustc
      pkgs.rustup
      pkgs.yarn

    ];
  }
