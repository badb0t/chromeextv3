var datatablebd;
var datatablepii;
var searchtype = "breachdata";
var tryLogin = false;
var darkmode = false;
var websiteurl = "breachdata.c0d3xploit.com";
var apiurl = "breach.c0d3xploit.com";

document.addEventListener('DOMContentLoaded', load);

function load() {
    chrome.storage.sync.get({
        badbot_url: apiurl,
        badbot_id: "0",
        badbot_secret: "0"
    }, function (items) {
        var bdr = 0;
        var bdt = 0;
        var piir = 0;
        var piit = 0;
        
        url1 = "https://" + items.badbot_url + "/api/breachdata/stats";
        url2 = "https://" + items.badbot_url + "/api/piidata/stats";

        $.ajaxSetup({
            headers : {   
              'CF-Access-Client-Id' : items.badbot_id,
              'CF-Access-Client-Secret' : items.badbot_secret,
            }
        });

        $.getJSON(url1, function (data) {
            bdr = data.records;
            bdt = data.tables;
            $('#total_breachdata_records').html(data.records.toLocaleString("en-US"))
            $('#total_breachdata_tables').html(data.tables.toLocaleString("en-US"))
        });

        $.getJSON(url2, function (data) {
            piir = data.records;
            piit = data.tables;
            $('#total_piidata_records').html(data.records.toLocaleString("en-US"))
            $('#total_piidata_tables').html(data.tables.toLocaleString("en-US"))
        });

        $(document).ajaxStop(function () {
            // $('#total_records').html((bdr + piir).toLocaleString("en-US"))
            // $('#total_tables').html((bdt + piit).toLocaleString("en-US"))
        });
    });

    checkLogon();
}

$(".mainsite").on("click", function () {
    var url = "https://" + websiteurl + "/"
    chrome.tabs.create({ url: url });
});

$(".terms").on("click", function () {
    var url = "https://" + websiteurl + "/legal"
    chrome.tabs.create({ url: url });
});

$("#darkmode").on("click", function () {
    if($('#darkmode').prop("checked")) {
        $("body").addClass("dark-mode")
    } else {
        $("body").removeClass("dark-mode")
    }

    chrome.storage.sync.set({
        badbot_darkmode: $('#darkmode').prop("checked")
    });
});

function checkLogon() {
    chrome.storage.sync.get({
        badbot_url: apiurl,
        badbot_id: "",
        badbot_secret: "",
        badbot_darkmode: false
    }, function (items) {
        if (items.badbot_secret && items.badbot_darkmode) {
            $.ajaxSetup({
                headers : {   
                  'CF-Access-Client-Id' : items.badbot_id,
                  'CF-Access-Client-Secret' : items.badbot_secret,
                }
            });

            $.getJSON("https://" + items.badbot_url + "/api/", function (data) {
                $('.bdinterface').show();
                $('.bdlogin').hide();
                darkmode = items.badbot_darkmode;
                websiteurl = items.badbot_url;

                if(darkmode) {
                    $("body").addClass("dark-mode")
                } else {
                    $("body").removeClass("dark-mode")
                }

                $('#darkmode').prop("checked", darkmode)

                if (tryLogin) {
                    toastr.info('Your credentials have been saved.')
                }
            }).fail(function (xhr) {
                failLogon(items);
            });
        } else {
            failLogon(items);
        }
    });
}