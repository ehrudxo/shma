var pg = require('pg');
var pool,client;
var connString = 'tcp://nodeMap:asdf@localhost/cpgoods';

var connect = exports.connect = function connect( callback ){
	if(client instanceof pg.Client){
		if( typeof callback === "function" ) callback();
	}else{
		client = new pg.Client(process.env.DATABASE_URL||connString);
		client.on('error', function(error) {
		      console.log(error);
		});
		client.connect( function(){
			if( typeof callback === "function" ) callback();
		});
	}
}

var getWord = exports.getWord = function( book,chpter,verse, callback ){
	var query = "select * from k_bible_1950 where book=$1 and chap=$2 and phase=$3";
	client.query(query, [book,chpter,verse], function(err, result) {
		if(err){
			console.log( "error occurred"+err );
			end();
		}else if(typeof result == "object"){
			callback( result.rows[0] );
		}else{
			console.log("unexpected!",err);
		}
	});
}
var getAll = exports.getAll = function(callback){
	var query = "select * from k_bible_1950";
	client.query(query, function(err, result) {
		if(err){
			console.log( "error occurred"+err );
			end();
		}else if(typeof result == "object"){
			var rows = result.rows;
			var len = rows.length;
			var bible ={};

			for(var i=0;i<len;i++){
				var book = rows[i]["book"];
				var chap = rows[i]["chap"];
				var phase = rows[i]["phase"];
				var con = rows[i]["con"];
				var idx = rows[i]["bible_idx"];
				if(!bible[book]){
					bible[book] = {};
				}
				if(!bible[book][chap]){
					bible[book][chap]={};
				}
				bible[book][chap][phase] = {
					t : con,
					i : idx
				}
			}
			callback( bible );
		}else{
			console.log("unexpected!",err);
		}
	});
}

var end = exports.end = function(){
	client.end();
	pg.end();
};
