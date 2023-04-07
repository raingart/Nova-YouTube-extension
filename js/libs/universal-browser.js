// const browser = (typeof chrome !== 'undefined') ? chrome : browser;
typeof browser === 'undefined' && (browser = chrome);
