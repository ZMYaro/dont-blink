'use strict';

/** {RegExp} Matches Chrome/Chromium's user agent string and pulls out the major version number */
const CHROM_VERSION_REGEX = /Chrome\/(\d+)/,
/** {RegExp} Matches EdgeHTML Edge's user agent string and pulls out the major version number (Edgium contains “Edg”, not “Edge”) */
	EDGEHTML_VERSION_REGEX = /Edge\/(\d+)/,
/** {Number} The first Chrom* version after Blink forked from WebKit */
	MIN_BLINK_VERSION = 28,
/** {Number} How much of the fake load to always show in milliseconds */
	MIN_FAKE_LOAD_DURATION = 5000,
/** {String} Path to the hiding angel image */
	HIDING_ANGEL_URL = 'angel_hiding.jpg',
/** {String} Alt text for the hiding angel image */
	HIDING_ANGEL_ALT_TEXT = 'A weeping angel stands back and covers its face.',
/** {String} Path to the attacking angel image */
	ATTACKING_ANGEL_URL = 'angel_attacking.jpg',
/** {String} Alt text for the attacking angel image */
	ATTACKING_ANGEL_ALT_TEXT = 'A weeping angel attacks.';

/** {HTMLImageElement} The angel image */
var angelImage,
/** {HTMLDivElement} The cover for the fake slow image loading animation */
	angelCover,
/** {Boolean} Whether the minimum time of the fake loading animation has passed */
	fakeLoadDone = false,
/** {Boolean} Whether the image has fully loaded */
	imageLoaded = false,
/** {Boolean} Whether the “I don't get it?” button has been clicked at least once */
	idgiClicked = false;

window.addEventListener('DOMContentLoaded', function () {
	angelImage = document.getElementById('angel-image');
	angelCover = document.getElementById('angel-cover');
	loadImage();
	
	document.getElementById('idgi-button').addEventListener('click', function () {
		var hint = 'Try using different web browsers 😉';
		if (idgiClicked) {
			// Point people to information about Blink if they click the button again.
			hint += '\r\n\r\n(https://developer.mozilla.org/docs/Glossary/Blink)';
		}
		alert(hint);
		idgiClicked = true;
	})
});

/**
 * Check whether the browser is using a Blink-based browser.
 * @returns {Boolean}
 */
function checkIsBlink() {
	var chromRegexResult = CHROM_VERSION_REGEX.exec(navigator.userAgent),
		edgeRegexResult = EDGEHTML_VERSION_REGEX.exec(navigator.userAgent);
	if (!chromRegexResult || !!edgeRegexResult) {
		// If the browser isn't Chromium, or pretends to be Chromium but is actually old Edge, no Blink.
		return false;
	}
	
	var chromiumVersion = parseInt(chromRegexResult[1]);
	if (!chromiumVersion || chromiumVersion < MIN_BLINK_VERSION) {
		// If it is an old Chromium version, it is WebKit, not (officially) Blink.
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
		hideCover();
	});
	angelImage.src = isBlink ? ATTACKING_ANGEL_URL : HIDING_ANGEL_URL;
	angelImage.alt = isBlink ? ATTACKING_ANGEL_ALT_TEXT : HIDING_ANGEL_ALT_TEXT;
	
	if (isBlink) {
		startFakeLoad();
	} else {
		skipFakeLoad();
	}
}

/**
 * Start the fake image loading animation.
 */
function startFakeLoad() {
	angelCover.classList.add('reveal-partial');
	setTimeout(function () {
		fakeLoadDone = true;
		hideCover();
	}, MIN_FAKE_LOAD_DURATION);
}

/**
 * Skip the fake image loading animation.
 */
function skipFakeLoad() {
	fakeLoadDone = true;
	angelCover.classList.add('reveal-full');
}

/**
 * Hide the fake load cover if the image has loaded and the fake load has finished.
 */
function hideCover() {
	if (!fakeLoadDone || !imageLoaded) { return; }
	
	angelCover.classList.add('reveal-full');
	angelCover.classList.remove('reveal-partial');
}
