var year = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', load);

function load() {
    $('#year').text(year);
}