window.nova_plugins.push({
   id: 'subscriptions-home',
   title: 'Redirect from home page to subscriptions page',
   'title:zh': '从主页重定向到订阅页面',
   'title:ja': 'ホーム ページからサブスクリプション ページへのリダイレクト',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   'title:pt': 'Redirecionar da página inicial para a página de assinaturas',
   // 'title:fr': 'Redirection de la page d'accueil vers la page d'abonnements',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   'title:pl': 'Przekieruj ze strony głównej na stronę subskrypcji',
   // 'title:ua': '',
   run_on_pages: 'home', // NOVA.currentPage == 'home'
   restart_on_location_change: true,
   section: 'header',
   // desc: '',
   'data-conflict': 'page-logo',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/475942-youtube-recommendations-be-gone-cleaner-youtube

      location.pathname = '/feed/subscriptions';

   },
});
