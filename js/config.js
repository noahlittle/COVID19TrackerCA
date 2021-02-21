// current url (should update links to not require this)
var url = window.location.protocol + '//' + window.location.hostname + '/'; 
// api  
var api_url = "https://api.covid19tracker.ca/";
var devapi_url = "https://api.covid19tracker.ca/";

var provinceSources = {
    ON: "https://covid19tracker.ca/sources.html",
    QC: "https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/",
    BC: "http://www.bccdc.ca/health-info/diseases-conditions/covid-19/data",
    AB: "https://www.alberta.ca/covid-19-alberta-data.aspx",
    SK: "https://www.saskatchewan.ca/government/health-care-administration-and-provider-resources/treatment-procedures-and-guidelines/emerging-public-health-issues/2019-novel-coronavirus/cases-and-risk-of-covid-19-in-saskatchewan",
    MB: "https://manitoba.ca/covid19/",
    PE: "https://www.princeedwardisland.ca/en/information/health-and-wellness/pei-covid-19-case-data",
    NL: "https://covid-19-newfoundland-and-labrador-gnl.hub.arcgis.com/",
    NS: "https://novascotia.ca/coronavirus/data/",
    NB: "https://experience.arcgis.com/experience/8eeb9a2052d641c996dba5de8f25a8aa",
    NU: "https://www.gov.nu.ca/health/information/covid-19-novel-coronavirus",
    NT: "https://www.gov.nt.ca/covid-19/",
    YT: "https://yukon.ca/en/case-counts-covid-19"
};

function expectedTime(code) {
    var expectedTimes = {
        ON: "17:05 CST",
        QC: "11:05 CST",
        BC: "16:05 CST",
        AB: "15:35 CST",
        SK: "13:30 CST",
        MB: "12:05 CST",
        PE: "Varies",
        NL: "11:35 CST",
        NS: "09:30 CST",
        NB: "11:00 CST",
        NU: "Varies",
        NT: "15:00 CST",
        YT: "15:00 CST"
    }

    return expectedTimes[code] || '';
}

function provinceProperties(code, name) {
    var hashmap = {
        "QC": {
            name: "Quebec",
            population : 8575779,
            code: "QC"
        },
        "NL": {
            name: "Newfoundland and Labrador",
            population : 520998,
            code: "NL"
        },
        "BC": {
            name: "British Columbia",
            population : 5145851,
            code: "BC"
        },
        "NU": {
            name: "Nunavut",
            population : 39285,
            code: "QC"
        },
        "NT": {
            name: "Northwest Territories",
            population : 45074,
            code: "NT"
        },
        "NB": {
            name: "New Brunswick",
            population : 781315,
            code: "NB"
        },
        "NS": {
            name: "Nova Scotia",
            population : 979115,
            code: "NS"
        },
        "SK": {
            name: "Saskatchewan",
            population : 1177884,
            code: "SK"
        },
        "AB": {
            name: "Alberta",
            population : 4428112,
            code: "AB"
        },
        "PE": {
            name: "Prince Edward Island",
            population : 159713,
            code: "PE"
        },
        "YT": {
            name: "Yukon",
            population : 42176,
            code: "YT"
        },
        "MB": {
            name: "Manitoba",
            population : 1379584,
            code: "MB"
        },
        "ON": {
            name: "Ontario",
            population : 14733119,
            code: "ON"
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

function displayNewCases(cases) {
    if (cases >= 0) cases = "+" + cases;
    return "(" + cases + " today)";
}

function displayNewCasesOlder(cases) {
    if (cases >= 0) cases = "+" + cases;
    return "(" + cases + ")";
}

function goCases() {
    window.location.href = "https://docs.google.com/spreadsheets/d/1e0QhkGT3XzJJh7l7EfUkK3be-81TawOEqO3JHMD8Y8s/edit?usp=sharing";
}

function goBack() {
    window.location.href = url + "index.html";
}

function goVax() {
    window.location.href = url + "vaccinationtracker.html";
}

function compareProvinces() {
    window.location.href = url + "compareprovinces.html";
}

function getLast5Days(data, prefix) {
    var last5days = {};

    var fields = ["cases", "fatalities", "hospitalizations", "recoveries", "tests", "vaccinations"];
    fields.forEach(field => {
        last5days[field] = [];
        for (var i = 2; i <= 6; i++) {
            let row = data[data.length-i];
            if (row !== undefined && row !== null &&
                row[prefix + field] !== undefined && row[prefix + field] !== null) {
                last5days[field].push({total: row[prefix + field], change: row["change_" + field], label: (i - 1) + (i === 2 ? " day " : " days ") + "ago"});
            }
        }
    });

    return last5days;
}

function parseRegions(data, regions) {
    data.forEach(item => {
        if (regions[item.province] === undefined) regions[item.province] = [];
        regions[item.province].push(item);
    });
}