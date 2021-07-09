#!/bin/sh

# chmod a+x release.sh

FILENAME='/tmp/nova-extensions'
# TODAY=$(date)

rm -v $FILENAME.zip
zip -r $FILENAME.zip \
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
 --exclude="*/-*.*"
#  -x \*.DS_Store
# -z $TODAY
