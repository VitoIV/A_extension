document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired.');

  const btnKeep = document.getElementById('btnKeep');
  const btnOpen = document.getElementById('btnOpen');
  const btnEdit = document.getElementById('btnEdit');
  const btnImage = document.getElementById('btnImage');
  const btnP = document.getElementById('btnP');
  const imgKeep = document.getElementById('imgKeep');
  const imgOpen = document.getElementById('imgOpen');
  const inputText = document.getElementById('inputText');
  const btnPreview = document.getElementById('btnPreview');
  const imgPreview = document.getElementById('imgPreview');

  let keepOn = localStorage.getItem('keepOn') === 'true';
  let openOn = localStorage.getItem('openOn') === 'true';
  console.log(`Loaded openOn from localStorage: ${openOn}`);

  let editDisabled = localStorage.getItem('editDisabled') === 'true'; 
  let imageDisabled = localStorage.getItem('imageDisabled') === 'true'; 
  let pDisabled = localStorage.getItem('pDisabled') === 'true'; 

  let previewOn = localStorage.getItem('previewOn') === 'true';
  
  btnEdit.disabled = editDisabled; 
  btnP.disabled = pDisabled; 
  btnImage.disabled = imageDisabled; 

  if (editDisabled) { 
    btnEdit.classList.add('disabled'); 
  } 
  if (pDisabled) { 
    btnP.classList.add('disabled'); 
  } 
  if (imageDisabled) { 
    btnImage.classList.add('disabled'); 
  } 

  if (keepOn && openOn) {
      keepOn = false;
      openOn = false;
      localStorage.setItem('keepOn', 'false');
      localStorage.setItem('openOn', 'false');
      console.log('Both buttons were on. Resetting both to false.');
  }

  updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
  updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');
  updateButtonState(btnPreview, imgPreview, previewOn, 'icons/preview_on.png', 'icons/preview_off.png');

  updateEditAndPState(openOn);

  console.log(`Initial KeepOn: ${keepOn}, OpenOn: ${openOn}`);

  inputText.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      console.log('Enter key pressed. Triggering CZ button click.');
      document.getElementById('btnCZ').click();
    }
  });

  btnPreview.addEventListener('click', function() {
    console.log('Preview button clicked.');
    previewOn = !previewOn;

    if (previewOn) {
      console.log('Preview mode is now ON');
      keepOn = true;
      updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
      localStorage.setItem('keepOn', 'true');
      console.log('Keep mode enabled as a requirement for Preview mode.');

      btnEdit.classList.add('disabled');
      btnImage.classList.add('disabled');
      btnP.classList.add('disabled');
      btnEdit.disabled = true;
      btnImage.disabled = true;
      btnP.disabled = true;
      localStorage.setItem('editDisabled', 'true');
      localStorage.setItem('imageDisabled', 'true');
      localStorage.setItem('pDisabled', 'true');
    } else {
      console.log('Preview mode is now OFF');
      keepOn = false;
      updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
      localStorage.setItem('keepOn', 'false');
      console.log('Keep mode disabled because Preview mode is OFF.');

      btnEdit.classList.remove('disabled');
      btnImage.classList.remove('disabled');
      btnP.classList.remove('disabled');
      btnEdit.disabled = false;
      btnImage.disabled = false;
      btnP.disabled = false;
      localStorage.setItem('editDisabled', 'false');
      localStorage.setItem('imageDisabled', 'false');
      localStorage.setItem('pDisabled', 'false');
    }

    updateButtonState(btnPreview, imgPreview, previewOn, 'icons/preview_on.png', 'icons/preview_off.png');
    localStorage.setItem('previewOn', previewOn ? 'true' : 'false');
  });

  btnKeep.addEventListener('click', function() {
    console.log('Keep button clicked.');
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
    console.log('Open button clicked.');
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
    updateEditAndPState(openOn);
  });

  function updateButtonState(button, img, isOn, onSrc, offSrc) {
    console.log(`Updating button state: ${button.id}, State: ${isOn}`);
    button.classList.toggle('on', isOn);
    button.classList.toggle('off', !isOn);
    img.src = isOn ? onSrc : offSrc;
  }

  function updateEditAndPState(openOn) {
    console.log(`Updating Edit and P button states. OpenOn: ${openOn}`);
    if (openOn) {
      console.log('Disabling Edit and P buttons.');
      btnEdit.classList.add('disabled');
      btnP.classList.add('disabled');
      btnEdit.disabled = true;
      btnP.disabled = true;
      btnEdit.title = "Nejde použít v novém okně";
      btnP.title = "Nejde použít v novém okně";
      localStorage.setItem('editDisabled', 'true'); 
      localStorage.setItem('pDisabled', 'true'); 
    } else {
      console.log('Enabling Edit and P buttons.');
      btnEdit.classList.remove('disabled');
      btnP.classList.remove('disabled');
      btnEdit.disabled = false;
      btnP.disabled = false;
      btnEdit.title = "";
      btnP.title = "";
      localStorage.setItem('editDisabled', 'false'); 
      localStorage.setItem('pDisabled', 'false'); 
    }
  }

  function handleButtonClick(action) {
    console.log('Handling button click. PreviewOn:', previewOn);
    if (previewOn) {
      redirectToPreview(); 
    } else {
      action(); 
    }

    const openInNewTab = localStorage.getItem('openOn') === 'true';
    if (!keepOn && !openInNewTab) {
      console.log('Closing extension window.');
      window.close();
    } else if (keepOn) {
      console.log('Keeping window open due to keepOn being true.');
    }
  }

  function redirectTo(tld) {
    const inputTextValue = document.getElementById('inputText').value.trim();
    console.log(`Redirecting to: ${tld}, Input: ${inputTextValue}`);
    if (inputTextValue) {
      const isCategory = /^\d{8}$/.test(inputTextValue);
      const redirectUrl = isCategory
        ? `https://www.alza.${tld}/${inputTextValue}.htm`
        : `https://alza.${tld}/kod/${inputTextValue}`;
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
      alert('První zadej kód produktu nebo kategorii.');
    }
  }

  document.getElementById('btnCZ').addEventListener('click', function() {
    console.log('CZ button clicked.');
    handleButtonClick(() => redirectTo('cz'));
  });
  document.getElementById('btnSK').addEventListener('click', function() {
    console.log('SK button clicked.');
    handleButtonClick(() => redirectTo('sk'));
  });
  document.getElementById('btnDE').addEventListener('click', function() {
    console.log('DE button clicked.');
    handleButtonClick(() => redirectTo('de'));
  });
  document.getElementById('btnAT').addEventListener('click', function() {
    console.log('AT button clicked.');
    handleButtonClick(() => redirectTo('at'));
  });
  document.getElementById('btnHU').addEventListener('click', function() {
    console.log('HU button clicked.');
    handleButtonClick(() => redirectTo('hu'));
  });

  document.getElementById('btnEdit').addEventListener('click', function() {
    console.log('Edit button clicked.');
    redirectToAdmin('edit');
  });
  document.getElementById('btnImage').addEventListener('click', function() {
    console.log('Image button clicked.');
    redirectToGallery();
  });
  document.getElementById('btnP').addEventListener('click', function() {
    console.log('P button clicked.');
    redirectToParameter();
  });

  function redirectToAdmin(endpoint) {
    const inputTextValue = document.getElementById('inputText').value.trim();
    console.log(`Redirecting to admin. Input: ${inputTextValue}, Endpoint: ${endpoint}`);
    if (inputTextValue) {
      const redirectUrl = `https://alza.cz/kod/${inputTextValue}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      console.log(`Redirecting to admin with URL: ${redirectUrl}`);

      const handleRedirection = (tabId) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (changeInfo.status === 'complete') {
            chrome.tabs.get(tabId, function(tab) {
              const url = tab.url;
              const match = url.match(/d(\d+)\.htm/) || url.match(/[?&]dq=(\d+)/);
              if (match) {
                const extractedCode = match[1];
                const adminUrl = `https://adminv2.alza.cz/commodity-to-process/${extractedCode}/legend`;
                console.log(`Redirecting to admin page: ${adminUrl}`);
                chrome.tabs.update(tabId, { url: adminUrl });
                chrome.tabs.onUpdated.removeListener(listener);
              }
            });
          }
        });
      };

      if (openInNewTab) {
        chrome.tabs.create({ url: redirectUrl }, function(tab) {
          handleRedirection(tab.id);
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const currentTabId = tabs[0].id;
          chrome.tabs.update(currentTabId, { url: redirectUrl }, function() {
            handleRedirection(currentTabId);
          });
        });
      }
    } else {
      alert('První zadej kód produktu nebo kategorii.');
    }
  }

  function redirectToParameter() {
    const inputTextValue = document.getElementById('inputText').value.trim();
    console.log(`Redirecting to parameter page. Input: ${inputTextValue}`);
    if (inputTextValue) {
      const redirectUrl = `https://alza.cz/kod/${inputTextValue}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      console.log(`Redirecting to parameter page: ${redirectUrl}`);

      const handleRedirection = (tabId) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (changeInfo.status === 'complete') {
            chrome.tabs.get(tabId, function(tab) {
              const url = tab.url;
              const match = url.match(/d(\d+)\.htm/) || url.match(/[?&]dq=(\d+)/);
              if (match) {
                const extractedCode = match[1];
                const parameterUrl = `https://adminv2.alza.cz/commodity-parameter/${extractedCode}/main`;
                console.log(`Redirecting to parameter page: ${parameterUrl}`);
                chrome.tabs.update(tabId, { url: parameterUrl });
                chrome.tabs.onUpdated.removeListener(listener);
              }
            });
          }
        });
      };

      if (openInNewTab) {
        chrome.tabs.create({ url: redirectUrl }, function(tab) {
          handleRedirection(tab.id);
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const currentTabId = tabs[0].id;
          chrome.tabs.update(currentTabId, { url: redirectUrl }, function() {
            handleRedirection(currentTabId);
          });
        });
      }
    } else {
      alert('První zadej kód produktu nebo kategorii.');
    }
  }

  function redirectToGallery() {
    const inputTextValue = document.getElementById('inputText').value.trim();
    console.log(`Redirecting to gallery. Input: ${inputTextValue}`);
    if (inputTextValue) {
      const galleryUrl = `https://adminv2.alza.cz/commodity-to-process/${inputTextValue}/gallery`;
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
      alert('První zadej kód produktu nebo kategorii.');
    }
  }

  function redirectToPreview() {
    const inputTextValue = document.getElementById('inputText').value.trim();
    console.log(`Redirecting to preview. Input: ${inputTextValue}`);

    if (inputTextValue) {
      const initialUrl = `https://alza.cz/kod/${inputTextValue}`;
      const openInNewTab = localStorage.getItem('openOn') === 'true';

      console.log(`Redirecting to initial URL: ${initialUrl}`);

      const handlePreviewRedirection = (tabId) => {
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
          if (updatedTabId === tabId && changeInfo.status === 'complete') {
            chrome.tabs.get(tabId, function(tab) {
              const url = tab.url;
              console.log(`Loaded URL: ${url}`);
              const match = url.match(/d(\d+)\.htm/) || url.match(/[?&]dq=(\d+)/);
              if (match) {
                const extractedNumber = match[1];
                const baseUrl = url.split('?')[0];
                const previewUrl = `${baseUrl}?dpgpreview=${extractedNumber}`;
                console.log(`Redirecting to preview URL: ${previewUrl}`);
                chrome.tabs.update(tabId, { url: previewUrl });
                chrome.tabs.onUpdated.removeListener(listener);
              } else {
                console.error('No matching pattern found in URL for preview.');
              }
            });
          }
        });
      };

      if (openInNewTab) {
        chrome.tabs.create({ url: initialUrl }, function(tab) {
          handlePreviewRedirection(tab.id);
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const currentTabId = tabs[0].id;
          chrome.tabs.update(currentTabId, { url: initialUrl }, function() {
            handlePreviewRedirection(currentTabId);
          });
        });
      }
    } else {
      alert('První zadej kód produktu nebo kategorii.');
    }
  }

  fetch(chrome.runtime.getURL('version.txt'))
  .then(response => response.text())
  .then(currentVersion => {
    currentVersion = currentVersion.trim();
    console.log(`Current version: ${currentVersion}`);
    checkForNewVersion(currentVersion);
  })
  .catch(error => console.error('Error fetching version.txt:', error));

async function checkForNewVersion(currentVersion) {
  try {
    const response = await fetch('https://api.github.com/repos/VitoIV/A_extension/releases/latest');
    const data = await response.json();
    let latestVersion = data.tag_name;

    if (latestVersion.startsWith('v')) {
      latestVersion = latestVersion.substring(1);
    }

    console.log(`Current version: ${currentVersion}, Latest version: ${latestVersion}`);

    if (latestVersion !== currentVersion) {
      displayUpdateNotification(latestVersion);
    }
  } catch (error) {
    console.error('Error fetching the latest version:', error);
  }
}

function displayUpdateNotification(latestVersion) {
  console.log('Displaying update notification.');
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <p>Je k dispozici nová verze!</p>
    <div class="button-group">
      <a href="https://github.com/VitoIV/A_extension/archive/refs/tags/v${latestVersion}.zip" target="_blank">Stáhnout</a>
      <a href="https://github.com/VitoIV/A_extension" target="_blank">GitHub</a>
      <a href="#" id="closeNotification">Zavřít</a>
    </div>
  `;

  document.body.appendChild(notification);

  document.getElementById('closeNotification').addEventListener('click', function() {
    console.log('Close notification button clicked.');
    if (confirm('Opravdu už nechcete tuto zprávu zobrazovat? \nDalší aktualizace bude třeba provést manuálně.')) {
      localStorage.setItem('hideUpdateNotification', 'true');
      notification.remove();
    }
  });
}

  let storedShortcuts = {};

  initShortcuts();
  document.addEventListener("keydown", onGlobalKeyDown);

  async function initShortcuts() {
    storedShortcuts = await loadShortcutsFromStorage();
    console.log("Loaded shortcuts:", storedShortcuts);
  }

  async function loadShortcutsFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.sync.get("shortcuts", (data) => {
        if (data.shortcuts) {
          resolve(data.shortcuts);
        } else {
          resolve({});
        }
      });
    });
  }
  function onGlobalKeyDown(e) {
    const combo = parseKeyEvent(e);
    const matchedButtonId = Object.keys(storedShortcuts).find(
      (btnId) => storedShortcuts[btnId] === combo
    );

    if (matchedButtonId) {
      e.preventDefault();
      console.log(`Shortcut for ${matchedButtonId} triggered.`);
      const targetButton = document.getElementById(matchedButtonId);
      if (targetButton) {
        targetButton.click();
      }
    }
  }
  function parseKeyEvent(e) {
    const keys = [];
    if (e.ctrlKey) keys.push("Ctrl");
    if (e.altKey) keys.push("Alt");
    if (e.shiftKey) keys.push("Shift");
    let mainKey = e.key.toUpperCase();

    if (mainKey === " ") mainKey = "Space";
    if (mainKey.startsWith("ARROW")) {
      mainKey = mainKey.replace("ARROW", "Arrow");
    }
    if (["CONTROL", "SHIFT", "ALT"].includes(mainKey)) {
      mainKey = "";
    }

    if (mainKey) keys.push(mainKey);
    return keys.join("+");
  }
});
