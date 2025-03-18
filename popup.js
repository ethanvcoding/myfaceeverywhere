const passwordField = document.getElementById('password');
const toggleBtn = document.getElementById('toggle');
const status = document.getElementById('status');

// Set your password here
const CORRECT_PASSWORD = "mypassword123";

toggleBtn.addEventListener('click', () => {
  const input = passwordField.value;
  if (input === CORRECT_PASSWORD) {
    chrome.storage.local.get("enabled", (data) => {
      const newStatus = !data.enabled;
      chrome.storage.local.set({ enabled: newStatus }, () => {
        status.textContent = newStatus ? "Enabled" : "Disabled";
      });
    });
  } else {
    status.textContent = "Incorrect password.";
  }
});

chrome.storage.local.get("enabled", (data) => {
  status.textContent = data.enabled ? "Enabled" : "Disabled";
});
