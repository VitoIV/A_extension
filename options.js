const BUTTONS = [
    { id: "btnCZ",    label: "CZ" },
    { id: "btnSK",    label: "SK" },
    { id: "btnDE",    label: "DE" },
    { id: "btnAT",    label: "AT" },
    { id: "btnHU",    label: "HU" },
    { id: "btnEdit",  label: "Edit" },
    { id: "btnImage", label: "Image" },
    { id: "btnP",     label: "P" },
    { id: "btnKeep",  label: "Keep" },
    { id: "btnOpen",  label: "Open" },
    { id: "btnPreview", label: "Preview" }
];

const DEFAULT_SHORTCUTS = {
  btnCZ: "",
  btnSK: "",
  btnDE: "",
  btnAT: "",
  btnHU: "",
  btnEdit: "",
  btnImage: "",
  btnP: "",
  btnKeep: "",
  btnOpen: "",
  btnPreview: ""
};

document.addEventListener("DOMContentLoaded", () => {
  const shortcutList = document.getElementById("shortcutList");
  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");

  loadShortcuts().then((shortcuts) => {
    renderShortcuts(shortcuts);
  });

  saveBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".shortcut-input");
    const newShortcuts = {};
    inputs.forEach((input) => {
      newShortcuts[input.dataset.buttonId] = input.value.trim();
    });

    const values = Object.values(newShortcuts).filter(v => v !== "");
    const hasDuplicates = values.some((val, idx) => values.indexOf(val) !== idx);
    if (hasDuplicates) {
      alert("Některá klávesová zkratka je použita vícekrát. Změňte je prosím.");
      return;
    }

    saveShortcuts(newShortcuts).then(() => {
      alert("Klávesové zkratky byly uloženy.");
    });
  });

  resetBtn.addEventListener("click", async () => {
    await saveShortcuts(DEFAULT_SHORTCUTS);
    alert("Klávesové zkratky byly resetovány na výchozí hodnoty.");
    renderShortcuts(DEFAULT_SHORTCUTS);
  });
});

function renderShortcuts(shortcuts) {
  const shortcutList = document.getElementById("shortcutList");
  shortcutList.innerHTML = ""; 

  BUTTONS.forEach((btn) => {
    const row = document.createElement("div");
    row.className = "shortcut-item";

    const label = document.createElement("label");
    label.textContent = btn.label;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "shortcut-input";
    input.dataset.buttonId = btn.id;
    input.value = shortcuts[btn.id] || "";

    input.addEventListener("keydown", (e) => {
      e.preventDefault();
      const combo = parseKeyEvent(e);
      input.value = combo;
    });

    const clearBtn = document.createElement("button");
    clearBtn.className = "clear-button";
    clearBtn.textContent = "✕";
    clearBtn.addEventListener("click", () => {
      input.value = "";
    });

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(clearBtn); 
    shortcutList.appendChild(row);
  });
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

async function loadShortcuts() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("shortcuts", (data) => {
      if (data.shortcuts) {
        resolve(data.shortcuts);
      } else {
        resolve(DEFAULT_SHORTCUTS);
      }
    });
  });
}

async function saveShortcuts(shortcuts) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ shortcuts }, () => {
      resolve();
    });
  });
}
