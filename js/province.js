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
            url: url + "api/controller/proxy.php?get=summary/split",
            type: "GET"
        }).then(res => {
            var province = res.data.filter(item => item.province === code)[0];
            fillNulls(res.data);
            $('#provinceTotalCases')[0].innerHTML = "Total Cases: " + province.total_cases;
            $('#provinceTotalDeaths')[0].innerHTML = "Total Deaths: " + province.total_fatalities;
        });

        // update graphs
        $.ajax({
            url: url + "api/controller/proxy.php?get=reports/province/" + code,
            type: "GET"
        }).then(res => {
            buildGraphs(res.data, value);
        });

        // update table
        $.ajax({
            url: url + "api/controller/proxy.php?get=cases?province=" + code,
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

    $('#provinceNewCasesChart').remove();
    $('#provinceCumulativeCasesChart').remove()

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
