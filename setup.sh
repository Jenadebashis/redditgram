#!/usr/bin/env bash
# Basic setup script for Redditgram
# Creates a virtual environment and installs dependencies
set -e

python3 -m venv env
. env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
