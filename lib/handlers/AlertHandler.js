const bot = require('../../Bot');

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
			if (alert.operator.includes('>')) {
				if (dataPoint.value >= alert.threshold) alert.notify(dataPoint);
			} else if (alert.operator.includes('<')) {
				if (dataPoint.value <= alert.threshold) alert.notify(dataPoint);
			}
		}
	}

	isPublicMessage(message) {
		return message.channel.type !== 'dm';
	}

	getAlerts() {
		return this.alerts;
	}

	setAlerts(alerts) {
		this.alerts = alerts;
		this.alerts.forEach((alert) => {
			alert.notify = this.generateNotification(alert, null);
			alert.check = this.generateCheck(alert);
		});
	}

	// need to replace message with author and add a get author or something.... might just remove this actually

}