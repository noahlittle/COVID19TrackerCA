// lineGraph: configures data for line graphs
// @param data: [] case data
// @param id: string graph container
// @param flag: boolean cumulative or not
function lineGraph(data, id, flag) {
    var name = [];
    var prefix = flag ? "total" : "change";
    var allData = {
        "cases": [],
        "fatalities": [],
        "recoveries": [],
        "hospitalizations": [],
        "criticals": [],
        "tests": []
    };

    for (var i in data) {
        var date = new Date(data[i].date);
        date.setDate(date.getDate() + 1);

        name.push(new Intl.DateTimeFormat('en-us', {
            month: 'short',
            day: 'numeric'
        }).format(date));

        for (var key in allData) {
            var dataItem = data[i][prefix + "_" + key];
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
            datasets: [
                {
                    label: "Cases",
                    lineTension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "rgba(2,117,216,1)",
                    pointHoverBackgroundColor: "rgba(2,117,216,1)",
                    backgroundColor: "rgba(2,117,216,0.2)",
                    borderColor: "rgba(2,117,216,1)",
                    data: allData["cases"]
                },
                {
                    label: "Deaths",
                    lineTension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "rgba(220,53,69,0.8)",
                    pointHoverBackgroundColor: "#dc3545",
                    backgroundColor: "rgba(220,53,69,0.2)",
                    borderColor: "#dc3545",
                    data: allData["fatalities"],
                    hidden: true
                },
                {
                    label: "Recoveries",
                    lineTension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "#28a745",
                    pointHoverBackgroundColor: "#28a745",
                    backgroundColor: "rgba(40,167,69,0.2)",
                    borderColor: "#28a745",
                    data: allData["recoveries"],
                    hidden: true
                },
                {
                    label: "Hospitalizations",
                    lineTension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "#ffc107",
                    pointHoverBackgroundColor: "#ffc107",
                    backgroundColor: "rgba(255,193,7,0.2)",
                    borderColor: "#ffc107",
                    data: allData["hospitalizations"],
                    hidden: true
                },
                {
                    label: "Criticals",
                    lineTension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "#ff6a07",
                    pointHoverBackgroundColor: "#ff6a07",
                    backgroundColor: "rgba(255,106,7,0.2)",
                    borderColor: "#ff6a07",
                    data: allData["criticals"],
                    hidden: true
                },
                {
                    label: "Tests",
                    lineTension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointBackgroundColor: "#5c3b8d",
                    pointHoverBackgroundColor: "#5c3b8d",
                    backgroundColor: "rgba(92,59,141,0.2)",
                    borderColor: "#5c3b8d",
                    data: allData["tests"],
                    hidden: true
                }
            ]
        },
        ticks: 7
    }

    // renders the graph
    draw(graphConfig);
}


// barGraph: configures data for bar graphs
// @param data: [] case data
// @param id: string graph container
function barGraph(data, id) {
    var name = [];
    var allData = {
        "cases": [],
        "fatalities": [],
        "recoveries": [],
        "hospitalizations": [],
        "criticals": [],
        "tests": []
    };

    data.sort(function(a, b) {
        return b["total_cases"] - a["total_cases"];
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
                    label: "Cases",
                    backgroundColor: "rgba(2,117,216,1)",
                    borderColor: "rgba(2,117,216,1)",
                    data: allData["cases"]
                },
                {
                    label: "Deaths",
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                    data: allData["fatalities"],
                    hidden: true
                },
                {
                    label: "Recoveries",
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                    data: allData["recoveries"],
                    hidden: true
                },
                {
                    label: "Hospitalizations",
                    backgroundColor: "#ffc107",
                    borderColor: "#ffc107",
                    data: allData["hospitalizations"],
                    hidden: true
                },
                {
                    label: "Criticals",
                    backgroundColor: "#ff6a07",
                    borderColor: "#ff6a07",
                    data: allData["criticals"],
                    hidden: true
                },
                {
                    label: "Tests",
                    backgroundColor: "#5c3b8d",
                    borderColor: "#5c3b8d",
                    data: allData["tests"],
                    hidden: true
                }
            ]
        },
        ticks: 15
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
        }
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

    var data = $.extend(true, {}, originalData);

    // filter original data by last 3 weeks, if set
    if (recentOnly) {
        var originalCount = data.labels.length;
        var labels = $.extend(true, [], data.labels);
        labels = labels.filter(item => moment().diff(item + ' 2020', 'week') < 3);
        data.labels = labels;
        var itemsRemoved = originalCount - labels.length;
        data.datasets.forEach(dataset => {
           dataset.data.splice(0, itemsRemoved);
        });
    }

    // apply log scale to graph, if set
    graph.config.options.scales.yAxes[0].type = logarithmicScale ? "logarithmic" : "linear";

    // set new data based on original data
    graph.config.data = data;
    graph.update();
}