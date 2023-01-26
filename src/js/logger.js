import pipwerks from 'pipwerks-scorm-api-wrapper';

const si = {};

si.log = [];
si.formatLog = function () {
	if (window.console.table) {
		console.table(si.log);
	} else {
		console.log(si.log);
	}
};

if (typeof window.si === 'undefined' || window.si === null) {
	window.si = si;
}

/**
 * A console logger that makes output prettier and easier to read. It is specifically made for SCORM logging.
 *
 * An object 'si' is available as a global variable:
 *
 * si.log:			An array containing the history of all messages that went through siLog.
 *					(Very useful in IE because the console doesn't show output generated before
 *					the dev tools were opened!).
 *
 * si.formatLog():	prints a table of the si.log array in the console.
 */
function siLog() {
	var args = [];
	var label = '[]';
	var tag = arguments[0];
	var emoji = '❌';
	var action = '';
	var key = '';
	var value = '';
	var mainMessage = arguments[1];

	args[0] = arguments[0] || '';
	args[1] = arguments[1] || '';
	args[2] = arguments[2] || '';
	args[3] = arguments[3] || '';
	args[4] = arguments[4] || '';

	if (arguments.length < 2) {
		// JUST A SUPER SIMPLE CONSOLE.LOG WITH STACK TRACE
		label = '[🤚SSI]';
		action = '💡SIMPLE';
		key = args[0];
		value = '';
	} else {
		// SOMETHING MORE INVOLVED, HOPEFULLY WITH TAG AND ALL
		// COMING EITHER FROM FRAMEWORK OR PIPWERKS SCORM API WRAPPER
		// console.error.apply(this, arguments);

		if (tag === 'pipwerks') {
			// DEALING WITH PIPWERKS DEBUG MESSAGES THAT WE HIJACKED
			pipwerksParser.apply(this, arguments);
		} else {
			// DEALING WITH OUR OWN MESSAGES, COMING FROM INSIDE THE FRAMEWORK
			interactiveParser.apply(this, arguments);
		}
	}

	// Nasty hack to make sure that the SCORM API object is actually available
	// (which seems to take a few ticks after initialization) to log to console.
	// That's why we have that timeout here.
	if (action.indexOf('API:') > -1) {
		setTimeout(function () {
			console.groupCollapsed(label + action + key, value);
			console.trace('Stack trace:');
			console.groupEnd();
		}, 1);
	} else {
		console.groupCollapsed(label + action + key + ' ' + value);
		console.trace('Stack trace:');
		console.groupEnd();
	}

	// For situations where the console isn't enough, because it might not have been logging
	// right from the start (looking at you internet explorer!), we also want to have all the
	// log worthy events in a neat array. That way we can look at it (or export it even!)
	// whenever we want!
	var logEntry = {
		label: label,
		action: action,
		key: key,
		value: value
	};

	si.log.push(logEntry);

	function pipwerksParser() {
		tag = 'PIP:SCORM';

		if (typeof arguments[1] === 'string') {
			// traceMsgPrefix = "SCORM.data.get('" + parameter + "') ";
			// traceMsgPrefix = "SCORM.data.set('" + parameter + "') ";
			if (mainMessage.indexOf('SCORM.data') > -1) {
				emoji = '💾';
				if (mainMessage.indexOf('.get') > -1) {
					mainMessage = mainMessage.replace(/SCORM.data.get\(/gi, '');
					action = '⏪ GET';
				} else if (mainMessage.indexOf('.set') > -1) {
					mainMessage = mainMessage.replace(/SCORM.data.set\(/gi, '');
					action = 'SET ⏩';
				}
				mainMessage = mainMessage.replace(/\)/gi, ':');
				key = mainMessage.split('  value: ')[0] || '';
				value = mainMessage.split('  value: ')[1] || '';
			}

			// traceMsgPrefix = 'SCORM.connection.initialize ';
			// traceMsgPrefix = 'SCORM.connection.terminate ';
			if (mainMessage.indexOf('SCORM.connection') > -1 || mainMessage.indexOf('connection.initialize') > -1) {
				emoji = '🔌';
				if (mainMessage.indexOf('.initialize') > -1) {
					mainMessage = mainMessage.replace(/SCORM.connection.initialize /gi, '');
					action = '🤝 INIT';
					if (mainMessage.indexOf('connection.initialize called.') > -1) {
						mainMessage = mainMessage.replace(/connection.initialize called./gi, '');
						key = 'Initializing LMS connection...';
					}
				} else if (mainMessage.indexOf('.terminate') > -1) {
					mainMessage = mainMessage.replace(/SCORM.connection.terminate /gi, '');
					action = '💀 TERM';
				}
				if (mainMessage.indexOf('failed') > -1 || mainMessage.indexOf('aborted') > -1) {
					mainMessage = mainMessage.replace(/failed/gi, '❌ FAILED');
					mainMessage = mainMessage.replace(/aborted/gi, '❌ ABORTED');
				}
			}

			// traceMsgPrefix = 'SCORM.API.find',
			if (mainMessage.indexOf('API') > -1) {
				emoji = '📖';
				if (mainMessage.indexOf('.find') > -1) {
					mainMessage = mainMessage.replace(/SCORM.API.find: /gi, '');
					mainMessage = mainMessage.replace(/. Version: /gi, ': v');
					action = '🔍 FIND';
					value = '(It will be available for inspection in a few ticks.)';
				}
				if (mainMessage.indexOf('API:') > -1) {
					action = '🔗 API';
					setTimeout(function () {
						key = pipwerks.SCORM.API.handle;
					}, 1);
				}
			}
		}

		if (action !== '') {
			action = '(' + action + ') ';
		}
		key = key || mainMessage;
		value = isNaN(parseFloat(value, 10)) ? value : parseFloat(value, 10);
		label = '[' + emoji + tag + '] ';
	}

	function interactiveParser() {
		tag = 'SSI:' + tag;
		emoji = '🤚';
		action = args[1] || '';
		key = args[2] || '';
		value = args[3] || '';

		if (typeof arguments[1] === 'string') {
			if (args[1] === 'SET') {
				action = '(SET ⏩) ';
			} else if (args[1] === 'GET') {
				action = '(⏪ GET) ';
			} else if (args[1] === 'INIT') {
				action = '(🤝 INIT) ';
			} else if (args[1] === 'COMPLETE') {
				action = '(🏆 COMPLETE) ';
			} else if (args[1] === 'INFO') {
				action = '(💡 INFO) ';
			} else if (args[1] === 'API') {
				action = '(🔗 API) ';
			}

			if (args[2].indexOf('SUCCESS') > -1) {
				key = '✅ ' + args[2];
			}
			if (args[2].indexOf('ERROR') > -1) {
				key = '❌ ' + args[2];
			}

			//   key = mainMessage.split("  value: ")[0];
			//   value = mainMessage.split("  value: ")[1] || "";
		}

		value = isNaN(parseFloat(value, 10)) ? value : parseFloat(value, 10);
		label = '[' + emoji + tag + '] ';
	}
}

pipwerks.UTILS.trace = function (msg) {
	if (pipwerks.debug.isActive) {
		if (window.console && window.console.log) {
			siLog('pipwerks', msg);
		}
	}
};

// [💾SCORM] ⬅️GET ('cmi.core.student_name')  value: interactive,

// traceMsgPrefix = 'SCORM.data.save failed';
// traceMsgPrefix = 'SCORM.getStatus failed',

// args[0] = '[💡SCORM]';
// args[0] = '[☝️SCORM]';
// args[0] = '[👆SCORM]';
// args[0] = '[🤞SCORM]';

export default siLog;
