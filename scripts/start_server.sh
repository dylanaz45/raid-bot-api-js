#!/bin/bash
sudo pm2 stop api
sudo pm2 start app.js --name "api"
