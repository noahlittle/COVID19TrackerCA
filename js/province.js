var removeOptionFlag;
var currentProvince = null;

$(document).ready(() => {
  removeOptionFlag = true;
	$('#provinceSelection').on('change', function () {
	    var value = this.value;
	    if (value === "Select Province") return;
	    var code = provinceProperties(null, this.value);
	    if (!code) return;

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
            $(".summary-header").show();
            $(".summary-header-cases > h1").text(province.total_cases + " cases");
            $(".summary-header-cases > b").text("(+" + province.change_cases + " today" + ")");
            $(".summary-header-deaths > h1").text(province.total_fatalities + " deaths");
            $(".summary-header-deaths > b").text("(+" + province.change_fatalities + " today" + ")");
            $(".summary-header-hospitalized > h1").text(province.total_hospitalizations + " hospitalized");
            $(".summary-header-hospitalized > b").text("(+" + province.change_hospitalizations + " today" + ")");
            $(".summary-header-recoveries > h1").text(province.total_recoveries + " recoveries");
            $(".summary-header-recoveries > b").text("(+" + province.change_recoveries + " today" + ")");
        });

        // update graphs
        $.ajax({
            url: api_url + "reports/province/" + code,
            type: "GET"
        }).then(res => {
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
})

function buildGraphs(data, province) {
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
        </div>`);

    lineGraph(data, "#provinceNewCasesChart", false);
    lineGraph(data, "#provinceCumulativeCasesChart", true);
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
