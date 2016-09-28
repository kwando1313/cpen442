function test(){
	var undecoded_text = $('.frequency-analysis').val();
	var letters_frequency = {};
	var two_word_frequency = {};
	var three_word_frequency = {};
	var four_word_frequency = {};
	var five_word_frequency = {};
	var six_word_frequency = {};
	for (var x = 0; x < undecoded_text.length; x++){
		if (undecoded_text.charAt(x) in letters_frequency){
			letters_frequency[undecoded_text.charAt(x)]++;
		}
		else {
			letters_frequency[undecoded_text.charAt(x)] = 1;
		}
	}
	
	for (var x = 0; x < undecoded_text.length - 1; x++){
		var temp_string = undecoded_text.charAt(x) + undecoded_text.charAt(x+1);
		if (temp_string in two_word_frequency){
			two_word_frequency[temp_string]++;
		}
		else {
			two_word_frequency[temp_string] = 1;
		}
	}
	
	for (var x = 0; x < undecoded_text.length - 2; x++){
		var temp_string = undecoded_text.charAt(x) + undecoded_text.charAt(x+1)+ undecoded_text.charAt(x+2);
		if (temp_string in three_word_frequency){
			three_word_frequency[temp_string]++;
		}
		else {
			three_word_frequency[temp_string] = 1;
		}
	}
	for (var x = 0; x < undecoded_text.length - 3; x++){
		var temp_string = undecoded_text.charAt(x) + undecoded_text.charAt(x+1)+ undecoded_text.charAt(x+2) + undecoded_text.charAt(x+3);
		if (temp_string in four_word_frequency){
			four_word_frequency[temp_string]++;
		}
		else {
			four_word_frequency[temp_string] = 1;
		}
	}
	for (var x = 0; x < undecoded_text.length - 4; x++){
		var temp_string = undecoded_text.charAt(x) + undecoded_text.charAt(x+1) + undecoded_text.charAt(x+2) + undecoded_text.charAt(x+3) + undecoded_text.charAt(x+4);
		if (temp_string in five_word_frequency){
			five_word_frequency[temp_string]++;
		}
		else {
			five_word_frequency[temp_string] = 1;
		}
	}
	for (var x = 0; x < undecoded_text.length - 5; x++){
		var temp_string = undecoded_text.charAt(x) + undecoded_text.charAt(x+1) + undecoded_text.charAt(x+2) + undecoded_text.charAt(x+3) + undecoded_text.charAt(x+4) + undecoded_text.charAt(x+5);
		if (temp_string in six_word_frequency){
			six_word_frequency[temp_string]++;
		}
		else {
			six_word_frequency[temp_string] = 1;
		}
	}
	var string = "";
	var string2 = "";
	var letters_array = [];
	var amount_array = [];
	

	var sortable = [];
	for (var key in letters_frequency)
		  sortable.push([key, letters_frequency[key]])
	sortable.sort(
		function(a, b) {
			return b[1] - a[1]
		}
	)
	for (var a in sortable){
		letters_array.push(sortable[a][0]);
		amount_array.push(sortable[a][1]);
	}
	for (var key in sortable){
		string = string + sortable[key][0] + ": " + sortable[key][1] + ": " + parseFloat(sortable[key][1]/undecoded_text.length).toFixed(3) *100 + "% </br>";
	}

	
	$('#results1').html(string);
	
	sortable = [];
	string = "";
	for (var key in two_word_frequency)
		  sortable.push([key, two_word_frequency[key]])
	sortable.sort(
		function(a, b) {
			return b[1] - a[1]
		}
	)
	for (var key in sortable){
		if (sortable[key][1] > 3){
			string = string + sortable[key][0] + ": " + sortable[key][1] + ": " + parseFloat(sortable[key][1]/undecoded_text.length).toFixed(3) *100 + "% </br>";
		}
	}

	
	$('#results2').html(string);
	string = "";
	
	sortable = [];
	for (var key in three_word_frequency)
		  sortable.push([key, three_word_frequency[key]])
	sortable.sort(
		function(a, b) {
			return b[1] - a[1]
		}
	)
	for (var key in sortable){
		if (sortable[key][1] > 3){
			string = string + sortable[key][0] + ": " + sortable[key][1] + ": " + parseFloat(sortable[key][1]/undecoded_text.length).toFixed(3) *100 + "% </br>";
		}
	}

	
	$('#results3').html(string);
		string = "";

	sortable = [];
	for (var key in four_word_frequency)
		  sortable.push([key, four_word_frequency[key]])
	sortable.sort(
		function(a, b) {
			return b[1] - a[1]
		}
	)
	for (var key in sortable){
		if (sortable[key][1] > 3){
			string = string + sortable[key][0] + ": " + sortable[key][1] + ": " + parseFloat(sortable[key][1]/undecoded_text.length).toFixed(3) *100 + "% </br>";
		}
	}

	
	$('#results4').html(string);
		string = "";

	sortable = [];
	for (var key in five_word_frequency)
		  sortable.push([key, five_word_frequency[key]])
	sortable.sort(
		function(a, b) {
			return b[1] - a[1]
		}
	)
	for (var key in sortable){
		if (sortable[key][1] > 3){
			string = string + sortable[key][0] + ": " + sortable[key][1] + ": " + parseFloat(sortable[key][1]/undecoded_text.length).toFixed(3) *100 + "% </br>";
		}
	}

	
	$('#results5').html(string);
		string = "";

	sortable = [];
	for (var key in six_word_frequency)
		  sortable.push([key, six_word_frequency[key]])
	sortable.sort(
		function(a, b) {
			return b[1] - a[1]
		}
	)
	for (var key in sortable){
		if (sortable[key][1] > 3){
			string = string + sortable[key][0] + ": " + sortable[key][1] + ": " + parseFloat(sortable[key][1]/undecoded_text.length).toFixed(3) *100 + "% </br>";
		}
	}

	
	$('#results6').html(string);
	
		var ctx = $("#myChart");

		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: letters_array,
				datasets: [{
					label: 'Letter Frequency',
					data: amount_array,
					borderWidth: 1
				}]
			},
			options: {
				responsive: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});

}