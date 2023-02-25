# bash: make build

# All .js compiled into a single one.
outFile="/tmp/novaTube.user.js"
# BEGIN="   options: {"
# END="});"
# NEW="});"

# example of searching in a directory listing
# find . -type f -name "*.txt" ! -path "./Movies/*" ! -path "./Music/*" ! -iname "secret.txt"

# Descriptions of code cleanup methods
# IN build:
# inside in @find
# find logo.js -type f -exec sed -n '/   options: {/q;p' | xargs cat > 1.txt
# remove settings options "   options: {" to end file
# find logo.js -type f | xargs sed -n '/   options: {/q;p' > 1.txt
# remove "desc:" line (sed)
# find logo.js -type f | sed '/\'title:/d' | xargs sed '/desc:/d' > 1.txt
# remove "'title:" line (grep)
# find logo.js -type f | xargs grep -v 'desc:' > 1.txt
# AFTER build:
# in vscode
# 1. clear in-comment regex - "//\s.*|/\*[\s\S\n]*?\*/"
# 2. process "
# 3. final clear multiple-newline regex - "^\n{2,}"

build:
	rm -f $(outFile)

   # manual copy-add
	cat ./UserScript/meta.js > $(outFile)

	cat ./UserScript/check-browser-support.js >> $(outFile)

	# add plugins container
	echo -e 'window.nova_plugins = [];' >> $(outFile)

	# collecting all plugins and cleaning them
	@find ./plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "plugin_example.js" | xargs sed "/'title:/d" | grep -v 'desc:' | sed -e "/   options: {/,/});/c\});" >> $(outFile)
	# failed attempt to use variables
	# @find ./plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "plugin_example.js" | xargs sed "/'title:/d" | grep -v 'desc:' | sed -e "/BEGIN/,/END/c\NEW" >> $(outFile)

	# only collection without cleaning
	# @find ./plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "plugin_example.js" | xargs cat >> $(outFile)

	cat ./js/plugins.js | sed -e "/   list\:/,/   run: (/c\   run: ({ user_settings, app_ver }) => {" >> $(outFile)
	# cat ./js/plugins.js >> $(outFile)

	cat ./UserScript/user.js >> $(outFile)

	VSCodium.AppImage $(outFile)
	# xdg-open $(outFile)
