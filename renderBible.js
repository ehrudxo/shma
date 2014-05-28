var Canvas = require('canvas')
	, Image = Canvas.Image
  	, canvas
  	, ctx 
  	, Font = Canvas.Font
	, fs = require('fs')
	, dao = require('./decisionDao')
	, path = require('path')
	, S = require('string');

var fontFile = function(name){
	return path.join(__dirname, '/vendor/fonts/', name);
}
var setCanvas = exports.setCanvas= function( width, height ){
	canvas = new Canvas( width, height );
	ctx = canvas.getContext('2d');
}
var getPngByWord = exports.getPngByWord = function( word, callback ){
	var nanumFont = new Font('NanumGothic', fontFile('NanumGothic.ttf'));
	var nanumBold = new Font('NanumGothicBold', fontFile('NanumGothicBold.ttf'));
	var content = word["con"] ;
	var ps1 = "("+ word["book"]+ word["chap"]+":"+word["phase"]+")";
	var ps2 = "-biblewiki.kr";
	var ciWidth = 480;
	var charSize = 40;
	var wordObj = getWordLine( content, charSize, ciWidth );
	var linegap =10;
	var lineNum = wordObj["lineNum"];
	var psHeight = charSize*3;
	setCanvas( ciWidth,  lineNum * ( charSize+linegap ) + psHeight );
	ctx.addFont(nanumFont);
	ctx.addFont(nanumBold);
	canvas.width = canvas.width;
	ctx.fillStyle = "#333333";
    ctx.fillRect(0,0,ciWidth , lineNum * ( charSize+linegap ) + psHeight );
	ctx.fillStyle = "white";
	ctx.font = 'bold '+charSize+'px NanumGothicBold';
	for(var i=0;i<lineNum;i++){
		ctx.fillText( wordObj["lineString"][i],  10 , (charSize+linegap) * (i+1)  );	
	}
	ctx.fillText( ps1,  10 , (charSize+linegap) * (i+1)  );	
	ctx.fillText( ps2,  ciWidth - 7*charSize , (charSize+linegap) * (i+2)  );	
	callback(canvas.toBuffer());
}

var getWordLine  = exports.getWordLine = function( content , charSize, ciWidth){
	var emptyCount = S(content).count(" ");
	var nonEmptyCount = content.length - emptyCount;
	var ratioBetweenWord = 1;
	var ratioOfEmpty = 10;
	var gapWidth = (charSize * ratioBetweenWord)/100;
	var emptyWidth = (charSize * ratioOfEmpty)/100 + gapWidth;
	var wordWidth = charSize + gapWidth;
	var wholeWidth = wordWidth*nonEmptyCount + emptyWidth * emptyCount;
	console.log(wholeWidth,ciWidth,wholeWidth/ciWidth,Math.floor(wholeWidth/ciWidth),wholeWidth%ciWidth==0?0:1);
	var lineNum = Math.floor(wholeWidth/ciWidth) + (wholeWidth%ciWidth==0?0:1);
	var lineString = [],i=0,linePointer=0,currentSize=0;
	while(i<content.length){
		if(content[i]==' '){
			currentSize += emptyWidth;
		}else{
			currentSize += wordWidth;
		}
		if(i==0)lineString[linePointer] ="";
		if(currentSize>=ciWidth - charSize) {
			linePointer++;
			lineString[linePointer] ="";
			currentSize=0;
		}
		lineString[linePointer]+=content[i];
		i++;
	}
	return {lineNum:lineNum, lineString:lineString};
}

//console.log(getWordLine("너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 비밀한 일을 네게 보이리라.", 40, 480));
