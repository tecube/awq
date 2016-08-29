function splitDefStr(str){
    var result = [];
    var len;

    while(str.length!=0){
        switch(str.charAt(0)){
          case "(" :
            len = result.push(str.slice(0, str.indexOf(")")+1));
            str = str.slice(result[len-1].length);
            break;
          case "{" :
            len = result.push(str.slice(0, str.indexOf("}")+1));
            str = str.slice(result[len-1].length);
            break;
          case "[" :
            len = result.push(str.slice(0, str.indexOf("]")+1));
            str = str.slice(result[len-1].length);
            break;
          case "【" :
            len = result.push(str.slice(0, str.indexOf("】")+1));
            str = str.slice(result[len-1].length);
            break;
          case "〔" :
            len = result.push(str.slice(0, str.indexOf("〕")+1));
            str = str.slice(result[len-1].length);
            break;
          case "《" :
            len = result.push(str.slice(0, str.indexOf("》")+1));
            str = str.slice(result[len-1].length);
            break;
          case "〈" :
            len = result.push(str.slice(0, str.indexOf("〉")+1));
            str = str.slice(result[len-1].length);
            break;
          case " " :
          case "," :
          case "，":
          case ":" :
          case ";" :
          case "；":
          case "." :
          case "\n":
            str = str.slice(1);
            break;
          default:
            var last = str.search(/[,，:;；\.\n\(\[\{【〔《〈]/);
            if(last>0){
                len = result.push(str.slice(0, last));
                //console.log("if len-1:%s", result[len-1]);
                str = str.slice(last);
                //console.log("str:", str);
            }else{
                len = result.push(str);
                //console.log("else len-1:%s", result[len-1]);
                str = "";
                //console.log("str:", str);
            }
            break;
        }
    }

    return result;
}

function addStoredWords(){
    //var listEles = document.getElementsByTagName("ol");

    chrome.storage.local.get(null, function(items){
        var hwl = items.headwordlist;
        var word;
        var ol = document.getElementById("termsAndDefs").getElementsByTagName("ol");
        var docFrgmnt = document.createDocumentFragment();
        var li, div, divT, divD, anchorT;

        for(var i=0; i<hwl.length; i++){
            word = items[hwl[i]];

            li = docFrgmnt.appendChild(document.createElement("li"));
            div = li.appendChild(document.createElement("div"));
            div.setAttribute("id", hwl[i]);
            divT = div.appendChild(document.createElement("div"));
            divT.setAttribute("class", "terms");
            anchorT = divT.appendChild(document.createElement("a"));
            anchorT.innerText = hwl[i];
            anchorT.setAttribute("href", "http://ejje.weblio.jp/content/" + hwl[i]);
            anchorT.setAttribute("target", "_blank");
            divD = div.appendChild(document.createElement("div"));
            divD.setAttribute("class", "defs");

            if(word==null){
                divD.appendChild(document.createElement("span")).innerText = " ";
                continue;
            }

            for(var j=0; j<word.length; j++){
                var resultAry = splitDefStr(word[j]);
                for(var k=0; k<resultAry.length; k++){
                    divD.appendChild(document.createElement("span")).innerText = resultAry[k];
                    divD.appendChild(document.createElement("span")).innerText = ",";
                    divD.lastElementChild.setAttribute("class", "between none");
                }
                divD.appendChild(document.createElement("br"));
            }

            ol.item(0).appendChild(docFrgmnt);
        }
    });
}

function exportClicked(){
    var wordList = document.getElementById("termsAndDefs").getElementsByTagName("li");
    var selected = [];
    var spans;

    for(var i=0; i<wordList.length; i++){
        selected[i]  = wordList.item(i).firstElementChild.id;
        selected[i] += "\t";
        spans = wordList.item(i).getElementsByClassName("selected");
        for(var j=0; j<spans.length; j++){
            if(spans.item(j).innerText=="/"){
                selected[i] += "\n";
            }else{
                selected[i] += spans.item(j).innerText;
            }
        }
    }
    console.log(selected);

    var outputEle = document.createElement("textarea");
    outputEle.id = "outputText";
    outputEle.addEventListener("click", function(){outputEle.select();}, false)
    outputEle.innerHTML = selected.join(";");
    if(document.getElementById("outputText")==null){
        document.getElementById("content").appendChild(outputEle).select();
    }else{
        document.getElementById("outputText").innerHTML = outputEle.innerHTML;
    }
    outputEle.select();
    document.execCommand("copy");
    
    chrome.storage.local.set({"result": outputEle.innerHTML}, function(){
        chrome.tabs.create({"url":"https://quizlet.com/create-set/new"});
        //chrome.tabs.executeScript({file: "atQuizlet.js"});
    });
}

function selectClicked(e){
    if(e.target.tagName!="SPAN"){
        return;
    }
    e.target.classList.toggle("selected");
    
    if(e.target.classList.contains("between") && e.target.classList.contains("none")){
        e.target.innerText = ", ";
        e.target.classList.remove("none");
        e.target.classList.add("comma");
        e.target.classList.add("selected");
    }else if(e.target.classList.contains("between") && e.target.classList.contains("comma")){
        e.target.innerText = "/";
        e.target.classList.remove("comma");
        e.target.classList.add("newline");
        e.target.classList.add("selected");
    }else if(e.target.classList.contains("between") && e.target.classList.contains("newline")){
        e.target.innerText = ",";
        e.target.classList.remove("newline");
        e.target.classList.add("none");
        e.target.classList.remove("selected");
    }
}

function editMeaning(e){
    if(e.target.tagName!="SPAN" || e.target.className.indexOf("between")!=-1){
        return;
    }

    var parentNode = document.getElementById(e.target.parentNode.parentNode.id).getElementsByClassName("defs").item(0);
    
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.value = e.target.innerText;

    input.addEventListener("keydown", function(ev){
        if(ev.keyCode === 13){
            e.target.innerText = ev.target.value;
            parentNode.replaceChild(e.target, ev.target);
        }
    });

    /*input.addEventListener("blur", function(ev){
        e.target.innerText = ev.target.value;
        parentNode.replaceChild(e.target, ev.target);
    });*/

    parentNode.replaceChild(input, e.target);

    input.focus();
}

var done = 0;

window.addEventListener("load", function(){
    done = 1;
    
    addStoredWords();
    
    document.getElementById("termsAndDefs").addEventListener("click", selectClicked, false);
    document.getElementById("termsAndDefs").addEventListener("dblclick", editMeaning, false);
    document.getElementById("export_link").addEventListener("click", exportClicked, false);
}, false);

if(done==0 && document.readyState=="complete"){
    addStoredWords();
    
    document.getElementById("termsAndDefs").addEventListener("click", selectClicked, false);
    document.getElementById("termsAndDefs").addEventListener("dblclick", editMeaning, false);
    document.getElementById("export_link").addEventListener("click", exportClicked, false);
}
