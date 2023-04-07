// const storageMethod = 'local';
const storageMethod = 'sync';

const Storage = function () {
   const nameApp = browser.runtime.getManifest().short_name;
   let saveParams = {};

   return {
      setParams(x = required(), sync_type) {
         let storageArea = (sync_type == 'sync') ? browser.storage.sync : browser.storage.local;

         storageArea.clear();
         saveParams[nameApp] = x;
         storageArea.set(saveParams, () => browser.runtime.lastError && console.error(browser.runtime.lastError));
      },

      getParams(callback, sync_type, x) {
         let storageArea = (sync_type == 'sync') ? browser.storage.sync : browser.storage.local;

         storageArea.get(x, prefs => {
            let item = prefs[nameApp] && prefs[nameApp][prefs] ? prefs[nameApp][prefs] : prefs[nameApp] || prefs;
            browser.runtime.lastError ? console.debug(browser.runtime.lastError) : callback(item);
         })
      },
   }
}();

browser.storage.onChanged.addListener((changes, namespace) => {
   Object.entries(changes)
      .forEach(([key, value]) => {
         console.debug('("%s") "%s" : "%s" => "%s"', key, namespace,
            JSON.stringify(value.oldValue),
            JSON.stringify(value.newValue));
      });
});
