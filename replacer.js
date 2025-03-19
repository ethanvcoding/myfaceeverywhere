chrome.storage.local.get(['uploadedImages', 'whitelist'], (result) => {
  const images = result.uploadedImages || [];
  const whitelist = result.whitelist || [];

  // Get current hostname
  const hostname = window.location.hostname;
  if (whitelist.includes(hostname)) return;

  if (images.length === 0) return;

  const randomImage = () => images[Math.floor(Math.random() * images.length)];

  const replaceImages = () => {
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      img.src = randomImage();
      img.style.objectFit = 'cover';
      img.width = originalWidth;
      img.height = originalHeight;
    });
  };

  replaceImages();

  // Also observe DOM changes to replace new images that load later
  const observer = new MutationObserver(() => {
    replaceImages();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
