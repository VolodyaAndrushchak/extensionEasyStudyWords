module.exports = function(pool){
	return {

		getWords: function(callback){
			pool.query("SELECT english, transcription, translation FROM wordfirst1000 LIMIT 6", callback);
		}
	
	}
}