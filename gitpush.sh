#!/bin/bash

echo "status"
git status

echo "Add"
git add .

echo "Commit"
git commit -m "Caddy server setting"


echo "Push"
git push origin main