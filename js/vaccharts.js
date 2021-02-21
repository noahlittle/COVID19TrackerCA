// lineGraph: configures data for line graphs
// @param data: [] case data
// @param id: string graph container
// @param flag: boolean cumulative or not

Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 20;
};

function lineGraph(data, id, flag, type) {
    var name = [];
    var prefix = flag ? "total" : "change";
    var allData = {
        "vaccinations": [],
        "vaccines_distributed": []
    };


    for (var i in data) {
        var date = new Date(data[i].date);
        date.setDate(date.getDate() + 1);

        name.push(new Intl.DateTimeFormat('en-us', {
            month: 'short',
            day: 'numeric'
        }).format(date));

        for (var key in allData) {
            var dataItem = data[i][prefix ? (prefix + "_" + key) : key];
            if (!dataItem) dataItem = 0;
            allData[key].push(dataItem);
        }
    }

    // used to setup graph that needs to be drawn
    var graphConfig = {
        graphTarget: $(id),
        type: 'line',
        unit: 'date',
        chartdata: {
            labels: name,
            datasets: type === "province" ? [
                {
                    label: "Doses Distributed",
                    lineTension: 0.2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHitRadius: 3,
                    pointBorderWidth: 1,
                    pointBorderColor: "rgba(110,117,124,0.8)",
                    pointBackgroundColor: "#6E757C",
                    pointHoverBackgroundColor: "#6E757C",
                    backgroundColor: "rgba(110,117,124,0.3)",
                    borderColor: "#6E757C",
                    data: allData["vaccines_distributed"],
                    hidden: false
                },
                {
                    label: "Doses Administered",
                    lineTension: 0.2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHitRadius: 3,
                    pointBorderWidth: 1,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "#353A3F",
                    pointHoverBackgroundColor: "#353A3F",
                    backgroundColor: "rgba(92,59,141,0.2)",
                    borderColor: "#353A3F",
                    data: allData["vaccinations"],
                    hidden: false
                }
            ] : [
                    {
                        label: "Doses Administered",
                        lineTension: 0.2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHitRadius: 3,
                        pointBorderWidth: 1,
                        pointBorderColor: "rgba(255,255,255,0.8)",
                        pointBackgroundColor: "#353A3F",
                        pointHoverBackgroundColor: "#353A3F",
                        backgroundColor: "rgba(92,59,141,0.2)",
                        borderColor: "#353A3F",
                        data: allData["vaccinations"],
                        hidden: false
                    }
                ]
        },
        ticks: 7
    }

    if (type === "region") graphConfig.chartdata.datasets = [graphConfig.chartdata.datasets[0], graphConfig.chartdata.datasets[1]];

    // renders the graph
    draw(graphConfig);
}


// barGraph: configures data for bar graphs
// @param data: [] case data
// @param id: string graph container
function barGraph(data, id) {
    var name = [];
    var allData = {
        "vaccinations": [],
        "vaccines_distributed": []
    };

    data.sort(function (a, b) {
        return b["total_vaccinations"] - a["total_vaccinations"];
    });

    for (var i in data) {
        name.push(provinceProperties(data[i].province).name);
        for (var key in allData) {
            var dataItem = data[i]["total_" + key];
            if (!dataItem) dataItem = 0;
            allData[key].push(dataItem);
        }
    }

    var graphConfig = {
        graphTarget: $(id),
        type: 'bar',
        unit: 'month',
        chartdata: {
            labels: name,
            datasets: [

                {
                    label: "Doses Distributed",
                    backgroundColor: "#D3D3D3",
                    borderColor: "#D3D3D3",
                    data: allData["vaccines_distributed"],
                    hidden: false
                },
                {
                    label: "Doses Administered",
                    backgroundColor: "#353A3F",
                    borderColor: "#353A3F",
                    data: allData["vaccinations"],
                    hidden: false
                }
            ]
        },
        ticks: 15
    }

    // renders the graph
    draw(graphConfig);
}

//pulled from barGraph function
//built for regions where vaccines_distributed is not available
function barGraph2(data, id) {
    var name = [];
    var allData = {
        "vaccinations": []
    };

    data.sort(function (a, b) {
        return b["total_vaccinations"] - a["total_vaccinations"];
    });

    for (var i in data) {
        name.push(data[i].name);
        for (var key in allData) {
            var dataItem = data[i]["total_" + key];
            if (!dataItem) dataItem = 0;
            allData[key].push(dataItem);
        }
    }

    var graphConfig = {
        graphTarget: $(id),
        type: 'bar',
        unit: 'month',
        chartdata: {
            labels: name,
            datasets: data.length > 0 ? [
                {
                    label: "Doses Administered",
                    backgroundColor: "#353A3F",
                    borderColor: "#353A3F",
                    data: allData["vaccinations"],
                    hidden: false
                }
            ] : [],
        },
        ticks: 15,
        plugins: [{
            afterDraw: function (chart) {
                if (chart.data.datasets.length === 0) {
                    // No data is present
                    var ctx = chart.chart.ctx;
                    var width = chart.chart.width;
                    var height = chart.chart.height
                    chart.clear();

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = "30px normal 'Helvetica Nueue'";
                    ctx.fillText(noDataText ? noDataText : 'No data to display', width / 2, height / 2);
                    ctx.restore();
                    if (chart.canvas.nextElementSibling !== null)
                        chart.canvas.nextElementSibling.classList.add("d-none");
                }
            }
        }]
    }

    // renders the graph
    draw(graphConfig);
}


// draw: renders the graph to HTML
// @param graphConfig: {} config for graph
function draw(graphConfig) {
    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';

    var chart = new Chart(graphConfig.graphTarget, {
        type: graphConfig.type,
        data: graphConfig.chartdata,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    time: {
                        unit: graphConfig.unit
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: graphConfig.ticks
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, .125)",
                    }
                }],
            },
            legend: {
                display: true
            }
        },
        plugins: graphConfig.plugins
    });

    graphConfig.graphTarget.data("chart", chart);
    graphConfig.graphTarget.data("originalData", graphConfig.chartdata);
}

function toggleChartSetting(el) {
    var isChecked = $(el)[0].checked;
    if (isChecked) $(el).parent().addClass("checked");
    else $(el).parent().removeClass("checked");

    updateGraph($(el).closest(".card-body"));
}

function updateGraph(container) {
    var graphContainer = container.find("canvas");
    var graph = graphContainer.data("chart");
    var originalData = graphContainer.data("originalData");

    var recentOnly = container.find(".chart-options > span:nth-child(1) input")[0].checked;
    var logarithmicScale = container.find(".chart-options > span:nth-child(2) input")[0].checked;
    var rollingAverage = container.find(".chart-options > span:nth-child(3) input")[0].checked;

    var data = $.extend(true, {}, originalData);

    // filter original data by last 3 weeks, if set


    if (recentOnly) {
        var originalCount = data.labels.length;
        var labels = $.extend(true, [], data.labels);
        labels = labels.slice(-21);
        data.labels = labels;
        var itemsRemoved = originalCount - labels.length;
        data.datasets.forEach(dataset => {
            dataset.data.splice(0, itemsRemoved);
        });
    }

    // apply log scale to graph, if set
    graph.config.options.scales.yAxes[0].type = logarithmicScale ? "logarithmic" : "linear";

    // apply rolling average
    data.datasets.forEach(dataset => {
        if (dataset.originalData === undefined) dataset.originalData = [...dataset.data];
    });

    if (rollingAverage) {
        data.datasets.forEach(dataset => {
            dataset.data = movingAvg([...dataset.originalData], 7);
        });
    }
    else {
        data.datasets.forEach(dataset => {
            dataset.data = [...dataset.originalData];
        });
    }

    // set new data based on original data
    graph.config.data = data;
    graph.update();
}

function movingAvg(array, count, qualifier) {

    // calculate average for subarray
    var avg = function (array, qualifier) {

        var sum = 0, count = 0, val;
        for (var i in array) {
            val = array[i];
            if (!qualifier || qualifier(val)) {
                sum += val;
                count++;
            }
        }

        return sum / count;
    };

    var result = [], val;

    // pad beginning of result with null values
    for (var i = 0; i < count - 1; i++)
        result.push(null);

    // calculate average for each subarray and add to result
    for (var i = 0, len = array.length - count; i <= len; i++) {

        val = avg(array.slice(i, i + count), qualifier);
        if (isNaN(val))
            result.push(null);
        else
            result.push(val);
    }

    return result;
}