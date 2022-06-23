const i18n = msg => chrome.i18n.getMessage(msg);

function localizePage() {
   let html = document.getElementsByTagName('html')[0];
   html.innerHTML = internationalize(html.innerHTML);

   function internationalize(name) {
      return name.replace(/__MSG_(\w+)__/g, (m, key) => i18n(key) || `{i18n: ${key}}`);
   }
}

window.addEventListener('DOMContentLoaded', localizePage);
