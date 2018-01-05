const bot = require('../../bot');

module.exports = class AlertsHandler {

	constructor(alerts = []) {
		this.alerts = alerts;
	}

	addAlert(message, dataPointName, operator, threshold, alertName) {
		let alert = {
			name: alertName,
			type: "threshold",
			dataPointName: dataPointName,
			operator: operator,
			threshold: parseFloat(threshold)
		};

		alert.notify = this.generateNotification(alert, message);
		alert.check = this.generateCheck(alert);

		this.alerts.push(alert);

		message.channel.send(`ALERT: Set ${alertName} to notify when ${dataPointName} ${operator} ${threshold}`)
	}

	removeAlert(message, alertName) {
		this.alerts = this.alerts.filter((alert) => alert.name !== alertName);
	}

	generateNotification(alert, message) {
		return (dataPoint) => {
			message.channel.send(`ALERT: ${alert.name} has broken the threshold at ${alert.threshold} with ${dataPoint.value}`);
			this.alerts = this.alerts.filter((a) => a.name !== alert.name);
		}
	}

	generateCheck(alert) {
		return (dataPoint) => {
			if (alert.operator === '>' || '>=') {
				if (dataPoint.value >= alert.threshold) alert.notify(dataPoint);
			} else if (alert.operator === '<' || '<=') {
				if (dataPoint.value <= alert.threshold) alert.notify(dataPoint);
			}
		}
	}



	// Threshold Alert - Fires when threshold is broken
	// addThresholdAlert(message, ticker, lessThan, threshold, broadcast = true) {
	// 	this.alerts.push({
	// 		message: message,
	// 		type: "threshold",
	// 		ticker: ticker,
	// 		lessThan: lessThan,
	// 		threshold: parseFloat(threshold),
	// 		broadcast: broadcast,
	// 		alertMsg: `:oncoming_police_car:!ALERT!:oncoming_police_car:\n${ticker} has broken the threshold for ${threshold}.`,
	// 		expired: false
	// 	});
	// 	this.reply(message, `Set threshold alert for ${ticker} when price is ${lessThan ? "less than" : "greater than"} ${threshold}.`);
	// }

	// // Trend Alert - Fires when trend is observed
	// addTrendAlert(message, trend, ticker, broadcast = true) {
	// 	let args = message.content.split(' ');
	// 	if (args[4] && args[5]) {
	// 		this.alerts.push({
	// 			message: message,
	// 			type: trend,
	// 			ticker: ticker,
	// 			broadcast: broadcast,
	// 			alertMsg: `:oncoming_police_car:!ALERT!:oncoming_police_car:\n${ticker} has observed a trend for ${trend} at undefined.`,
	// 			expired: false
	// 		});
	// 		this.reply(message, `Set ${trend} alert for ${ticker}.`);
	// 	} else {
	// 		// if (message.author) message.author.send('nah');
	// 		// else if (message.channel) message.channel.send('nah');
	// 	}
	// }

	isPublicMessage(message) {
		return message.channel.type !== 'dm';
	}

	getAlerts() {
		return this.alerts;
	}

}