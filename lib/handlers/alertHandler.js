// all wrappers have queues, set to execute every 30 seconds on the main bot interface
// in the queues, we pass in setters for each coin and when the queue fulfils, the price updates
// when the price updates, in the main bot interface, we check our alerts data store,
// loop through it and notify if any conditions meet

module.exports = class AlertsHandler {

	constructor(alerts = []) {
		this.alerts = alerts;
	}

	// Threshold Alert - Fires when threshold is broken
	addThresholdAlert(message, ticker, lessThan, threshold, broadcast = true) {
		this.alerts.push({
			message: message,
			type: "threshold",
			ticker: ticker,
			lessThan: lessThan,
			threshold: parseFloat(threshold),
			broadcast: broadcast,
			alertMsg: `:oncoming_police_car:!ALERT!:oncoming_police_car:\n${ticker} has broken the threshold for ${threshold}.`,
			expired: false
		});
		this.reply(message, `Set threshold alert for ${ticker} when price is ${lessThan ? "less than" : "greater than"} ${threshold}.`);
	}

	// Trend Alert - Fires when trend is observed
	addTrendAlert(message, trend, ticker, broadcast = true) {
		let args = message.content.split(' ');
		if (args[4] && args[5]) {
			this.alerts.push({
				message: message,
				type: trend,
				ticker: ticker,
				broadcast: broadcast,
				alertMsg: `:oncoming_police_car:!ALERT!:oncoming_police_car:\n${ticker} has observed a trend for ${trend} at undefined.`,
				expired: false
			});
			this.reply(message, `Set ${trend} alert for ${ticker}.`);
		} else {
			// if (message.author) message.author.send('nah');
			// else if (message.channel) message.channel.send('nah');
		}
	}

	broadCast(alert) {
		if (alert.broadcast) {
			alert.message.channel.send(alert.alertMsg);
		} else {
			alert.message.author.send(alert.alertMsg);
		}
		alert.expired = true;
	}

	reply(message, content) {
		if (this.isPublicMessage(message))
			message.channel.send(content);
		else
			message.author.send(content);
	}

	isPublicMessage(message) {
		return message.channel.type !== 'dm';
	}

	getAlerts() {
		return this.alerts;
	}

	cleanAlerts() {
		this.alerts = this.alerts.filter((alert) => !alert.expired);
	}

}