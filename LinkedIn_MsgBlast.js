var mSelectConn = "CODE:TAG POS={{LOOP}} TYPE=INPUT:CHECKBOX ATTR=NAME:connectionChooser CONTENT=YES";
var iLoop = 51;
var iMax = 50;
var iLetter = 0;
var aLetter = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#");
var err_message = "";
var bSent = false;

for (;;) {	
	var iCntSelect = 0;
	iimPlay('LinkedIn_MsgCompose');	
	for (var j = iLetter; j <= 26; j++) {
		
		var mLetter = "CODE:TAG POS=1 TYPE=A ATTR=TXT:" + aLetter[j];
		iimPlay(mLetter);
		err_message = iimGetLastError();
		if (err_message != 'OK') {
			continue;
		}
		else {
			for (var i = iLoop;; i++) {
				iimSet('loop', i);
				iimPlay(mSelectConn);
				
				err_message = iimGetLastError();
				if (err_message != 'OK') {
					break;
				}
				else {
					iLoop = i;
					iCntSelect++;
				}
				
				if (iCntSelect == iMax) {
					iimPlay('LinkedIn_MsgSend');
					iLoop = i + 1;
					iLetter = j;
					bSent = true;
					break;
				}
			}			
		}
		if (j == 26) {
			iimPlay('LinkedIn_MsgSend');
			break;
		}
		if (bSent == true) {
			bSent = false;
			break;
		}
		iLoop = 1;
	}
	if (j == 26) {
		break;
	}
}