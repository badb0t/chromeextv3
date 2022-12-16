document.addEventListener('DOMContentLoaded', setup);
var tryLogin = false;
var websiteurl = "badbot.c0d3xploit.com";
var apiurl = "breachdata.c0d3xploit.com";

function setup() {
    restoreOptions();
    if (document.getElementById('save')) {
        document.getElementById('save').addEventListener('click', saveOptions);
    }
}

$(".mainsite").on("click", function () {
    var url = "https://" + websiteurl + "/"
    chrome.tabs.create({ url: url });
});

$(".terms").on("click", function () {
    var url = "https://" + websiteurl + "/legal"
    chrome.tabs.create({ url: url });
});

// Saves options to chrome.storage.sync.
function saveOptions() {
    var badbot_url = document.getElementById('badbot_url').value;
    var badbot_id = document.getElementById('badbot_id').value;
    var badbot_secret = document.getElementById('badbot_secret').value;
    chrome.storage.sync.set({
        badbot_url: badbot_url,
        badbot_id: badbot_id,
        badbot_secret: badbot_secret,
    }, function () {
        tryLogin = true;
        checkLogon();
    });
}

function checkLogon() {
    chrome.storage.sync.get({
        badbot_url: apiurl,
        badbot_id: "",
        badbot_secret: ""
    }, function (items) {
        $.ajaxSetup({
            headers : {   
              'CF-Access-Client-Id' : items.badbot_id,
              'CF-Access-Client-Secret' : items.badbot_secret,
            }
        });
        
        $.getJSON("https://" + items.badbot_url + "/api/breachdata/stats", function (data) {
            websiteurl = items.badbot_url;
            if (tryLogin) {
                toastr.info('Your credentials have been saved.')
            }
        }).fail(function (xhr) {
            if (tryLogin) {
                toastr.error('Sorry but the credentials you entered is incorrect! Please try again.')
            }
        });
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        badbot_url: apiurl,
        badbot_id: "",
        badbot_secret: "",
    }, function (items) {
        if (document.getElementById('badbot_url')) {
            document.getElementById('badbot_url').value = items.badbot_url;
        }

        if (document.getElementById('badbot_id')) {
            document.getElementById('badbot_id').value = items.badbot_id;
        }

        if (document.getElementById('badbot_secret')) {
            document.getElementById('badbot_secret').value = items.badbot_secret;
        }
    });
}

