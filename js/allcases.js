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
    // overload ajax request
    $.ajaxSetup({beforeSend: preProcessRequest});

    // get province, if any
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var province = urlParams.get('province');

    // get last days
    $.ajax({
        url: api_url + "reports?fill_dates=true",
        type: "GET",
    }).then(res => {
        fillNulls(res.data);
        last5days = getLast5Days(res.data, "total_");
    });

    // update header
    $.ajax({
        url: api_url + "summary" + (province ? "/split" : ""),
        type: "GET"
    }).then(res => {
        var data = !province ? res.data[0] : res.data.filter(item => item.province === province)[0];

        $("#activeCases").prop("checked", false);
        $("#criticalCases").prop("checked", false);

        totalCases = data.total_cases;
        totalCasesChange = data.change_cases;
        activeCases = data.total_cases - data.total_fatalities - data.total_recoveries;
        activeCasesChange = data.change_cases - data.change_fatalities - data.change_recoveries;
        critical = data.total_criticals;
        criticalChange = data.change_criticals;
        hospitalizations = data.total_hospitalizations;
        hospitalizationsChange = data.change_hospitalizations;

        $(".summary-header-cases > h1").text(data.total_cases + " cases");
        $(".summary-header-cases > b").text(displayNewCases(data.change_cases));
        $(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
        $(".summary-header-deaths > b").text(displayNewCases(data.change_fatalities));
        $(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
        $(".summary-header-hospitalized > b").text(displayNewCases(data.change_hospitalizations));
        $(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
        $(".summary-header-recoveries > b").text(displayNewCases(data.change_recoveries));
        $(".summary-header-tests > h1").text(data.total_tests + " tests");
        $(".summary-header-tests > b").text(displayNewCases(data.change_tests));
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

    buildTable(province);
})

function buildTable(province) {
    $('#individualCaseTable').dataTable({
        "serverSide": true,
        "lengthChange": false,
        "pageLength": 100,
        "searching": false,
        "bSort" : false,
        "ajax": {
            url: api_url + "cases?" + (province ? ("&province=" + province) : ""),
            dataFilter: function(data) {
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.total;
                json.recordsFiltered = json.total;

                fillNulls(json.data);

                json.data.forEach(function(item) {
                    item.province = provinceProperties(item.province) ? provinceProperties(item.province).name : item.province;
                    item.date = moment(item.date).format('MM/DD/YY');
                });

                return JSON.stringify(json);
            }
        },
        "order": [
            [0, "desc"]
        ],
        "destroy": true,
        "columns": [{
                "data": "id",
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

