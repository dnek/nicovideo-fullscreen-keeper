const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
document.documentElement.appendChild(script);
console.log('nicovideo-fullscreen-keeper injected.');
script.remove();
