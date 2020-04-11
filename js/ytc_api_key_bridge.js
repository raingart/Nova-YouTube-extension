// also change "APIKeysStoreName" in file '/js/background.js', '/plugins/ytc_lib.js'
const APIKeysStoreName = 'YOUTUBE_API_KEYS';

// set youtubeApiKeys
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (chrome.runtime.id != sender.id) return;
   console.log('onMessage request: %s', JSON.stringify(request.action || request));
   if (request.action === APIKeysStoreName) {
      console.log(`get and save ${APIKeysStoreName} in localStorage`, JSON.stringify(request.options));
      localStorage.setItem(APIKeysStoreName, JSON.stringify(request.options));
   }
});

chrome.runtime.sendMessage('REQUESTING_' + APIKeysStoreName);
