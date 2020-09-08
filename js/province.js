var removeOptionFlag;
var currentProvince = null;
var regions = {};

var totalCases = 0;
var totalCasesChange = 0;
var activeCases = 0;
var activeCasesChange = 0;
var critical = 0;
var criticalChange = 0;
var hospitalizations = 0;
var hospitalizationsChange = 0;
var last5days = {};

$(document).ready(() => {
    removeOptionFlag = true;

    // update regions list
    $.ajax({
        url: devapi_url + "regions",
        type: "GET"
    }).then(res => {
        parseRegions(res.data, regions);
    });

    $("#regionSelection").on('change', function () {
        $(".summary-dropdown-container").hide();

        var value = this.value;
        var label = $(this).find("option[value='" + this.value + "']").text();
        var province = provinceProperties(currentProvince, this.value).name;

        if (!value || value === "Select Region") return;

        $("#individualCaseTableDiv").closest(".card").hide();

        $.ajax({
            url: devapi_url + "regions/" + value + "/reports",
            type: "GET"
        }).then(res => {
            if (!res.data || !res.data.length || res.data.length < 2) {
                $(".summary-header").hide();
                return;
            }

            var lastItem = res.data[res.data.length-1];
            var previousItem = res.data[res.data.length-2];

            calculateRegionChanges(lastItem, previousItem);

            last5days = getLast5Days(res.data, "total_");

            $(".summary-header").show();
            $(".summary-header .col-md").show();

            $(".summary-header .card-body > h1").text('');
            $(".summary-header .card-body > b").text('');

            $("#activeCases").prop("checked", false);
            $("#criticalCases").prop("checked", false);

            totalCases = lastItem.total_cases;
            totalCasesChange = lastItem.change_cases;
            activeCases = lastItem.total_cases - (lastItem.total_fatalities || 0) - (lastItem.total_recoveries || 0);
            activeCasesChange = lastItem.change_cases - (lastItem.change_fatalities || 0) - (lastItem.change_recoveries || 0);
            critical = lastItem.total_criticals || 0;
            criticalChange = lastItem.change_criticals || 0;
            hospitalizations = lastItem.total_hospitalizations || 0;
            hospitalizationsChange = lastItem.change_hospitalizations || 0;

            if (lastItem.total_cases === null || lastItem.total_cases === undefined)
                $(".summary-header-cases").closest(".col-md").hide();
            else {
                $(".summary-header-cases > h1").text(lastItem.total_cases + " cases");
                if (lastItem.change_cases !== null && lastItem.change_cases !== undefined)
                    $(".summary-header-cases > b").text(displayNewCases(lastItem.change_cases));
            }

            if (lastItem.total_fatalities === null || lastItem.total_fatalities === undefined)
                $(".summary-header-deaths").closest(".col-md").hide();
            else {
                $(".summary-header-deaths > h1").text(lastItem.total_fatalities + " deaths");
                if (lastItem.change_fatalities !== null && lastItem.change_fatalities !== undefined)
                    $(".summary-header-deaths > b").text(displayNewCases(lastItem.change_fatalities));
            }

            if (lastItem.total_hospitalizations === null || lastItem.total_hospitalizations === undefined)
                $(".summary-header-hospitalized").closest(".col-md").hide();
            else {
                $(".summary-header-hospitalized > h1").text(lastItem.total_hospitalizations + " hospitalized");
                if (lastItem.change_hospitalizations !== null && lastItem.change_hospitalizations !== undefined)
                    $(".summary-header-hospitalized > b").text(displayNewCases(lastItem.change_hospitalizations));
            }

            if (lastItem.total_recoveries === null || lastItem.total_recoveries === undefined)
                $(".summary-header-recoveries").closest(".col-md").hide();
            else {
                $(".summary-header-recoveries > h1").text(lastItem.total_recoveries + " recoveries");
                if (lastItem.change_recoveries !== null && lastItem.change_recoveries !== undefined)
                    $(".summary-header-recoveries > b").text(displayNewCases(lastItem.change_recoveries));
            }

            if (lastItem.total_tests === null || lastItem.total_tests === undefined)
                $(".summary-header-tests").closest(".col-md").hide();
            else {
                $(".summary-header-tests > h1").text(lastItem.total_tests + " tests");
                if (lastItem.change_tests !== null && lastItem.change_tests !== undefined)
                    $(".summary-header-tests > b").text(displayNewCases(lastItem.change_tests));
            }

            buildGraphs(res.data, province + " " + label, "region");
        });
    });

    $('#provinceSelection').on('change', function () {
        $(".summary-dropdown-container").hide();

        var value = this.value;
        if (value === "Select Province") return;
        var code = provinceProperties(null, this.value);
        if (!code) return;

        $(".summary-header .col-md").show();
        $("#individualCaseTableDiv").closest(".card").show();

        if (regions[code]) {
            $("#regionSelection").empty();
            $("#regionSelection").append("<option>Select Region</option>");
            regions[code].forEach(item => {
                $("#regionSelection").append("<option value='" + item.hr_uid + "'>" + item.engname + "</option>");
            });
        }

        currentProvince = code;

        if (removeOptionFlag) {
            removeOptionFlag = false;
            $('#provinceSelection')[0][0].remove();
        }

        // update header
        $.ajax({
            url: api_url + "summary/split",
            type: "GET"
        }).then(res => {
            var province = res.data.filter(item => item.province === code)[0];
            fillNulls(res.data);

            $("#activeCases").prop("checked", false);
            $("#criticalCases").prop("checked", false);

            totalCases = province.total_cases;
            totalCasesChange = province.change_cases;
            activeCases = province.total_cases - province.total_fatalities - province.total_recoveries;
            activeCasesChange = province.change_cases - province.change_fatalities - province.change_recoveries;
            critical = province.total_criticals;
            criticalChange = province.change_criticals;
            hospitalizations = province.total_hospitalizations;
            hospitalizationsChange = province.change_hospitalizations;

            $(".summary-header").show();
            $(".summary-header-cases > h1").text(province.total_cases + " cases");
            $(".summary-header-cases > b").text(displayNewCases(province.change_cases));
            $(".summary-header-deaths > h1").text(province.total_fatalities + " deaths");
            $(".summary-header-deaths > b").text(displayNewCases(province.change_fatalities));
            $(".summary-header-hospitalized > h1").text(province.total_hospitalizations + " hospitalized");
            $(".summary-header-hospitalized > b").text(displayNewCases(province.change_hospitalizations));
            $(".summary-header-recoveries > h1").text(province.total_recoveries + " recoveries");
            $(".summary-header-recoveries > b").text(displayNewCases(province.change_recoveries));
            $(".summary-header-tests > h1").text(province.total_tests + " tests");
            $(".summary-header-tests > b").text(displayNewCases(province.change_tests));
        });

        // update graphs
        $.ajax({
            url: api_url + "reports/province/" + code,
            type: "GET"
        }).then(res => {
            last5days = getLast5Days(res.data, "total_");
            buildGraphs(res.data, value);
        });

        // update table
        $.ajax({
            url: api_url + "cases?province=" + code,
            type: "GET"
        }).then(res => {
            buildTable(res.data);
        });
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
                    "<span>" + item.total + " " + (item.change !== null && item.change !== undefined ? displayNewCasesOlder(item.change) : "") + "</span>" +
                    "</div>");
            });
        }
        container.toggle();
    });
})

function buildGraphs(data, province, type) {
    fillNulls(data);

    $('#provinceNewCases')[0].innerHTML = province + " New Cases by Day";
    $('#provinceCumulativeCases')[0].innerHTML = province + " Cumulative Cases";

    $('#provinceCumulativeCasesChartDiv').empty();
    $('#provinceNewCasesChartDiv').empty()

    $('#provinceCumulativeCasesChartDiv').append("<canvas id=\"provinceCumulativeCasesChart\" width=\"100%\" height=\"40\"></canvas>");
    $('#provinceNewCasesChartDiv').append("<canvas id=\"provinceNewCasesChart\" width=\"100%\" height=\"40\"></canvas>")

    $('#provinceCumulativeCasesChartDiv, #provinceNewCasesChartDiv').append(`
        <div class="chart-options text-center">
            <span class="mx-2">
                <label><input type="checkbox" onclick="toggleChartSetting(this)" />Last 3 Weeks</label>
            </span>
            <span class="mx-2">
                <label><input type="checkbox" onclick="toggleChartSetting(this)" />Logarithmic Scale</label>
            </span>
            <span class="mx-2">
                <label><input type="checkbox" onclick="toggleChartSetting(this)" />Rolling Average (7 Days)</label>
            </span>
        </div>`);

    lineGraph(data, "#provinceNewCasesChart", false, type);
    lineGraph(data, "#provinceCumulativeCasesChart", true, type);
}

function buildTable(data) {
    fillNulls(data);

    data.forEach(function(item) {
        item.province = provinceProperties(item.province) ? provinceProperties(item.province).name : item.province;
        item.date = moment(item.date).format('MM/DD/YY');
    });

    $('#individualCaseTable').dataTable({
        "order": [
            [0, "desc"]
        ],
        "destroy": true,
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
}

function calculateRegionChanges(lastItem, previousItem) {
    var fields = ["cases", "fatalities", "hospitalizations", "recoveries", "tests", "criticals"];
    fields.forEach(field => {
        if (lastItem[field] !== undefined && lastItem[field] !== null &&
            previousItem[field] !== undefined && previousItem[field] !== null) {
            lastItem["change_" + field] = lastItem[field] - previousItem[field];
        }
    });
}