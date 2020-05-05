const Storage = function () {
   const nameApp = chrome.runtime.getManifest().short_name;
   let saveParams = {};

   return {
      setParams(x = required(), sync_type) {
         let storageArea = sync_type === 'sync' ? chrome.storage.sync : chrome.storage.local;

         storageArea.clear();
         saveParams[nameApp] = x;
         storageArea.set(saveParams, () => chrome.runtime.lastError && console.log(chrome.runtime.lastError));
      },

      getParams(callback, sync_type, x) {
         let storageArea = sync_type === 'sync' ? chrome.storage.sync : chrome.storage.local;

         storageArea.get(x, prefs => {
            // console.log('saveParams '+JSON.stringify(prefs));
            let item = prefs[nameApp] && prefs[nameApp][prefs] ? prefs[nameApp][prefs] : prefs[nameApp] || prefs;
            chrome.runtime.lastError ? console.log(chrome.runtime.lastError) : callback(item);
         })
      },
   }
}();

chrome.storage.onChanged.addListener((changes, namespace) => {
   Object.entries(changes).forEach(([key, value]) => {
      console.log('("%s") "%s" : "%s" => "%s"', key, namespace,
         JSON.stringify(value.oldValue),
         JSON.stringify(value.newValue));
   });
});
