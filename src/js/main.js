import { setStatusInfo } from './ignore-me.js';
import simpleScorm from './simple-scorm.js';

const LMSConnected = simpleScorm.getStarted();

const video = document.getElementById('the-video');
const btnExit = document.getElementById('btn-exit');
const btnBookmark = document.getElementById('btn-bookmark');

if (LMSConnected) {
	window.addEventListener('beforeunload', windowUnloadHandler);
	window.addEventListener('unload', windowUnloadHandler);

	setVideoTime(simpleScorm.getLocation());
}

btnExit.addEventListener('click', () => simpleScorm.quit());
btnBookmark.addEventListener('click', () => simpleScorm.setLocation(video.currentTime));
video.addEventListener('loadedmetadata', () => videoLoadedHandler());
video.addEventListener('timeupdate', () => videoTimeUpdateHandler());
video.addEventListener('ended', () => videoEndedHandler());

function windowUnloadHandler() {
	simpleScorm.setLocation(video.currentTime);
	simpleScorm.setScore(calcScore());
	simpleScorm.unloadHandler();
}

function videoEndedHandler() {
	simpleScorm.setCompleted();
}

function videoLoadedHandler() {
	video.addEventListener('timeupdate', () => videoTimeUpdateHandler());
	setStatusInfo(LMSConnected, calcScore);
}

function videoTimeUpdateHandler() {
	setStatusInfo(LMSConnected, calcScore);
}

function setVideoTime(value) {
	if (typeof value !== 'number') return;

	video.currentTime = value;
}

function calcScore() {
	const duration = video.duration;
	const time = video.currentTime;
	const score = Math.round((time / duration) * 100);
	return score;
}

setStatusInfo(LMSConnected, calcScore);
