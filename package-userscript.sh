#!/bin/zsh
# Created by: raingart, muescha

# AFTER build in vscode
# 1. Clear comments. regex - "//\s.*|/\*[\s\S\n]*?\*/"
# 2. For clear spaces use "Format Document".
# 3. Replace "\n^\n+" to"\n"

# outFile="$TMPDIR/nova-tube.user.js"
outFile="nova-tube.user.js"
rm -f "$outFile"

fileArray=(
  "./Userscript/meta.js"
  "./Userscript/compatibility.js"
  "./Userscript/plugin-container.js"
)

# Include additional files from ./plugins, excluding those starting with "-"
while IFS= read -r -d '' file; do
    fileArray+=("$file")
done < <(find ./plugins -type f -name "*.js" ! -name "-*.js" -print0)


fileArray+=(
  "./js/plugins.js"
  "./Userscript/user.js"
)

{
  for file in "${fileArray[@]}"; do

    echo "Including file: $file" >&2  # Print the filename to the console (stderr)

    print ""
    print ""
    print "/* --------------- */"
    print "/* file: $file */"
    print "/* --------------- */"
    print ""
    cat "$file"  # Append the file content to the output file
  done
} > "$outFile"

# Print the output file path to the console
echo ""
echo "user file created:"
echo "$outFile"
