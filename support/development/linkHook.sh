#! /bin/bash
cd /opt/sailshook; 
yarn link; 
cd /opt/redbox-portal;  
if [ ! -d "node_modules/@uts-eresearch/sails-hook-redbox-template" ]; then
    yarn add  "file:/opt/sailshook";
fi
yarn link "@uts-eresearch/sails-hook-redbox-template"; 
node app.js