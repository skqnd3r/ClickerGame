function loadJSON(file) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './'+file+'.json', false);
    xobj.send(null);
    if (xobj.readyState == 4 && xobj.status == "200") {
        let response = xobj.responseText;
        return JSON.parse(response)
    }
    //else reload
}

var minions;
var rank;

function loadjson() {    
        minions = loadJSON('minions');
        rank = loadJSON('rank');
        console.log(rank)
        start()
}
