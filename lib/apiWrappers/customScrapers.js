const axios = require('axios');
const cheerio = require('cheerio');

const scrapingUtils = require('../util/scrapingUtils');

// TODO: I need to replace the word scraperCluster with scraper and scraper with dataPoint
module.exports = class CustomScrapers {

	constructor() {
		this.scrapers = [];
	}

	addScraper(message, name, url, selector) {
		let scraperCluster = this.scrapers.find((scraper) => scraper.url === url)

		axios.get(url).then((response) => {
			let $ = cheerio.load(response.data);
			let info = scrapingUtils.getTextFromNode($(selector)[0]);
			if (!info) { message.reply(`I couldn't retrieve value at "${selector}", please try again.`); return; };

			let scraper = {
				name: name,
				url: url,
				selector: selector,
				omittedCharacters: '',
				activated: false,
				info: info
			};

			if (!scraperCluster) {
				scraperCluster = {
					url: url,
					scrapers: []
				}

				this.addUpdaterToScraper(scraperCluster);

				this.scrapers.push(scraperCluster);
			}

			scraperCluster.scrapers.push(scraper);

			message.reply(`I added ${scraper.name} to track ${scraper.info} on ${scraper.url}.\nEnter !custom omit ${scraper.name} "character list" to omit characters from this value.`)
		});
	}

  resetUpdater(scraperCluster) {
    return () => {
      scraperCluster.updater = this.getUpdater(scraperCluster);
    }
  }

  getUpdater(scraperCluster) {
    return new Promise((resolve, reject) => {
      this.updateInfo(scraperCluster).then((scraperCluster) => {
      	resolve(scraperCluster);
      }).catch((error) => reject(error));
    });
  }

  addUpdaterToScraper(scraperCluster) {
		scraperCluster.updater = this.getUpdater(scraperCluster);
		scraperCluster.resetUpdater = this.resetUpdater(scraperCluster);
	}

	updateInfo(scraperCluster) {
		return axios.get(scraperCluster.url).then((response) => {
			let $ = cheerio.load(response.data);
			scraperCluster.scrapers.forEach((scraper) => {
				let info = scrapingUtils.getTextFromNode($(scraper.selector)[0]);
				scraper.omittedCharacters.split('').forEach((char) => info = info.replace(char, ''));
				scraper.info = info;
			});
			return scraperCluster;
		});
	}

	removeScraper(message, name) {
		this.scrapers.forEach((scraperCluster) => {
			let scraperToRemove = scraperCluster.scrapers.find((scraper) => scraper.name === name);
			if (scraperToRemove) scraperCluster.scrapers = scraperCluster.scrapers.filter((scraper) => scraper !== scraperToRemove);
			else message.reply(`I couldn't find a scraper with name: ${name}`);
		});

		this.scrapers = this.scrapers.filter((scraperCluster) => scraperCluster.scrapers.length === 0);
		message.reply(`Successfully removed ${name}`);
	}

	getScraper(name) {
		let scraper;

		this.scrapers.forEach((scraperCluster) => {
			scraper = scraperCluster.scrapers.find((scraper) => scraper.name === name);
		});

		return scraper;
	}

	editScraper(message, name, omittedCharacters) {
		// let scraper = this.scrapers.find((scraper) => scraper.name === name);
		// if (scraper) {
		// 	scraper.omittedCharacters = omittedCharacters;
		// 	scraper.update = this.updateInfo(scraper, scraper.url, scraper.selector);
		// 	message.reply(`${scraper.name} will now successfully omit "${omittedCharacters}"`);
		// } else message.reply(`Couldn't find scraper with name "${name}"`);
	}

	activateScraper(message, name) {
		this.scrapers.forEach((scraperCluster) => {
			let scraper = scraperCluster.scrapers.find((scraper) => scraper.name === name);
			if (scraper) { scraper.activated = true; message.reply(`${scraper.name} has been activated.`); }
			else message.reply(`I couldn't find a scraper with name: ${name}`);
		})
	}

	confirmDataPoint(message, scraper) {
	}

	getScrapers() {
		return this.scrapers;
	}

	setScrapers(scrapers) {
		this.scrapers = scrapers;
		this.scrapers.forEach((scraper) => this.addUpdaterToScraper(scraper));
	}

}