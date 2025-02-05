// derived from https://github.com/dnek/nicovideo-comfortable-controller-fader
const comfortableControllerFader = () => {
    const baseStyleEl = GM_addStyle(`
        div[data-styling-id=":r3:"]:has(> div[data-styling-id=":r4:"]) {
            cursor: none;
            > div[data-styling-id=":r4:"] {
                opacity: 0;
                pointer-events: none;
                &:hover {
                    opacity: 1;
                    pointer-events: auto;
                }
            }
        }
        `);

    const mouseMovingStyleEl = GM_addStyle(`
        div[data-styling-id=":r3:"]:has(> div[data-styling-id=":r4:"]) {
            cursor: auto;
            > div[data-styling-id=":r4:"] {
                opacity: 1;
                pointer-events: auto;
            }
        }
        `);
    mouseMovingStyleEl.disabled = true;

    let timeoutID;

    const initFader = () => {
        const controllerEl = document.querySelector('div[data-styling-id=":r3:"] > div[data-styling-id=":r4:"]');
        if (controllerEl === null) {
            return;
        }

        controllerEl.setAttribute('nccf-controller', '');

        const enableMouseMovingStyle = () => {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                mouseMovingStyleEl.disabled = true;
            }, 2000);
            mouseMovingStyleEl.disabled = false;
        };

        enableMouseMovingStyle();

        const playerEl = controllerEl.parentElement;

        playerEl.addEventListener('mousemove', enableMouseMovingStyle);

        playerEl.addEventListener('mouseleave', () => {
            clearTimeout(timeoutID);
            mouseMovingStyleEl.disabled = true;
        });

        console.log('nicovideo-comfortable-controller-fader is added.');
    };

    setInterval(() => {
        if (document.querySelector('div[nccf-controller]') === null) {
            initFader();
        }
    }, 100);
};

(() => {
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

    // When exitFullscreen is prevented, the controller does not disappear until mousemove.
    comfortableControllerFader();
})();
