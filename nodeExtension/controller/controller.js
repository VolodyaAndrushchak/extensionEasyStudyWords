module.exports = function(model, view, request, cheerio){
	return {
		getWords: function(req, res){
			model.getWords(function(err, answerDB){
				view.getWords(answerDB, function(HTMLcontent){
					res.json(HTMLcontent);
				} )
					
			});
		}			
	}
}
