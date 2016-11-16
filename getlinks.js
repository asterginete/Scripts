// Script to scrape e-mails and number on a specific site with iMacros extension for Firefox.
// This script will open link pages, then scrape e-mails and numbers on that page.

var rootDir = "http://www.ayosdito.ph/Philippines/Cars-for-sale-1020?o=";
var rootDir2 = "&th=1";
var start_page = 1;
var max_page = 0;
var start_link = 1;
var end_link = 170;

//==========================================================//
var gotoURL = "CODE:URL GOTO={{adlink}}";
var getLink = "CODE:TAG POS={{loop}} TYPE=A ATTR=HREF:http://www.ayosdito.ph*.htm EXTRACT=HREF";

openAds();
//getData();

function openAds () {
	var extract =  "CODE:SEARCH SOURCE=REGEXP:'target:/(09|\+639)\d+\-?\d+\-?\d+/g' EXTRACT=$1";
	
	iimSet ('adlink', rootDir + start_page + rootDir2);
	iimPlay (gotoURL);
	
	while (window.content.find("PREVIOUS")) {

		var closeTab = "CODE:TAB CLOSE";
		
		for (var i = 1; i <= 40; i++) {
			iimSet('loop', i);
			iimPlay(getLink);
			i++;
			iimSet('loop', i);
			iimPlay(getLink);
			
			strLink = iimGetLastExtract(0);
			if (strLink == '#EANF#') {	
				break;
			}
						
			if (strLink.search("login") > 0) {
			}
			else {
				iimSet ('adlink', strLink);
				iimPlay ('savelink');
				searchDigit();
				searchEmail()
				iimPlay (closeTab);
			}
		}
		
		if (max_page > 0) {
			if (start_page == max_page) {
				break;
			}
		}
		start_page--;
		
		iimSet ('adlink', rootDir + start_page + rootDir2);
		iimPlay (gotoURL);
	}
}

function getData () {
	for (var i = start_link; i <= end_link; i++) {
		iimDisplay('LOOP NUMBER: ' + i);
		iimSet('loop', i);
		iimPlay ('openlinks');
		searchDigit();
		searchEmail();
	}
}

function searchEmail() {
	var getEmail, bodyText;

	bodyText = window.content.document.body.innerHTML;
	getEmail = bodyText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (getEmail != null && getEmail.length > 0) {
	
		var prevString = "";
		for (var i = 0; i < getEmail.length; i++) {
			var getString = getEmail[i];
			
			if (prevString.localeCompare(getString) != 0) {
				prevString = getString;
				iimSet('extracted', getString);
				iimPlay('getmail_links');
			}			
		}
	}
}

function searchDigit() {
	var getNumber, bodyText;

	bodyText = window.content.document.body.innerHTML;
	getNumber = bodyText.match(/(08|09|\+63)\s?\.?\-?\d+\s?\.?\-?\d+\s?\.?\-?\d+/g);
    if (getNumber != null && getNumber.length > 0) {
	
		var prevString = "";
		
		for (var i = 0; i < getNumber.length; i++) {
			var getString = getNumber[i];
			var newString = getString.replace(/-/g,"").replace(/^\+639/,"09").replace(/\s+/g,"");
			
			if (newString.length == 11 && prevString.localeCompare(newString) != 0) {
				if (newString.match(/^0813|^0817|^0905|^0906|^0907|^0908|^0909|^0910|^0912|^0915|^0916|^0917|^0918|^0919|^0920|^0921|^0922|^0923|^0925|^0926|^0927|^0928|^0929|^0930|^0932|^0933|^0934|^0935|^0936|^0937|^0938|^0939|^0942|^0943|^0946|^0947|^0948|^0949|^0973|^0974|^0977|^0979|^0989|^0994|^0996|^0997|^0998|^0999/)) {
					prevString = newString;
					iimSet('extracted', newString);
					iimPlay('getnum_links');
				}
			}		
		}
	}
}
