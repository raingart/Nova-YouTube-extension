// 'use strict';

console.log(i18n("app_name") + ": init opt.js");

var _plugins = [];

Plugins.load.direct(Plugins.list_plugins.sandbox.concat(Plugins.list_plugins.direct))

const Opt = {

   // DEBUG: true,

   plugins_: {

      conteiner: '#plugins',

      showTable: () => {
         Opt.log('showTable _plugins: %s', JSON.stringify(_plugins));
         for (const plugin of _plugins) {
            console.log('plugin %s', plugin.name);

            let li = document.createElement("li");
            li.className = "item";

            li.innerHTML = '<div class="info">\
   <label for="' + plugin.id + '" tooltip="' + plugin.desc + '" flow="up">' + plugin.name + '\
      <i>v.' + plugin.version + '</i>\
      <!--<span>group: ' + plugin.depends_page + '</span>\
      <span>' + plugin.desc + '</span>-->\
   </label>\
</div>\
<div class="opt" tooltip="ON/OFF" flow="left">\
   <input type="checkbox" name="' + plugin.id + '" id="' + plugin.id + '" />\
</div>';

            let p = Opt.plugins_.conteiner;
            p += plugin.group ? '> #' + plugin.group.toString().toLowerCase() : '> #other';

            /**/
            if (plugin.export_opt)
               li.appendChild(
                  document.createElement("li")
                  .appendChild(
                     Opt.UI.combine_html_opt(plugin.export_opt, plugin.id)
                  )
               );

            document.querySelector(p).appendChild(li);
         }
      },

   },

   UI: {
      toggleListView: (hideElms, activeElm, activeClass) => {
         // hide all
         Array.from(document.querySelectorAll(hideElms))
            .forEach((i) => i.classList.remove(activeClass));

         // target show
         Array.from(document.querySelectorAll(activeElm))
            .forEach((i) => i.classList.add(activeClass));

      },

      combine_html_opt: (tags, id) => {
         let outHTML = document.createElement('ul');
         outHTML.setAttribute('data-dependent', '{"' + id + '":[true]}');

         for (const elm in tags) {
            // console.log('elm %s', JSON.stringify(elm));
            // console.log('tags[elm] %s', JSON.stringify(tags[elm]));
            let values = tags[elm];

            if (!values.name) {
               console.warn('tag "%s" not has name...skiping', elm);
               continue;
            }

            let tagHTML_conteiner = document.createElement('li');
            let tagHTML = document.createElement(elm);

            for (const attr in values) {
               // console.log('attr %s', JSON.stringify(attr));
               // console.log('values[attr] %s', JSON.stringify(values[attr]));
               let value = values[attr];

               switch (attr) {
                  case 'options':
                     // for (const option of value) {
                     value.forEach((option) => {
                        let optionHTML = document.createElement('option');
                        optionHTML.setAttribute('value', option.value);
                        optionHTML.innerHTML = option.label;
                        if (option.selected) optionHTML.setAttribute('selected', true);
                        tagHTML.appendChild(optionHTML);
                     });
                     // }
                     break;

                  case 'label':
                     let label = document.createElement(attr);
                     label.innerHTML = value;
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

   eventListener: (elm /*, callback*/ ) => {
      // appearance map
      Array.from(document.querySelectorAll(elm))
         .forEach((i) => {
            i.addEventListener('click', function (event) {
               // event.preventDefault();
               Opt.UI.toggleListView(
                  Opt.plugins_.conteiner + ' > *',
                  Opt.plugins_.conteiner + '>#' + this.id,
                  'active'
               );
               document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
            }, false);
         });

      // link show_all_plugins
      Array.from(document.querySelectorAll("#show_all_plugins"))
         .forEach((dependentItem) => {
            dependentItem.addEventListener('click', (event) => {
               event.preventDefault();
               Opt.UI.toggleListView(
                  Opt.plugins_.conteiner + ' > *',
                  Opt.plugins_.conteiner + ' > *',
                  'active'
               );
               document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
            }, false);
         });

      // Array.from(document.querySelectorAll(/*Opt.conteiner +*/ "#plugins> ul"))
      //    .forEach((ul) => {
      //       document.getElementById(ul.getAttribute('id')).addEventListener('click', (event) => {
      //          ul.classList.toggle("collapse")
      //          event.preventDefault();
      //          ul.querySelectorAll("li").forEach(li => li.classList.toggle("hide"));
      //       }, false);
      //    });

   },

   init: () => {
      Opt.eventListener(".appearance > *");
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


// function sendMessage (message) {
//    chrome.runtime.sendMessage({ action: message }, (response) => {
//      console.log('MessageResponse: ', response)
//    })
//  }

//  const actionElements = document.getElementsByClassName('action')

//  for (const key in actionElements) {
//    const action = actionElements[key]
//    action.onclick = () => sendMessage(action.id)
//  }

//  window.onkeyup = function (e) {
//    if (e.shiftKey || e.ctrlKey) {
//      return
//    }

// let message;
// switch (e.key) {
//    case 'a':
//       message = 'sortByAge';
//       break;
//    case 'u':
//       message = 'sortByUrl';
//       break;
//    case 'd':
//       message = 'sortByNumDomain';
//       break;
//    case 'r':
//       message = 'reverseSort';
//       break;

//    default:
//       return;
//       // break;
//    sendMessage(message);
// }
//  }
