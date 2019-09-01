let YOUTUBE_API_KEYS = [];

// no internet connection
let interval_update_keys = setInterval(() => {
   if (YOUTUBE_API_KEYS.length) clearInterval(interval_update_keys);
   else update_YOUTUBE_API_KEYS();
}, 60 * 1000); // 1 mins

function update_YOUTUBE_API_KEYS() {
   fetch('https://gist.githubusercontent.com/raingart/c685f14d7186a8c9bf009a83b41d1f66/raw/youtube_api_keys.json')
      .then(res => res.json())
      .then(data => YOUTUBE_API_KEYS = data)
      .then(() => console.log('get keys:', JSON.stringify(YOUTUBE_API_KEYS)))
      .catch(error => console.error(error))
}

// init
update_YOUTUBE_API_KEYS();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   console.log('onMessage request: %s', JSON.stringify(request.action || request));

   // const sendMessage_ = out => chrome.tabs.query({url: "*://www.youtube.com/*"}, tabs => // need "permissions": ["tabs"]
   const sendMessage_ = out => chrome.tabs.query({ "currentWindow": true }, tabs =>
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, out)));

   switch (request.action || request) {
      case 'setOptions': break;

      case 'get_YOUTUBE_API_KEYS':
         sendMessage_({
            action: 'YOUTUBE_API_KEYS',
            options: YOUTUBE_API_KEYS,
         });
         break;

      default:
         console.warn('onMessage default', request);
   }
});
