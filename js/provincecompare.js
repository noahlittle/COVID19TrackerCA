$(document).ready(() => {
    $('#provinceSelection, #province2Selection, #displaySelection').on('change', function () {
        var province1 = $('#provinceSelection').val();
        var province2 = $('#province2Selection').val();
        var field = $('#displaySelection').val();
        if (province1 === "Select Province" || province2 === "Select Province" || field === "Select type") return;

        var code1 = provinceProperties(null, province1);
        if (!code1) return;
        var code2 = provinceProperties(null, province2);
        if (!code2) return;

        // update graphs
        $.ajax({
            url: api_url + "reports/province/" + code1,
            type: "GET"
        }).then(res => {
            let province1Data = res.data;
            $.ajax({
                url: api_url + "reports/province/" + code2,
                type: "GET"
            }).then(res2 => {
                let province2Data = res2.data;
                buildGraphs(province1Data, province2Data, province1, province2, field);
            });
        });
    });
})

function buildGraphs(data1, data2, province1, province2, field) {
    fillNulls(data1);
    fillNulls(data2);

    var graphLabel = "";
    if (field === "cases") graphLabel = "Cases";
    if (field === "fatalities") graphLabel = "Deaths";
    if (field === "recoveries") graphLabel = "Recoveries";
    if (field === "hospitalizations") graphLabel = "Hospitalizations";
    if (field === "criticals") graphLabel = "Criticals";
    if (field === "tests") graphLabel = "Tests";

    $('#provinceNewCases')[0].innerHTML = province1 + " vs. " + province2 + " New " + graphLabel + " by Day";
    $('#provinceCumulativeCases')[0].innerHTML = province1 + " vs. " + province2 + " Cumulative " + graphLabel;

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

    lineGraphCompare(data1, data2, province1, province2, field, "#provinceNewCasesChart", false);
    lineGraphCompare(data1, data2, province1, province2, field, "#provinceCumulativeCasesChart", true);
}
