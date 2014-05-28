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



var end = exports.end = function(){
	client.end();
	pg.end();
};

