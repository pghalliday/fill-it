chrome.storage.local.get('extracted', function(items) {
  const extracted = items.extracted;
  if (extracted) {
    console.log(extracted);
    chrome.storage.local.remove('extracted', function() {
      console.log('deleted extracted from storage');
    });
  }
});
