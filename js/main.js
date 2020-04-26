// Controls the state of the application, sets up correct data information
$(document).ready(() => {

    // get and update header, and cases by province table footer
    $.ajax({
        url: api_url + "summary"
    }).then(res => {
        var data = res.data[0];

        // update timestamp
        $("#updateTime").text("Updated " + moment(last_updated).format("dddd, MMMM D HH.mm") + " CST");

        // update header
        $(".summary-header-cases > h1").text(data.total_cases + " cases");
        $(".summary-header-cases > b").text("(+" + data.change_cases + " today" + ")");
        $(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
        $(".summary-header-deaths > b").text("(+" + data.change_fatalities + " today" + ")");
        $(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
        $(".summary-header-hospitalized > b").text("(+" + data.change_hospitalizations + " today" + ")");
        $(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
        $(".summary-header-recoveries > b").text("(+" + data.change_recoveries + " today" + ")");

        // update province table footer
        var canadaPopulation = 37679286;
        var casesPer100000 = Math.floor(((100000 * data.total_cases) / canadaPopulation) * 100) / 100;
        $('#totalCasesCanada').text(data.total_cases + (data.change_cases ? (" (+" + data.change_cases + " today)") : ""));
        $('#infectedPerCanada').text(casesPer100000);
        $('.death_total').text(data.total_fatalities + (data.change_fatalities ? (" (+" + data.change_fatalities + " today)") : ""));
    });

    // draw map and cases by province graph and table
    $.ajax({
        url: api_url + "summary/split",
        type: "GET",
    }).then(res => {
        drawMap(res.data);
        barGraph(res.data, "#provinceCasesChart");
        buildProvinceTable(res.data);
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

function buildProvinceTable(data) {
    data.forEach(function(item) {
        var casesPer100000 = Math.floor(((100000 * item.total_cases) / provinceProperties(item.province).population) * 100) / 100;

        // append data to row
        $('#totalCasesProvinceTable').append(
            "<tr>" +
            "<td>" + provinceProperties(item.province).name + "</td>" +
            "<td><b><i>" + item.total_cases + (item.change_cases ? (" (+" + item.change_cases + " today)") : "") + "</i></b></td>" +
            "<td>" + casesPer100000 + "</td>" +
            "<td><b><i>" + item.total_fatalities + (item.change_fatalities ? (" (+" + item.change_fatalities + " today)") : "") + "</i></b></td>" +
            "<td><a href=''>Source</a></td>" +
            "</tr>"
        )
    });
}