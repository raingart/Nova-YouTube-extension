console.log(i18n("app_name") + ": init optionsView.js");

// plugins conteiner
let _plugins = [];

// load all Plugins
Plugins.load([].concat(...Object.values(Plugins_list)));

const Opt = {
   // DEBUG: true,

   plugins_: {

      conteiner: '#plugins',

      showTable() {
         Opt.log('showTable _plugins:', JSON.stringify(_plugins));

         _plugins.forEach(plugin => {
            try {
               Opt.log('plugin load:', plugin.name);

               let li = document.createElement("li");
               li.className = "item";

               li.innerHTML = '<div class="info"' +
                  (plugin.desc ? ' tooltip="' + plugin.desc + '" flow="up"' : '') + '>' +
                  `<label for="${plugin.id}">${plugin.name}</label>` +
                  `<a href="https://github.com/raingart/New-Horizons-for-YouTube-extension/wiki/plugin-specifications#${plugin.id}" target=”_blank” title="More info">?</a>` +
                  (plugin.api_key_dependent ? ' <b tooltip="Youtube API key required" flow="left">API</b> ' : '') +
                  `</div><div class="opt"><input type="checkbox" name="${plugin.id}" id="${plugin.id}" /></div>`;

               if (plugin.export_opt)
                  li.appendChild(
                     document.createElement("li")
                        .appendChild(Opt.UI.combine_html_opt(plugin.export_opt, plugin.id))
                  );

               const pl_selector = '>#' + plugin.section.toString().toLowerCase();
               let p = Opt.plugins_.conteiner;

               p += plugin.section && document.querySelector(p + pl_selector) ? pl_selector : '>#other';

               document.querySelector(p).appendChild(li);

            } catch (err) {
               console.error('error:', err);
               console.warn(JSON.stringify(plugin));
               // alert(plugin.name\n + err.slice(25));
            }
         });
      },

   },

   UI: {
      toggleListView(hideElms, activeElm, activeClass = required()) {
         // hide all
         if (hideElms) [...document.querySelectorAll(hideElms)].forEach(i => i.classList.remove(activeClass));

         // target show
         if (activeElm) [...document.querySelectorAll(activeElm)].forEach(i => i.classList.add(activeClass));

      },

      combine_html_opt(tags, id) {
         let outHTML = document.createElement('ul');
         outHTML.setAttribute('data-dependent', `{"${id}":[true]}`);

         for (const name in tags) {
            Opt.log('tags[name]', JSON.stringify(tags[name]));
            let property = tags[name];

            if (!property._elementType) {
               console.warn(`tag "${property}" not has _elementType...skiping`);
               continue;
            }

            let tagHTML_conteiner = document.createElement('li');
            let tagHTML = document.createElement(property._elementType);

            property.name = name;
            property.id = name;
            delete property._elementType;

            if (property['data-dependent']) {
               // tagHTML_conteiner.setAttribute('data-dependent', '{\"'+ id +'\":[true]}');
               tagHTML_conteiner.setAttribute("data-dependent", property['data-dependent']);
               // tagHTML.setAttribute('data-dependent', property['data-dependent']);
               delete property['data-dependent'];
            }

            if (property.hasOwnProperty('title')) {
               tagHTML_conteiner.setAttribute("tooltip", property.title);
               delete property.title;
            }

            for (const attr in property) {
               // console.log('attr', JSON.stringify(attr));
               // console.log('values[attr]', JSON.stringify(values[attr]));
               const value = property[attr];

               switch (attr) {
                  case 'options':
                     value.forEach(option => {
                        let optionHTML = document.createElement('option');
                        optionHTML.setAttribute('value', option.value);
                        optionHTML.textContent = option.label;
                        if (option.selected) optionHTML.setAttribute('selected', true);
                        tagHTML.appendChild(optionHTML);
                     });
                     break;

                  case 'label':
                     let label = document.createElement(attr);
                     label.innerHTML = '<font>↪</font>' + value;
                     label.htmlFor = property.name;
                     tagHTML_conteiner.appendChild(label);
                     // tagHTML_conteiner.insertAdjacentHTML("beforeend", '<label>' + value + '</label>');
                     break;

                  default:
                     tagHTML.setAttribute(attr, value);
                     break;
               };
            }

            outHTML
               .appendChild(tagHTML_conteiner)
               .appendChild(tagHTML);
         }
         return outHTML;
      },

      outerHTML: node => node.outerHTML || new XMLSerializer().serializeToString(node),
   },

   eventListener() {
      // appearance map
      [...document.querySelectorAll(".appearance > *")].forEach(al => {
         // test plugins is empty
         if (document.querySelector(this.plugins_.conteiner + `>#${al.id}:empty`)) {
            al.classList.add('empty');

         } else {
            // add click event
            al.addEventListener('click', event => {
               // event.preventDefault();
               this.UI.toggleListView(
                  this.plugins_.conteiner + '> *',
                  this.plugins_.conteiner + '>#' + al.id, //event.target.id <- error
                  'active'
               );
               this.UI.toggleListView(this.plugins_.conteiner + ' > *', null, 'collapse');
               this.UI.toggleListView(this.plugins_.conteiner + ' .item', null, 'hide');
               document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
            });
         }
      });

      // link show_all_plugins
      document.getElementById("show_all_plugins")
         .addEventListener('click', event => {
            event.preventDefault();
            this.UI.toggleListView(
               this.plugins_.conteiner + ' > *',
               this.plugins_.conteiner + ' > *',
               'active'
            );
            // unset collapse state
            this.UI.toggleListView(this.plugins_.conteiner + ' > *', null, 'collapse');
            this.UI.toggleListView(this.plugins_.conteiner + ' li.item', null, 'hide');
            document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
         });

      // spoler
      [...document.querySelectorAll(this.plugins_.conteiner + '> *')]
         .forEach(ul => ul.addEventListener('click', event => {
            // event.preventDefault();
            event.target.classList.toggle("collapse")
            event.target.querySelectorAll("li.item").forEach(li => li.classList.toggle("hide"));
         }));

   },

   apiKeyDependent_lockCheckbox(store) {
      // console.log('store:', JSON.stringify(store));
      [...document.querySelectorAll('li.item')].forEach(li => {
         const APIKeysStoreName = 'YOUTUBE_API_KEYS';
         let el = li.querySelector('.info b');
         if (el && !store['custom-api-key'] && !JSON.parse(localStorage.getItem(APIKeysStoreName))?.length) {
            console.warn('Youtube API Key is missing');
            if (li.querySelector('input').checked) li.querySelector('input').click();
            li.querySelector('.opt').setAttribute('tooltip', "Need Youtube API key");
            li.querySelector('.opt').setAttribute('flow', "left");

            li.querySelector('input').setAttribute('disabled', true);
            li.querySelector('label').setAttribute('for', 'tab_3');
         }
      });

   },

   init() {
      this.plugins_.showTable();
      this.eventListener();
      Storage.getParams(this.apiKeyDependent_lockCheckbox, 'local');
   },

   log(...agrs) {
      this.DEBUG && agrs?.length && console.log(...agrs);
   },
}


window.addEventListener('load', event => {
   const UI = {
      search: document.getElementById('search'),
      plugins_list: document.getElementById('plugins'),
   };

   // search
   ["change", "keyup"].forEach(event => {
      UI.search.addEventListener(event, () => searchFilter({
         'keyword': UI.search.value,
         // 'containers': UI.plugins_list.children,
         // 'containers':  UI.plugins_list.getElementsByTagName('li'),
         'containers': UI.plugins_list.querySelectorAll('li.item'),
         'filterChildTagName': 'label'
      }));
   });

   Opt.init();
});


function searchFilter({keyword, containers, filterChildTagName}) {
   // console.log('searchFilter:', ...arguments);

   for (const item of containers) {
      let text = item.textContent;
      let found = text.toLowerCase().includes(keyword.toLowerCase());
      let highlight = el => {
         el.innerHTML = el.innerHTML.replace(/<\/?mark[^>]*>/g, ''); // clear highlight tags
         if (found && keyword.toString().trim()) highlightSearchTerm(el, keyword);
      };

      // vision
      item.style.display = found ? '' : 'none';

      if (filterChildTagName) { // fix reset input status
         item.querySelectorAll(filterChildTagName).forEach(highlight);
      }
   }

   function highlightSearchTerm(container, keyword = required(), highlightClass) {
      // fix
      let content = container.innerHTML,
         pattern = new RegExp('(>[^<.]*)?(' + keyword + ')([^<.]*)?', 'gi'),
         replaceWith = '$1<mark ' + (highlightClass ? 'class="' + highlightClass + '"' : 'style="background-color:#afafaf"') + '>$2</mark>$3',
         marked = content.replace(pattern, replaceWith);

      return (container.innerHTML = marked) !== content;
   }
}
