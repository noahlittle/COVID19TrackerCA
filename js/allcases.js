$(document).ready(() => {
    // overload ajax request
    $.ajaxSetup({beforeSend: preProcessRequest});

    // get province, if any
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var province = urlParams.get('province');

    // update header
    $.ajax({
        url: api_url + "summary" + (province ? "/split" : ""),
        type: "GET"
    }).then(res => {
        var data = !province ? res.data[0] : res.data.filter(item => item.province === province)[0];
        $(".summary-header-cases > h1").text(data.total_cases + " cases");
        $(".summary-header-cases > b").text("(+" + data.change_cases + " today" + ")");
        $(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
        $(".summary-header-deaths > b").text("(+" + data.change_fatalities + " today" + ")");
        $(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
        $(".summary-header-hospitalized > b").text("(+" + data.change_hospitalizations + " today" + ")");
        $(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
        $(".summary-header-recoveries > b").text("(+" + data.change_recoveries + " today" + ")");
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

