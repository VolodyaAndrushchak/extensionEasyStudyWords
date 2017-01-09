window.onload = function() {
	
	/*$.ajax({
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170105T114050Z.873224048886e44e.0c1fbef17184a12e7c2b498d046c2ff7ed69bdec&text=head&lang=uk",
            type: 'GET',
            success: function(answer){ 
				console.log(answer.text[0]);
            	 $('#wrapper').find('p').html(answer.text[0]); 		
            }
	});*/
	
	function Words() {
		
	}
	
	Words.prototype.getWord = function(){
		$.ajax({
            url: "http://localhost:8080/getWords",
            type: 'GET',
            success: function(answer){ 
				//console.log(answer);
				var tableNew = "";
				for(var i = 0; i < 3; i++ ){
					tableNew = tableNew + "<tr><td><div class = 'status-word'></div></td><td>" + answer[i].english + "</td><td>" + answer[i].translation + "</td></tr>"; 
				}
				
				$("#tableNew").append(tableNew);
            }
		});
	}
	
	var word = new Words();
	console.log(111);
	word.getWord();
}


