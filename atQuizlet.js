function openImportArea(){
    var importArea, textarea, importButton;
    
    importArea = document.getElementsByClassName("ImportTerms is-hidden").item(0);
    importArea.classList.remove("is-hidden");
    importArea.classList.add("is-showing");
    
    textarea = document.getElementsByClassName("ImportTerms-textarea text").item(0);
    chrome.storage.local.get("result", function(items){
        textarea.innerText = items.result;
    });
    
    importButton = document.getElementsByClassName("ImportTerms-importButton button").item(0);
    importButton.removeAttribute("disabled");
    importButton.click();
}

function addWords(){
    chrome.storage.local.get(null, function(items){
        /*var textareas = Array.prototype.slice.call(document.getElementsByClassName("AutoExpandTextarea-textarea"));
        console.log(textareas);
        console.log(items);
        textareas.shift();

        for(i=0; i<items.headwordlist.length; i++){
            textareas[i*2].value = items.headwordlist[i];
            textareas[i*2+1].value = items[items.headwordlist[i]].join("\n");
        }*/
        var link = document.getElementsByClassName("CreateSetPage-importLink").item(0);
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", false, true);
        link.dispatchEvent(event);
    });
}

var done = 0;

window.addEventListener("load", function(){
    done = 1;
    window.setTimeout(addWords, 5000);
    openImportArea();
    //addWords();
}, false);

if(done==0 && document.readyState=="complete"){
    window.setTimeout(addWords, 1000);
    openImportArea();
    //addWords();
}
