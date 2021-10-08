var totalCases = 0;
var totalCasesChange = 0;
var activeCases = 0;
var activeCasesChange = 0;
var critical = 0;
var criticalChange = 0;
var hospitalizations = 0;
var hospitalizationsChange = 0;
var totalVaccinations = 0;
var totalVaccinationsChange = 0;
var last5days = {};
var regions = [];
var noDataText = "";
var totalPopulationVaccinated = 0;
var totalPopulationVaccinated16 = 0;
var totalPopulationVaccinated2 = 0;
var totalPopulationVaccinated216 = 0;
var adults = 0;
var adultsFull = 0;
var _hrDataTable = [];
var _hrResponse = [];
var populationObj = [{
	"province": "AB",
	"population": 4442879,
	"populationEligible": 3791830,
	"regionsPopulation": {
		"4831": 309575, // "South Zone"
		"4832": 1728648, // "Calgary Zone"
		"4833": 480620, // "Central Zone"
		"4834": 1480081, // "Edmonton Zone"
		"4835": 459426 // "North Zone"
	},
	"regionsPopulationEligible": {
		"4831": 261159, // "South Zone"
		"4832": 1480861, // "Calgary Zone"
		"4833": 409091, // "Central Zone"
		"4834": 1265708, // "Edmonton Zone"
		"4835": 379557 // "North Zone"
	}
}, {
	"province": "BC",
	"population": 5214805,
	"populationEligible": 4644749,
	"regionsPopulation": {
		"591": 1961951, // "Fraser Health"
		"592": 823346, // "Interior Health"
		"593": 864079, // "Vancouver Island Health"
		"594": 301050, // "Northern Health"
		"595": 1249689 // "Vancouver  Coastal Health"
	},
	"regionsPopulationEligible": {
		"591": 1721508, // "Fraser Health"
		"592": 735765, // "Interior Health"
		"593": 776715, // "Vancouver Island Health"
		"594": 258457, // "Northern Health"
		"595": 1134377 // "Vancouver  Coastal Health"
	}
}, {
	"province": "MB",
	"population": 1383765,
	"populationEligible": 1176028,
	"regionsPopulation": {
		"4601": 788084, // "Winnipeg Regional Health Authority"
		"4602": 172995, // "Prairie Mountain Health"
		"4603": 134867, // "Interlake-Eastern Regional Health Authority"
		"4604": 75732, // "Northern Regional Health Authority"
		"4605": 212268 // "Southern Health—Santé Sud"
	},
	"regionsPopulationEligible": {
		"4601": 683093, // "Winnipeg Regional Health Authority"
		"4602": 145682, // "Prairie Mountain Health"
		"4603": 115508, // "Interlake-Eastern Regional Health Authority"
		"4604": 57004, // "Northern Regional Health Authority"
		"4605": 172154 // "Southern Health—Santé Sud"
	}
}, {
	"province": "NB",
	"population": 789225,
	"populationEligible": 701879,
	"regionsPopulation": {
		"1301": 229755, // "Zone 1 (Moncton area)"
		"1302": 177667, // "Zone 2 (Saint John area)"
		"1303": 185290, // "Zone 3 (Fredericton area)"
		"1304": 47698, // "Zone 4 (Edmundston area)"
		"1305": 24957, // "Zone 5 (Campbellton area)"
		"1306": 76348, // "Zone 6 (Bathurst area)"
		"1307": 43741 // "Zone 7 (Miramichi area)"
	},
	"regionsPopulationEligible": {
		"1301": 203484, // "Zone 1 (Moncton area)"
		"1302": 156294, // "Zone 2 (Saint John area)"
		"1303": 162593, // "Zone 3 (Fredericton area)"
		"1304": 42916, // "Zone 4 (Edmundston area)"
		"1305": 22714, // "Zone 5 (Campbellton area)"
		"1306": 69952, // "Zone 6 (Bathurst area)"
		"1307": 39387 // "Zone 7 (Miramichi area)"
	}
}, {

	"province": "NL",
	"population": 520553,
	"populationEligible": 467760,
	"regionsPopulation": {
		"1011": 318005, // "Eastern Regional Health Authority"
		"1012": 90299, // "Central Regional Health Authority"
		"1013": 76207, // "Western Regional Health Authority"
		"1014": 35957 // "Labrador-Grenfell Regional Health Authority"
	},
	"regionsPopulationEligible": {
		"1011": 284280, // "Eastern Regional Health Authority"
		"1012": 82183, // "Central Regional Health Authority"
		"1013": 69288, // "Western Regional Health Authority"
		"1014": 31020 // "Labrador-Grenfell Regional Health Authority"
	}
}, {

	"province": "NT",
	"population": 45504,
	"populationEligible": 38364,
	"regionsPopulation": {
		"6101": 45504 // "Northwest Territories"
	},
	"regionsPopulationEligible": {
		"6101": 38364 // "Northwest Territories"
	}
}, {

	"province": "NS",
	"population": 992055,
	"populationEligible": 884353,
	"regionsPopulation": {
		"1201": 199520, // "Zone 1 - Western"
		"1202": 148718, // "Zone 2 - Northern"
		"1203": 161838, // "Zone 3 - Eastern"
		"1204": 475049 // "Zone 4 - Central"
	},
	"regionsPopulationEligible": {
		"1201": 179438, // "Zone 1 - Western"
		"1202": 131897, // "Zone 2 - Northern"
		"1203": 145071, // "Zone 3 - Eastern"
		"1204": 419961 // "Zone 4 - Central"
	}
}, {
	"province": "NU",
	"population": 39403,
	"populationEligible": 29429,
	"regionsPopulation": {
		"6201": 39403 // "Nunavut"
	},
	"regionsPopulationEligible": {
		"6201": 29429 // "Nunavut"
	}
}, {
	"province": "ON",
	"population": 14826276, // 14845710
	"populationEligible": 13038032,
	"regionsPopulation": {
		"3526": 117433, //"The District of Algoma Health Unit"
		"3527": 154616, //"Brant County Health Unit"
		"3530": 717732, //"Durham Regional Health Unit"
		"3533": 176731, //"Grey Bruce Health Unit"
		"3534": 120255, //"Haldimand-Norfolk Health Unit"
		"3535": 191499, //"Haliburton, Kawartha, Pine Ridge District Health Unit"
		"3536": 616852, //"Halton Regional Health Unit"
		"3537": 586092, //"City of Hamilton Health Unit"
		"3538": 173299, //"Hastings and Prince Edward Counties Health Unit"
		"3539": 147099, //"Huron Perth Public Health Unit"
		"3540": 106779, //"Chatham-Kent Health Unit"
		"3541": 209864, //"Kingston, Frontenac and Lennox and Addington Health Unit"
		"3542": 133271, //"Lambton Health Unit"
		"3543": 180362, //"Leeds, Grenville and Lanark District Health Unit"
		"3544": 516035, //"Middlesex-London Health Unit"
		"3546": 484809, //"Niagara Regional Area Health Unit"
		"3547": 129470, //"North Bay Parry Sound District Health Unit"
		"3549": 80986, //"Northwestern Health Unit"
		"3551": 1052217, //"City of Ottawa Health Unit"
		"3553": 1584273, //"Peel Regional Health Unit"
		"3555": 148400, //"Peterborough County–City Health Unit"
		"3556": 84775, //"Porcupine Health Unit"
		"3557": 108524, //"Renfrew County and District Health Unit"
		"3558": 216569, //"The Eastern Ontario Health Unit"
		"3560": 608746, //"Simcoe Muskoka District Health Unit"
		"3561": 205175, //"Sudbury and District Health Unit"
		"3562": 156986, //"Thunder Bay District Health Unit"
		"3563": 33742, //"Timiskaming Health Unit"
		"3565": 612513, //"Waterloo Health Unit"
		"3566": 313848, //"Wellington-Dufferin-Guelph Health Unit"
		"3568": 432621, //"Windsor-Essex County Health Unit"
		"3570": 1211576, //"York Regional Health Unit"
		"3575": 220116, //"Southwestern Public Health Unit"
		"3595": 3012445 //"City of Toronto Health Unit"
	},
	"regionsPopulationEligible": {
		"3526": 104643, //"The District of Algoma Health Unit"
		"3527": 133015, //"Brant County Health Unit"
		"3530": 618162, //"Durham Regional Health Unit"
		"3533": 154649, //"Grey Bruce Health Unit"
		"3534": 105459, //"Haldimand-Norfolk Health Unit"
		"3535": 172692, //"Haliburton, Kawartha, Pine Ridge District Health Unit"
		"3536": 531835, //"Halton Regional Health Unit"
		"3537": 513431, //"City of Hamilton Health Unit"
		"3538": 153530, //"Hastings and Prince Edward Counties Health Unit"
		"3539": 126842, //"Huron Perth Public Health Unit"
		"3540": 93772, //"Chatham-Kent Health Unit"
		"3541": 187084, //"Kingston, Frontenac and Lennox and Addington Health Unit"
		"3542": 117294, //"Lambton Health Unit"
		"3543": 160810, //"Leeds, Grenville and Lanark District Health Unit"
		"3544": 451138, //"Middlesex-London Health Unit"
		"3546": 430520, //"Niagara Regional Area Health Unit"
		"3547": 115443, //"North Bay Parry Sound District Health Unit"
		"3549": 68724, //"Northwestern Health Unit"
		"3551": 922250, //"City of Ottawa Health Unit"
		"3553": 1378144, //"Peel Regional Health Unit"
		"3555": 131858, //"Peterborough County–City Health Unit"
		"3556": 73483, //"Porcupine Health Unit"
		"3557": 94951, //"Renfrew County and District Health Unit"
		"3558": 189253, //"The Eastern Ontario Health Unit"
		"3560": 535157, //"Simcoe Muskoka District Health Unit"
		"3561": 181536, //"Sudbury and District Health Unit"
		"3562": 138008, //"Thunder Bay District Health Unit"
		"3563": 29551, //"Timiskaming Health Unit"
		"3565": 532183, //"Waterloo Health Unit"
		"3566": 271461, //"Wellington-Dufferin-Guelph Health Unit"
		"3568": 379734, //"Windsor-Essex County Health Unit"
		"3570": 1060671, //"York Regional Health Unit"
		"3575": 188874, //"Southwestern Public Health Unit"
		"3595": 2689105 //"City of Toronto Health Unit"
	}
}, {

	"province": "PE",
	"population": 164318,
	"populationEligible": 145431,
	"regionsPopulation": {
		"1100": 164318 // "Prince Edward Island"
	},
	"regionsPopulationEligible": {
		"1100": 145431 // "Prince Edward Island"
	}
}, {
	"province": "QC",
	"population": 8604495,
	"populationEligible": 7532471,
	"regionsPopulation": {
		"2401": 197856, // "Région du Bas-Saint-Laurent"
		"2402": 278851, // "Région du Saguenay—Lac-Saint-Jean"
		"2403": 759583, // "Région de la Capitale-Nationale"
		"2404": 526375, // "Région de la Mauricie et du Centre-du-Québec"
		"2405": 499945, // "Région de l'Estrie"
		"2406": 2075553, // "Région de Montréal"
		"2407": 402944, // "Région de l'Outaouais"
		"2408": 147445, // "Région de l'Abitibi-Témiscamingue"
		"2409": 89937, // "Région de la Côte-Nord"
		"2410": 14276, // "Région du Nord-du-Québec"
		"2411": 90515, // "Région de la Gaspésie—Îles-de-la-Madeleine"
		"2412": 434401, // "Région de la Chaudière-Appalaches"
		"2413": 444562, // "Région de Laval"
		"2414": 526621, // "Région de Lanaudière"
		"2415": 635138, // "Région des Laurentides"
		"2416": 1445829, // "Région de la Montérégie"
		"2417": 13488, // "Région du Nunavik"
		"2418": 17946 // "Région des Terres-Cries-de-la-Baie-James"
	},
	"regionsPopulationEligible": {
		"2401": 176123, // "Région du Bas-Saint-Laurent"
		"2402": 246351, // "Région du Saguenay—Lac-Saint-Jean"
		"2403": 669511, // "Région de la Capitale-Nationale"
		"2404": 465010, // "Région de la Mauricie et du Centre-du-Québec"
		"2405": 439679, // "Région de l'Estrie"
		"2406": 1819303, // "Région de Montréal"
		"2407": 348570, // "Région de l'Outaouais"
		"2408": 127909, // "Région de l'Abitibi-Témiscamingue"
		"2409": 78733, // "Région de la Côte-Nord"
		"2410": 12522, // "Région du Nord-du-Québec"
		"2411": 81810, // "Région de la Gaspésie—Îles-de-la-Madeleine"
		"2412": 379155, // "Région de la Chaudière-Appalaches"
		"2413": 387166, // "Région de Laval"
		"2414": 455071, // "Région de Lanaudière"
		"2415": 555005, // "Région des Laurentides"
		"2416": 1254427, // "Région de la Montérégie"
		"2417": 9866, // "Région du Nunavik"
		"2418": 13731 // "Région des Terres-Cries-de-la-Baie-James"
	}
},
{
	"province": "SK",
	"population": 1179844,
	"populationEligible": 996896,
	"regionsPopulation": {
		"471": 51710, // "Far North"
		"472": 202809, // "North"
		"473": 131941, // "Central"
		"474": 342056, // "Saskatoon"
		"475": 269284, // "Regina"
		"476": 184251 // "South"
	},
	"regionsPopulationEligible": {
		"471": 39865, // "Far North"
		"472": 168145, // "North"
		"473": 113577, // "Central"
		"474": 289664, // "Saskatoon"
		"475": 228633, // "Regina"
		"476": 157095 // "South"
	}
}, {
	"province": "YT",
	"population": 42986,
	"populationEligible": 37203,
	"regionsPopulation": {
		"6001": 42986 // "Yukon"
	},
	"regionsPopulationEligible": {
		"6001": 37203 // "Yukon"
	}
}];

// Helper function to format numbers with commas
const formatter = new Intl.NumberFormat('en-CA');
function format(value) {
    const formattedValue = formatter.format(value);
    // this safely returns any values that aren't numbers, such a 'N/A'
    if (formattedValue === 'NaN') return value;
    // otherwise return the number as a string with commas in it
    return formattedValue;
}



// Controls the state of the application, sets up correct data information
$(document).ready(() => {
    //$(".display-select").hide();

    $("#perCapita").on('change', function () {
        var field = $(this).val();

        switch (field) {
            case "cases":
                $('#infectedPerCanada').text($('#totalCasesCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(2)").attr("data-per-capita"));
                });
                break;
            case "fatalities":
                $('#infectedPerCanada').text($('#totalFatalitiesCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(3)").attr("data-per-capita"));
                });
                break;
            case "hospitalizations":
                $('#infectedPerCanada').text($('#totalHospitalizationsCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(4)").attr("data-per-capita"));
                });
                break;
            case "criticals":
                $('#infectedPerCanada').text($('#totalCriticalsCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(5)").attr("data-per-capita"));
                });
                break;
            case "recoveries":
                $('#infectedPerCanada').text($('#totalRecoveriesCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(6)").attr("data-per-capita"));
                });
                break;
            case "tests":
                $('#infectedPerCanada').text($('#totalTestsCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(7)").attr("data-per-capita"));
                });
                break;
            case "vaccinations":
                $('#infectedPerCanada').text($('#totalVaccinationsCanada').attr("data-per-capita"));
                $('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
                    $(item).find("td:nth-child(9)").text($(item).find("td:nth-child(8)").attr("data-per-capita"));
                });
                break;
        }

        return true;
    });


    var provinces = [];
    $.ajax({
        url: api_url + "provinces"
    }).then(res => {
        provinces = res;
        var pCode = getParameterByName("p");
        if (!pCode || pCode === "") {
            window.location = "vaccinationtracker.html";
        } else
            pCode = pCode.toUpperCase();
		$.ajax({
			url: api_url + "vaccines/reports/latest"
		}).then(res2 => {
			var data2 = res2.data.find(function(_res2) { return _res2.province === pCode; });
			showAll(pCode, data2);
		});
		
		
		if (provinceProperties(pCode).displayNotes) {
			$(".province-data-notes").removeClass("d-none");
		}
    });

    //$("#provinceSelection").on("change", function (e) {
    function showAll(pCode, latest) {
        //var pCode = $(this).val();
        //var pText = $("#provinceSelection option:selected").text();
        if (pCode === "")
            return "";
        province = provinces.find(function (_p) { return pCode === _p.code; });
        var population = province.population;
		var populationEligible = populationObj.find(function (_p) { return pCode === _p.province; }).populationEligible;
        var date1 = province.updated_at;
        var date = date1.substring(0, date1.length - 17);

        var population16 = populationObj.find(function (_p) { return pCode === _p.province; }).population;
        var pText = province.name;
		var booster = latest.total_boosters_1 > 0 ? latest.total_boosters_1 : 0;
        noDataText = pText + " does not release regional vaccination data";
        $(".display-province").text(pText);
        //$(".display-select").hide();
        // get and update header, and cases by province table footer
        //draw map and cases by province graph and table

    $("#activeCases").on('change', function () {
        var checked = $("#activeCases").prop("checked");
        if (checked) {
            $(".summary-header-cases > h1").text(activeCases + " active");
            $(".summary-header-cases > b").text(displayNewCases(activeCasesChange));
        }
        else {
            $(".summary-header-cases > h1").text(totalCases + " cases");
            $(".summary-header-cases > b").text(displayNewCases(totalCasesChange));
        }
    });

    $("#criticalCases").on('change', function () {
        var checked = $("#criticalCases").prop("checked");
        if (checked) {

            $(".summary-header-vaccinations > h1").text(format(peopleVaccinated) + " people");
            $(".summary-header-vaccinations > b").text("have received at least one dose");

        }
        else {
            $(".summary-header-vaccinations > h1").text(format(vaccinations) + " doses administered");
            $(".summary-header-vaccinations > b").text(displayNewCases(vaccinationsChange));
        }
    });

    $("#popDoseToggle").on('change', function () {
        var checked = $("#popDoseToggle").prop("checked");
        if (checked) {
            $(".summary-header-percentVaccinated > h1").text((totalPopulationVaccinated16).toFixed(3) + "%");
            $(".summary-header-percentVaccinated > b").text("of people 12+ in " + pText + " have received at least one dose");

        }
        else {
            $(".summary-header-percentVaccinated > h1").text((totalPopulationVaccinated).toFixed(3) + "%");
            $(".summary-header-percentVaccinated > b").text("of all people in " + pText + " have received at least one dose");
        }
    });

    $("#popDose2Toggle").on('change', function () {
        var checked = $("#popDose2Toggle").prop("checked");
        if (checked) {
            $(".summary-header-percentVaccinated2 > h1").text((totalPopulationVaccinated216).toFixed(3) + "%");
            $(".summary-header-percentVaccinated2 > b").text("of people 12+ in " + pText + " are fully vaccinated");

        }
        else {
            $(".summary-header-percentVaccinated2 > h1").text((totalPopulationVaccinated2).toFixed(3) + "%");
            $(".summary-header-percentVaccinated2 > b").text("of all people in " + pText + " are fully vaccinated");
        }
    });
	
    $(".summary-arrow").click(function () {
        var container = $(this).next();
        container.empty();
        var field = $(this).attr("data-field");
        var data = last5days[field];
        if (data !== undefined) {
            data.forEach(item => {
                container.append("<div>" +
                    "<span>" + item.label + "</span>" +
                    "<span>" + item.total + " " + (item.change !== null && item.change !== undefined ? displayNewCasesOlder(item.change) : "") + "</span>" +
                    "</div>");
            });
        }
        container.toggle();
    });

        document.querySelector('title').textContent = `COVID-19 Tracker Canada - ${pText} Vaccination Tracker`;

        $.ajax({
            url: api_url + "summary/split"
        }).then(res => {
			var data = res.data.find(function (_res) { return _res.province === pCode; });
			
			$("#activeCases").prop("checked", false);
			$("#criticalCases").prop("checked", false);

			vaccinations = data.total_vaccinations;
			peopleVaccinated = data.total_vaccinations - (data.total_vaccinated + booster);
			twoDoses = data.total_vaccinated;
			percentVaccinated = Math.floor((data.total_vaccinations - (data.total_vaccinated + booster)) / population * 100) / 100;
			vaccinationsChange = data.change_vaccinations;
			vaccinesDistributed = data.total_vaccines_distributed;
			totalPopulationVaccinated = ((data.total_vaccinations - (data.total_vaccinated + booster)) / population) * 100;
			totalPopulationVaccinated16 = ((data.total_vaccinations - (data.total_vaccinated + booster)) / populationEligible) * 100;
			totalPopulationVaccinated2 = ((data.total_vaccinated) / population) * 100;
			totalPopulationVaccinated216 = ((data.total_vaccinated) / populationEligible) * 100;
			date = data.last_updated;

			// update timestamp
			$("#updateTime").text("As of " + moment(res.last_updated).format("dddd [at] h:mm a [CST, ]"));
			$("#updateVax").text(format(data.total_vaccinations));
			$("#updateChangeVax").text(format(data.change_vaccinations));
			$("#updateTwoDoses").text(format(data.total_vaccinated));
			$("#updateVaxPpl").text(format(data.total_vaccinations - (data.total_vaccinated + booster)));
			$("#updateTotalDel").text(format(data.total_vaccines_distributed));
			$("#updatePerAdm").text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%")

			// update header
			$(".summary-header-cases > h1").text(data.total_cases + " cases");
			$(".summary-header-cases > b").text(displayNewCases(data.change_cases));
			$(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
			$(".summary-header-deaths > b").text(displayNewCases(data.change_fatalities));
			$(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
			$(".summary-header-hospitalized > b").text(displayNewCases(data.change_hospitalizations));
			$(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
			$(".summary-header-recoveries > b").text(displayNewCases(data.change_recoveries));
			$(".summary-header-percentVaccinated > h1").text((((data.total_vaccinations - (data.total_vaccinated + booster)) / population) * 100).toFixed(3) + "%");
			$(".summary-header-percentVaccinated > b").text("of all people in " + pText + " have received at least one dose");
			$(".summary-header-percentVaccinated2 > h1").text((((data.total_vaccinated) / population) * 100).toFixed(3) + "%");
			$(".summary-header-percentVaccinated2 > b").text("of all people in " + pText + " are fully vaccinated");
			$(".summary-header-vaccinations > h1").text(format(data.total_vaccinations) + " doses administered");
			$(".summary-header-vaccinations > b").text(displayNewCases(data.change_vaccinations));
			$(".summary-header-pplVac > h1").text(data.total_vaccinations);
			$(".summary-header-pplVac > b").text("people have received at least one dose");
			$(".summary-header-vaccineDelivered > h1").text(format(data.total_vaccines_distributed) + " doses delivered");
			$(".summary-header-vaccineDelivered > b").text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%" + " of doses delivered have been administered");

			$("#tablePopulationToggle").on('change', function () {
				var checked = $("#tablePopulationToggle").prop("checked");
				buildRegionTable(_hrDataTable, _hrResponse, checked, booster);
				if (checked) {
					$('#totalOneDoseProvince').text((((data.total_vaccinations - (data.total_vaccinated + booster)) / populationEligible) * 100).toFixed(2) + '%');
					$('#totalFullDoseProvince').text(((data.total_vaccinated / populationEligible) * 100).toFixed(2) + '%');
				} else {
					$('#totalOneDoseProvince').text((((data.total_vaccinations - (data.total_vaccinated + booster)) / population) * 100).toFixed(2) + '%');
					$('#totalFullDoseProvince').text(((data.total_vaccinated / population) * 100).toFixed(2) + '%');
				}
			});

			// update province table footer
			var casesPer100000 = Math.floor(((100000 * data.total_cases) / population) * 100) / 100;
			var fatalitiesPer100000 = Math.floor(((100000 * data.total_fatalities) / population) * 100) / 100;
			var hospitalizationsPer100000 = Math.floor(((100000 * data.total_hospitalizations) / population) * 100) / 100;
			var criticalsPer100000 = Math.floor(((100000 * data.total_criticals) / population) * 100) / 100;
			var recoveriesPer100000 = Math.floor(((100000 * data.total_recoveries) / population) * 100) / 100;
			var testsPer100000 = Math.floor(((100000 * data.total_tests) / population) * 100) / 100;
			var vaccinationsPer100000 = Math.floor(((100000 * data.total_vaccinations) / population) * 100) / 100;
			var vaccinationsPercent = Math.floor(((100000 * data.total_vaccinations) / data.total_vaccines_distributed) * 100) / 100;
			$('#totalCasesCanada').attr("data-per-capita", casesPer100000);
			$('#totalFatalitiesCanada').attr("data-per-capita", fatalitiesPer100000);
			$('#totalHospitalizationsCanada').attr("data-per-capita", hospitalizationsPer100000);
			$('#totalCriticalsCanada').attr("data-per-capita", criticalsPer100000);
			$('#totalRecoveriesCanada').attr("data-per-capita", recoveriesPer100000);
			$('#totalTestsCanada').attr("data-per-capita", testsPer100000);
			$('#totalVaccinationsCanada').attr("data-per-capita", vaccinationsPer100000);
			$('#totalVaccinationsChangeCanada').attr("data-per-capita", vaccinationsPer100000);

			$('#totalCasesCanada').text(data.total_cases + (data.change_cases ? (" " + displayNewCases(data.change_cases)) : ""));
			$('#totalFatalitiesCanada').text(data.total_fatalities + (data.change_fatalities ? (" " + displayNewCases(data.change_fatalities)) : ""));
			$('#totalHospitalizationsCanada').text(data.total_hospitalizations + (data.change_hospitalizations ? (" " + displayNewCases(data.change_hospitalizations)) : ""));
			$('#totalCriticalsCanada').text(data.total_criticals + (data.change_criticals ? (" " + displayNewCases(data.change_criticals)) : ""));
			$('#totalRecoveriesCanada').text(data.total_recoveries + (data.change_recoveries ? (" " + displayNewCases(data.change_recoveries)) : ""));
			$('#totalTestsCanada').text(data.total_tests + (data.change_tests ? (" " + displayNewCases(data.change_tests)) : ""));
			$('#totalVaccinationsCanada').text(data.total_vaccinations + (data.change_vaccinations ? (" " + displayNewCases(data.change_vaccinations)) : ""));
			$('#totalVaccinationsDistCanada').text(data.total_vaccines_distributed);
			$('#totalVaccinationsPercentCanada').text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%")
			$('#totalVaccinationsChangeCanada').text(data.change_vaccinations);
			$('#totalVaccinatedCanada').text(data.total_vaccinated);
			$('#vaccinatedPerCanada').text(vaccinationsPer100000);
			$('#infectedPerCanada').text(casesPer100000);
			$('#totalOneDoseProvince').text((((data.total_vaccinations - (data.total_vaccinated + booster)) / population) * 100).toFixed(2) + '%');
			$('#totalFullDoseProvince').text(((data.total_vaccinated / population) * 100).toFixed(2) + '%');
        });

        $.ajax({
            url: api_url + "province/" + pCode + "/regions"
        }).then(res2 => {
            $.ajax({
                url: api_url + "summary/split/hr"
            }).then(res3 => {
                var hrData = [];
                var hrDataTable = [];
                $.each(res3.data, function (i, v) {
                    _hrData = res2.find(function (t) { return t.hr_uid === v.hr_uid; });
                    if (typeof _hrData !== "undefined" && v.total_vaccinations !== null) {
                        v.name = typeof _hrData.engname !== "undefined" ? _hrData.engname : "Region" + v.hr_uid;
                        hrData.push(v);
                    }
                    if (typeof _hrData !== "undefined") {
						v.regPopulation = populationObj.find(function (_p) { return pCode === _p.province; }).regionsPopulation[v.hr_uid];
						v.regPopulationEligible = populationObj.find(function (_p) { return pCode === _p.province; }).regionsPopulationEligible[v.hr_uid];
                        hrDataTable.push(v);
                    }
                });
				_hrDataTable = hrDataTable;
				_hrResponse = res2;
                barGraph2(hrData, "#provinceCasesChart");
                buildRegionTable(hrDataTable, res2, false, booster);
            });
        });

        $.ajax({
            url: api_url + "reports/province/" + pCode + "?after=2020-12-10?fill_dates=true",
            type: "GET",
        }).then(res => {
            fillNulls(res.data);
            last5days = getLast5Days(res.data, "total_");
            lineGraph(res.data, "#dailyCaseChart", false);
            lineGraph(res.data, "#cumulativeCaseChart", true, "province");
        });

        $.ajax({
            url: api_url + "vaccines/distribution/split",
            type: "GET",
        }).then(res => {
            var data = res.data.find(function (r) {
                return r.province === pCode;
            });
            pieChart(data, "#vaccineDistribution");
            barGraph3(data, "#vaccineDistributionBarCanvas");
            $("#vaccineDistributionBarCanvas").css("max-height", $("#vaccineDistributionDiv").height() + "px");
            $("#vaccineDistributionLastUpdate").text(data.date);
            $("#vaccineDistributionLastUpdate2").text(data.date);
        });
		
		$.ajax({
			url: api_url + "vaccines/reports/province/" + pCode + "?after=" + date,
			type: "GET",
		}).then(res => {
			
			if (provinceAgeGroup[pCode].boxEnabled) {
                var data = res.data[0];

				$(".summary-header-percentVaccinated-ageGroup > h1").text((((data.total_adults_vaccinations - data.total_adults_vaccinated) / provinceAgeGroup[pCode].population) * 100).toFixed(3) + "%");
				$(".summary-header-percentVaccinated-ageGroup > b").text("of adults (18+) in " + provinceProperties(pCode).name + " have received at least one dose");
				$(".summary-header-percentFullyVaccinated-ageGroup > h1").text(((data.total_adults_vaccinated / provinceAgeGroup[pCode].population) * 100).toFixed(3) + "%");
				$(".summary-header-percentFullyVaccinated-ageGroup > b").text("of adults (18+) in " + provinceProperties(pCode).name + " are fully vaccinated");
			} else {
				$(".summary-header-percentVaccinated-ageGroup").parents(".card-body").hide();
				$(".summary-header-percentFullyVaccinated-ageGroup").parents(".card-body").hide();
			}
		});

        $.ajax({
            url: api_url + "vaccines/age-groups/province/" + pCode + "?after=2021-04-24",
            type: "GET",
        }).then(res => {
            lineGraph2(res.data, "#ageGroupChart", false, "full", pCode);
            lineGraph2(res.data, "#ageGroupAtleast1Chart", false, "atleast1", pCode);
            barGraph4(res.data[res.data.length - 1].data, "#ageGroupBarCanvas", pCode);
			
			$("#ageGroupFullToggle").on("change", function(){
				updateAgeGroupChart($("#" + $(this).data("target")), $(this).is(":checked"), res.data, "full");
			});
			
			$("#ageGroupAtleast1Toggle").on("change", function(){
				updateAgeGroupChart($("#" + $(this).data("target")), $(this).is(":checked"), res.data, "atleast1");
			});
			
			$("#ageGroupBarToggle").on("change", function(){
				updateAgeGroupBar($("#" + $(this).data("target")), $(this).is(":checked"), res.data[res.data.length - 1].data);
			});
        });

		$('[data-toggle="tooltip"]').tooltip({
			trigger: 'hover'
		});
    }

    $(window).on("resize", function () {
        $('#totalCasesProvinceTable .regionTable').each((index, regionsRow) => {
            var container = $(regionsRow).prev();
            var firstCells = container.find("td");
            var regionsRows = $(regionsRow).find("tr");
            regionsRows.each((index, row) => {
                var secondCells = $(row).find("td");
                firstCells.each((index2, cell) => {
                    var newWidth = $(cell).width();
                    if (index2 === 0) newWidth += 2;
                    $(secondCells[index2]).width(newWidth);
                });
            });
        });
    });
});

function buildRegionTable(data, regionData, isEligible, booster) {
	$('#vaccinationsProvinceTable').children().remove();
    data.forEach(function (item) {
        var regProvinceData = regionData.find(function (r) { return r.hr_uid === item.hr_uid; });
        var regName = typeof regProvinceData !== "undefined" ? regProvinceData.engname : "Region " + item.hr_uid;
        var itemTotalVaccinations = (item.total_vaccinations === null || item.total_vaccinations === undefined) ? "No Data" : item.total_vaccinations;
        var itemTotalVaccinated = (item.total_vaccinated === null || item.total_vaccinated === undefined) ? "No Data" : item.total_vaccinated;
		var oneDosePercentage = itemTotalVaccinated === "No Data" ? "No Data" : ((((itemTotalVaccinations - (itemTotalVaccinated)) / (isEligible ? item.regPopulationEligible : item.regPopulation)) * 100).toFixed(2) + "%");
		var fullDosePercentage = itemTotalVaccinated === "No Data" ? "No Data" : (((itemTotalVaccinated / (isEligible ? item.regPopulationEligible : item.regPopulation)) * 100).toFixed(2) + "%");
		
		if (oneDosePercentage === NaN) {
			oneDosePercentage = "No Data";
		}
		
		if (oneDosePercentage === NaN) {
			oneDosePercentage = "No Data";
		}

        // append data to row
        $('#vaccinationsProvinceTable').append(
            "<tr class='provinceRow'>" +
            "<td>" +
            "<span>" + regName + "</span>" +
            "</td>" +
            "<td><i>" + format(itemTotalVaccinations) + (item.change_vaccinations ? ("<i>" + " " + displayNewCases(item.change_vaccinations)) : "" + "</i>") + "</i></td>" +
            "<td><i>" + format(itemTotalVaccinated) + "</i></td>" +
			"<td><i>" + format(oneDosePercentage) + "</i></td>" +
			"<td><i>" + format(fullDosePercentage) + "</i></td>" +
            "</tr>"
        );
    });
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}