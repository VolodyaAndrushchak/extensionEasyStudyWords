window.onload = function() {
	
	function Words() {
		this.arrBGC = ['background-color' + ':' +'#A60000', 
					   'background-color' + ':' +'#FF6200', 
					   'background-color' + ':' +'#FFDB00', 
					   'background-color' + ':' +'#AEF100', 
					   'background-color' + ':' +'#41DB00'];
		
		this.hiddenArray = {'repeat-pop-up-menu': 'previousWordsHidden' , 'new-pop-up-menu' :'tableNewHidden' };
		this.arrWords = [];
		this.studyInc = 0;
		this.trainInc = 0;
		this.arrCommonWords = [];
		this.rightAnswer = 0;
		this.arrLocal;
		this.isNewWords = true;
		
	}
	Words.prototype.minHeightWindow = function() {
		$('body').height(0);
		$('html').height(0);
	}
	
	Words.prototype.getWord = function(){
		var that = this;
		//private function that add words to main pop menu
		function appendWordsInPopUp(idTable, fromI, toI, arrData, classWords) {
			var tableNew = "";
			for(var i = fromI; i < toI; i++ ){
				if (arrData[classWords][i]) {
					tableNew = tableNew + "<tr><td><div class = 'status-word' style=" + that.arrBGC[classWords] + "></div></td><td>" + arrData[classWords][i].english + "</td><td>" + arrData[classWords][i].translation + "</td></tr>"; 
				}
			}
			$("#" + idTable).append(tableNew);
		}
		
		$.ajax({
            url: "http://localhost:8080/getWords",
            type: 'GET',
            success: function(answer){
				//attach answer(words) to neccesary property
				that.arrWords = answer;
				that.isNewWords == that.arrWords[0].length != 0 ? true : false;
				//words in common array
				for(var i = 0; i < that.arrWords.length; i++) {
					for(var j = 0; j < that.arrWords[i].length; j++) {
						that.arrCommonWords.push(that.arrWords[i][j]);
					}
				}
				//append words in table
				if (that.arrWords[0].length < 3) {
					//append three new words in text
					appendWordsInPopUp('tableNew', 0, that.arrWords[0].length, answer, 0);
				}
				else {
					//apend familiar... words
					appendWordsInPopUp('tableNew', 0, 3, answer, 0);
					appendWordsInPopUp('tableNewHidden', 3, that.arrWords[0].length, answer, 0);
				}
				/*
				appendWordsInPopUp('tableNew', 0, 3, answer, 0);
				// append hidden three words
				appendWordsInPopUp('tableNewHidden', 3, 6, answer, 0);*/
				//apend familiar... words
				for (var i = 1; i < 4; i++) {
					if( answer[i] != [] ) {
						appendWordsInPopUp('previousWords', 0, 6, answer, i);
						break;
					}
				}
				//apend familiar in hidden table
				for (var i = 2; i < 4; i++) {
					appendWordsInPopUp('previousWordsHidden', 0, 6, answer, i);
				}
				
            }
		});
	}
	
	Words.prototype.showHideWords = function(idButton) {
		//change img on buttons
		if ($('#' + this.hiddenArray[idButton]).css('display') == 'none') 
			$('#' + idButton).find('img').attr('src', 'img/arrowTop.png');
		else 
			$('#' + idButton).find('img').attr('src', 'img/arrowBottom.png');
		//show/hide additional words
		$('#' + this.hiddenArray[idButton]).slideToggle('fast');
		//resizing window of extension
		this.minHeightWindow();
	}
	
	Words.prototype.trainWords = function() {
		//train necessary amount words
		if (this.trainInc < this.arrCommonWords.length) {
			
			this.arrLocal = new Array(4);
			this.rightAnswer = Math.round(Math.random()*3);
			this.arrLocal[this.rightAnswer] = this.trainInc;

			for(var i = 0; i < 3; i++) {
				var randWord; 
				do {
					randWord = Math.round(Math.random()*(this.arrCommonWords.length - 1) ); 
				}
				while ( this.arrLocal.indexOf(randWord) != -1)

				if ( this.arrLocal[i] != undefined ) {
					this.arrLocal[i + 1] =  randWord;
				}	
				else {
					this.arrLocal[i] =  randWord;
				}
			}
			var test = "<div id = 'trainWords'><p>"+ this.arrCommonWords[this.trainInc].english +"</p><ul id = 'testList'>";
			console.log(this.arrCommonWords);
			for( var i = 0; i < 4; i++) {
				test = test + "<li><input type='radio' name = 'varanswer'>" + this.arrCommonWords[this.arrLocal[i]].translation +"</li>"
			}
			test = test + "</ul></div>"
			$('#main-content').empty();
			$('#main-content').append(test);
			this.minHeightWindow();
			
			this.trainInc++;
			$('#buttonStudy').html('Train');
			//console.log(arrLocal);
		}
		//last words
		else {
			$('#main-content').empty();
			$('#main-content').append("<p>You finished training!</p>");
		}
		
		
	}
	
	Words.prototype.studyWords = function(){
		
		if (this.studyInc != this.arrWords[0].length) {
			
			$('#main-content').empty();
			var strHTML = "<div id = 'studyWords'>";
			strHTML = strHTML + "<p>" + this.arrWords[0][this.studyInc].english +"</p><p>" + 
									this.arrWords[0][this.studyInc].transcription + "</p><p>" +
									this.arrWords[0][this.studyInc].translation;
			strHTML = strHTML + "</div>";
			$('#main-content').append(strHTML);
			this.minHeightWindow();
			this.studyInc++;
			$('#buttonStudy').html('Study');
			
			if( this.studyInc === this.arrWords[0].length ) {
				$('#buttonStudy').html('Train');
				//$('#buttonStudy').attr("id", "buttonTrain");
			}
		}
		
	}
	
	Words.prototype.checkWords = function(){
		
		var inp = document.getElementsByName('varanswer');
		var tmp = [];
		for (var i = 0; i < inp.length; i++) {
			if (inp[i].type == "radio" && inp[i].checked) {

				var obj = {};
				//if right answer
				if( this.rightAnswer == i ) {
					inp[i].parentElement.style.backgroundColor = "green";
					obj = {
						word: this.arrCommonWords[this.arrLocal[i]].english,
						status: 1
					};
				}
				//if wrong anwer
				else {
					inp[i].parentElement.style.backgroundColor = "red";
					inp[ this.rightAnswer].parentElement.style.backgroundColor = "green";
					obj = {
						word: this.arrCommonWords[this.arrLocal[this.rightAnswer]].english,
						status: 0
				};
					
				}
				console.log(obj.word);
				//sent to server - word and status
				$.ajax({
					url: "http://localhost:8080/changeStatusWord",
					type: 'PATCH',
					data: obj,
					success: function(answer){
					}
				});
			}
			else {
				tmp.push(0);
			}	
		}
		//check if user click on radio
		if(tmp.length == 4) {
			$('#buttonStudy').css('pointer-events', 'none ');
			$('#buttonStudy').css('color', '#BBBBBB');
			$('#checkButton').css('pointer-events', 'visiblePainted ');
			$('#checkButton').css('color', '#000');
		}
		else {
			$('#checkButton').css('pointer-events', 'none ');
			$('#checkButton').css('color', '#BBBBBB');
			$('#buttonStudy').css('pointer-events', 'visiblePainted ');
			$('#buttonStudy').css('color', '#000');
		}
}
	
	//creating object word
	var word = new Words();
	// this method will work when you click on exnension's icon
	word.getWord();
	
	document.getElementById("new-pop-up-menu").onclick=function(){
		word.showHideWords('new-pop-up-menu');
	}
	
	document.getElementById("repeat-pop-up-menu").onclick=function(){
		word.showHideWords('repeat-pop-up-menu');
	}
	
	document.getElementById("buttonStudy").onclick=function(){
		console.log( word.isNewWords);
		if( $('#buttonStudy').html() != 'Train' && word.isNewWords == true) {
			word.studyWords();
		}
		else {
			
			$('#checkButton').css('display', 'block');
			$('#checkButton').css('pointer-events', 'visiblePainted ');
			$('#checkButton').css('color', '#000');
			$('#buttonStudy').css('pointer-events', 'none ');
			$('#buttonStudy').css('color', '#BBBBBB');
			word.trainWords();
		}
	}
	
	document.getElementById("checkButton").onclick=function(){
		word.checkWords();
		
	}
	

}




