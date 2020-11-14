console.debug("init optionsView.js");

// plugins conteiner
let _plugins = [];

// load all Plugins
Plugins.load([].concat(...Object.values(Plugins.list)));

const Opt = {
   // DEBUG: true,

   generate: {

      cssSelector: '#plugins',

      list() {
         Opt.log('list _plugins:', JSON.stringify(_plugins));

         _plugins.forEach(plugin => {
            try {
               Opt.log('plugin load:', plugin.name);

               let li = document.createElement("li");
               li.className = "item";

               li.innerHTML = '<div class="info"' +
                  (plugin.desc ? ' tooltip="' + plugin.desc + '" flow="up"' : '') + '>' +
                  `<label for="${plugin.id}">${plugin.name}</label>` +
                  `<a href="https://github.com/raingart/New-Horizons-for-YouTube-extension/wiki/plugin-specifications#${plugin.id}" target=”_blank” title="More info">?</a>` +
                  (plugin.api_key_dependency ?
                     ' <b tooltip="use your [API key] for stable work" flow="left"><span style="font-size: initial;">⚠️</span></b> ' : '') +
                  `</div><div class="opt"><input type="checkbox" name="${plugin.id}" id="${plugin.id}" /></div>`;

               if (plugin.opt_export)
                  li.appendChild(
                     document.createElement("li")
                        .appendChild(this.options(plugin.opt_export, plugin.id))
                  );

               const pl_selector = '>#' + plugin.section.toString().toLowerCase();
               let p = this.cssSelector;

               p += plugin.section && document.querySelector(p + pl_selector) ? pl_selector : '>#other';

               document.querySelector(p).appendChild(li);

            } catch (err) {
               console.error('Error plugin generate:', (plugin?.id || '\n' + JSON.stringify(plugin)), '\n' + err);
               Opt.DEBUG && alert(plugin?.id + '\n' + err.slice(25));
            }
         });
      },

      options(obj, id) {
         let outHTML = document.createElement('ul');
         outHTML.setAttribute('data-dependent', `{"${id}":[true]}`);

         for (const key in obj) {
            Opt.log('obj[name]', JSON.stringify(obj[key]));
            let property = obj[key];

            if (!property._elementType) {
               console.warn(`tag "${property}" not has _elementType...skiping`);
               continue;
            }

            let tagConteiner = document.createElement('li');
            let tag_ = document.createElement(property._elementType);

            property.name = key;
            property.id = key;
            delete property._elementType;

            if (property['data-dependent']) {
               // tagConteiner.setAttribute('data-dependent', '{\"'+ id +'\":[true]}');
               tagConteiner.setAttribute("data-dependent", property['data-dependent']);
               // tag_.setAttribute('data-dependent', property['data-dependent']);
               delete property['data-dependent'];
            }

            if (property.hasOwnProperty('title')) {
               tagConteiner.setAttribute("tooltip", property.title);
               delete property.title;
            }

            for (const attr in property) {
               // console.debug('attr', JSON.stringify(attr));
               // console.debug('values[attr]', JSON.stringify(values[attr]));
               const value = property[attr];

               switch (attr) {
                  case 'options':
                     value.forEach(option => {
                        let optionHTML = document.createElement('option');
                        optionHTML.setAttribute('value', option.value);
                        optionHTML.textContent = option.label;
                        if (option.selected) optionHTML.setAttribute('selected', true);
                        tag_.appendChild(optionHTML);
                     });
                     break;

                  case 'label':
                     let label = document.createElement(attr);
                     label.innerHTML = '<font>↪</font>' + value;
                     label.htmlFor = property.name;
                     tagConteiner.appendChild(label);
                     // tagConteiner.insertAdjacentHTML("beforeend", '<label>' + value + '</label>');
                     break;

                  default:
                     tag_.setAttribute(attr, value);
                     break;
               };
            }

            outHTML
               .appendChild(tagConteiner)
               .appendChild(tag_);
         }
         return outHTML;
      },

   },

   UI: {
      toggleListView(hideElms, activeElms, activeClass = required()) {
         // hide all
         if (hideElms) [...document.querySelectorAll(hideElms)].forEach(i => i.classList.remove(activeClass));

         // target show
         if (activeElms) [...document.querySelectorAll(activeElms)].forEach(i => i.classList.add(activeClass));

      },

      // outerHTML: node => node.outerHTML || new XMLSerializer().serializeToString(node),
   },

   eventListener() {
      // appearance map
      [...document.querySelectorAll(".appearance > *")]
         .forEach(el => {
            // group is empty
            if (document.querySelector(this.generate.cssSelector + `>#${el.id}:empty`)) {
               el.classList.add('empty');

            } else {
               // add click event
               el.addEventListener('click', event => {
                  // event.preventDefault();
                  this.UI.toggleListView(
                     this.generate.cssSelector + '> *',
                     this.generate.cssSelector + '>#' + el.id, //event.target.id <- error
                     'active'
                  );
                  this.UI.toggleListView(this.generate.cssSelector + ' > *', null, 'collapse');
                  this.UI.toggleListView(this.generate.cssSelector + ' .item', null, 'hide');
                  document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
               });
            }
         });

      // link show_all_plugins
      document.getElementById("show_all_plugins")
         .addEventListener('click', event => {
            event.preventDefault();
            this.UI.toggleListView(
               this.generate.cssSelector + ' > *',
               this.generate.cssSelector + ' > *',
               'active'
            );
            // unset collapse state
            this.UI.toggleListView(this.generate.cssSelector + ' > *', null, 'collapse');
            this.UI.toggleListView(this.generate.cssSelector + ' li.item', null, 'hide');
            document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
         });

      // spoler
      [...document.querySelectorAll(this.generate.cssSelector + '> *')]
         .forEach(ul => ul.addEventListener('click', event => {
            // event.preventDefault();
            event.target.classList.toggle("collapse")
            event.target.querySelectorAll("li.item").forEach(li => li.classList.toggle("hide"));
         }));

   },

   init() {
      this.generate.list();
      this.eventListener();

      // remove API info
      Storage.getParams(store => {
         if (!store['custom-api-key']) return;
         [...document.querySelectorAll('.info b')].forEach(el => el.parentNode.removeChild(el));
      }, 'sync');
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   }
}


window.addEventListener('load', event => {
   const UI = {
      search: document.getElementById('search'),
      generatelist: document.querySelector(Opt.generate.cssSelector),
   };

   // search bar
   ["change", "keyup"]
      .forEach(event => {
         UI.search.addEventListener(event, () => searchFilter({
            'keyword': UI.search.value,
            // 'container': UI.generatelist.children,
            // 'container':  UI.generatelist.getElementsByTagName('li'),
            'container': UI.generatelist.querySelectorAll('li.item'),
            'filterChildTagName': 'label'
         }));
      });

   Opt.init();
});


function searchFilter({keyword, container, filterChildTagName}) {
   // console.debug('searchFilter:', JSON.stringify(...arguments));

   for (const item of container) {
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

   function highlightSearchTerm(target, keyword = required(), highlightClass) {
      // fix
      let content = target.innerHTML,
         pattern = new RegExp('(>[^<.]*)?(' + keyword + ')([^<.]*)?', 'gi'),
         replaceWith = '$1<mark ' + (highlightClass ? 'class="' + highlightClass + '"' : 'style="background-color:#afafaf"') + '>$2</mark>$3',
         marked = content.replace(pattern, replaceWith);

      return (target.innerHTML = marked) !== content;
   }
}
