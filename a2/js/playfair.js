//web worker stuff
var hclimber, hclimber2, hclimber3;
var stop_flag = 0;
var current_channel = 0;
var max_score = -10000.0;

var numb_workers = 3;
var created_workers = 0;

function set_reload(){
    stop_flag = 1; // signal to reinitialize
}    

function initialize(){
	var str;
	var s;
	
	
   hclimber = new Worker('js/climber.js');
   hclimber.onmessage = function (event) {
	 str = event.data;
	 if (str.charAt(0) == '0'){
		 s = str.split('~'); // string separated by tilde ~
		 score = parseFloat(s[0].slice(1));
		 $('#status').val(s[0].slice(1));
		 if ( score > max_score){
		 	 max_score = score;
		 	 current_channel = 0;
		 }
		
		if ( current_channel == 0)
     		$('#output_area').val(s[1]+" worker: 0");
	 
	 }
     else if (str.charAt(0) == '1'){
     	$('#status').val(str.slice(1));
 	}
     else
     	$('#output_area').val(str);   
   };

	hclimber2 = new Worker('js/climber.js');
	hclimber2.onmessage = function (event) {
		var str,i,score,s;	   
		 str = event.data; 	 
		 if (str.charAt(0) == '0') { // break up into score and display strings
			 s = str.split('~'); // string separated by tilde ~
			 score = parseFloat(s[0].slice(1));
			 $('#status1').val(s[0].slice(1));		 
			 if ( score > max_score){
				 max_score = score;
				 current_channel = 1;
			 }
			
			if ( current_channel == 1)
			$('#output_area').val(s[1]+" worker: 1");
		
		}
	  else if (str.charAt(0) == '1'){
		//alert(str.slice(1));
			$('#status1').val(str.slice(1));
		}
	  else
		$('#output_area').val(str+" worker: 1");   
	};

	hclimber3 = new Worker('js/climber.js');
	hclimber3.onmessage = function (event) {
		var str,i,score,s;	   
		 str = event.data; 	 
		 if (str.charAt(0) == '0') { // break up into score and display strings
			 s = str.split('~'); // string separated by tilde ~
			 score = parseFloat(s[0].slice(1));
			 $('#status2').val(s[0].slice(1));		 
			 if ( score > max_score){
				 max_score = score;
				 current_channel = 2;
			 }
			
			if ( current_channel == 2)
			$('#output_area').val( s[1]+" worker: 2");
		
		}
	  else if (str.charAt(0) == '1'){
		//alert(str.slice(1));
			$('#status2').val(str.slice(1));
		}
	  else
		$('#output_area').val(str+" worker: 2");   
	};
  
}

function do_check(){
	var s,s1,n,c;
	var alpha='abcdefghijklmnopqrstuvwxyz';
	s = $('#input_area').val();
	if (s == ''){
		alert("No text entered");
		return(false)
	}
	s = s.toLowerCase();
	s1=''
	for (n = 0;n<s.length;n++){
		c = s.charAt(n);
		if (alpha.indexOf(c) != -1)
			s1 += c;
	}
	if ( (s1.length&1) !=0 ){
		alert("Text has odd number of letters!");
		return(false);
	}
	return(true);
}

function do_solve(){
	var str,max_trials,s,n;
	
	if (!do_check()) return;

	if (created_workers < numb_workers){
		initialize();
		created_workers = numb_workers;
	}

	max_score  = -10000.0;
	max_trials = parseInt($('#numb_trials').val());	
	str = '@'+max_trials;
	s = $('#fudgefactor0').val();
	//s = 0.23;
	str += ':'+s; // use colons to separate values
	n = Math.floor( Math.random()*1000);
	str = str+':'+n;
	
	hclimber.postMessage(str);  
	str = '@'+max_trials;
	s = $('#fudgefactor1').val();
	str += ':'+s; // use colons to separate values
	n = Math.floor( Math.random()*2000);
	str = str+':'+n;
	hclimber2.postMessage(str);  

	str = '@'+max_trials;
	s = $('#fudgefactor2').val();
	//s = 0.23;
	str += ':'+s; // use colons to separate values
	n = Math.floor( Math.random()*3000);
	str = str+':'+n;
	hclimber3.postMessage(str);  

	//transmit ciphertext
	str = $('#input_area').val();	
	hclimber.postMessage(str);  
	hclimber2.postMessage(str);  
	hclimber3.postMessage(str);  
	stop_flag = 0;
}

function do_stop(){
	var str;
	
	hclimber.terminate();
	hclimber2.terminate();
	hclimber3.terminate();	
	$('#status').val("Stopped");
	$('#status1').val("Stopped");
	$('#status2').val("Stopped");
	stop_flag = 1;
}

function do_clear(){
	$('#output_area').val('');
	$('#input_area').val('');
	$('#status').val('Idle');
	$('#status1').val('Idle');
	$('#status2').val('Idle');
	created_workers = 0;
}
