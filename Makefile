# bash: make compile

# All .js compiled into a single one.
compiled="/tmp/superNova-userscript.js"

# example of searching in a directory listing
# find . -type f -name "*.txt" ! -path "./Movies/*" ! -path "./Downloads/*" ! -path "./Music/*"

compile:
   # header
	cat ./UserScript/meta.js > $(compiled)
	# isolate start
	echo -e '(() => {' >> $(compiled)
	# plugins conteiner
	echo -e '_plugins_conteiner = [];' >> $(compiled)
	# all plugins
	@find ./plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "_blank_plugin.js" | xargs cat >> $(compiled)
	cat ./js/plugins.js >> $(compiled)
	# UserScript code
	cat ./UserScript/user.js >> $(compiled)
	# isolate end
	echo -e '})();' >> $(compiled)
	xdg-open $(compiled)
