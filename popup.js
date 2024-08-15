document.addEventListener('DOMContentLoaded', function() {
  const btnKeep = document.getElementById('btnKeep');
  const btnOpen = document.getElementById('btnOpen');
  const imgKeep = document.getElementById('imgKeep');
  const imgOpen = document.getElementById('imgOpen');

  let keepOn = localStorage.getItem('keepOn') === 'true';
  let openOn = localStorage.getItem('openOn') === 'false';

  updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
  updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');

  btnKeep.addEventListener('click', function() {
    keepOn = !keepOn;
    updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
    localStorage.setItem('keepOn', keepOn ? 'true' : 'false');
  });

  btnOpen.addEventListener('click', function() {
    openOn = !openOn;
    updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');
    localStorage.setItem('openOn', openOn ? 'true' : 'false');
  });

  btnKeep.addEventListener('mouseenter', function() {
    btnKeep.title = keepOn ? "Rozšíření se nebude zavírat." : "Rozšíření se bude zavírat.";
  });

  btnOpen.addEventListener('mouseenter', function() {
    btnOpen.title = openOn ? "Odkaz bude otevřen na nové kartě." : "Odkaz bude otevřen na současné kartě.";
  });

  const inputText = document.getElementById('inputText');

  function handleButtonClick(action) {
    action();
    if (!keepOn) {
      window.close();
    }
  }

  document.getElementById('btnCZ').addEventListener('click', function() {
    handleButtonClick(() => redirectTo('cz'));
  });

  document.getElementById('btnSK').addEventListener('click', function() {
    handleButtonClick(() => redirectTo('sk'));
  });

  document.getElementById('btnDE').addEventListener('click', function() {
    handleButtonClick(() => redirectTo('de'));
  });

  document.getElementById('btnAT').addEventListener('click', function() {
    handleButtonClick(() => redirectTo('at'));
  });

  document.getElementById('btnHU').addEventListener('click', function() {
    handleButtonClick(() => redirectTo('hu'));
  });

  document.getElementById('btnEdit').addEventListener('click', function() {
    handleButtonClick(() => redirectToAdmin('legend'));
  });

  document.getElementById('btnImage').addEventListener('click', function() {
    handleButtonClick(() => redirectToGallery());
  });

  document.getElementById('btnP').addEventListener('click', function() {
    handleButtonClick(() => redirectToParameter());
  });

  function updateButtonState(button, img, isOn, onSrc, offSrc) {
    button.classList.toggle('on', isOn);
    button.classList.toggle('off', !isOn);
    img.src = isOn ? onSrc : offSrc;
  }

  function redirectTo(tld) {
    const inputText = document.getElementById('inputText').value;
    if (inputText) {
      const redirectUrl = `https://alza.${tld}/kod/${inputText}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      if (openInNewTab) {
        chrome.tabs.create({ url: redirectUrl });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.update(tabs[0].id, { url: redirectUrl });
        });
      }
    } else {
      alert('První zadej kód produktu.');
    }
  }

  function redirectToAdmin(endpoint) {
    const inputText = document.getElementById('inputText').value;
    if (inputText) {
      const redirectUrl = `https://alza.cz/kod/${inputText}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      if (openInNewTab) {
        chrome.tabs.create({ url: redirectUrl }, function(tab) {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === 'complete') {
              const url = tab.url;
              const match = url.match(/d(\d+)\.htm/);
              if (match) {
                const extractedCode = match[1];
                const adminUrl = `https://adminv2.alza.cz/commodity-to-process/${extractedCode}/${endpoint}`;
                chrome.tabs.update(tab.id, { url: adminUrl });
                chrome.tabs.onUpdated.removeListener(listener);
              }
            }
          });
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.update(tabs[0].id, { url: redirectUrl });
        });
      }
    } else {
      alert('První zadej kód produktu.');
    }
  }

  function redirectToParameter() {
    const inputText = document.getElementById('inputText').value;
    if (inputText) {
      const redirectUrl = `https://alza.cz/kod/${inputText}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      if (openInNewTab) {
        chrome.tabs.create({ url: redirectUrl });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.update(tabs[0].id, { url: redirectUrl });
        });
      }
    } else {
      alert('První zadej kód produktu.');
    }
  }

  function redirectToGallery() {
    const inputText = document.getElementById('inputText').value;
    if (inputText) {
      const galleryUrl = `https://adminv2.alza.cz/commodity-to-process/${inputText}/gallery`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      if (openInNewTab) {
        chrome.tabs.create({ url: galleryUrl });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.update(tabs[0].id, { url: galleryUrl });
        });
      }
    } else {
      alert('První zadej kód produktu.');
    }
  }
});
