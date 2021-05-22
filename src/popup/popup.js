
dateDisplay.innerText = new Date().toLocaleString();


function openBookmarkManager(){
    chrome.tabs.query({ 'url': 'chrome://bookmarks/*' }, ([tab]) => {        
        console.log('openBookmarkManager', tab);

        if(tab){            
            if(!tab.selected){
                console.log('openBookmarkManager:update', tab);
                chrome.tabs.update(tab.id, { selected: true}); //, active: true 
            }                
        }
        else{
            chrome.tabs.create({'url': 'chrome://bookmarks/'});
        }
    });
}

openBookmarkManagerBtn.addEventListener("click", () => { openBookmarkManager()});


sortBookmarkCurrentFolderBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    sortBookmarkCurrentFolder(tab);
});

(function enableSortBookmarkCurrentFolder(){
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {        
        sortBookmarkCurrentFolderBtn.disabled = !isBookmarkManagerTab(tab);
    });
})();


/*
// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }
 */