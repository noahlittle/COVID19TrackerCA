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


// Controls the state of the application, sets up correct data information
$(document).ready(() => {

    // get and update header, and cases by province table footer
    $.ajax({
        url: api_url + "summary"
    }).then(res => {
        var data = res.data[0];

        $("#activeCases").prop("checked", false);
        $("#criticalCases").prop("checked", false);

       // totalCases = data.total_cases;
       // totalCasesChange = data.change_cases;
      //  activeCases = data.total_cases - data.total_fatalities - data.total_recoveries;
       // activeCasesChange = data.change_cases - data.change_fatalities - data.change_recoveries;
       // critical = data.total_criticals;
       // criticalChange = data.change_criticals;
       //  hospitalizations = data.total_hospitalizations;
        // hospitalizationsChange = data.change_hospitalizations;
        
        vaccinations = data.total_vaccinations;
        peopleVaccinated = data.total_vaccinations;
        percentVaccinated = Math.floor((data.total_vaccinations) / canadaPopulation * 100) / 100;
        vaccinationsChange = data.change_vaccinations;

        // update timestamp

        

        $("#updateTime").text("As of " + moment(res.last_updated).format("dddd [at] h:mm a [CST, ]"));
        $("#updateVax").text(data.total_vaccinations);
        $("#updateChangeVax").text(data.change_vaccinations);
        $("#updateVaxPpl").text(data.total_vaccinations);




        // update header
        $(".summary-header-cases > h1").text(data.total_cases + " cases");
        $(".summary-header-cases > b").text(displayNewCases(data.change_cases));
        $(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
        $(".summary-header-deaths > b").text(displayNewCases(data.change_fatalities));
        $(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
        $(".summary-header-hospitalized > b").text(displayNewCases(data.change_hospitalizations));
        $(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
        $(".summary-header-recoveries > b").text(displayNewCases(data.change_recoveries));
        $(".summary-header-percentVaccinated > h1").text((((data.total_vaccinations) / 37590000)*100).toFixed(3) + "%");
        $(".summary-header-percentVaccinated > b").text("of the Canadian population has recieved at least one dose");
        $(".summary-header-vaccinations > h1").text(data.total_vaccinations + " doses administered");
        $(".summary-header-vaccinations > b").text(displayNewCases(data.change_vaccinations));
        $(".summary-header-pplVac > h1").text(data.total_vaccinations);
        $(".summary-header-pplVac > b").text("people have recieved at least one dose");

        // update province table footer
        var canadaPopulation = 37679286;
        var casesPer100000 = Math.floor(((100000 * data.total_cases) / canadaPopulation) * 100) / 100;
        var fatalitiesPer100000 = Math.floor(((100000 * data.total_fatalities) / canadaPopulation) * 100) / 100;
        var hospitalizationsPer100000 = Math.floor(((100000 * data.total_hospitalizations) / canadaPopulation) * 100) / 100;
        var criticalsPer100000 = Math.floor(((100000 * data.total_criticals) / canadaPopulation) * 100) / 100;
        var recoveriesPer100000 = Math.floor(((100000 * data.total_recoveries) / canadaPopulation) * 100) / 100;
        var testsPer100000 = Math.floor(((100000 * data.total_tests) / canadaPopulation) * 100) / 100;
        var vaccinationsPer100000 = Math.floor(((100000 * data.total_vaccinations) / canadaPopulation) * 100) / 100;
        $('#totalCasesCanada').attr("data-per-capita", casesPer100000);
        $('#totalFatalitiesCanada').attr("data-per-capita", fatalitiesPer100000);
        $('#totalHospitalizationsCanada').attr("data-per-capita", hospitalizationsPer100000);
        $('#totalCriticalsCanada').attr("data-per-capita", criticalsPer100000);
        $('#totalRecoveriesCanada').attr("data-per-capita", recoveriesPer100000);
        $('#totalTestsCanada').attr("data-per-capita", testsPer100000);
        $('#totalVaccinationsCanada').attr("data-per-capita", vaccinationsPer100000);

        $('#totalCasesCanada').text(data.total_cases + (data.change_cases ? (" " + displayNewCases(data.change_cases)) : ""));
        $('#totalFatalitiesCanada').text(data.total_fatalities + (data.change_fatalities ? (" " + displayNewCases(data.change_fatalities)) : ""));
        $('#totalHospitalizationsCanada').text(data.total_hospitalizations + (data.change_hospitalizations ? (" " + displayNewCases(data.change_hospitalizations)) : ""));
        $('#totalCriticalsCanada').text(data.total_criticals + (data.change_criticals ? (" " + displayNewCases(data.change_criticals)) : ""));
        $('#totalRecoveriesCanada').text(data.total_recoveries + (data.change_recoveries ? (" " + displayNewCases(data.change_recoveries)) : ""));
        $('#totalTestsCanada').text(data.total_tests + (data.change_tests ? (" " + displayNewCases(data.change_tests)) : ""));
        $('#totalVaccinationsCanada').text(data.total_vaccinations + (data.change_vaccinations ? (" " + displayNewCases(data.change_vaccinations)) : ""));
        $('#infectedPerCanada').text(casesPer100000);
    });

    $("#perCapita").on('change', function () {
        var field = $(this).val();

        switch(field) {
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
            $(".summary-header-hospitalized > h1").text(critical + " critical");
            $(".summary-header-hospitalized > b").text(displayNewCases(criticalChange));
        }
        else {
            $(".summary-header-hospitalized > h1").text(hospitalizations + " hospitalized");
            $(".summary-header-hospitalized > b").text(displayNewCases(hospitalizationsChange));
        }
    });

    $(".summary-arrow").click(function() {
        var container = $(this).next();
        container.empty();
        var field = $(this).attr("data-field");
        var data = last5days[field];
        if (data !== undefined) {
            data.forEach(item => {
                container.append("<div>" +
                "<span>" + item.label + "</span>" +
                "<span>" + item.total + " " +  (item.change !== null && item.change !== undefined ? displayNewCasesOlder(item.change) : "") + "</span>" +
                "</div>");
            });
        }
        container.toggle();
    });

    // draw map and cases by province graph and table
    $.ajax({
        url: api_url + "summary/split",
        type: "GET",
    }).then(res => {
        drawMap(res.data);
        barGraph(res.data, "#provinceCasesChart");
        $.ajax({
            url: api_url + "provinces"
        }).then(res2 => {
            buildProvinceTable(res.data, res2);
        });
    });

    // draw new and cumulative cases graphs
    $.ajax({
        url: api_url + "reports?fill_dates=true",
        type: "GET",
    }).then(res => {
        fillNulls(res.data);
        last5days = getLast5Days(res.data, "total_");
        lineGraph(res.data, "#dailyCaseChart", false);
        lineGraph(res.data, "#cumulativeCaseChart", true);
    });

    // draw latest cases table
    $.ajax({
        url: api_url + "cases",
        type: "GET",
    }).then(res => {

        var data = res.data;

        data.forEach(function(item) {
            item.province = provinceProperties(item.province) ? provinceProperties(item.province).name : item.province;
            item.date = moment(item.date).format('MM/DD/YY');
        });

        $('#individualCaseTable').dataTable({
            "order": [
                [0, "desc"]
            ],
            "data": data,
            "columns": [{
                    "data": "id"
                }, {
                    "data": "date"
                }, {
                    "data": "province"
                }, {
                    "data": "city"
                }, {
                    "data": "age"
                }, {
                    "data": "travel_history"
                }, {
                    "data": "confirmed_presumptive"
                },
                {
                    "data": "source",
                    "render": (data, type) => {
                        if (type === 'display') data = '<a href="' + data + '">Source</a>';

                        return data;
                    }
                }
            ]
        });
    })

    // get notice
    $.ajax({
        url: devapi_url + "notes",
        type: "GET",
    }).then(res => {
        var data = res;
        if (data && data.length) {
            $("#statisticsNotice").show();
            var note = data[0];
            $("#statisticsNotice .card-body").empty();
            $("#statisticsNotice .card-body").append("<h3>" + note.title + "</h3><p>" + note.description + "</p>");
        }
    });

    // update regions list
    $.ajax({
        url: devapi_url + "regions",
        type: "GET"
    }).then(res => {
        parseRegions(res.data, regions);
        // update regions list
        $.ajax({
            url: devapi_url + "summary/split/hr",
            type: "GET"
        }).then(regionData => {
            if (regionData && regionData.data && regionData.data.length) {
                for (var province in regions) {
                    regions[province].forEach(region => {
                        let currentRegionData = regionData.data.filter(item => item.hr_uid === region.hr_uid);
                        if (currentRegionData && currentRegionData.length) region.data = currentRegionData[0];
                    });
                }
            }
        });
    });

    $(document).on("click", ".arrow-down", function() {
        var container = $(this).closest("tr");

        var toggled = $(this).attr("data-toggle") === "1";
        var province = $(this).attr("data-province");
        if (toggled) {
            $(this).closest("tr").next().remove();
            $(this).attr("data-toggle", "0");
        }
                        else {
                    $(this).attr("data-toggle", "1");
                    container.after("<tr class='regionTable'><td colspan='10'><table></table></td>");
                    var regionsTable = container.next().find("table");
                    var theseRegions = regions[province];
                    theseRegions.forEach(item => {
                        var itemTotalCases = item.data.total_cases;
                        var itemTotalFatalities = item.data.total_fatalities;
                        var itemTotalHospitalizations = item.data.total_hospitalizations;
                        var itemTotalCriticals = item.data.total_criticals;
                        var itemTotalRecoveries = item.data.total_recoveries;
                        var itemTotalTests = item.data.total_tests;
                        var itemTotalVaccinations = item.data.total_vaccinations;

                        if (itemTotalCases === null || itemTotalCases === undefined) itemTotalCases = "N/A";
                        else if (item.data.change_cases) itemTotalCases += "<i> " + displayNewCases(item.data.change_cases);
                        if (itemTotalFatalities === null || itemTotalFatalities === undefined) itemTotalFatalities = "N/A";
                        else if (item.data.change_fatalities) itemTotalFatalities += "<i> " + displayNewCases(item.data.change_fatalities);
                        if (itemTotalHospitalizations === null || itemTotalHospitalizations === undefined) itemTotalHospitalizations = "N/A";
                        else if (item.data.change_hospitalizations) itemTotalHospitalizations += "<i> " + displayNewCases(item.data.change_hospitalizations);
                        if (itemTotalCriticals === null || itemTotalCriticals === undefined) itemTotalCriticals = "N/A";
                        else if (item.data.change_criticals) itemTotalCriticals += "<i> " + displayNewCases(item.data.change_criticals);
                        if (itemTotalRecoveries === null || itemTotalRecoveries === undefined) itemTotalRecoveries = "N/A";
                        else if (item.data.change_recoveries) itemTotalRecoveries += "<i> " + displayNewCases(item.data.change_recoveries);
                        if (itemTotalTests === null || itemTotalTests === undefined) itemTotalTests = "N/A";
                        else if (item.data.change_tests) itemTotalTests += "<i> " + displayNewCases(item.data.change_tests);
                        if (itemTotalVaccinations === null || itemTotalVaccinations === undefined) itemTotalVaccinations = "N/A";
                        else if (item.data.change_vaccinations) itemTotalVaccinations += "<i> " + displayNewCases(item.data.change_vaccinations);
                        if (item.data) {
                            regionsTable.append('<tr><td>' + item.engname + '</td><td>' + itemTotalCases + '</td><td>' + itemTotalFatalities + '</td><td>' + itemTotalHospitalizations + '</td>' +
                                '<td>' + itemTotalCriticals + '</td><td>' + itemTotalRecoveries + '</td><td>' + itemTotalTests + '</td><td>' + itemTotalVaccinations + '</td><td>&nbsp;</td><td>&nbsp;</td>');
                        }
                    });
            var firstCells = container.find("td");
            var regionsRows = regionsTable.find("tr");
            regionsRows.each((index, row) => {
                var secondCells = $(row).find("td");
                firstCells.each((index2, cell) => {
                    var newWidth = $(cell).width();
                    if (index2 === 0) newWidth += 2;
                    $(secondCells[index2]).width(newWidth);
                });
            });
        }
    });

    $(window).on("resize", function() {
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

function buildProvinceTable(data, provinceData) {
    data.forEach(function(item) {
        item.source = provinceSources[item.province] || "https://covid19tracker.ca/sources.html";
        var casesPer100000 = Math.floor(((100000 * item.total_cases) / provinceProperties(item.province).population) * 100) / 100;
        var fatalitiesPer100000 = Math.floor(((100000 * item.total_fatalities) / provinceProperties(item.province).population) * 100) / 100;
        var hospitalizationsPer100000 = Math.floor(((100000 * item.total_hospitalizations) / provinceProperties(item.province).population) * 100) / 100;
        var criticalsPer100000 = Math.floor(((100000 * item.total_criticals) / provinceProperties(item.province).population) * 100) / 100;
        var recoveriesPer100000 = Math.floor(((100000 * item.total_recoveries) / provinceProperties(item.province).population) * 100) / 100;
        var testsPer100000 = Math.floor(((100000 * item.total_tests) / provinceProperties(item.province).population) * 100) / 100;
        var vaccinationsPer100000 = Math.floor(((100000 * item.total_vaccinations) / provinceProperties(item.province).population) * 100) / 100;


        var thisProvinceData = provinceData.filter(province => province.code === item.province);
        thisProvinceData = thisProvinceData.length ? thisProvinceData[0] : {};

        var updatedAt = thisProvinceData.updated_at ? moment(thisProvinceData.updated_at).format("dddd, MMMM Do YYYY, HH:mm") + " CST": "N/A";
        var provinceStatus = thisProvinceData.data_status || "Unknown";

        // append data to row
        $('#totalCasesProvinceTable').append(
            "<tr class='provinceRow'>" +
            "<td>" +
            "<span class='province-update-status status-" + provinceStatus.toLowerCase().replace(/\s/gi, '-') + "' " +
            " data-toggle='tooltip' data-placement='bottom' data-html='true' title='" +
            "Status: <b>" + provinceStatus + "</b><br>" +
            "Last updated: <b>" + updatedAt + "</b><br>" +
            "Update expected by: <b>" + expectedTime(item.province) + "</b>" +
            "'></span>" +
            "<span>" + provinceProperties(item.province).name + "</span><span class='toggle-regions'><span class='arrow-down' data-toggle='0' data-province='" + item.province + "'><i class='fa fa-angle-down'></i></span></span>" +
            "</td>" +
            "<td data-per-capita='" + casesPer100000 + "'><b><i>" + item.total_cases + (item.change_cases ? (" " + displayNewCases(item.change_cases)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + fatalitiesPer100000 + "'><b><i>" + item.total_fatalities + (item.change_fatalities ? (" " + displayNewCases(item.change_fatalities)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + hospitalizationsPer100000 + "'><b><i>" + item.total_hospitalizations + (item.change_hospitalizations ? (" " + displayNewCases(item.change_hospitalizations)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + criticalsPer100000 + "'><b><i>" + item.total_criticals + (item.change_criticals ? (" " + displayNewCases(item.change_criticals)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + recoveriesPer100000 + "'><b><i>" + item.total_recoveries + (item.change_recoveries ? (" " + displayNewCases(item.change_recoveries)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + testsPer100000 + "'><b><i>" + item.total_tests + (item.change_tests ? (" " + displayNewCases(item.change_tests)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + vaccinationsPer100000 + "'><b><i>" + item.total_vaccinations + (item.change_vaccinations ? (" " + displayNewCases(item.change_vaccinations)) : "") + "</i></b></td>" +
            "<td>" + casesPer100000 + "</td>" +
            "<td><a href='" + item.source + "'>Source</a></td>" +
            "</tr>"
        )
        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip province-status-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
    });
}