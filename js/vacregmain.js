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
var populationObj = [{
    "province": "AB",
    "population": 3547485
}, {
    "province": "BC",
    "population": 4378888
}, {
    "province": "MB",
    "population": 1101731
}, {
    "province": "NB",
    "population": 661556
}, {
    "province": "NL",
    "population": 446985
}, {
    "province": "NT",
    "population": 35535
}, {
    "province": "NS",
    "population": 833085
}, {
    "province": "NU",
    "population": 26207
}, {
    "province": "ON",
    "population": 12296737
}, {
    "province": "PE",
    "population": 133390
}, {
    "province": "QC",
    "population": 7138076
}, {
    "province": "SK",
    "population": 933947
}, {
    "province": "YT",
    "population": 34480
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
            $(".summary-header-percentVaccinated > b").text("of Canadians 16+ have received at least one dose");

        }
        else {
            $(".summary-header-percentVaccinated > h1").text((totalPopulationVaccinated).toFixed(3) + "%");
            $(".summary-header-percentVaccinated > b").text("of the Canadian population has received at least one dose");
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
        showAll(pCode);
    });

    //$("#provinceSelection").on("change", function (e) {
    function showAll(pCode) {
        //var pCode = $(this).val();
        //var pText = $("#provinceSelection option:selected").text();
        if (pCode === "")
            return "";
        province = provinces.find(function (_p) { return pCode === _p.code; });
        var population = province.population;
        var population16 = populationObj.find(function (_p) { return pCode === _p.province; }).population;
        var pText = province.name;
        noDataText = pText + " does not release regional vaccination data";
        $(".display-province").text(pText);
        //$(".display-select").hide();
        // get and update header, and cases by province table footer
        //draw map and cases by province graph and table


        document.querySelector('title').textContent = `COVID-19 Tracker Canada - ${pText} Vaccination Tracker`;

        $.ajax({
            url: api_url + "summary/split"
        }).then(res => {
            var data = res.data.find(function (_res) { return _res.province === pCode; });

            $("#activeCases").prop("checked", false);
            $("#criticalCases").prop("checked", false);

            vaccinations = data.total_vaccinations;
            peopleVaccinated = data.total_vaccinations - data.total_vaccinated;
            twoDoses = data.total_vaccinated;
            percentVaccinated = Math.floor((data.total_vaccinations - data.total_vaccinated) / population * 100) / 100;
            vaccinationsChange = data.change_vaccinations;
            vaccinesDistributed = data.total_vaccines_distributed;
            totalPopulationVaccinated = ((data.total_vaccinations - data.total_vaccinated) / population) * 100;
            totalPopulationVaccinated16 = ((data.total_vaccinations - data.total_vaccinated) / population16) * 100;

            // update timestamp
            $("#updateTime").text("As of " + moment(res.last_updated).format("dddd [at] h:mm a [CST, ]"));
            $("#updateVax").text(format(data.total_vaccinations));
            $("#updateChangeVax").text(format(data.change_vaccinations));
            $("#updateTwoDoses").text(format(data.total_vaccinated));
            $("#updateVaxPpl").text(format(data.total_vaccinations - data.total_vaccinated));
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
            $(".summary-header-percentVaccinated > h1").text((((data.total_vaccinations - data.total_vaccinated) / population) * 100).toFixed(3) + "%");
            $(".summary-header-percentVaccinated > b").text("of people in " + pText + " have received at least one dose");
            $(".summary-header-vaccinations > h1").text(format(data.total_vaccinations) + " doses administered");
            $(".summary-header-vaccinations > b").text(displayNewCases(data.change_vaccinations));
            $(".summary-header-pplVac > h1").text(data.total_vaccinations);
            $(".summary-header-pplVac > b").text("people have received at least one dose");
            $(".summary-header-vaccineDelivered > h1").text(format(data.total_vaccines_distributed) + " doses delivered");
            $(".summary-header-vaccineDelivered > b").text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%" + " of doses delivered have been administered");

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

            //$(".display-select").show();
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
                    _hrData = res2.find(function (t) { return t.hr_uid === v.hr_uid; })
                    if (typeof _hrData !== "undefined" && v.total_vaccinations !== null) {
                        v.name = typeof _hrData.engname !== "undefined" ? _hrData.engname : "Region" + v.hr_uid;
                        hrData.push(v);
                    }
                    if (typeof _hrData !== "undefined") {
                        hrDataTable.push(v);
                    }
                });
                barGraph2(hrData, "#provinceCasesChart");
                buildRegionTable(hrDataTable, res2);
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

function buildRegionTable(data, regionData) {
    data.forEach(function (item) {
        var regProvinceData = regionData.find(function (r) { return r.hr_uid === item.hr_uid; });
        var regName = typeof regProvinceData !== "undefined" ? regProvinceData.engname : "Region " + item.hr_uid;
        var itemTotalVaccinations = (item.total_vaccinations === null || item.total_vaccinations === undefined) ? "No Data" : item.total_vaccinations;
        var itemTotalVaccinated = (item.total_vaccinated === null || item.total_vaccinated === undefined) ? "No Data" : item.total_vaccinated;

        // append data to row
        $('#vaccinationsProvinceTable').append(
            "<tr class='provinceRow'>" +
            "<td>" +
            "<span>" + regName + "</span>" +
            "</td>" +
            "<td><i>" + format(itemTotalVaccinations) + (item.change_vaccinations ? ("<i>" + " " + displayNewCases(item.change_vaccinations)) : "" + "</i>") + "</i></td>" +
            "<td><i>" + format(itemTotalVaccinated) + "</i></td>" +
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