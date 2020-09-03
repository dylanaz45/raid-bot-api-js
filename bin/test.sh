#!/bin/bash
pm2 start server.js --name "api"
newman run tests/raid_bot_test.postman_collection
pm2 stop api
