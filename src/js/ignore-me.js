import simpleScorm from './simple-scorm.js';

document.onkeydown = event => {
	const key = event.code;
	const meta = event.metaKey;
	// const alt = event.altKey;

	if (key === 'KeyK' && meta) {
		console.clear();
	}
};

function setStatusInfo(LMSConnected, calcScore) {
	const video = document.getElementById('the-video');

	const lmsConnectedString = LMSConnected ? '✅ connected' : '❌ not connected';
	const lmsScore = LMSConnected ? simpleScorm.getScore() : null;
	const lmsScoreString = lmsScore ? lmsScore + ' %' : 'n/a';
	const lmsLocation = LMSConnected ? simpleScorm.getLocation() : null;
	const lmsLocationString = lmsLocation ? lmsLocation + ' s' : 'n/a';
	const localScoreString = calcScore() + ' %';
	const localLocationString = video.currentTime + ' s';

	document.querySelector('.connected .lms').innerHTML = lmsConnectedString;
	document.querySelector('.connected .local').innerHTML = '';

	document.querySelector('.score .lms').innerHTML = lmsScoreString;
	document.querySelector('.score .local').innerHTML = localScoreString;

	document.querySelector('.location .lms').innerHTML = lmsLocationString;
	document.querySelector('.location .local').innerHTML = localLocationString;
}

export { setStatusInfo };
