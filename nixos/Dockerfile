FROM nixos/nix

RUN nix-channel --update
RUN nix-env -iA nixpkgs.nodejs \
  nixpkgs.bash \
  nixpkgs.nodePackages.typescript

ENV NODE_ENV=production

ADD ./src /app
ADD ./package.json /app
ADD ./package-lock.json /app

WORKDIR /app

RUN mkdir ./node_modules && \
  npm install && \
  tsc --lib es2019,DOM ./Main.ts && \
  find . -name '*.ts' -exec rm {} \;

RUN nix-env -e nixpkgs.nodePackages.typescript
CMD ["node", "Main.js"]
