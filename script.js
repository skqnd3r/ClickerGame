var golds = 0;
var clickvalue = 1;
var level = 0;
var gps = 0;
var step = 0;
var stepmax = 50;

//start
function start() {
    displayRank();
    displayGolds();
    setGPS();
    displayGPS();
    autosave();
    for (let i = 0; i < minions.length + 1; i++) {
        displayValue(i);
    }
}

//return value
function displayValue(id) {
    minions.forEach(function (minions) {
        if (minions.id == id) {
            var displayer = document.getElementsByClassName(minions.class);
            displayer[0].innerHTML = minions.name;
            var round = minions.cost.toFixed(0);
            displayer[1].innerHTML = `${format(round)}`;
            displayer[5].innerHTML = "";
            if (minions.owned > 0) {
                if (minions.level == 6) {
                    displayer[4].style.width = "100%";
                    displayer[5].innerHTML = "lvl.MAX";
                } else {
                    rank.forEach(function (rank) {
                        if (minions.level == rank.level) {
                            var taille = ((minions.owned - rank.step) * 100) / (rank.own - rank.step);
                            displayer[4].style.width = taille + "%";
                        }
                    });
                }
                displayer[2].innerHTML = minions.owned;
                displayer[5].innerHTML = "lvl." + `${minions.level}`;
                displayer[3].style.opacity = "100%"
            } else {
                displayer[2].innerHTML = "";
                displayer[3].style.opacity = "0%"
            }
        }
    });
}

//gold
function addGold(x = 0) {
    golds = golds + clickvalue + x;
    var displayer = document.getElementsByClassName("mine");
    displayer[0].setAttribute("hidden", "");
    displayer[1].removeAttribute("hidden", "");
    setTimeout(function () {
        displayer[2].removeAttribute("hidden", "");
    }, 80)
    setTimeout(function () {
        displayer[2].setAttribute("hidden", "");
    }, 120)
    setTimeout(function () {
        displayer[0].removeAttribute("hidden", "");
        displayer[1].setAttribute("hidden", "");
    }, 60);
}

function displayGolds() {
    goldcount = document.querySelector("#gold");
    setInterval(function () {
        var round = golds.toFixed(0);
        goldcount.innerHTML = `${format(round)}`;
        displayCost();
    }, 50);
}

//GPS
function setGPS() {
    setInterval(function () {
        golds = golds + gps;
    }, 1000);
}

// calcul gps
function getGPS() {
    gps = 0; //reset
    minions.forEach(function (minions) { // for (let i = 0; i < minions.length; i++) {     // in for each minion == minions
        gps += minions.gps * minions.owned; // minions[i].name;
    });
}

function displayGPS() {
    GPScount = document.querySelector("#gps");
    var round = gps.toFixed(1);
    GPScount.innerHTML = `${format(round)}`;
}


//numbers in red
function displayCost() {
    minions.forEach(function (minions) {
        var displayer = document.getElementsByClassName(minions.class);
        if (golds < minions.cost) {
            displayer[1].style.color = "#463f3a";
        } else {
            // console.log(displayer)
            displayer[1].style.color = "gold";
        }
    });
}

function buyMinion(id) {
    minions.forEach(function (minions) {
        if (minions.id == id) {
            if (golds >= minions.cost) {
                golds = golds - minions.cost;
                minions.owned++;
                step++;
                minions.cost = minions.cost * 1.2;
                refresh(minions, minions.id);
            } else {
                console.log("not enough money"); //message erreur
            }
        }
    });
}

// affichage reset on load
function refresh(minions, id) {
    doubleclick();
    iflevel(minions);
    getGPS();
    displayGPS();
    displayValue(id);
    displayRank();
}

// Click step
function doubleclick() {
    if (step >= stepmax) {
        step -= stepmax;
        level++;
        stepmax = stepmax * 2;
        rank.forEach(function (rank) {
            if (rank.level == level) {
                clickvalue = clickvalue * rank.multiplier;
            }
        });
        displayRank();
        if (level != 1) {
            save();
        }
    }
}

//lvl of upgrade
function iflevel(minions) {
    rank.forEach(function (rank) {
        if (minions.owned >= rank.own) {
            if (minions.level == rank.level) {
                minions.gps = minions.gps * rank.multiplier;
                minions.level++;
                if (minions.level != 1) {
                    save();
                }
            }
        }
    })
}

//ranking
function displayRank() {
    //bar
    var displayer = document.getElementsByClassName("rankname");

    if (level < 6) {
        var taille = (step * 100) / (stepmax);
        displayer[1].style.width = taille + "%";
    } else {
        displayer[1].style.width = "100%";
    }
    //rank
    rank.forEach(function (rank) {
        if (rank.level == level) {
            displayer[0].innerHTML = rank.name;
        }
    });
}

// save
function save() {
    // Int
    localStorage.setItem("golds", golds);
    localStorage.setItem("clickvalue", clickvalue);
    localStorage.setItem("step", step);
    localStorage.setItem("level", level);
    // String
    localStorage.setItem("rank", JSON.stringify(rank));
    localStorage.setItem("minions", JSON.stringify(minions));
    console.log("Saved");
}

//auto save
function autosave() {
    setInterval(function () {
        save();
    }, 300000);
}

// load
function load() {
    // Retrieve
    var goldsx = localStorage.getItem("golds");
    var clickvaluex = localStorage.getItem("clickvalue");
    var stepx = localStorage.getItem("step");
    var rankx = localStorage.getItem("rank");
    var minionsx = localStorage.getItem("minions");
    var levelx = localStorage.getItem("level");
    // Parse
    golds = parseInt(goldsx);
    clickvalue = parseInt(clickvaluex);
    step = parseInt(stepx);
    level = parseInt(levelx);
    rank = JSON.parse(rankx);
    minions = JSON.parse(minionsx);
    //reset function
    getGPS();
    start();
}

// format
function format(num) {
    if (num > Math.pow(10, 3) && num < (Math.pow(10, 6)) * 2) {
        return (num / Math.pow(10, 3)).toFixed(3);
    } else if (num > (Math.pow(10, 6) * 2) && num < (Math.pow(10, 9)) * 2) {
        return (num / Math.pow(10, 6)).toFixed(3) + " millions";
    } else if (num > (Math.pow(10, 9) * 2) && num < (Math.pow(10, 12)) * 2) {
        return (num / Math.pow(10, 9)).toFixed(3) + " billions";
    } else if (num > (Math.pow(10, 12) * 2) && num < (Math.pow(10, 15)) * 2) {
        return (num / Math.pow(10, 12)).toFixed(3) + " trillions";
    } else if (num > (Math.pow(10, 15) * 2) && num < (Math.pow(10, 18)) * 2) {
        return (num / Math.pow(10, 15)).toFixed(3) + " quadrillions";
    } else if (num > (Math.pow(10, 18) * 2) && num < (Math.pow(10, 21)) * 2) {
        return (num / Math.pow(10, 18)).toFixed(3) + " quintillions";
    } else if (num > (Math.pow(10, 21) * 2) && num < (Math.pow(10, 24)) * 2) {
        return (num / Math.pow(10, 21)).toFixed(3) + " sextillions";
    } else if (num > (Math.pow(10, 24) * 2) && num < (Math.pow(10, 27)) * 2) {
        return (num / Math.pow(10, 24)).toFixed(3) + " septillions";
    } else if (num > (Math.pow(10, 27) * 2) && num < (Math.pow(10, 30)) * 2) {
        return (num / Math.pow(10, 27)).toFixed(3) + " octillions";
    } else if (num > (Math.pow(10, 30) * 2) && num < (Math.pow(10, 33)) * 2) {
        return (num / Math.pow(10, 30)).toFixed(3) + " nonillions";
    } else if (num > (Math.pow(10, 33) * 2) && num < (Math.pow(10, 36)) * 2) {
        return (num / Math.pow(10, 33)).toFixed(3) + " decillions";
    }
    return num;
}