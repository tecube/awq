function pickMeanings(index){
    var midashigo = document.getElementsByClassName("midashigo");
    var resultRow;
    var meanings = [];
    var i;

    switch (midashigo.item(index).nextElementSibling.className){
      case "Kejje" :
        resultRow = document.getElementsByClassName("level0");
        if(resultRow.length!=0){
            for(i=0; i<resultRow.length; i++){
                meanings[i] = resultRow.item(i).innerText;
            }
        }
        break;
      case "Kejcy" :
        ;
        break;
      case "Nwnej" :
        resultRow = midashigo.item(index).nextElementSibling.querySelectorAll("div.nwnejP, div.nwnejSEnL, div.nwnejS p:first-child");
        console.log(resultRow);
        if(resultRow.length!=0){
            for(i=0; i<resultRow.length; i++){
                meanings[i] = resultRow.item(i).innerText;
            }
        }
        break;
      case "Hypej" :
        resultRow = midashigo.item(index).nextElementSibling.querySelectorAll("div.hypejSub, div.level0");
        console.log("resultRow:", resultRow);
        if(resultRow.length!=0){
            for(i=0; i<resultRow.length; i++){
                meanings[i] = resultRow.item(i).innerText;
            }
        }
        break;
      case "Stwdj" :
      case "Wejty" :
        manings[0] = midashigo.item(index).nextElementSibling.innerText;
        break;
      default :
        break;
    }
    return meanings;
}

function saveMeanings(){
    var headword = document.getElementsByClassName("midashigo").item(0).innerText;
    var meanings = [];
    var obj = {};
//    var duplicate = false;

    chrome.storage.local.get("headwordlist", function(items){
        if(Object.keys(items).length==0){
            console.log("no headwordlist");
            items.headwordlist = [];
        }

        if(items.headwordlist.indexOf(headword)!=-1){
            console.log("has");
            //duplicate = true;
            return;
        }
        
        items.headwordlist.push(headword);
        //console.log(items);
        chrome.storage.local.set({"headwordlist": items.headwordlist});
    });

    meanings = pickMeanings(0);
    obj[headword] = meanings;
    //console.log(obj);
    chrome.storage.local.set(obj);
}

var done = 0;

window.addEventListener("load", function(){
    done = 1;
    saveMeanings();
}, false);

if(done==0 && document.readyState=="complete"){
    saveMeanings();
}
