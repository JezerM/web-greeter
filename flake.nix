{
  description = "LightDM greeter themeable with HTML, CSS and JavaScript";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    self.submodules = true; # The stock themes live in a submodule, which a flake source otherwise skips
  };

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (
        system:
        let
          web-greeter = nixpkgs.legacyPackages.${system}.callPackage ./nix/package.nix { src = self; };
        in
        {
          inherit web-greeter;
          default = web-greeter;
        }
      );

      overlays.default = final: prev: {
        web-greeter = final.callPackage ./nix/package.nix { src = self; };
      };

      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-tree);
    };
}
