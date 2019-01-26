const Storage = function () {
   const nameApp = chrome.runtime.getManifest().short_name;
   let saveParams = {};

   return {
      setParams: (x = required(), sync_type) => {
         let storageArea = sync_type === 'sync' ? chrome.storage.sync : chrome.storage.local;

         storageArea.clear();
         saveParams[nameApp] = x;
         storageArea.set(saveParams, () => chrome.runtime.lastError && console.log(chrome.runtime.lastError));
      },

      getParams: (callback, sync_type, x) => {
         let storageArea = sync_type === 'sync' ? chrome.storage.sync : chrome.storage.local;

         storageArea.get(x, items => {
            // console.log('saveParams '+JSON.stringify(items));
            let item = items[nameApp] && items[nameApp][items] ? items[nameApp][items] : items[nameApp] || items;
            chrome.runtime.lastError ? console.log(chrome.runtime.lastError) : callback(item);
         })
      },
   }
}();

chrome.storage.onChanged.addListener((changes, namespace) => {
   for (const key in changes) {
      const storageChange = changes[key];
      //   console.log('Storage key "%s" in namespace "%s" changed. ' +
      //               'Old value was "%s", new value is "%s".',
      console.log('("%s") "%s" : "%s" => "%s"', key, namespace,
         JSON.stringify(storageChange.oldValue),
         JSON.stringify(storageChange.newValue));
   }
});
