#!/bin/bash
pm2 stop api
pm2 start app.js --name "api"
