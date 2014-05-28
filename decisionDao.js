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

var getFilesById = exports.getFilesById = function( id, callback ){
	var query = "select * from decision where id=" + id;
	client.query(query, function(err, result) {
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
var updateDecision = exports.updateDecision = function( id, which, callback){
	var query = "UPDATE decision SET vote"+which+"=(select vote"+which+"+1 from decision where id="+id+") WHERE id="+id+";"
	client.query(query, function(err, result) {
		if(err){
			console.log( "error occurred"+err );
			end();
		}else if(typeof result == "object"){
			getFilesById(id, function(decision){
				callback( decision );	
			});

			
		}else{
			console.log("unexpected!",err);
		}
	});	
}
var end = exports.end = function(){
	client.end();
	pg.end();
};

