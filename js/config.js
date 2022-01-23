// current url (should update links to not require this)
var url = window.location.protocol + '//' + window.location.hostname + '/'; 
// api  
var api_url = "https://api.covid19tracker.ca/";
var devapi_url = "https://api.covid19tracker.ca/";
var provinceAgeGroup = {
	"NL": {
		population: 436312,
		boxEnabled: false
	},
	"PE": {
		population: 129799,
		boxEnabled: false
	},
	"NS": {
		population: 813389,
		boxEnabled: false
	},
	"NB": {
		population: 645289,
		boxEnabled: false
	},
	"QC": {
		population: 6972707,
		boxEnabled: false
	},
	"ON": {
		population: 12083325,
		boxEnabled: false
	},
	"MB": {
		population: 1068553,
		boxEnabled: false
	},
	"SK": {
		population: 942109,
		boxEnabled: false
	},
	"AB": {
		population: 3445146,
		boxEnabled: false
	},
	"BC": {
		population: 4273972,
		boxEnabled: false
	},
	"YT": {
		population: 33660,
		boxEnabled: false
	},
	"NT": {
		population: 34430,
		boxEnabled: false
	},
	"NU": {
		population: 24878,
		boxEnabled: false
	}
};

var ageGroupPopulation = {
	"CA": {
		"0-4": 1882571,
		"05-11": 2879112,
		"12-17": 2468487,
		"18-29": 6017203,
		"30-39": 5292403,
		"40-49": 4854363,
		"50-59": 5194811,
		"60-69": 4727516,
		"70-79": 3004925,
		"80+": 1663666
	},
	"NL": {
		"0-4": 19556,
		"05-11": 33237,
		"12-17": 31452,
		"18-29": 68153,
		"30-39": 59093,
		"40-49": 67180,
		"50-59": 83319,
		"60-69": 82057,
		"70-79": 53637,
		"80+": 22873
	},
	"PE": {
		"0-4": 7095,
		"05-11": 11792,
		"12-17": 10977,
		"18-29": 25825,
		"30-39": 18526,
		"40-49": 19817,
		"50-59": 22324,
		"60-69": 21466,
		"70-79": 14695,
		"80+": 7146
	},
	"NS": {
		"0-4": 41451,
		"05-11": 66251,
		"12-17": 58119,
		"18-29": 146519,
		"30-39": 119947,
		"40-49": 118101,
		"50-59": 144056,
		"60-69": 142617,
		"70-79": 95133,
		"80+": 47016
	},
	"NB": {
		"0-4": 33048,
		"05-11": 54298,
		"12-17": 48489,
		"18-29": 104081,
		"30-39": 91358,
		"40-49": 99730,
		"50-59": 117344,
		"60-69": 116991,
		"70-79": 77424,
		"80+": 38361
	},
	"QC": {
		"0-4": 421670,
		"05-11": 650354,
		"12-17": 529424,
		"18-29": 1242231,
		"30-39": 1126339,
		"40-49": 1108957,
		"50-59": 1184571,
		"60-69": 1148405,
		"70-79": 753760,
		"80+": 408444
	},
	"ON": {
		"0-4": 712821,
		"05-11": 1075423,
		"12-17": 961857,
		"18-29": 2455535,
		"30-39": 2056059,
		"40-49": 1876583,
		"50-59": 2060934,
		"60-69": 1795046,
		"70-79": 1159902,
		"80+": 679266
	},
	"MB": {
		"0-4": 82260,
		"05-11": 125477,
		"12-17": 101481,
		"18-29": 230201,
		"30-39": 193992,
		"40-49": 169280,
		"50-59": 170251,
		"60-69": 154144,
		"70-79": 95330,
		"80+": 55355
	},
	"SK": {
		"0-4": 72825,
		"05-11": 110123,
		"12-17": 89350,
		"18-29": 189909,
		"30-39": 183246,
		"40-49": 151896,
		"50-59": 147466,
		"60-69": 138471,
		"70-79": 79817,
		"80+": 51304
	},
	"AB": {
		"0-4": 258669,
		"05-11": 392380,
		"12-17": 322828,
		"18-29": 695123,
		"30-39": 715527,
		"40-49": 608435,
		"50-59": 550748,
		"60-69": 474412,
		"70-79": 260634,
		"80+": 140267
	},
	"BC": {
		"0-4": 224047,
		"05-11": 346009,
		"12-17": 303934,
		"18-29": 816513,
		"30-39": 740337,
		"40-49": 649294,
		"50-59": 720742,
		"60-69": 674171,
		"70-79": 436574,
		"80+": 236341
	},
	"YT": {
		"0-4": 2204,
		"05-11": 3579,
		"12-17": 2616,
		"18-29": 6016,
		"30-39": 7017,
		"40-49": 5914,
		"50-59": 5986,
		"60-69": 5501,
		"70-79": 2394,
		"80+": 832
	},
	"NT": {
		"0-4": 2850,
		"05-11": 4290,
		"12-17": 3519,
		"18-29": 7832,
		"30-39": 7110,
		"40-49": 6267,
		"50-59": 6627,
		"60-69": 4437,
		"70-79": 1651,
		"80+": 506
	},
	"NU": {
		"0-4": 4075,
		"05-11": 5899,
		"12-17": 4441,
		"18-29": 7716,
		"30-39": 5946,
		"40-49": 4488,
		"50-59": 4038,
		"60-69": 1817,
		"70-79": 694,
		"80+": 179
	}
};

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
            population : 8604495,
            code: "QC",
			displayNotes: false
        },
        "NL": {
            name: "Newfoundland and Labrador",
            population : 520553,
            code: "NL",
			displayNotes: false
        },
        "BC": {
            name: "British Columbia",
            population : 5214805,
            code: "BC",
			displayNotes: false
        },
        "NU": {
            name: "Nunavut",
            population : 39403,
            code: "NU",
			displayNotes: false
        },
        "NT": {
            name: "Northwest Territories",
            population : 45504,
            code: "NT",
			displayNotes: false
        },
        "NB": {
            name: "New Brunswick",
            population : 789225,
            code: "NB",
			displayNotes: false
        },
        "NS": {
            name: "Nova Scotia",
            population : 992055,
            code: "NS",
			displayNotes: false
        },
        "SK": {
            name: "Saskatchewan",
            population : 1179844,
            code: "SK",
			displayNotes: true
        },
        "AB": {
            name: "Alberta",
            population : 4442879,
            code: "AB",
			displayNotes: false
        },
        "PE": {
            name: "Prince Edward Island",
            population : 164318,
            code: "PE",
			displayNotes: false
        },
        "YT": {
            name: "Yukon",
            population : 42986,
            code: "YT",
			displayNotes: false
        },
        "MB": {
            name: "Manitoba",
            population : 1383765,
            code: "MB",
			displayNotes: false
        },
        "ON": {
            name: "Ontario",
            population : 14826276,
            code: "ON",
			displayNotes: false
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

function goRap() {
    window.location.href = url + "rapid.html";
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
