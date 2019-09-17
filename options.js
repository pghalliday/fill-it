chrome.storage.local.get('extracted', function(items) {
  const extracted = items.extracted;
  if (extracted) {
    console.log(extracted);
    chrome.storage.local.remove('extracted', function() {
      console.log('deleted extracted from storage');
    });
  }
});

let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);