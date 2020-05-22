// Controls the state of the application, sets up correct data information
$(document).ready(() => {

    // get and update header, and cases by province table footer
    $.ajax({
        url: api_url + "summary"
    }).then(res => {
        var data = res.data[0];

        // update timestamp
        $("#updateTime").text("Updated " + moment(res.last_updated).format("dddd, MMMM Do YYYY, h:mm") + " CST");

        // update header
        $(".summary-header-cases > h1").text(data.total_cases + " cases");
        $(".summary-header-cases > b").text(displayNewCases(data.change_cases));
        $(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
        $(".summary-header-deaths > b").text(displayNewCases(data.change_fatalities));
        $(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
        $(".summary-header-hospitalized > b").text(displayNewCases(data.change_hospitalizations));
        $(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
        $(".summary-header-recoveries > b").text(displayNewCases(data.change_recoveries));

        // update province table footer
        var canadaPopulation = 37679286;
        var casesPer100000 = Math.floor(((100000 * data.total_cases) / canadaPopulation) * 100) / 100;
        $('#totalCasesCanada').text(data.total_cases + (data.change_cases ? (" " + displayNewCases(data.change_cases)) : ""));
        $('#infectedPerCanada').text(casesPer100000);
        $('.death_total').text(data.total_fatalities + (data.change_fatalities ? (" " + displayNewCases(data.change_fatalities)) : ""));
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

});

function buildProvinceTable(data, provinceData) {
    data.forEach(function(item) {
        var casesPer100000 = Math.floor(((100000 * item.total_cases) / provinceProperties(item.province).population) * 100) / 100;
        var thisProvinceData = provinceData.filter(province => province.code === item.province);
        thisProvinceData = thisProvinceData.length ? thisProvinceData[0] : {};

        var updatedAt = thisProvinceData.updated_at ? moment(thisProvinceData.updated_at).format("dddd, MMMM Do YYYY, HH:mm") + " CST": "N/A";
        var provinceStatus = thisProvinceData.data_status || "Unknown";

        // append data to row
        $('#totalCasesProvinceTable').append(
            "<tr>" +
            "<td>" +
            "<span class='province-update-status status-" + provinceStatus.toLowerCase().replace(/\s/gi, '-') + "' " +
            " data-toggle='tooltip' data-placement='bottom' data-html='true' title='" +
            "Status: <b>" + provinceStatus + "</b><br>" +
            "Last updated: <b>" + updatedAt + "</b><br>" +
            "Next update: <b>" + expectedTime(item.province) + "</b>" +
            "'></span>" +
            "<span>" + provinceProperties(item.province).name + "</span>" +
            "</td>" +
            "<td><b><i>" + item.total_cases + (item.change_cases ? (" " + displayNewCases(item.change_cases)) : "") + "</i></b></td>" +
            "<td>" + casesPer100000 + "</td>" +
            "<td><b><i>" + item.total_fatalities + (item.change_fatalities ? (" " + displayNewCases(item.change_fatalities)) : "") + "</i></b></td>" +
            "<td><a href=''>Source</a></td>" +
            "</tr>"
        )
        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip province-status-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
    });
}