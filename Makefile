# bash: make build

# All .js compiled into a single one.
outFile="/tmp/novaTube.user.js"

# example of searching in a directory listing
# find . -type f -name "*.txt" ! -path "./Movies/*" ! -path "./Downloads/*" ! -path "./Music/*"

build:
	rm -f $(outFile)

	cat ./UserScript/meta.js > $(outFile)

	cat ./UserScript/check-browser-support.js >> $(outFile)

	# plugins container
	echo -e 'window.nova_plugins = [];' >> $(outFile)
	# all plugins
	@find ./plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "_blank_plugin.js" | xargs cat >> $(outFile)
	# unsuccessful attempt to delete settings options:
	# cp -r ./plugins/ /tmp/plugins/
	# @find /tmp/plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "_blank_plugin.js" -exec sed -i '/options: {/$d' {} +
	# @find /tmp/plugins/* -type f -name "*.js" ! -iname "-*" ! -iname "_blank_plugin.js" -exec sh -c "echo '});' >> {}" \;
	cat ./js/plugins.js >> $(outFile)

	cat ./UserScript/user.js >> $(outFile)

	xdg-open $(outFile)
