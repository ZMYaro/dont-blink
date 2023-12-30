'use strict';

const UA_TEST = /Chrome\/(\d+)/,
	/** {Number} How much of the fake load to always show */
	MIN_FAKE_LOAD_DURATION = 5000, // In milliseconds.
	HIDING_ANGEL_URL = 'angel_hiding.jpg',
	HIDING_ANGEL_ALT_TEXT = 'A weeping angel stands back and covers its face.',
	ATTACKING_ANGEL_URL = 'angel_attacking.jpg',
	ATTACKING_ANGEL_ALT_TEXT = 'A weeping angel attacks.';

var angelImage,
	angelCover,
	fakeRevealDone = false,
	imageLoaded = false;

window.addEventListener('DOMContentLoaded', function () {
	angelImage = document.getElementById('angel-image');
	angelCover = document.getElementById('angel-cover');
	
	loadImage();
});

/**
 * Check whether the browser is using a Blink-based browser.
 * @returns {Boolean}
 */
function checkIsBlink() {
	var regexResult = UA_TEST.exec(navigator.userAgent);
	
	if (!regexResult) {
		return false;
	}
	
	var chromiumVersion = parseInt(regexResult[1]);
	
	if (!chromiumVersion || chromiumVersion < 120) {
		return false;
	}
	
	return true;
}

/**
 * Identify which image to load and load it.
 */
function loadImage() {
	var isBlink = checkIsBlink();
	angelImage.addEventListener('load', function () {
		imageLoaded = true;
		console.log('loaded');
		hideCover();
	});
	angelImage.src = isBlink ? ATTACKING_ANGEL_URL : HIDING_ANGEL_URL;
	angelImage.alt = isBlink ? ATTACKING_ANGEL_ALT_TEXT : HIDING_ANGEL_ALT_TEXT;
	
	angelCover.classList.add('reveal-partial');
	setTimeout(function () {
		fakeRevealDone = true;
		hideCover();
	}, MIN_FAKE_LOAD_DURATION)
}

function hideCover() {
	if (!fakeRevealDone || !imageLoaded) { return; }
	
	angelCover.classList.add('reveal-full');
	angelCover.classList.remove('reveal-partial');
}
