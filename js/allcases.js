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
        $('#totalCases')[0].innerHTML = "Total Cases: " + data.total_cases;
        $('#totalDeaths')[0].innerHTML = "Total Deaths: " + data.total_fatalities;
    });

    buildTable(province);
    // update table
   /* $.ajax({
        url: api_url + "cases?per_page=100" + (province ? ("&province=" + province) : ""),
        type: "GET"
    }).then(res => {
        $(".all-cases-title").text((province ? (provinceProperties(province).name + ": ") : "") + "All Cases");
        buildTable(res.data);

        var total = res.total;
        var requests = Math.ceil(total / 1000);

        while (requests > 0) {
            setTimeout(function() {
                $.ajax({
                    url: api_url + "cases?per_page=1000" + (province ? ("&province=" + province) : ""),
                    type: "GET"
                }).then(res => {
                    requests--;
                    buildTable(res.data);
                });
            })
        }
    });*/
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

