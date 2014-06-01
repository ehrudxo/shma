
var express = require('express');
var logfmt = require('logfmt');
var jade = require('jade');
var app = express();
var renderImage = require('./renderImage');	
var renderBible = require('./renderBible');	
var dao = require('./decisionDao');	
var bDao = require('./bibleDao');	
var formidable = require('formidable');

app.set('title','which is bertter?');
app.set('view engine','jade');
app.engine('jade',require('jade').__express);
app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));

app.use('/blabla/:id/which/:which', function(req,res){
	res.render('blabla', {id:req.params.id,which :req.params.which});
})
app.use('/', function(eq,res){
	res.send("Hello shma!");
});
app.use('/canvas/:id/which/:which', function( req, res ){
	
	dao.connect( function(){
		dao.getFilesById( req.params.id, function(decision){
			renderImage.setCanvas(600,600);
			renderImage.getPngByFiles( decision["filepath1"], decision["filepath2"], req.params.id, req.params.which, function( pngFile ){
				res.set('Content-Type', 'image/png');
				res.send( pngFile );
			} );	
			
		});
	} );
	
});
app.get('/:book/:chapter/:verse', function( req, res ){
	bDao.connect( function(){
		bDao.getWord(req.params.book, 
					 req.params.chapter, 
					 req.params.verse, 
					 function( word ){
			renderBible.getPngByWord( word , function(pngFile){
				res.set('Content-Type', 'image/png');
				res.send( pngFile );
			} );	

		});
	});
});

app.post('/uploads',function(req,res){
	var form = new formidable.IncomingForm();
	console.log(form);
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        console.log(files);
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
 
        
    });
});


var port = Number(process.env.PORT || 8001);
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

