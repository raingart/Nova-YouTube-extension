console.log(i18n("app_name") + ": init runtimeListener.js");

(function () {
   'use strict';

   // Check whether new version is installed
   chrome.runtime.onInstalled.addListener(function (details) {
      const manifest = chrome.runtime.getManifest();

      console.log('app ' + details.reason + ' ' + details.previousVersion + ' to ' + manifest.version);

      if (details.reason === 'install') {
         // var defaultSetting = {
         //    'showNotification': true,
         // }
         // Storage.setParams(defaultSetting, 'sync');

         chrome.runtime.openOptionsPage();
         // openNewTab('data:text/html, <html contenteditable>');

         // } else if (details.reason === 'update') {

      }

      function openNewTab (url = required(), isActiveTab) {
         chrome.tabs.create({
            url: url,
            selected: isActiveTab || false
         })
      }
   });
}());
