// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick({
	printNavigation: true,
	printResourceErrors: true,
	printPageErrors: true,
	resourceTimeout: 3000,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
})

// }

/*
	This demo script returns two things:
	1) JSON of all the Hacker News homepage links
	2) Screenshot of the Hacker News homepage

	Edit it as you wish, have a look at our documentation on https://hub.phantombuster.com/ and do get in touch.

	Most importantly, click LAUNCH to get a taste of Phantombuster's power!! :)
*/

nick.newTab().then(async (tab) => {
	const links = [    "/catalogue/shtukaturki/",
    "/catalogue/shpaklevki/",
    "/catalogue/suhie-smesi-dlya-pola/",
    "/catalogue/montazhnye-i-kladochnye-smesi/",
    "/catalogue/gruntovki/",
    "/catalogue/sypuchie-materialy-cement-pesok-keramzit/",
    "/catalogue/dobavki-dlya-stroitelnyh-rastvorov/",
    "/catalogue/klei-dlya-plitki-kamnya-i-izolyacii/"
    ];
    const baseUrl = "https://leroymerlin.ru"

	await tab.open(baseUrl + "/catalogue/shtukaturki")
	// await tab.inject("$('form').submit(false);");
	await tab.untilVisible(".catalog__name") // Make sure we have loaded the right page


	const firstLink = await tab.evaluate((arg, callback) => {
		const data = []
		$("p.catalog__name").each((index, element) => {
			data.push({
				title: $(element).find('a').text(),
				url: $(element).find('a').attr('href')
			})
		})
		callback(null, data)
	})
	console.log(firstLink[0].url);
	await tab.open(baseUrl + firstLink[0].url)
	await tab.untilVisible("table.about__params__table")

	// Continue your navigation in this branch
	// You should probably do a waitUntilVisible() or waitUntilPresent() here


	//await tab.inject("../injectables/jquery-3.0.0.min.js") // We're going to use jQuery to scrape

	// Evaluate a function in the current page DOM context. Execution is sandboxed: page has no access to the Nick context
	// In other words: Open the browser inspector to execute this function in the console
	const hackerNewsLinks = await tab.evaluate((arg, callback) => {
		const data = []
		$("table.about__params__table tr").each((index, element) => {
			data.push({
				name: $(element).find('td').eq(0).text(),
				value: $(element).find('td').eq(1).text()
			})
		})
		callback(null, data)
	})

	await buster.setResultObject(hackerNewsLinks) // Send the result back to Phantombuster
	// await tab.screenshot("hacker-news.png") // Why not take a screenshot while we're at it?

})
.then(() => {
	console.log("Job done!")
	nick.exit()
})
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})