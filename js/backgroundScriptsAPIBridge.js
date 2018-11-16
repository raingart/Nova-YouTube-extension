console.log(i18n("app_name") + ": init Background.js");

const Background = {
   // sessionSettings: null,

   getStorageData: (function () {
      Storage.getParams(null /*all*/ , (res) => {
         console.log('confStorage: %s', JSON.stringify(res));
         Background.sessionSettings = res;
      }, true /* true=sync, false=local */ );
   }()),

   // onMessage: function (request, sender, sendResponse) {
   //    console.log('> sender %s', JSON.stringify(sender));
   //    console.log('> sendResponse %s', JSON.stringify(sendResponse));

   //    switch (sender.action) {
   //       case 'getOptions':
   //          // chrome.tabs.sendMessage((request.tab && request.tab.id), {
   //          chrome.tabs.sendMessage(request.tab.id, {
   //             action: 'setOptions',
   //             options: Background.sessionSettings
   //          }, (response) => {
   //             console.log(sender.action);
   //          });
   //          break;

   //       case 'setOptions':
   //          Background.sessionSettings = sender.options;
   //          //from alls tabs
   //          chrome.tabs.query({}, function (tabs) {
   //             for (const tab of tabs) {
   //                chrome.tabs.sendMessage(tab.id, {
   //                   action: 'setOptions',
   //                   options: sender.options
   //                });
   //             }
   //          });
   //          break;

   //          // case 'injectSript':
   //          //    chrome.tabs.executeScript((sender.tab && sender.tab.id), {
   //          //       file: sender.src,
   //          //       allFrames: false
   //          //    }, (response) => {});
   //          //    break;
   //          // default:
   //    }

   // },

   // getPageType: (url) => {
   //    let page = url.split('/')[1];
   //    return (page == 'channel' || page == 'user') ? 'channel' : page;
   // },

   // Register the event handlers.
   eventListener: (function () {
      // chrome.runtime.onMessage.addListener(this.onMessage);
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
         console.log('> request %s', JSON.stringify(request));
         // console.log('> sender %s', JSON.stringify(sender));
         // console.log('> sendResponse %s', JSON.stringify(sendResponse));

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
               let source = {
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
               
               // default:
         }

      });

      // // Listen for when a Tab changes state
      // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      //    // console.log('onUpdated');
      //    if (changeInfo && changeInfo.status == "complete") {
      //       console.log("Tab updated: %s", tab.url);

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
      //       //    Background.log('result bg %s', JSON.stringify(result))
      //       // });
      //    }
      // });
   }()),

   // init: () => {
   //    console.log('Background: init');
   // },
}

// Background.init();
