// ==UserScript==
// @namespace       https://github.com/raingart/Nova-YouTube-extension/
// @name            Nova YouTube
// @version         0.12.1
// @description     Make YouTube be better

// @author          raingart
// @license         Apache-2.0
// @icon            https://raw.github.com/raingart/Nova-YouTube-extension/master/icons/48.png

// @homepageURL     https://github.com/raingart/Nova-YouTube-extension
// @supportURL      https://github.com/raingart/Nova-YouTube-extension/issues
// @contributionURL https://www.patreon.com/raingart

// @updateURL       https://openuserjs.org/meta/raingart/Nova_YouTube.meta.js
// @downloadURL     https://openuserjs.org/src/scripts/raingart/Nova_YouTube.user.js

// @include         http*://*.youtube.com/*
// @include         http*://*.youtube-nocookie.com/*
// @include         http*://raingart.github.io/options.html*
// @exclude         http*://www.youtube.com/*/*.xml*
// @exclude         http*://www.youtube.com/error
// @exclude         http*://music.youtube.com/*
// @exclude         http*://accounts.youtube.com/*

// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_getResourceURL
// @grant           GM_addValueChangeListener
// @grant           GM_removeValueChangeListener
// @grant           GM_listValues
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_notification
// @grant           GM_openInTab
// @run-at          document-start

// @compatible      chrome >=80 Violentmonkey,Tampermonkey
// @compatible      firefox >=74 Tampermonkey
// ==/UserScript==
/*jshint esversion: 6 */
