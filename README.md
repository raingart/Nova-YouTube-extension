# Nova YouTube-extension
[![ver.](https://img.shields.io/chrome-web-store/v/miiheelkbegpkflplpmmkidaklfgjecb.svg?style=flat-square)](https://chrome.google.com/webstore/detail/miiheelkbegpkflplpmmkidaklfgjecb)

Combine small plugins, expanding the possibilities of YouTube.

The extension is based on the plugin files themselves. The rest of the files only serve them.
- ease of extensibility
- low probability of conflict with other extensions.

![Nova YouTube-extension](https://lh3.googleusercontent.com/NUJv5yIT-6NUT7YiBgkNu8kCULGkbG8YL3XXjNiB_Q3XW87rvfyYDbPj55u2RTqJihtX_94Y=w640-h400-e365)

## Installation
[Download the extension from the Chrome store.](https://chrome.google.com/webstore/detail/miiheelkbegpkflplpmmkidaklfgjecb)(It's free.)

OR

You can now load the extension into your browser through the browser's extension tools page:
1. Download the script
2. Type `chrome://extensions` in your address bar to bring up the extensions page.
3. Enable __Developer Mode__ (checkbox)
4. Click the "Load unpacked extension" button, navigate to the build folder of your local extension instance, and click "OK". Or drag the script folder onto the extensions page.

OR

Userscript [openuserjs](https://openuserjs.org/scripts/raingart/Nova_YouTube).

## Bilder
**Only for Unix shell**. All output will be in the `/tmp/` directory.

**Extensions**: `$ ./package-extensions.sh`

**Userscript**: `$ make build`

### File structure
The extension is based on plugin files. The remaining files only serve them.

* [/js/loader.js](https://github.com/raingart/Nova-YouTube-extension/tree/master/js/loader.js) - initial loading and connection of plugins.
* [/js/plugins.js](https://github.com/raingart/Nova-YouTube-extension/blob/master/js/plugins.js) - a list of all plugins and their module to run them.
* [/js/optionsBilder.js](https://github.com/raingart/Nova-YouTube-extension/blob/master/js/optionsBilder.js) - generator of plugins configuration file.
* [/js/libs/](https://github.com/raingart/Nova-YouTube-extension/blob/master/js/libs) - directory of internal components of the extension. Not used by plugins, only by the extension itself.
* [/plugins/common-lib.js](https://github.com/raingart/Nova-YouTube-extension/blob/master/plugins/common-lib.js) - common library for all plugins.
* [/plugins/](https://github.com/raingart/Nova-YouTube-extension/tree/master/plugins) - directory of all plugins and files available for connection to the YouTube page.
  * [plugin example](https://github.com/raingart/Nova-YouTube-extension/blob/master/plugins/_blank_plugin.js) - file use to understand basic functions
