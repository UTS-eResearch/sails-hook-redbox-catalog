#! /bin/bash
cd /opt/hooks/sails-hook-redbox-catalog;
yarn link;
cd /opt/redbox-portal;
if [ ! -d "node_modules/@uts-eresearch/sails-hook-redbox-template" ]; then
    yarn add  "file:/opt/hooks/sails-hook-redbox-catalog";
fi
yarn link "@uts-eresearch/sails-hook-redbox-catalog";
node app.js
