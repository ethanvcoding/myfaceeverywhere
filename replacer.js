chrome.storage.local.get(["images", "whitelist"], ({ images = [], whitelist = [] }) => {
  const domain = window.location.hostname;
  if (whitelist.includes(domain)) return;

  const imgs = document.querySelectorAll("img");
  imgs.forEach(img => {
    const rand = images[Math.floor(Math.random() * images.length)];
    if (rand) img.src = rand;
  });
});
