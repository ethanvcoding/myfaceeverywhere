document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const adminView = document.getElementById("adminView");
  const passwordInput = document.getElementById("passwordInput");
  const loginButton = document.getElementById("loginButton");
  const imageContainer = document.getElementById("imageContainer");

  const base64Placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAF0lEQVR4nO3BMQEAAADCoPdPbQ0PoAAAAAAAAAAAAPAAC2QAAAGzN8rQAAAAASUVORK5CYII=";

  loginView.style.display = "block";

  loginButton.addEventListener("click", () => {
    const pwd = passwordInput.value.trim();
    if (pwd === "adminpassword") {
      loginView.style.display = "none";
      adminView.style.display = "block";
      loadImages();
    } else {
      alert("Incorrect password");
    }
  });

  document.getElementById("backButton").addEventListener("click", () => {
    adminView.style.display = "none";
    loginView.style.display = "block";
    passwordInput.value = "";
  });

  function loadImages() {
    chrome.storage.local.get(['uploadedImages'], (result) => {
      const images = result.uploadedImages || [];
      imageContainer.innerHTML = '';

      if (images.length === 0) {
        const placeholderImg = document.createElement('img');
        placeholderImg.src = base64Placeholder;
        placeholderImg.alt = "Placeholder";
        imageContainer.appendChild(placeholderImg);
      } else {
        images.forEach((imgDataUrl, index) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'image-wrapper';

          const img = document.createElement('img');
          img.src = imgDataUrl;

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = "Delete";
          deleteBtn.onclick = () => {
            images.splice(index, 1);
            chrome.storage.local.set({ uploadedImages: images }, loadImages);
          };

          wrapper.appendChild(img);
          wrapper.appendChild(deleteBtn);
          imageContainer.appendChild(wrapper);
        });
      }
    });
  }

  document.getElementById("imageUpload").addEventListener("change", (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    const readers = [];

    chrome.storage.local.get(['uploadedImages'], (result) => {
      let currentImages = result.uploadedImages || [];

      if (currentImages.length + files.length > 6) {
        alert("You can only upload up to 6 images total.");
        return;
      }

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          currentImages.push(reader.result);
          if (currentImages.length > 6) {
            currentImages = currentImages.slice(0, 6);
          }
          chrome.storage.local.set({ uploadedImages: currentImages }, loadImages);
        };
        reader.readAsDataURL(file);
      });
    });
  });

  document.getElementById("addWhitelist").addEventListener("click", () => {
    const input = document.getElementById("whitelistInput");
    const site = input.value.trim();
    if (!site) return;

    chrome.storage.local.get(['whitelist'], (result) => {
      const whitelist = result.whitelist || [];
      if (!whitelist.includes(site)) {
        whitelist.push(site);
        chrome.storage.local.set({ whitelist }, () => {
          input.value = '';
          renderWhitelist(whitelist);
        });
      }
    });
  });

  function renderWhitelist(list) {
    const ul = document.getElementById("whitelistList");
    ul.innerHTML = '';
    list.forEach((site, idx) => {
      const li = document.createElement("li");
      li.textContent = site;
      ul.appendChild(li);
    });
  }

  chrome.storage.local.get(['whitelist'], (result) => {
    renderWhitelist(result.whitelist || []);
  });

  document.getElementById("runButton").addEventListener("click", () => {
    alert("Extension is running! (Placeholder for actual activation logic)");
    // Here you'd store a flag or message that triggers content script behavior
  });
});
