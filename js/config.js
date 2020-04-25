// current url (should update links to not require this)
var url = window.location.protocol + '//' + window.location.hostname + '/';
// api
var api_url = "https://api.covid19tracker.ca/";

function provinceProperties(code, name) {
    var hashmap = {
        "QC": {
            name: "Quebec",
            population : 8485000
        },
        "NL": {
            name: "Newfoundland and Labrador",
            population : 521000
        },
        "BC": {
            name: "British Columbia",
            population : 5071000
        },
        "NU": {
            name: "Nunavut",
            population : 38780
        },
        "NT": {
            name: "Northwest Territories",
            population : 44826,
        },
        "NB": {
            name: "New Brunswick",
            population : 776827
        },
        "NS": {
            name: "Nova Scotia",
            population : 971395
        },
        "SK": {
            name: "Saskatchewan",
            population : 1174000
        },
        "AB": {
            name: "Alberta",
            population : 4371000
        },
        "PE": {
            name: "Prince Edward Island",
            population : 156947
        },
        "YT": {
            name: "Yukon",
            population : 35874
        },
        "MB": {
            name: "Manitoba",
            population : 1369000
        },
        "ON": {
            name: "Ontario",
            population : 14570000
        }
    };

    if (code) return hashmap[code];
    if (name) {
        var keys = Object.keys(hashmap);
        code = null;
        for (var i = 0; i < keys.length; i++) {
            if (hashmap[keys[i]].name === name) {
                code = keys[i];
                break;
            }
        }
        return code;
    }
    return null;
}

function fillNulls(data) {
    data.forEach(item => {
        var keys = Object.keys(item);
        keys.forEach(key => {
            if (item[key] === null) item[key] = 0;
        });
    })
}

function preProcessRequest(e, data) {
    // override server-side processing of DataTables, to send correct params supported by API
    if (data.url.indexOf('columns%5B0%5D%5Bdata%5D=id') !== -1) {
        var province = data.url.match(/&province=(.*?)&/) ? data.url.match(/&province=(.*?)&/)[1] : null;
        var start = parseInt(data.url.match(/&start=(.*?)&/)[1]);
        var length = parseInt(data.url.match(/&length=(.*?)&/)[1]);
        var page = Math.ceil(start / length) + 1;
        data.url = api_url + "cases?page=" + page + "&per_page=" + length + (province ? ("&province=" + province) : "");
    }

    return data;
}

function seeProvince() {
    window.location.href = url + "province.html";
}

function seeAllCases(province) {
    window.location.href = url + "allcases.html" + (province ? ('?province=' + province) : '');
}

function goCases() {
    window.location.href = "https://docs.google.com/spreadsheets/d/1e0QhkGT3XzJJh7l7EfUkK3be-81TawOEqO3JHMD8Y8s/edit?usp=sharing";
}

function goBack() {
    window.location.href = url + "index.html";
}