// https://github.com/allanhortle/pipwerks-scorm-api-wrapper#readme
import { SCORM } from 'pipwerks-scorm-api-wrapper';

import siLog from './logger.js';

let lmsConnected = false;
let unloaded = false;
const debug = false;

/**
 * Tries to connect to the LMS using the pipwerks helper function SCORM.init().
 *
 * @returns {boolean} If the module could successfully connect to the LMS or not.
 */
function getStarted() {
	siLog('SCORM', 'INIT', 'Getting started...');

	if (debug) {
		lmsConnected = true;
	} else {
		lmsConnected = SCORM.init();
	}

	/* You could introduce sideeffects here if you want. */
	// if (lmsConnected) {
	// 	const name = SCORM.get('cmi.core.student_name');
	// 	console.log('cmi.core.student_name: ', name);
	// }

	return lmsConnected;
}

/**
 * Event handler function that should run when the window unloads.
 * It makes sure that we persist all data that wasn't yet committed
 * and that we close the connection to the LMS properly.
 */
function unloadHandler() {
	siLog('SCORM', 'INFO', 'Setting unloadHandler...');
	if (lmsConnected && !unloaded) {
		unloaded = true;
		SCORM.save(); // save all data that has already been sent
		SCORM.quit(); // close the SCORM API connection properly
	}
}

/**
 * Persists a numeric value as the current score (or progress). Usually represented as percentage in the LMS.
 * NOTE: It will be converted to string by the wrapper.
 *
 * @param {number|string} value The current score that should be saved to the LMS (as integer or string from 0 to 100)
 */
function setScore(value) {
	siLog('SCORM', 'INFO', 'setScore...', value);
	SCORM.set('cmi.core.score.raw', value);
	SCORM.set('cmi.core.score.max', 100);
	SCORM.set('cmi.core.score.min', 0);
	SCORM.save();
}

/**
 * Gets the current score from the LMS and returns it parsed as integer (or null).
 *
 * @returns {number|null} The score/progress (as integer from 0 to 100) or null
 */
function getScore() {
	let score = SCORM.get('cmi.core.score.raw');
	if (debug) {
		score = '42';
	}
	siLog('SCORM', 'INFO', 'getScore...', score);

	if (!score || score === 'null' || score === 'undefined') {
		score = null;
	} else {
		score = parseFloat(score);
	}

	return score;
}

/**
 * Persists a value of any type as the current location (or bookmark).
 * (This is the current time of the video).
 * NOTE: It will be converted to string by the wrapper.
 *
 * @param {any} value The current location that should be saved to the LMS
 */
function setLocation(value) {
	siLog('SCORM', 'INFO', 'setLocation...', value);
	SCORM.set('cmi.core.lesson_location', value);
	SCORM.save();
}

/**
 * Gets the current location/bookmark from the LMS and returns it parsed as float (or null).
 * (This is the time of the video where the learner has left off).
 *
 * @returns {number|null} The location/bookmark (as float from 0 to 100) or null
 */
function getLocation() {
	let location = SCORM.get('cmi.core.lesson_location');
	if (debug) {
		location = '26.140844';
	}

	siLog('SCORM', 'INFO', 'getLocation...', location);
	if (!location || location === 'null' || location === 'undefined') {
		location = null;
	} else {
		location = parseFloat(location);
	}

	return location;
}

/**
 * Marks the course as completed in the LMS.
 */
function setCompleted() {
	siLog('SCORM', 'INFO', 'setCompleted...');
	SCORM.set('cmi.core.lesson_status', 'completed');
	SCORM.save();
}

/**
 * Close the SCORM API connection properly.
 */
function quit() {
	siLog('SCORM', 'INFO', 'quit...');
	SCORM.quit();
}

/**
 * A wrapper for the very generic pipwerks wrapper. Adds some opinionated quality of life helper functions.
 */
export default { getStarted, quit, setCompleted, getLocation, setLocation, setScore, getScore, unloadHandler };
