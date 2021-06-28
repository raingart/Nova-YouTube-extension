# start in bash: make compile

# All .js compiled into a single one.
compiled="./-all-plugins.js"

# example of searching in a directory listing
# find . -type f -name "*.txt" ! -path "./Movies/*" ! -path "./Downloads/*" ! -path "./Music/*"

compile:
	@find ./plugins/*/ -type f -name "*.js" ! -iname "-*" ! -iname "_blank_plugin.js" | xargs cat > $(compiled)
