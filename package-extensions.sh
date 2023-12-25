#!/bin/sh
# chmod a+x release.sh

ver="$(cat manifest.json | jq -r '.version')" #need installed - jq
# need after git push
# ver="$(git show HEAD:manifest.json | grep '"version"' | cut -d\" -f4)"
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
 --exclude='plugins/plugin_example.js'
#  -x \*.DS_Store
# -z $TODAY

echo "Compressed $filename"

if [ ! -z "$1" ]; then
   ver="$1"
fi

pause 'Press [Enter] to pushing the tag'
git tag "v$(echo "${ver}" | sed 's/1/0/1')" -f -m "$(cat "./-changelog.md")"
# git tag "v$(echo "${ver}" | sed 's/1/0/1')" "v$(echo "${ver}" | sed 's/1/0/1')"^{} -f -a -m "$(cat "./-changelog.md")" # edit tag
git push origin master --tags -f

pause 'Press [Enter] to pushing the repository...'
git add .
git commit -m "$ver"
git push origin master
