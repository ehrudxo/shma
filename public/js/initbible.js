var kbible1950;
var readUrl ='/read';
var bibleInit = function(){
  if(localStorage["getItem"]){
    kbible1950 = JSON.parse(localStorage.getItem("k_bible_1950"));
  }else{
    alert("브라우저가 오프라인 모드를 지원하지 않습니다.");
    console.log("local storage problem");
  }
}
var bibleInstall = function(callback){
  if(localStorage.getItem("k_bible_1950")){
    var r = confirm("개역 한글이 설치되어 있는 거 같습니다. 그래도 설치하시겠습니까?");
    if (r == true) {
      installRequest(function( data ){
        console.log( data );
        alert("성공적으로 설치했습니다!");
        window.location.replace( readUrl );
      });
    } else {
      window.location.replace( readUrl );
    }
  }else{
    installRequest(function( data ){
      console.log( data );
      alert("성공적으로 설치했습니다!");
      window.location.replace( readUrl );
    });
  }
}
var installRequest = function( callback ){
  $.get( "/getAll", function( data ) {
    localStorage.setItem( "k_bible_1950" , data );
    callback(data);
  });
}

var bibleRead = function(book,chap,phase){
  $(".cbody").html("");
  if(book && book.length==1){
    book = book + " ";
  }
  chap = chap ||"1";
  if(book){
    for( phs in kbible1950[book][chap]){
      $(".cbody").append("<div class='b"+phs+"'>["+book+" "+chap+":"+phs+"] "+ kbible1950[book][chap][phs]["t"] + "</div>");
    }
  }
  if(phase){
    $(".b"+phase).css("color","red");
    $(".b"+phase).ScrollTo();
  }
}
