chrome.storage.local.get("enabled", (data) => {
  if (!data.enabled) return;

  const replacements = [
    chrome.runtime.getURL("images/replacement1.jpg"),
    chrome.runtime.getURL("images/replacement2.jpg")
  ];

  const imgs = document.querySelectorAll("img");
  imgs.forEach((img, i) => {
    const replacement = replacements[i % replacements.length];
    img.src = replacement;
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === "IMG") {
          const replacement = replacements[Math.floor(Math.random() * replacements.length)];
          node.src = replacement;
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
