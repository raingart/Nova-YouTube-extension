#!/bin/sh
# chmod a+x release.sh

ver="$(cat manifest.json | jq -r '.version')" #need installed - jq
# need after git push
# ver="$(git show HEAD:manifest.json | grep '"version"' | cut -d\" -f4)"
# TODAY=$(date)

pause() { read -p "$*"; }

if [ ! -z "$1" ]; then
   ver="$1"
fi

# pause 'Press [Enter] to pushing the tag "'${ver}'"'
# git tag "v$(echo "${ver}" | sed 's/1/0/1')" -f -m "$(cat "./-changelog.md")"
# # git tag "v$(echo "${ver}" | sed 's/1/0/1')" "v$(echo "${ver}" | sed 's/1/0/1')"^{} -f -a -m "$(cat "./-changelog.md")" # edit tag
# git push origin master --tags -f

pause 'Press [Enter] to pushing the repository...'
git add .
git commit -m "$ver"
git push origin master
