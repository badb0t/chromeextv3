var datatablebd;
var datatablepii;
var searchtype = "breachdata";
var tryLogin = false;
var darkmode = false;
var websiteurl = "badbot.c0d3xploit.com";
var apiurl = "breach.c0d3xploit.com";

document.addEventListener('DOMContentLoaded', load);

function load() {
    $('.bdinterface').hide();
    $('.bdlogin').hide();

    datatablebd = $('.datatablebd').DataTable({
        processing: true,
        responsive: true,
        pageLength: 5,
        lengthMenu: [
            [5, 10, 25, 50, 100],
            [5, 10, 25, 50, 100],
        ],
        columns: [
            { title: 'Breach Name', data: 'breachname' },
            { title: 'Email', data: 'email' },
            { title: 'Password', data: 'password' },
            { title: 'Hash Type', data: 'hashtype' }
        ]
    });

    datatablepii = $('.datatablepii').DataTable({
        processing: true,
        responsive: true,
        pageLength: 5,
        lengthMenu: [
            [5, 10, 25, 50, 100],
            [5, 10, 25, 50, 100],
        ],
        columns: [
            { title: 'Breach Name', data: 'breachname' },
            { title: 'Email', data: 'email' },
            { title: 'Username', data: 'username' },
            { title: 'First Name', data: 'firstname' },
            { title: 'Last Name', data: 'lastname' },
            { title: 'DOB', data: 'dob' },
            { title: 'Phone', data: 'phone' },
            { title: 'IP', data: 'ip' }
        ]
    });

    var hash = window.location.hash;
    if (hash) {
        searchtype = hash.replace('#', '');
    }

    checkLogon()
    switchSearchType()
}

$("ul.ddsearchfield").on("click", "li", function () {
    $('#searchfield').val($(this).attr('value'));
    $('#searchfield').text($(this).text());
});

$(".mainsite").on("click", function () {
    var url = "https://" + websiteurl + "/"
    chrome.tabs.create({ url: url });
});

$(".terms").on("click", function () {
    var url = "https://" + websiteurl + "/legal"
    chrome.tabs.create({ url: url });
});

$("#darkmode").on("click", function () {
    if ($('#darkmode').prop("checked")) {
        $("body").addClass("dark-mode")
    } else {
        $("body").removeClass("dark-mode")
    }

    chrome.storage.sync.set({
        badbot_darkmode: $('#darkmode').prop("checked")
    });
});

$("a.switchSearch").on("click", function () {
    if (searchtype == "breachdata") {
        searchtype = "piidata"
    } else {
        searchtype = "breachdata"
    }

    switchSearchType()
});

$("a.nav-link").on("click", function () {
    var hash = window.location.hash;
    console.info(hash);
    if (hash) {
        searchtype = hash.replace('#', '');
    }

    switchSearchType()
});

$("#search-form").validate({
    rules: {
        search: {
            required: true,
            minlength: 3
        }
    },
    messages: {
        search: {
            required: "Please enter a search term",
            minlength: "Your search must be at least 3 characters long"
        }
    },
    submitHandler: function (form) {
        field = $('#searchfield').val().toLowerCase();
        search = $(form).find('input[name="search"]').val()

        chrome.storage.sync.get({
            badbot_url: apiurl,
            badbot_id: "",
            badbot_secret: ""
        }, function (items) {
            query_searchdata(items.badbot_url, items.badbot_id, items.badbot_secret, field, search);
        });
    }
});

function switchSearchType() {
    if (searchtype == "breachdata") {
        $('.switchSearch').html("Search PII Data")
        $('.header').html("Breach Data Search")
        $('.ddsearchfield').empty();
        $('.ddsearchfield').append('<li class="dropdown-item" value="username">Username</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="email">Email</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="domain">Domain</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="password">Password</li>');
        $('.divbd').show()
        $('.divpii').hide()
    } else {
        $('.switchSearch').html("Search Breach Data")
        $('.header').html("PII Data Search")
        $('.ddsearchfield').empty();
        $('.ddsearchfield').append('<li class="dropdown-item" value="username">Username</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="email">Email</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="firstname">First Name</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="lastname">Last Name</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="phone">Phone</li>');
        $('.ddsearchfield').append('<li class="dropdown-item" value="ip">IP</li>');
        $('.divbd').hide()
        $('.divpii').show()
    }
}

var query_searchdata = function (url, id, secret, field, search) {
    var url = "https://" + url + "/api/" + searchtype + "/?t=" + field + "&s=" + search;

    $.ajaxSetup({
        headers: {
            'CF-Access-Client-Id': id,
            'CF-Access-Client-Secret': secret,
        }
    });

    if (searchtype == "breachdata") {
        datatablebd.ajax.url(url).load();
    } else {
        datatablepii.ajax.url(url).load();
    }
}

function checkLogon() {
    chrome.storage.sync.get({
        badbot_url: apiurl,
        badbot_id: "",
        badbot_secret: "",
        badbot_darkmode: false
    }, function (items) {
        if (items.badbot_id && items.badbot_secret) {
            $.ajaxSetup({
                headers: {
                    'CF-Access-Client-Id': items.badbot_id,
                    'CF-Access-Client-Secret': items.badbot_secret,
                }
            });

            $.getJSON("https://" + items.badbot_url + "/api/breachdata/stats", function (data) {
                $('.bdinterface').show();
                $('.bdlogin').hide();
                darkmode = items.badbot_darkmode;
                websiteurl = items.badbot_url;

                if (darkmode) {
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

function failLogon(items) {
    //window.open("chrome-extension://" + chrome.runtime.id + "/pages/options.html", "_blank");
    document.getElementById('save').addEventListener('click', saveOptions);
    $('#badbot_url').val(items.badbot_url);
    $('#badbot_id').val(items.badbot_id);
    $('#badbot_secret').val(items.badbot_secret);
    $('.bdlogin').show();
    $('.bdinterface').hide();

    if (tryLogin) {
        toastr.error('Sorry but the credentials you entered is incorrect! Please try again.')
    }
}

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