// ==UserScript==
// @name        nicovideo-fullscreen-keeper
// @namespace   https://github.com/dnek
// @version     1.0
// @author      dnek
// @description ニコニコ動画の連続再生で次の動画へ行くときにフルスクリーンが解除されるのを防ぎます。
// @homepageURL https://github.com/dnek/nicovideo-fullscreen-keeper
// @updateURL   https://github.com/dnek/nicovideo-fullscreen-keeper/raw/main/nicovideo-fullscreen-keeper.user.js
// @downloadURL https://github.com/dnek/nicovideo-fullscreen-keeper/raw/main/nicovideo-fullscreen-keeper.user.js
// @match       https://www.nicovideo.jp/watch/*
// @grant       none
// @license     MIT license
// ==/UserScript==

(async () => {
    'use strict';

    let lastHref = location.href;

    const originalExitFullscreen = Document.prototype.exitFullscreen;
    const preventExitFullscreen = () => {
        console.log('exitFullscreen() prevented.');
    };

    const updateExitFullscreen = () => {
        const url = new URL(lastHref);
        const params = new URLSearchParams(url.search);
        if (params.get('rf') === 'nvpc') {
            Document.prototype.exitFullscreen = preventExitFullscreen;
            console.log('preventExitFullscreen enabled.');
        } else {
            Document.prototype.exitFullscreen = originalExitFullscreen;
            console.log('originalExitFullscreen enabled.');
        }
    };

    const observer = new MutationObserver(() => {
        const newHref = location.href;
        if (lastHref !== newHref) {
            lastHref = newHref;
            console.log('href changed:', newHref);

            updateExitFullscreen();
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true,
    });
})();
