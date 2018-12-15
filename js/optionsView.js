console.log(i18n("app_name") + ": init opt.js");

Plugins.load((() => {
   let pl = [];
   for (i in Plugins_list) {
      for (p of Plugins_list[i]) pl.push(p);
   }
   return pl;
})());

const Opt = {

   // DEBUG: true,

   plugins_: {

      conteiner: '#plugins',

      showTable: () => {
         Opt.log('showTable _plugins: %s', JSON.stringify(_plugins));
         for (const plugin of _plugins) {
            try {
               console.log('plugin load:', plugin.name);

               let li = document.createElement("li");
               li.className = "item";

               li.innerHTML = '<div class="info" tooltip="' + plugin.desc + '" flow="up">\
   <label for="' + plugin.id + '">' + plugin.name + '\
      <!--\
      <i>v.' + plugin.version + '</i>\
      <span>section: ' + plugin.depends_page + '</span>\
      <span>' + plugin.desc + '</span>\
      -->\
   </label>\
</div>\
<div class="opt">\
   <input type="checkbox" name="' + plugin.id + '" id="' + plugin.id + '" />\
</div>';

               if (plugin.export_opt)
                  li.appendChild(
                     document.createElement("li")
                     .appendChild(
                        Opt.UI.combine_html_opt(plugin.export_opt, plugin.id)
                     )
                  );

               let p = Opt.plugins_.conteiner;

               p += plugin.section && document.querySelector(
                  p + '> #' + plugin.section.toString().toLowerCase()
               ) ? '> #' + plugin.section.toString().toLowerCase() : '>#other';

               document.querySelector(p).appendChild(li);

            } catch (err) {
               console.error('error:', err);
               console.warn(JSON.stringify(plugin));
            }
         }
      },

   },

   UI: {
      toggleListView: (hideElms, activeElm, activeClass) => {
         // hide all
         if (hideElms) Array.from(document.querySelectorAll(hideElms))
            .forEach((i) => i.classList.remove(activeClass));

         // target show
         if (activeElm) Array.from(document.querySelectorAll(activeElm))
            .forEach((i) => i.classList.add(activeClass));

      },

      combine_html_opt: (tags, id) => {
         let outHTML = document.createElement('ul');
         // outHTML.setAttribute('data-dependent', '{"' + id + '":[true]}');
         outHTML.setAttribute('data-dependent', '{\"' + id + '\":[true]}');

         for (const name in tags) {
            Opt.log('tags[name]', JSON.stringify(tags[name]));
            let property = tags[name];

            if (!property._elementType) {
               console.warn('tag "%s" not has _elementType...skiping', property);
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
               let value = property[attr];

               switch (attr) {
                  case 'options':
                     // for (const option of value) {
                     value.forEach((option) => {
                        let optionHTML = document.createElement('option');
                        optionHTML.setAttribute('value', option.value);
                        optionHTML.textContent = option.label;
                        if (option.selected) optionHTML.setAttribute('selected', true);
                        tagHTML.appendChild(optionHTML);
                     });
                     // }
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

      outerHTML: (node) => {
         return node.outerHTML || new XMLSerializer().serializeToString(node);
      },
   },

   eventListener: (el) => {
      // appearance map
      Array.from(document.querySelectorAll(el))
         .forEach((i) => {
            i.addEventListener('click', function (event) {
               // event.preventDefault();
               Opt.UI.toggleListView(
                  Opt.plugins_.conteiner + ' > *',
                  Opt.plugins_.conteiner + '>#' + this.id,
                  'active'
               );
               Opt.UI.toggleListView(Opt.plugins_.conteiner + ' > *', null, 'collapse');
               Opt.UI.toggleListView(Opt.plugins_.conteiner + ' .item', null, 'hide');
               document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
            });
         });

      // link show_all_plugins
      document.getElementById("show_all_plugins")
         .addEventListener('click', event => {
            event.preventDefault();
            Opt.UI.toggleListView(
               Opt.plugins_.conteiner + ' > *',
               Opt.plugins_.conteiner + ' > *',
               'active'
            );
            Opt.UI.toggleListView(Opt.plugins_.conteiner + ' > *', null, 'collapse');
            Opt.UI.toggleListView(Opt.plugins_.conteiner + ' li.item', null, 'hide');
            document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
         });

      // spoler
      Array.from(document.querySelectorAll(Opt.plugins_.conteiner + '> *'))
         .forEach(ul => {
            ul.addEventListener('click', event => {
               // event.preventDefault();
               event.target.classList.toggle("collapse")
               event.target.querySelectorAll("li.item").forEach(li => li.classList.toggle("hide"));
            }, false);
         });

   },

   init: () => {
      Opt.eventListener(".appearance > *:not(.empty)");
      Opt.plugins_.showTable();
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('[+] %s', msg);
      }
   },
}

window.addEventListener('load', (event) => {
   Opt.init();
});
