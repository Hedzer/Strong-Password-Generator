/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var App = (function(){
 	var byId = function(id){
 		return document.getElementById(id);
 	};
 	var strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
 	var numbers = /\d+/g;
 	var salt = "yk4iYUynToFbYiYZ6nYn2kZzhPsWaatKgZo7S70MBUTc7ZnQBS7OX6ClzbjITIE5mo5IKaYYscCyqOYUte8OSAdyfYuc0+naCnRXwtWFMn75Yxb56nRJXzH5Mk+YkBF4SmB070W4fHh+9nKAqzE7gzw24XcLu9Bt0HSVwJH/a5ig==";
	var algorithm = [
		CryptoJS.MD5,
		CryptoJS.RIPEMD160,
		CryptoJS.SHA1,
		CryptoJS.SHA224,
		CryptoJS.SHA256,
		CryptoJS.SHA3,
		CryptoJS.SHA384,
		CryptoJS.SHA512
	];
	var specials = [
		"!",
		"@",
		"#",
		"$",
		"%",
		"^",
		"&",
		"*"
	];
	var app = {
		// Application Constructor
		initialize: function() {
			app.setPlaceholders();
			app.bindEvents();
		},
		setPlaceholders:function(){
			//set the placeholder
			var placeholders = [
				"coffee",
				"bluebird",
				"chicken breast",
				"red car",
				"Florida",
				"Holland",
				"gold finger",
				"atoms",
				"clock",
				"shivering timbers",
				"shark attack",
				"rainbow",
				"quick brown fox",
				"kung fu",
				"home",
				"Andrew",
				"beer",
				"ramen",
				"chimney",
				"cinnamon roll",
				"fog",
				"piano"
			];
			var placeholder = "Example: "+placeholders[new Date().valueOf() % placeholders.length];
			byId("word").placeholder = placeholder;
		},
		bindEvents:function(){
			var eventList = [
				"keypress",
				"keyup",
				"keydown",
				"paste",
				"input"
			];
			eventList.forEach(function(name){
				["word", "phone"].forEach(function(id){
					byId(id).addEventListener(name, function(){
						app.generate();
					});
				});
			});
			var elPassword = byId("password");
			["click", "focus"].forEach(function(name){
				elPassword.addEventListener(name, function(){
					elPassword.select();
				});
			});
		},
		generate:(function(){
			var gTimer = false;
			return function(){
				clearTimeout(gTimer);
				gTimer = setTimeout(function(){
					var elWord = byId("word");
					var elPhone = byId("phone");
					var elPassword = byId("password");
					var word = elWord.value;
					var phone = ((elPhone.value+"").match(numbers) || []).join("");
					if (!word.length){
						elWord.style.background = "rgba(255, 0, 0, .25)";
						elPassword.value = "Missing Word(s)";
						return;
					}
					elWord.style.background = "rgba(255, 255, 255, 1)";
					if (!phone.length){
						elPhone.style.background = "rgba(255, 0, 0, .25)";
						elPassword.value = "Missing Number";
						return;
					}
					elPhone.style.background = "rgba(255, 255, 255, 1)";
					var aIndex = crc32(salt+word+phone) % algorithm.length;
					var sIndex = crc32(phone+salt+word) % specials.length;
					var hasher = algorithm[aIndex];
					var replace = specials[sIndex];
					var hash = false;
					var process = function(){
						hash = (hash ? hasher(hash) : hasher(salt+word+aIndex+phone+salt));
						hash = CryptoJS.enc.Base64.stringify(hash);
						hash = hash.replace(/\+|\/|=/g, '');
						hash = hash.substr(0, 10);
						var nIndex = crc32(word+phone+salt) % hash.length;
						var find = hash[nIndex];
						hash = hash.replace(find, replace);
						var passed = strong.test(hash);
						setTimeout((passed ? function(){
							elPassword.value = hash;
						} : process),0);
					};
					process();
				}, 400);
			};
		})()
	}; 
	return app;
 })();

