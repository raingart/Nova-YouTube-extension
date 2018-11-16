_plugins.push({
   name: 'AutoHide Navigation Panel',
   id: 'hide-navigation-panel',
   // group: '',
   depends_page: 'channel',
   // sandbox: true,
   desc: '',
   version: '0.1',
   runtime: function (data) {

      PolymerYoutube.waitFor('#guide', function (element) {
         // console.log('#guide', element);
         // console.log('#guide', document.getElementById('guide').hasAttribute("opened"));
         // If the element has a attribute, delete it
         setTimeout(() => {
            if (element.hasAttribute("opened")) {
               // console.log('#guide is opened');
               element.removeAttribute("opened");
            }
         }, 100);
      });

   }
});
