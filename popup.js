document.addEventListener('DOMContentLoaded', function() {
  const btnKeep = document.getElementById('btnKeep');
  const btnOpen = document.getElementById('btnOpen');
  const imgKeep = document.getElementById('imgKeep');
  const imgOpen = document.getElementById('imgOpen');
  const inputText = document.getElementById('inputText');

  let keepOn = localStorage.getItem('keepOn') === 'true';
  let openOn = localStorage.getItem('openOn') === 'true';

  if (keepOn && openOn) {
    keepOn = false;
    openOn = false;
    localStorage.setItem('keepOn', 'false');
    localStorage.setItem('openOn', 'false');
    console.log('Both buttons were on. Resetting both to false.');
  }

  updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
  updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');

  console.log(`Initial KeepOn: ${keepOn}, OpenOn: ${openOn}`);

  btnKeep.addEventListener('click', function() {
    keepOn = !keepOn;
    if (keepOn) {
      openOn = false;
      updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');
      localStorage.setItem('openOn', 'false');
      console.log('Keep button turned on, Open button turned off.');
    } else {
      console.log('Keep button turned off.');
    }
    updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
    localStorage.setItem('keepOn', keepOn ? 'true' : 'false');
  });

  btnOpen.addEventListener('click', function() {
    openOn = !openOn;
    if (openOn) {
      keepOn = false;
      updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
      localStorage.setItem('keepOn', 'false');
      console.log('Open button turned on, Keep button turned off.');
    } else {
      console.log('Open button turned off.');
    }
    updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');
    localStorage.setItem('openOn', openOn ? 'true' : 'false');
  });

  function updateButtonState(button, img, isOn, onSrc, offSrc) {
    button.classList.toggle('on', isOn);
    button.classList.toggle('off', !isOn);
    img.src = isOn ? onSrc : offSrc;
  }

  function handleButtonClick(action) {
    action();
    const openInNewTab = localStorage.getItem('openOn') === 'true';
    if (!keepOn && !openInNewTab) {
      console.log('Closing extension window.');
      window.close();
    }
  }

  document.getElementById('btnCZ').addEventListener('click', function() {
    console.log("Button CZ clicked.");
    handleButtonClick(() => redirectTo('cz'));
  });

  inputText.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      console.log("Enter pressed, simulating CZ button click.");
      document.getElementById('btnCZ').click();
    }
  });

  document.getElementById('btnSK').addEventListener('click', function() {
    console.log("Button SK clicked.");
    handleButtonClick(() => redirectTo('sk'));
  });

  document.getElementById('btnDE').addEventListener('click', function() {
    console.log("Button DE clicked.");
    handleButtonClick(() => redirectTo('de'));
  });

  document.getElementById('btnAT').addEventListener('click', function() {
    console.log("Button AT clicked.");
    handleButtonClick(() => redirectTo('at'));
  });

  document.getElementById('btnHU').addEventListener('click', function() {
    console.log("Button HU clicked.");
    handleButtonClick(() => redirectTo('hu'));
  });

  document.getElementById('btnEdit').addEventListener('click', function() {
    console.log("Button Edit clicked.");
    handleButtonClick(() => redirectToAdmin('legend'));
  });

  document.getElementById('btnImage').addEventListener('click', function() {
    console.log("Button Image clicked.");
    handleButtonClick(() => redirectToGallery());
  });

  document.getElementById('btnP').addEventListener('click', function() {
    console.log("Button P clicked.");
    handleButtonClick(() => redirectToParameter());
  });

  function redirectTo(tld) {
    const inputText = document.getElementById('inputText').value;
    if (inputText) {
      const redirectUrl = `https://alza.${tld}/kod/${inputText}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      console.log(`Redirecting to: ${redirectUrl} (New tab: ${openInNewTab})`);

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

      console.log(`Redirecting to admin with URL: ${redirectUrl}`);

      if (openInNewTab) {
        chrome.tabs.create({ url: redirectUrl }, function(tab) {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === 'complete') {
              const url = tab.url;
              const match = url.match(/d(\d+)\.htm/);
              if (match) {
                const extractedCode = match[1];
                const adminUrl = `https://adminv2.alza.cz/commodity-to-process/${extractedCode}/${endpoint}`;
                console.log(`Redirecting to admin page: ${adminUrl}`);
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

      console.log(`Redirecting to parameter page: ${redirectUrl}`);

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

      console.log(`Redirecting to gallery page: ${galleryUrl}`);

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
