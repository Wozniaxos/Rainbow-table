var hasher = require('./md5-algorythm.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const fs = require('fs');
const URL = "https://raw.githubusercontent.com/Selleo/recruitment-exercises/master/exercises/js_intermediate_stuff/rainbow_table/pan_tadeusz.txt";
let wordList = [];
let rainbow_table = [];

let getTxt = function(URL) {
	let request = new XMLHttpRequest();
	let rawtext;
	request.open('GET', URL, false);
	request.onreadystatechange = function () {
		if(request.readyState === 4) {
			if(request.status === 200 || request.status === 0) {
				rawtext = request.responseText;
			}
		}
	}
	request.send(null);
	return rawtext;
};

let createWordList = function(txt) {
	let lines = txt.split('\n');
	let wordListInTheLine;
	let filteredwordListInTheLine
	let lineWithoutSpecials;
	
	for(var i = 0 ; i < lines.length ; i++) {
		lineWithoutSpecials = lines[i].replace(/[^\węóąśłżźćń\s]/gi, '');
		wordListInTheLine = lineWithoutSpecials.split(" ");
		filteredwordListInTheLine = removeDuplicates(wordListInTheLine);
		wordList = wordList.concat(filteredwordListInTheLine);
	}
	wordList = wordList.filter((word) => word != "");
	wordList = removeDuplicates(wordList);
}

let removeDuplicates = function(wordsarray) {
	let seen = {};
	return wordsarray.filter(function(el) {
		return seen.hasOwnProperty(el) ? false : (seen[el] = true);
	})
}

let createHashes = function(wordList){
	return wordList.map((w) => hasher.createHash(w));
}

let createRainbowTable = function(wordList, createHashes) {
	let hashes = createHashes;
	for(var i = 0 ; i < wordList.length ; i ++) {
		rainbow_table.push({word: wordList[i], hash: hashes[i]});
	}
}

let crackPassword = function(psw, table){
	return table.filter((r) => r.hash == psw).map((r)=>r.word)
}

let saveToFile = function(fileName) {
	let convertedToString
	typeof this[0] !== 'string' ? convertedToString = this.map((el) => el.word + "    " + el.hash).join("\n")
								: convertedToString = this.join("\n");
	fs.appendFile(fileName + ".txt", convertedToString, function(err) {
	if(err) throw err
		console.log("Sukces!, zapisano w pliku: " + fileName + ".txt");
	})
}

Array.prototype.saveToFile = saveToFile;
String.prototype.saveToFile = (fileName) => {
fs.appendFile(fileName + ".txt", this, (err)=> { 
												if (err) throw err
													console.log("Sukces, zapisano w pliku: " + fileName + ".txt")
												})
}

createWordList(getTxt(URL));
wordList.saveToFile('word_list');

createRainbowTable(wordList, createHashes(wordList));
rainbow_table.saveToFile('rainbow_table');

let crackedPassword = crackPassword('c8e095e2a26f8540afabb36dcdaee3b1', rainbow_table);
crackedPassword.saveToFile('cracked_password');

	





 

 