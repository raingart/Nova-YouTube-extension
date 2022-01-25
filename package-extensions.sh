#!/bin/sh
# chmod a+x release.sh

ver="$(cat manifest.json | jq -r '.version')"
filename="/tmp/nova-extensions_v${ver}.zip"
# TODAY=$(date)

pause() { read -p "$*"; }

echo "Zipping extension for Chrome Web Store..."
rm $filename
zip -q -r $filename \
                  _locales \
                  css/libs/*/*.css \
                  css/*/*.css \
                  css/*.css \
                  html/*.html \
                  icons/16.png \
                  icons/48.png \
                  icons/128.png \
                  js/*.js \
                  js/*/*.js \
                  manifest.json \
                  plugins/*.js \
                  plugins/*/*.js \
                  images/*.png \
 --exclude="*/-*.*" \
 --exclude='plugins/_blank_plugin.js'
#  -x \*.DS_Store
# -z $TODAY

echo "Сompressed $filename"

pause 'Press [Enter] to pushing the repository...'
git add --all
git commit -m "$ver"
git tag "v${ver}"
git push
