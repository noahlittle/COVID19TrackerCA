var positives = 0;
var negatives = 0;
var invalids = 0;
var total = 0;

// Helper function to format numbers with commas
const formatter = new Intl.NumberFormat('en-CA');
function format(value) {
    const formattedValue = formatter.format(value);
    // this safely returns any values that aren't numbers, such a 'N/A'
    if (formattedValue === 'NaN') return value;
    // otherwise return the number as a string with commas in it
    return formattedValue;
}

// Controls the state of the application, sets up correct data information
$(document).ready(() => {
	

		
		// get and update header, and cases by province table footer
		$.ajax({
			url: "https://devapi.covid19tracker.ca/rapid-tests/"
		}).then(res => {
			var data = res.data[0];
			var update = res.last_updated;
			// $("#activeCases").prop("checked", false);
			// $("#criticalCases").prop("checked", false);

			// totalCases = data.total_cases;
			// totalCasesChange = data.change_cases;
			//  activeCases = data.total_cases - data.total_fatalities - data.total_recoveries;
			// activeCasesChange = data.change_cases - data.change_fatalities - data.change_recoveries;
			// critical = data.total_criticals;
			// criticalChange = data.change_criticals;
			//  hospitalizations = data.total_hospitalizations;
			// hospitalizationsChange = data.change_hospitalizations;

			positive = data.total_positive;
			negative = data.total_negative;
			invalid = data.total_invalid;

			// twoDoses = data.total_vaccinated;
			// percentVaccinated = Math.floor((data.total_vaccinations - data.total_vaccinated) / canadaPopulation * 100) / 100;
			// percentFullyVaccinated = Math.floor(data.total_vaccinated / canadaPopulation * 100) / 100;
			// vaccinationsChange = data.change_vaccinations;
			// vaccinesDistributed = data.total_vaccines_distributed;

			// totalPopulationVaccinated = ((data.total_vaccinations - data.total_vaccinated - data.total_boosters_1) / 38246108) * 100;
			// totalPopulationVaccinated16 = ((data.total_vaccinations - data.total_vaccinated - data.total_boosters_1) / 36363537) * 100;
			// totalPopulationFullVaccinated = ((data.total_vaccinated) / 38246108) * 100;
			// totalPopulationFullVaccinated16 = ((data.total_vaccinated) / 36363537) * 100;

			// update timestamp



			$("#updateTime").text("Updated " + moment(res.last_updated).format("dddd, MMMM Do [at] h:mm a") + " CST");
			// $("#updateVax").text(format(test_results.positive));
			// $("#updateChangeVax").text(format(data.change_vaccinations));
			// $("#updateTwoDoses").text(format(data.total_vaccinated));
			// $("#totalBoost").text(format(data.total_boosters_1));
			// $("#updateVaxPpl").text(format(data.total_vaccinations - data.total_vaccinated - data.total_boosters_1));
			// $("#updateTotalDel").text(format(data.total_vaccines_distributed));
			// $("#updatePerAdm").text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%")






			// update header
			// $(".summary-header-cases > h1").text(test_results.positive + " cases");
			// $(".summary-header-cases > b").text(displayNewCases(data.change_cases));
			// $(".summary-header-deaths > h1").text(data.total_fatalities + " deaths");
			// $(".summary-header-deaths > b").text(displayNewCases(data.change_fatalities));
			// $(".summary-header-hospitalized > h1").text(data.total_hospitalizations + " hospitalized");
			// $(".summary-header-hospitalized > b").text(displayNewCases(data.change_hospitalizations));
			// $(".summary-header-recoveries > h1").text(data.total_recoveries + " recoveries");
			// $(".summary-header-recoveries > b").text(displayNewCases(data.change_recoveries));
			// $(".summary-header-percentVaccinated > h1").text((((data.total_vaccinations - (data.total_vaccinated) - (data.total_boosters_1)) / 38246108) * 100).toFixed(3) + "%");
			// $(".summary-header-percentVaccinated > b").text("of the Canadian population has received at least one dose");
			// $(".summary-header-percentFullyVaccinated > h1").text(((data.total_vaccinated / 38246108) * 100).toFixed(3) + "%");
			// $(".summary-header-percentFullyVaccinated > b").text("of the Canadian population is fully vaccinated");
			 $(".summary-header-rapidpositive > h1").text(format(data.total_positive) + " positive tests");
			 $(".summary-header-positivity > h1").text(((((data.total_positive) / ((data.total_positive) + (data.total_negative) + (data.total_invalid)))) * 100).toFixed(1) + "% overall positivity");
			 $(".summary-header-rapidnegative > h1").text(format(data.total_negative) + " negative results");
			 $(".summary-header-rapidtotal > h1").text(format((data.total_positive) + (data.total_negative) + (data.total_invalid)) + " total rapid tests reported");
			// $(".summary-header-vaccinations > b").text(displayNewCases(data.change_vaccinations));
			// $(".summary-header-pplVac > h1").text(data.total_vaccinations);
			// $(".summary-header-pplVac > b").text("people have received at least one dose");
			// $(".summary-header-vaccineDelivered > h1").text(format(data.total_vaccines_distributed) + " doses delivered");
			// $(".summary-header-vaccineDelivered > b").text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%" + " of doses delivered have been administered");

			// update province table footer
			// var canadaPopulation = 38246108;
			// var casesPer100000 = Math.floor(((100000 * data.total_cases) / canadaPopulation) * 100) / 100;
			// var fatalitiesPer100000 = Math.floor(((100000 * data.total_fatalities) / canadaPopulation) * 100) / 100;
			// var hospitalizationsPer100000 = Math.floor(((100000 * data.total_hospitalizations) / canadaPopulation) * 100) / 100;
			// var criticalsPer100000 = Math.floor(((100000 * data.total_criticals) / canadaPopulation) * 100) / 100;
			// var recoveriesPer100000 = Math.floor(((100000 * data.total_recoveries) / canadaPopulation) * 100) / 100;
			// var testsPer100000 = Math.floor(((100000 * data.total_tests) / canadaPopulation) * 100) / 100;
			// var vaccinationsPer100000 = Math.floor(((100000 * data.total_vaccinations) / canadaPopulation) * 100) / 100;
			// var vaccinationsPercent = Math.floor(((100000 * data.total_vaccinations) / data.total_vaccines_distributed) * 100) / 100;
			// $('#totalCasesCanada').attr("data-per-capita", casesPer100000);
			// $('#totalFatalitiesCanada').attr("data-per-capita", fatalitiesPer100000);
			// $('#totalHospitalizationsCanada').attr("data-per-capita", hospitalizationsPer100000);
			// $('#totalCriticalsCanada').attr("data-per-capita", criticalsPer100000);
			// $('#totalRecoveriesCanada').attr("data-per-capita", recoveriesPer100000);
			// $('#totalTestsCanada').attr("data-per-capita", testsPer100000);
			// $('#totalVaccinationsCanada').attr("data-per-capita", vaccinationsPer100000);
			// $('#totalVaccinationsChangeCanada').attr("data-per-capita", vaccinationsPer100000);

			// $('#totalCasesCanada').text(data.total_cases + (data.change_cases ? (" " + displayNewCases(data.change_cases)) : ""));
			// $('#totalFatalitiesCanada').text(data.total_fatalities + (data.change_fatalities ? (" " + displayNewCases(data.change_fatalities)) : ""));
			// $('#totalHospitalizationsCanada').text(data.total_hospitalizations + (data.change_hospitalizations ? (" " + displayNewCases(data.change_hospitalizations)) : ""));
			// $('#totalCriticalsCanada').text(data.total_criticals + (data.change_criticals ? (" " + displayNewCases(data.change_criticals)) : ""));
			// $('#totalRecoveriesCanada').text(data.total_recoveries + (data.change_recoveries ? (" " + displayNewCases(data.change_recoveries)) : ""));
			// $('#totalTestsCanada').text(data.total_tests + (data.change_tests ? (" " + displayNewCases(data.change_tests)) : ""));
			// $('#totalVaccinationsCanada').text(data.total_vaccinations + (data.change_vaccinations ? (" " + displayNewCases(data.change_vaccinations)) : ""));
			// $('#totalVaccinationsDistCanada').text(data.total_vaccines_distributed);
			// $('#totalVaccinationsPercentCanada').text((((data.total_vaccinations) / (data.total_vaccines_distributed)) * 100).toFixed(1) + "%")
			// $('#totalVaccinationsChangeCanada').text(data.change_vaccinations);
			// $('#totalVaccinatedCanada').text(data.total_vaccinated + (data.change_vaccinated ? (" " + displayNewCases(data.change_vaccinated)) : ""));
			// $('#totalBoostedCanada').text(data.total_boosters_1 + (data.change_boosters_1 ? (" " + displayNewCases(data.change_boosters_1)) : ""));
			// $('#vaccinatedPerCanada').text(vaccinationsPer100000);
			// $('#infectedPerCanada').text(casesPer100000);
		});

		// $("#perCapita").on('change', function () {
		// 	var field = $(this).val();

		// 	switch (field) {
		// 		case "cases":
		// 			$('#infectedPerCanada').text($('#totalCasesCanada').attr("data-per-capita"));
		// 			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		// 				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(2)").attr("data-per-capita"));
		// 			});
		// 			break;
		// 		case "fatalities":
		// 			$('#infectedPerCanada').text($('#totalFatalitiesCanada').attr("data-per-capita"));
		//			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		//				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(3)").attr("data-per-capita"));
		//			});
		//			break;
		//		case "hospitalizations":
		//			$('#infectedPerCanada').text($('#totalHospitalizationsCanada').attr("data-per-capita"));
		//			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		//				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(4)").attr("data-per-capita"));
		//			});
		//			break;
		//		case "criticals":
		//			$('#infectedPerCanada').text($('#totalCriticalsCanada').attr("data-per-capita"));
		//			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		//				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(5)").attr("data-per-capita"));
		//			});
		//			break;
		//		case "recoveries":
		//			$('#infectedPerCanada').text($('#totalRecoveriesCanada').attr("data-per-capita"));
		//			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		//				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(6)").attr("data-per-capita"));
		//			});
		//			break;
		//		case "tests":
		//			$('#infectedPerCanada').text($('#totalTestsCanada').attr("data-per-capita"));
		//			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		//				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(7)").attr("data-per-capita"));
		//			});
		//			break;
		//		case "vaccinations":
		//			$('#infectedPerCanada').text($('#totalVaccinationsCanada').attr("data-per-capita"));
		//			$('#totalCasesProvinceTable tr.provinceRow').each((index, item) => {
		//				$(item).find("td:nth-child(9)").text($(item).find("td:nth-child(8)").attr("data-per-capita"));
		//			});
		//			break;
		//	}

		//	return true;
		//});

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

				$(".summary-header-vaccinations > h1").text(format(peopleVaccinated) + " people");
				$(".summary-header-vaccinations > b").text("have received at least one dose");

			}
			else {
				$(".summary-header-vaccinations > h1").text(format(vaccinations) + " doses administered");
				$(".summary-header-vaccinations > b").text(displayNewCases(vaccinationsChange));
			}
		});

		$("#popDoseToggle").on('change', function () {
			var checked = $("#popDoseToggle").prop("checked");
			if (checked) {
				$(".summary-header-percentVaccinated > h1").text((totalPopulationVaccinated16).toFixed(3) + "%");
				$(".summary-header-percentVaccinated > b").text("of Canadians 5+ have received at least one dose");

			}
			else {
				$(".summary-header-percentVaccinated > h1").text((totalPopulationVaccinated).toFixed(3) + "%");
				$(".summary-header-percentVaccinated > b").text("of the Canadian population has received at least one dose");
			}
		});

		   $("#popDoseToggle1").on('change', function () {
			var checked = $("#popDoseToggle1").prop("checked");
			if (checked) {
				$(".summary-header-percentFullyVaccinated > h1").text((totalPopulationFullVaccinated16).toFixed(3) + "%");
				$(".summary-header-percentFullyVaccinated > b").text("of Canadians 5+ are fully vaccinated");

			}
			else {
				$(".summary-header-percentFullyVaccinated > h1").text((totalPopulationFullVaccinated).toFixed(3) + "%");
				$(".summary-header-percentFullyVaccinated > b").text("of the Canadian population is fully vaccinated");
			}
		});

		$(".summary-arrow").click(function () {
			var container = $(this).next();
			container.empty();
			var field = $(this).attr("data-field");
			var data = last5days[field];
			if (data !== undefined) {
				data.forEach(item => {
					container.append("<div>" +
						"<span>" + item.label + "</span>" +
						"<span>" + item.total + " " + (item.change !== null && item.change !== undefined ? displayNewCasesOlder(item.change) : "") + "</span>" +
						"</div>");
				});
			}
			container.toggle();
		});

		// draw map and cases by province graph and table
		$.ajax({
			url: "https://devapi.covid19tracker.ca/rapid-tests/split",
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
			url: "https://devapi.covid19tracker.ca/rapid-tests/report",
			type: "GET",
		}).then(res => {
			fillNulls(res.data);
			lineGraph3(res.data, "#dailyCaseChart", true);
			lineGraph4(res.data, "#dailyPositiveChart", true);
			lineGraph(res.data, "#cumulativeCaseChart", false);
			lineGraph(res.data, "#dosesPerDayChart");
		});

		// draw latest cases table
		$.ajax({
			url: api_url + "cases",
			type: "GET",
		}).then(res => {

			var data = res.data;

			data.forEach(function (item) {
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
		});

		// get notice
		$.ajax({
			url: "https://devapi.covid19tracker.ca/" + "notes/tag/vac",
			type: "GET",
		}).then(res => {
			var data = res;
			if (data && data.length) {
				$("#statisticsNotice").show();
				var note = data[0];
				$("#statisticsNotice .card-body").empty();
				$("#statisticsNotice .card-body").append("<h3>" + note.title + "</h3><p>" + note.description + "</p>");
			}
		});

		$.ajax({
			url: api_url + "vaccines/distribution",
			type: "GET",

		}).then(res => {
			var data = res.data;
			pieChart(data[0], "#vaccineDistribution");
			barGraph3(data[0], "#vaccineDistributionBarCanvas");
			$("#vaccineDistributionBarCanvas").css("max-height", $("#vaccineDistributionDiv").height() + "px");
			$.ajax({
				url: api_url + "vaccines/distribution/split",
				type: "GET",
			}).then(res2 => {
				data[0].country = "Canada";
				res2.data.push(data[0]);
				buildVaccineDistributionTable(res2.data);
			});
		});
		
		$.ajax({
			url: api_url + "vaccines/age-groups?after=2021-04-24",
			type: "GET",

		}).then(res => {
			lineGraph2(res.data, "#ageGroupChart", false, "full", "CA");
			lineGraph2(res.data, "#ageGroupAtleast1Chart", false, "atleast1", "CA");
			barGraph4(res.data[res.data.length - 1].data, "#ageGroupBarCanvas", "CA");
			
			$("#ageGroupFullToggle").on("change", function(){
				updateAgeGroupChart($("#" + $(this).data("target")), $(this).is(":checked"), res.data, "full");
			});
			
			$("#ageGroupAtleast1Toggle").on("change", function(){
				updateAgeGroupChart($("#" + $(this).data("target")), $(this).is(":checked"), res.data, "atleast1");
			});
			
			$("#ageGroupBarToggle").on("change", function(){
				updateAgeGroupBar($("#" + $(this).data("target")), $(this).is(":checked"), res.data[res.data.length - 1].data);
			});
			
			var keys = ["18-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80+"];
			var atleast1Sum = 0, fullSum = 0;
			$.each(keys, function(i, v){
				var aData = JSON.parse(res.data[res.data.length - 1].data);
				atleast1Sum += aData[v]["atleast1"];
				fullSum += aData[v]["full"];
			});
			
			$(".summary-header-percentVaccinated-ageGroup > h1").text((((atleast1Sum) / 30754887) * 100).toFixed(3) + "%");
			$(".summary-header-percentVaccinated-ageGroup > b").text("of adults (18+) in Canada have received at least one dose");
			$(".summary-header-percentFullyVaccinated-ageGroup > h1").text(((fullSum / 30754887) * 100).toFixed(3) + "%");
			$(".summary-header-percentFullyVaccinated-ageGroup > b").text("of adults (18+) in Canada are fully vaccinated");
		});
		
		$.ajax({
			url: api_url + "vaccines/age-groups/split?after=2021-04-24",
			type: "GET",
		}).then(res => {
			var provinceCodes = [];
			$.each(res.data, function(i, v){
				provinceCodes.push(v.province);
			});
			
			var maxDate = res.data[res.data.length - 1].date;
			var provinces = provinceCodes.filter(onlyUnique);
			var _data = res.data.filter(function(v){
				return v.date == maxDate && provinces.indexOf(v.province) >= 0;
			});
			
			_data.sort(function(a, b){ 
				if (a.province < b.province) {
					return -1;
				}
				if (b.province > a.province) {
					return 1;
				}
				return 0;
			});
		});

		$(window).on("resize", function () {
			$('#totalCasesProvinceTable .regionTable').each((index, regionsRow) => {
				var container = $(regionsRow).prev();
				var firstCells = container.find("td");
				var regionsRows = $(regionsRow).find("tr");
				regionsRows.each((index, row) => {
					var secondCells = $(row).find("td");
					firstCells.each((index2, cell) => {
						var newWidth = $(cell).width();
						if (index2 === 0) newWidth += 2;
						$(secondCells[index2]).width(newWidth);
					});
				});
			});
		});
	});

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return "" + y + "-" + m.toString().padStart(2, "0") + "-" + d.toString().padStart(2, "0");
}

function buildProvinceTable(data, provinceData) {
    data.forEach(function (item) {
        item.source = provinceSources[item.province] || "https://covid19tracker.ca/sources.html";
        var casesPer100000 = Math.floor(((100000 * item.total_cases) / provinceProperties(item.province).population) * 100) / 100;
        var fatalitiesPer100000 = Math.floor(((100000 * item.total_fatalities) / provinceProperties(item.province).population) * 100) / 100;
        var hospitalizationsPer100000 = Math.floor(((100000 * item.total_hospitalizations) / provinceProperties(item.province).population) * 100) / 100;
        var criticalsPer100000 = Math.floor(((100000 * item.total_criticals) / provinceProperties(item.province).population) * 100) / 100;
        var recoveriesPer100000 = Math.floor(((100000 * item.total_recoveries) / provinceProperties(item.province).population) * 100) / 100;
        var testsPer100000 = Math.floor(((100000 * item.total_tests) / provinceProperties(item.province).population) * 100) / 100;
        var vaccinationsPer100000 = Math.floor(((100000 * item.total_vaccinations) / provinceProperties(item.province).population) * 100) / 100;
        var vaccinationsPercent = Math.floor(((100 * item.total_vaccinations) / item.total_vaccines_distributed) * 100) / 100;


        var thisProvinceData = provinceData.filter(province => province.code === item.province);
        thisProvinceData = thisProvinceData.length ? thisProvinceData[0] : {};

        var updatedAt = thisProvinceData.updated_at ? moment(thisProvinceData.updated_at).format("dddd, MMMM Do YYYY, HH:mm") + " CST" : "N/A";
        var provinceStatus = thisProvinceData.data_status || "Unknown";

        // append data to row
        $('#totalCasesProvinceTable').append(
            "<tr class='provinceRow'>" +
            "<td>" +
            "<span class='province-update-status status-" + provinceStatus.toLowerCase().replace(/\s/gi, '-') + "' " +
            " data-toggle='tooltip' data-placement='bottom' data-html='true' title='" +
            "Status: <b>" + provinceStatus + "</b><br>" +
            "Last updated: <b>" + updatedAt + "</b><br>" +
            "Update expected by: <b>" + expectedTime(item.province) + "</b>" +
            "'></span>" +
            "<span>" + provinceProperties(item.province).name + "</span><span class='toggle-regions'><span class='arrow-down' data-toggle='0' data-province='" + item.province + "'><i class='fa fa-angle-down'></i></span></span>" +
            "</td>" +
            "<td data-per-capita='" + casesPer100000 + "'><b><i>" + item.total_cases + (item.change_cases ? (" " + displayNewCases(item.change_cases)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + fatalitiesPer100000 + "'><b><i>" + item.total_fatalities + (item.change_fatalities ? (" " + displayNewCases(item.change_fatalities)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + hospitalizationsPer100000 + "'><b><i>" + item.total_hospitalizations + (item.change_hospitalizations ? (" " + displayNewCases(item.change_hospitalizations)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + criticalsPer100000 + "'><b><i>" + item.total_criticals + (item.change_criticals ? (" " + displayNewCases(item.change_criticals)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + recoveriesPer100000 + "'><b><i>" + item.total_recoveries + (item.change_recoveries ? (" " + displayNewCases(item.change_recoveries)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + testsPer100000 + "'><b><i>" + item.total_tests + (item.change_tests ? (" " + displayNewCases(item.change_tests)) : "") + "</i></b></td>" +
            "<td data-per-capita='" + vaccinationsPer100000 + "'><b><i>" + item.total_vaccinations + (item.change_vaccinations ? (" " + displayNewCases(item.change_vaccinations)) : "") + "</i></b></td>" +
            "<td>" + casesPer100000 + "</td>" +
            "<td><a href='" + item.source + "'>Source</a></td>" +
            "</tr>"
        )


        var itemTotalVaccinated = item.total_vaccinated;
         var itemPositivity = Math.floor(item.total_positive / (item.total_invalid + item.total_positive + item.total_negative) * 100) / 100 * 100;

         if (itemPositivity === 0 || itemPositivity === undefined) itemPositivity = "N/A";
        else itemPositivity = Math.floor(item.total_positive / (item.total_invalid + item.total_positive + item.total_negative) * 100) / 100 * 100 + "%";

        if (itemTotalVaccinated === null || itemTotalVaccinated === undefined) itemTotalVaccinated = "N/A";
        else itemTotalVaccinated = item.total_vaccinated;

        var itemTotalBoosted = item.total_boosters_1;


        if (itemTotalBoosted === 0 || itemTotalBoosted === undefined) itemTotalBoosted = "N/A";
        else itemTotalBoosted = item.total_boosters_1;

        // append data to row
        $('#vaccinationsProvinceTable').append(
            "<tr class='provinceRow'>" +
            "<td>" +
            "<span> <b>" + provinceProperties(item.province).name + "</b> </span>" +
            "</td>" +
            "<td><i>" + format(itemPositivity) + "</i></td>" +
            "<td><i>" + format(item.total_positive) + "</i></td>" +
            "<td><i>" + format(item.total_negative) + "</i></td>" +
            "<td><i>" + format(item.total_invalid) + "</i></td>" +
          	"</tr>"
        )

        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip province-status-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
    });
}

function buildVaccineDistributionTable(data) {
    data.forEach(function (item) {
        $('#vaccineDistributionByProvinceTable').append(
            "<tr class='provinceRow'>" +
            "<td>" + (item.country ? "<b>" + item.country + "</b>" : provinceProperties(item.province).name) + "</td>" +
            "<td><span data-toggle='tooltip1' title='" + (item.moderna_administered ? "" + format(item.moderna_administered) + " administered" : "") + "'>" + (item.moderna ? format(item.moderna) : 0) + "</span></td>" +
            "<td><span data-toggle='tooltip1' title='" + (item.pfizer_biontech_administered ? "" + format(item.pfizer_biontech_administered) + " administered" : "") + "'>" + (item.pfizer_biontech ? format(item.pfizer_biontech) : 0) + "</span></td>" +
            "<td><span data-toggle='tooltip1' title='" + (item.astrazeneca_administered ? "" + format(item.astrazeneca_administered) + " administered" : "") + "'>" + (item.astrazeneca ? format(item.astrazeneca) : 0) + "</span></td>" +
            "<td>" + (item.johnson ? format(item.johnson) : 0) + "</td>" +
            "</tr>"
        )
    });


    $.ajax({
        url: api_url + "vaccines/distribution/"
    }).then(res => {
        var data = res.data[0];

        $("#vaccineDistributionLastUpdate").text(data.latest_date);
        $("#vaccineDistributionLastUpdate2").text(data.latest_date);
    });

    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })

}


