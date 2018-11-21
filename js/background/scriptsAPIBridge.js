console.log(i18n("app_name") + ": init Background.js");

const Background = {
   // sessionSettings: null,

   getStorageData: (function () {
      Storage.getParams(null /*all*/ , (res) => {
         console.log('confStorage:', JSON.stringify(res));
         Background.sessionSettings = res;
      }, true /* true=sync, false=local */ );
   }()),

   // onMessage: function (request, sender, sendResponse) {
   // },

   // getPageType: (url) => {
   //    let page = url.split('/')[1];
   //    return (page == 'channel' || page == 'user') ? 'channel' : page;
   // },

   // Register the event handlers.
   eventListener: (function () {
      // chrome.runtime.onMessage.addListener(this.onMessage);
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
         console.log('> request', JSON.stringify(request));
         // console.log('> sender', JSON.stringify(sender));
         // console.log('> sendResponse', JSON.stringify(sendResponse));

         switch (request.action) {
            case 'getOptions':
               // chrome.tabs.sendMessage((request.tab && request.tab.id), {
               chrome.tabs.sendMessage(sender.tab.id, {
                  action: 'setOptions',
                  options: Background.sessionSettings
               }, (response) => {
                  // console.log(request.action);
               });
               break;

            case 'setOptions':
               Background.sessionSettings = request.options;
               //from alls tabs
               chrome.tabs.query({}, function (tabs) {
                  for (const tab of tabs) {
                     chrome.tabs.sendMessage(tab.id, {
                        action: 'setOptions',
                        options: request.options
                     });
                  }
               });
               break;

            case 'injectScript':
               source = {
                  allFrames: false
               };
               if (request.src) source.file = request.src;
               else if (request.code) source.code = request.code;

               // chrome.tabs.executeScript(sender.tab.id, source, function (response) {});
               // tabs.forEach(tab => {
               chrome.tabs.executeScript(sender.tab.id, source, result => {
                  const lastErr = chrome.runtime.lastError;
                  if (lastErr) console.log('tab: ' + sender.tab.id + ' lastError: ' + JSON.stringify(lastErr));
               });
               //   });
               break;

               // case 'injectStyle':
               //    source = {
               //       allFrames: false
               //    };
               //    if (request.src) source.file = request.src;
               //    else if (request.code) source.code = request.code;

               //    chrome.tabs.insertCSS(sender.tab.id, source, result => {
               //       const lastErr = chrome.runtime.lastError;
               //       if (lastErr) console.log('tab: ' + sender.tab.id + ' lastError: ' + JSON.stringify(lastErr));
               //    });
               //    break;

               // default:
         }
      });

      // // Listen for when a Tab changes state
      // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      //    // console.log('onUpdated');
      //    if (changeInfo && changeInfo.status == "complete") {
      //       console.log("Tab updated:", tab.url);

      //       // if (Background.getPageType(tab.url) == "channel") {
      //       chrome.tabs.sendMessage(tabId, {
      //          action: 'tabUpdated',
      //          options: tab.url
      //       }, (response) => {});
      //       // }

      //       // chrome.tabs.executeScript(
      //       //    tabId, {
      //       //    file: '/js/inject.js'
      //       // }, function (result) {
      //       //    Background.log('result bg', JSON.stringify(result))
      //       // });
      //    }
      // });
   }()),

   // init: () => {
   //    console.log('Background: init');
   // },
}

// Background.init();
