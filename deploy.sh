#!/bin/bash

echo "Pulling"
git pull

echo "Composing down"
sudo docker-compose down

echo "Building application"
sudo docker-compose up -d --build


echo "Check if it's running"
sudo docker ps