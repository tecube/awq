chrome.browserAction.setBadgeBackgroundColor({color: "#444444"});
chrome.storage.local.get("headwordlist", function(items){
        if(items.headwordlist==null){
            chrome.browserAction.setBadgeText({text: "0"});
        }else{
            chrome.browserAction.setBadgeText({text: items.headwordlist.length.toString()});
        }
    });

chrome.storage.onChanged.addListener(function(changes, areaName){
    if(areaName!="local"){
        return;
    }
    
    chrome.storage.local.get("headwordlist", function(items){
        if(items.headwordlist==null){
            chrome.browserAction.setBadgeText({text: "0"});
        }else{
            chrome.browserAction.setBadgeText({text: items.headwordlist.length.toString()});
        }
    });
});
