
// Global Variables
var currentElement;
var userJSON;

// onload
function initSite() {
    if (!callContent('page')) {
        initContent('main');
    }
    setTimeout(hideSplash, 1500);
}

// Content Management
function initContent(args) {
    if (currentElement != args) {
        if (loadContent(args)) {
            setInactive();
            if (args == 'main') {
                setActive(1);
                currentElement = args;
            } else if (args == 'features') {
                setActive(2);
                currentElement = args;
            } else if (args == 'documentation') {
                setActive(3);
                currentElement = args;
            } else if (args == 'about') {
                setActive(4);
                currentElement = args;
            } else if (args == 'partners') {
                setActive(5);
                currentElement = args;
            }
        }
    }
}

function loadContent(args) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('content-view').innerHTML = this.responseText;
            // For About section
            if (args == 'about') {
                fetchUser();
            }
        }
    }
    xhttp.open('GET', 'assets/docs/' + args + '.html', true);
    xhttp.send();
    return true;
}

function setActive(args) {
    document.getElementById('content-nav-item-' + args).classList.add('active');
}

function setInactive() {
    var element = document.getElementsByClassName('content-nav-item');
    for (var i = 0; i < element.length; i++) {
        element[i].classList.remove('active');
    }
}

function fetchUser() {
    // var data = JSON.stringify({
    //     "user": [
    //         "401648495515402240",
    //         "283236977602592778",
    //         "yeeeee"
    //     ]
    // });

    document.getElementById('userInject')
        .setAttribute(
            'style',
            'color: mediumvioletred;display: flex;justify-content: center;width: -webkit-fill-available;background: #f7cbffba;border-radius: 10px;padding: 40px;margin: 10px;border: 2px solid palevioletred;'
        )
    document.getElementById('userInject').innerHTML = 'Constructing Pylons...';

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            userJSON = JSON.parse(this.responseText);
            var data = JSON.stringify(userJSON.user);

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var respond = JSON.parse(this.responseText);
                    injectUser(respond);
                }else{
                    document.getElementById('userInject').innerHTML = 'Construct failed :(';
                }
            });

            xhr.open("POST", 'https://leewp14.nsupdate.info/rem-official/api/fetchUser/');
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("cache-control", "no-cache");

            xhr.send(data);
        }
    });

    xhr.open("GET", "assets/docs/about/fetchUser.json");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send();

    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function () {
    //     if (this.readyState === 4) {
    //         respond = JSON.parse(this.responseText);
    //         injectUser(respond);
    //     }
    // });

    // xhr.open("POST", "http://localhost/");
    // xhr.setRequestHeader("content-type", "application/json");
    // xhr.setRequestHeader("cache-control", "no-cache");

    // xhr.send(data);
}

function injectUser(args) {
    var coco = [];
    for (i in userJSON.user) {
        userid = args[i].id;
        username = args[i].username;
        useravatar = args[i].avatar;
        useravatarurl = 'https://cdn.discordapp.com/avatars/' + userid + '/' + useravatar;
        string1 =
            '<div id="bot-owner-1" class="card card-2"><div class="card-header"><span class="icon icon-circle-right"></span><a class="card-text">' +
            userJSON.title[i] +
            '</a></div ><div class="card-content bot-owner"><img class="bot-owner-avatar" src="' +
            useravatarurl +
            '.gif?size=512" onerror="this.onerror=null;this.src=' + "'" +
            useravatarurl +
            ".png?size=512'" + '"><div class="bot-owner-info"><div class="bot-owner-name">@' +
            username + '</div>' +
            userJSON.desc[i] +
            '</div></div></div>';

        coco.push(string1);

    }
    document.getElementById('userInject').innerHTML = coco.join('');
    document.getElementById('userInject').removeAttribute('style');
    document.getElementById('userInject').style.display = 'flex';
    document.getElementById('userInject').style.flexWrap = 'wrap';
}

// Call Page and Section according to URL Parameters
function callContent(args) {
    var isCalled = false;
    if (args == 'page') {
        var pages = ['features', 'documentation', 'about', 'partners'];
        if (pages.indexOf(getUrlParams().page) != '-1') {
            initContent(getUrlParams().page);
            isCalled = true;
        }
    }
    return isCalled;
}

// Join Discord Server
function joinServer(args) {
    var serverURL = 'https://discord.gg/' + args;
    window.open(serverURL);
}

// Invite Discord Bot
function inviteBot(args1, args2) {
    var botURL = 'https://discordapp.com/oauth2/authorize?client_id=' + args1 + '&permissions=' + args2 + '&scope=bot';
    window.open(botURL);
}

// Scroll Content Into View
function scrollIntoViewz(args) {
    document.getElementById(args).scrollIntoView({ behavior: "smooth" });
}

// Splash Screen
function hideSplash() {
    document.getElementById('splash').style.pointerEvents = 'none';
    document.getElementById('splash').style.opacity = '0';
}

// Get URL Parameters
function getUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};

    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                }
                else {
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}
