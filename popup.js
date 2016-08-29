document.addEventListener('DOMContentLoaded', function() {
    //var yn = document.getElementById("yn");
    //yn.style.display = "none";
    var clear_yes = document.getElementById("yes");
    clear_yes.style.display = "none";
    
    var clear_link = document.getElementById("clear");
    clear_link.addEventListener("click", function(){
        //yn.style.display = "inline-block";
        if(clear_yes.style.display=="none"){
            clear_yes.style.display = "inline-block";
        }else{
            clear_yes.style.display = "none";
        }
    }, false);
    
    clear_yes.addEventListener("mouseout", function(){
        //yn.style.display = "none";
        clear_yes.style.display = "none";
    }, false);
    
    //var clear_yes = document.getElementById("yes");
    clear_yes.addEventListener("click", function(){
        chrome.storage.local.clear();
        //yn.style.display = "none";
        clear_yes.style.display ="none";
    }, false);
    
    /*var clear_no = document.getElementById("no");
    clear_no.addEventListener("click", function(){
        yn.style.display = "none";
    }, false);*/

    var option_link = document.getElementById("option");
    option_link.addEventListener("click", function(){
        chrome.tabs.create({ "url": "option.html" });
    }, false);

    /*
    chrome.storage.local.get(null, function(items){
        console.log(items);
    });*/
    
    //chrome.tabs.create({ "url": "https://quizlet.com/create-set/new", "active": false });
    //chrome.tabs.create({ "url": "option.html", "active": false });
    /*chrome.tabs.query({"url": "https://quizlet.com/create-set/new"}, function(tabs){
        console.log("done");
        chrome.tabs.executeScript(tabs[0].id, {"file": "atQuizlet.js"});
    });*/
});
