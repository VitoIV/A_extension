document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired.');

  const btnKeep = document.getElementById('btnKeep');
  const btnOpen = document.getElementById('btnOpen');
  const btnCategory = document.getElementById('btnCategory');
  const btnEdit = document.getElementById('btnEdit');
  const btnImage = document.getElementById('btnImage');
  const btnP = document.getElementById('btnP');
  const imgKeep = document.getElementById('imgKeep');
  const imgOpen = document.getElementById('imgOpen');
  const imgCategory = document.getElementById('imgCategory');
  const inputText = document.getElementById('inputText');

  let keepOn = localStorage.getItem('keepOn') === 'true';
  let openOn = localStorage.getItem('openOn') === 'true';
  let categoryOn = localStorage.getItem('categoryOn') === 'true';

  if (keepOn && openOn) {
      keepOn = false;
      openOn = false;
      localStorage.setItem('keepOn', 'false');
      localStorage.setItem('openOn', 'false');
      console.log('Both buttons were on. Resetting both to false.');
  }

  updateButtonState(btnKeep, imgKeep, keepOn, 'icons/keep.png', 'icons/keep_off.png');
  updateButtonState(btnOpen, imgOpen, openOn, 'icons/open.png', 'icons/open_off.png');
  updateButtonState(btnCategory, imgCategory, categoryOn, 'icons/category.png', 'icons/category.png');
  updateEditAndPState(openOn);
  updateButtonsStateCategory(categoryOn);

  console.log(`Initial KeepOn: ${keepOn}, OpenOn: ${openOn}, CategoryOn: ${categoryOn}`);

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

  btnCategory.addEventListener('click', function() {
      console.log('Category button clicked.');
      categoryOn = !categoryOn;
      updateButtonState(btnCategory, imgCategory, categoryOn, 'icons/category.png', 'icons/category.png');
      localStorage.setItem('categoryOn', categoryOn ? 'true' : 'false');
      console.log(`Category button turned ${categoryOn ? 'on' : 'off'}.`);
      updateButtonsStateCategory(categoryOn);
  });

  function updateButtonState(button, img, isOn, onSrc, offSrc) {
      console.log(`Updating button state: ${button.id}, State: ${isOn}`);
      button.classList.toggle('on', isOn);
      button.classList.toggle('off', !isOn);
      img.src = onSrc;  
  }

  function updateEditAndPState(openOn) {
      console.log(`Updating Edit and P button states. OpenOn: ${openOn}`);
      if (openOn) {
          btnEdit.classList.add('disabled');
          btnP.classList.add('disabled');
          btnEdit.disabled = true;
          btnP.disabled = true;
          btnEdit.title = "Nejde použít v novém okně";
          btnP.title = "Nejde použít v novém okně";
      } else {
          btnEdit.classList.remove('disabled');
          btnP.classList.remove('disabled');
          btnEdit.disabled = false;
          btnP.disabled = false;
          btnEdit.title = "";
          btnP.title = "";
      }
  }

  function updateButtonsStateCategory(categoryOn) {
      console.log(`Updating buttons state for category. CategoryOn: ${categoryOn}`);
      if (categoryOn) {
          btnEdit.classList.add('disabled');
          btnImage.classList.add('disabled');
          btnP.classList.add('disabled');
          btnEdit.disabled = true;
          btnImage.disabled = true;
          btnP.disabled = true;
          btnEdit.title = "Nejdřív vypni otvírání kategorií";
          btnImage.title = "Nejdřív vypni otvírání kategorií";
          btnP.title = "Nejdřív vypni otvírání kategorií";
      } else {
          btnEdit.classList.remove('disabled');
          btnImage.classList.remove('disabled');
          btnP.classList.remove('disabled');
          btnEdit.disabled = false;
          btnImage.disabled = false;
          btnP.disabled = false;
          btnEdit.title = "";
          btnImage.title = "";
          btnP.title = "";
      }
  }

  function handleButtonClick(action) {
      console.log('Handling button click.');
      action();
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
          const redirectUrl = categoryOn ? `https://alza.${tld}/${inputTextValue}.htm` : `https://alza.${tld}/kod/${inputTextValue}`;
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
              const match = url.match(/d(\d+)\.htm/);
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
      alert('První zadej kód produktu.');
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
              const match = url.match(/d(\d+)\.htm/);
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
      alert('První zadej kód produktu.');
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
      alert('První zadej kód produktu.');
    }
  }

  /* fetch(chrome.runtime.getURL('version.txt'))
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

  const hideNotification = localStorage.getItem('hideUpdateNotification') === 'true';

  if (!hideNotification) {
    console.log('Displaying notification because it is not hidden.'); 
  }*/
});
