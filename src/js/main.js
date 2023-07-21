import simpleScorm from './simple-scorm.js';

const LMSConnected = simpleScorm.getStarted();

const video = document.getElementById('the-video');

if (LMSConnected) {
	window.addEventListener('beforeunload', windowUnloadHandler);
	window.addEventListener('unload', windowUnloadHandler);

	setVideoTime(simpleScorm.getLocation());
}

video.addEventListener('ended', () => videoEndedHandler());

function windowUnloadHandler() {
	simpleScorm.setLocation(video.currentTime);
	simpleScorm.setScore(calcScore());
	simpleScorm.unloadHandler();
}

function videoEndedHandler() {
	simpleScorm.setCompleted();
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
