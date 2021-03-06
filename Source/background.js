var settings = new Store('settings', {'enabled': false, 'guid': false, 'page': false, 'url': false, 'prevEnabled': 1})

if (settings.get('enabled')) {
  setIconEnabled();
} else {
  setIconDisabled();
}

var guid = false;
if (settings.get('guid')) {
  guid = settings.get('guid');
} else {
  guid = guidMake();
  settings.set('guid', guid);
}

//Listen for when a Tab changes state
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    chrome.tabs.executeScript(tab.id, {file:"content_script.js", allFrames:true});
  if(changeInfo && changeInfo.status == "complete"){
      chrome.tabs.sendMessage(tabId, {data: tab}, function(response) {
          // console.log(response);

        chrome.tabs.executeScript(tab.id, {file:"content_script.js", allFrames:true});

      });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "enabled"){
		sendResponse({data: settings.get('enabled')});
	}
    else
      sendResponse({}); // snub them.
});

//Unique userid - not currently used anywhere
function guidMake() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function setIconEnabled(){
    chrome.browserAction.setIcon({
      path : {
      "19": "icon48.png",
      "38": "icon128.png"
      }
    });
    chrome.browserAction.setTitle({title : "Anticipation - Active"});
}

function setIconDisabled(){
    chrome.browserAction.setIcon({
      path : {
      "19": "inactive48.png",
      "38": "inactive128.png"
      }
    });
    chrome.browserAction.setTitle({title : "Anticipation - Inactive"});
}


