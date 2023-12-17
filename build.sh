#!/bin/sh

mkdir gezenti

# copy backend
cp ./data/game.py ./gezenti/game.py
cp ./data/permutations_shuffled.json ./gezenti/permutations_shuffled.json
cp ./data/cities.json ./gezenti/cities.json
cp ./data/backend.py ./gezenti/app.py
cp ./data/requirements.txt ./gezenti/requirements.txt

# copy frontend
cp -r ./frontend/ ./gezenti/static/
rm -f ./gezenti/README.md

# copy heroku
cp ./Procfile ./gezenti/Procfile
