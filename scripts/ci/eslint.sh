#!/bin/bash
set -e

echo "About to perform eslint run"

yarn eslint:ci

echo "ESLint was a success"