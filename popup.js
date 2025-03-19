const loginView = document.getElementById("login-view");
const adminView = document.getElementById("admin-view");
const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password-input");
const backBtn = document.getElementById("back-btn");
const imageUpload = document.getElementById("image-upload");
const thumbnails = document.getElementById("thumbnails");
const whitelist = document.getElementById("whitelist");
const runBtn = document.getElementById("run-btn");

let adminPassword = "adminpassword";
let imageURLs = [];

loginBtn.onclick = () => {
  const val = passwordInput.value.trim();
  if (val === adminPassword) {
    showAdminView();
  } else {
    alert("Incorrect password");
  }
};

backBtn.onclick = () => {
  adminView.classList.add("hidden");
  loginView.classList.remove("hidden");
};

function showAdminView() {
  loginView.classList.add("hidden");
  adminView.classList.remove("hidden");
  renderThumbnails();
  chrome.storage.local.get("whitelist", (res) => {
    whitelist.value = (res.whitelist || []).join("\n");
  });
}

imageUpload.onchange = (e) => {
  const files = Array.from(e.target.files);
  if (imageURLs.length + files.length > 6) {
    alert("Max 6 images allowed.");
    return;
  }

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageURLs.push(event.target.result);
      chrome.storage.local.set({ images: imageURLs });
      renderThumbnails();
    };
    reader.readAsDataURL(file);
  }
};

function renderThumbnails() {
  thumbnails.innerHTML = "";
  chrome.storage.local.get("images", (res) => {
    imageURLs = res.images || [];
    imageURLs.forEach((url, index) => {
      const div = document.createElement("div");
      div.className = "thumb";
      div.innerHTML = `<img src="${url}"><button class="delete-btn" data-index="${index}">Delete</button>`;
      thumbnails.appendChild(div);
    });
  });
}

thumbnails.onclick = (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = parseInt(e.target.dataset.index);
    imageURLs.splice(index, 1);
    chrome.storage.local.set({ images: imageURLs });
    renderThumbnails();
  }
};

whitelist.oninput = () => {
  const lines = whitelist.value.split("\n").map(l => l.trim()).filter(Boolean);
  chrome.storage.local.set({ whitelist: lines });
};

runBtn.onclick = () => {
  chrome.runtime.sendMessage({ action: "run" });
};
