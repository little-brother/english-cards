window.addEventListener('load', function() {
	var card;
	var cards = {};
	var sounds = {};
	var sounds_no = {};

	var $main = document.querySelector('#main');

	var audio = {
		correct: new Audio('correct.mp3'),	
		error: new Audio('error.mp3'),
		success: new Audio('success.mp3'),
		failure: new Audio('failure.mp3'),
	};

	fetch('sounds.json').then(response => response.json()).then(json => sounds = json);
	fetch('cards.json').then(response => response.json()).then(json => (cards = json) && init());

	function init() {
		$main.innerHTML = '';
		Object.keys(cards).forEach(function (card) {
			var $e = document.createElement('img');
			$e.src = '/images/' + cards[card][0] + '.jpg';
			$e.setAttribute('title', card);
			$e.onclick = function () {
				$main.innerHTML = '<div id = "buttons"><div id = "back" class = "button" title = "Back to topics">&#10006;</div><div id = "test" class = "button" title = "Run test">&#10004;</div></div>';
				cards[card].shuffle().forEach(function (e) {
					var $e = document.createElement('img');
					$e.src = '/images/' + e + '.jpg';
					$e.setAttribute('title', e);
					$e.onclick = () => play(e);
					$main.appendChild($e);
				})
				$main.querySelector('#back').onclick = init;
				$main.querySelector('#test').onclick = () => test(card);
			}
			$main.appendChild($e);
		})
	}

	var word;
	var error_count;
	function test(card) {
		error_count = 0;
		function next () {
			if (words.length == 0) {
				$main.innerHTML = '<div id = "wrapper"><div id = "result" errors="' + error_count + '"></></div>';
				audio[error_count ? 'failure' : 'success'].play();
				return setTimeout(init, 2000);
			}
	 		
			word = words.pop();
			play(word);		
		}

		var words = cards[card].shuffle();
		$main.innerHTML = '<div id = "buttons"><div id = "repeat" class = "button" title = "Repeat">&#10226;</div></div>';
		$main.querySelector('#repeat').onclick = () => play(word);	
		cards[card].forEach(function (e) {
			var $e = document.createElement('img');
			$e.src = '/images/' + e + '.jpg';
			$e.setAttribute('title', e);
			$e.onclick = function () {
				if (word != e) {
					error_count++;
					return audio.error.play();
				}

				if (words.length)
					audio.correct.play();
				$e.style.opacity = 0.3;
				next();	
			}
			$main.appendChild($e);
		})
		next();		
	}

	Array.prototype.shuffle = function () {
		var array = this.slice();	
		var count = array.length, randomnumber, temp;
		while( count ){
			randomnumber = Math.random() * count-- | 0;
			temp = array[count];
			array[count] = array[randomnumber];
			array[randomnumber] = temp;
		}
		return array;
	}

	function play(word) {
		var snd_no = sounds_no[word] || 0;
		var url = sounds[word][snd_no];
		sounds_no[word] = (snd_no + 1) % sounds[word].length;

		var audio = new Audio(url);
		audio.oncanplay = () => audio.play();
		audio.onended = () => audio = undefined;
		audio.onerror = alert;
	}
});