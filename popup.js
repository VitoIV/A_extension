document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('inputText');
  const btnCZ = document.getElementById('btnCZ');
  
   if (inputText && btnCZ) {
    inputText.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        btnCZ.click();
      }
    });

    btnCZ.addEventListener('click', function() {
      redirectTo('cz');
    });

    document.getElementById('btnSK').addEventListener('click', function() {
      redirectTo('sk');
    });
    document.getElementById('btnDE').addEventListener('click', function() {
      redirectTo('de');
    });
    document.getElementById('btnAT').addEventListener('click', function() {
      redirectTo('at');
    });
    document.getElementById('btnHU').addEventListener('click', function() {
      redirectTo('hu');
    });

    document.getElementById('btnEdit').addEventListener('click', function() {
      redirectToAdmin('legend');
    });
    document.getElementById('btnImage').addEventListener('click', function() {
      redirectToGallery();
    });
    document.getElementById('btnP').addEventListener('click', function() {
      redirectToParameter();
    });
    document.getElementById('btnIL').addEventListener('click', function() {
      redirectToAdmin('info-list');
    });
    document.getElementById('btnURL').addEventListener('click', function() {
      redirectToAdmin('producer-url');
    });
    document.getElementById('btnHelp').addEventListener('click', function() {
      alert('Bugy a dotazy směřujte prosím na Asanu nebo Skype: Vít Repka');
    });
  }
});

function redirectTo(tld) {
  const inputText = document.getElementById('inputText').value;
  if (inputText) {
    const redirectUrl = `https://alza.${tld}/kod/${inputText}`;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: redirectUrl }, function(tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            if (updatedTab.url.includes('d')) {
              const url = updatedTab.url;
              const match = url.match(/d(\d+)\.htm/);
              if (match) {
                const extractedCode = match[1];
                localStorage.setItem('extractedCode', extractedCode);
                console.log(`Redirect URL: ${redirectUrl}`);
                console.log(`Extracted Code: ${extractedCode}`);
                console.log(`Final URL: ${url}`);
                chrome.tabs.onUpdated.removeListener(listener);
              }
            }
          }
        });
      });
    });
  } else {
    alert('První zadej kód produktu.');
  }
}

function redirectToAdmin(endpoint) {
  const inputText = document.getElementById('inputText').value;
  if (inputText) {
    const redirectUrl = `https://alza.cz/kod/${inputText}`;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: redirectUrl }, function(tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
          if (tabId === tab.id && changeInfo.status === 'complete' && updatedTab.url.includes('d')) {
            const url = updatedTab.url;
            const match = url.match(/d(\d+)\.htm/);
            if (match) {
              const extractedCode = match[1];
              const adminUrl = `https://adminv2.alza.cz/commodity-to-process/${extractedCode}/${endpoint}`;
              console.log(`Redirect URL: ${redirectUrl}`);
              console.log(`Extracted Code: ${extractedCode}`);
              console.log(`Admin URL: ${adminUrl}`);
              chrome.tabs.update(tab.id, { url: adminUrl });
              chrome.tabs.onUpdated.removeListener(listener);
            }
          }
        });
      });
    });
  } else {
    alert('První zadej kód produktu.');
  }
}

function redirectToParameter() {
  const inputText = document.getElementById('inputText').value;
  if (inputText) {
    const redirectUrl = `https://alza.cz/kod/${inputText}`;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: redirectUrl }, function(tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
          if (tabId === tab.id && changeInfo.status === 'complete' && updatedTab.url.includes('d')) {
            const url = updatedTab.url;
            const match = url.match(/d(\d+)\.htm/);
            if (match) {
              const extractedCode = match[1];
              const paramUrl = `https://adminv2.alza.cz/commodity-parameter/${extractedCode}/main`;
              console.log(`Redirect URL: ${redirectUrl}`);
              console.log(`Extracted Code: ${extractedCode}`);
              console.log(`Parameter URL: ${paramUrl}`);
              chrome.tabs.update(tab.id, { url: paramUrl });
              chrome.tabs.onUpdated.removeListener(listener);
            }
          }
        });
      });
    });
  } else {
    alert('První zadej kód produktu.');
  }
}

function redirectToGallery() {
  const inputText = document.getElementById('inputText').value;
  if (inputText) {
    const galleryUrl = `https://adminv2.alza.cz/commodity-to-process/${inputText}/gallery`;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: galleryUrl }, function(tab) {
        console.log(`Gallery URL: ${galleryUrl}`);
      });
    });
  } else {
    alert('První zadej kód produktu.');
  }
}
