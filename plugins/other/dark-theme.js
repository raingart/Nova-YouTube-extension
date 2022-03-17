window.nova_plugins.push({
   id: 'dark-theme',
   title: 'Dark Theme',
   'title:zh': '黑暗主题',
   'title:ja': '暗いテーマ',
   'title:ko': '어두운 테마',
   'title:es': 'Tema oscuro',
   'title:pt': 'Tema escuro',
   'title:fr': 'Thème sombre',
   'title:tr': 'Karanlık Tema',
   'title:de': 'Dunkles Thema',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Warn! Do not use unnecessarily',
   'desc:zh': '警告！ 不要不必要地使用',
   'desc:ja': '暖かい！ 不必要に使用しないでください',
   'desc:ko': '경고하다! 불필요하게 사용하지 마십시오',
   'desc:es': '¡Advertir! no lo use innecesariamente',
   'desc:pt': 'Avisar! não use desnecessariamente',
   'desc:fr': 'Prévenir! Ne pas utiliser inutilement',
   'desc:tr': 'Uyarmak! gereksiz yere kullanmayınız',
   'desc:de': 'Warnen! nicht unnötig verwenden',
   _runtime: user_settings => {

      // NOVA.cookie.set('PREF', 'f6=400'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f6', value: 40000400 });

   },
});
