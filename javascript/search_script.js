function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function getAnchorTexts(htmlStr) {
    var div,
        anchors,
        i,
        texts;
    div = document.createElement('div');
    div.innerHTML = htmlStr;
    anchors = div.getElementsByTagName('a');
    texts = [];
    for (i = 0; i < anchors.length; i += 1) {
        texts.push(anchors[i].text);
    }
    return texts;
}

function scoreToGrade(score) {
    if(score < .60){
      return "F";
    }
    if(score >=.60 && score <=.62){
      return "D-";
    }
    if(score >.62 && score <.68){
      return "D";
    }
    if(score >=.68 && score <.70){
      return "D+";
    }
    if(score >=.70 && score <=.72){
      return "C-";
    }
    if(score >.72 && score <.78){
      return "C";
    }
    if(score >=.78 && score <.80){
      return "C+";
    }
    if(score >=.80 && score <=.82){
      return "B-";
    }
    if(score >.82 && score <.88){
      return "B";
    }
    if(score >=.88 && score <.90){
      return "B+";
    }
    if(score >=.90 && score <=.92){
      return "A-";
    }
    if(score >.92 && score <.98){
      return "A";
    }
    if(score >=.98 && score <1.0){
      return "A+";
    }
    else{
      return "undefined";
    }
}

var URL = getURLParameter('url');
console.log(URL);
document.getElementById('search-page-input').value = URL;

var title;
var author;
var date;
var result;
var get_data = $.get(URL, function(data) {
var data = $(data);
	title = $(data).find('.pg-headline');
	author = $(data).find('.metadata__byline__author');
	date = $(data).find('.update-time');
	var body = $(data).find('.zn-body__paragraph');
	result = "";
	for(i=0; i < body.length; i++){
	  result += body[i].innerHTML;
	}
});

var post_data;
$.when(get_data).done(function(){
	post_data = {'title': title.html(), 'content': result,
	'url': URL};
	$.post( "http://169.234.59.37:8080/fakebox/check", post_data, function( data ) {

		console.log(data);

		var authors = getAnchorTexts(author.html()).join(", ");
		var article_date = String(date.html()).split("<span")[0];

		var article_keywords = data["content"]["keywords"][0]["keyword"];
		for (i = 1; i < data["content"]["keywords"].length; i++) {
			article_keywords += ", " + data["content"]["keywords"][i]["keyword"];
		}

		document.getElementById("article-title-score").innerHTML = scoreToGrade(data["title"]["score"]);
		document.getElementById("article-score").innerHTML = scoreToGrade(data["content"]["score"]);

		document.getElementById("article-title").innerHTML = title.html();
		document.getElementById("article-author").innerHTML = "Author: " + authors;
		document.getElementById("article-date").innerHTML = article_date;

		document.getElementById("title-decision").innerHTML = data["title"]["decision"];
		document.getElementById("title-score").innerHTML = String(data["title"]["score"]).slice(0,6);
    document.getElementById("title-ldBar").ldBar.set(String(data["title"]["score"]).slice(2,4));

		document.getElementById("content-decision").innerHTML = data["content"]["decision"];
		document.getElementById("content-score").innerHTML = String(data["content"]["score"]).slice(0,6);
    document.getElementById("content-ldBar").ldBar.set(String(data["content"]["score"]).slice(2,4));
		document.getElementById("content-keywords").innerHTML = article_keywords;

		document.getElementById("domain-decision").innerHTML = data["domain"]["category"];
		document.getElementById("domain-name").innerHTML = data["domain"]["domain"];
		


	});
});