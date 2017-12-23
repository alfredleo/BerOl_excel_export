// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick()

// }

/*
	This demo script returns two things:
	1) JSON of all the Hacker News homepage links
	2) Screenshot of the Hacker News homepage

	Edit it as you wish, have a look at our documentation on https://hub.phantombuster.com/ and do get in touch.

	Most importantly, click LAUNCH to get a taste of Phantombuster's power!! :)
*/
let output = []

const links = [
   "/catalogue/ramki-dlya-rozetok-i-vyklyuchateley/",
   "/catalogue/nakladki-dlya-rozetok-i-vyklyuchateley/",
            ];
const baseUrl = "https://leroymerlin.ru"


//links.forEach(function(link){
nick.newTab().then(async (tab) => {

	let result = []
	for (link of links) {
	 await tab.open(baseUrl + link)
	//await tab.inject("../injectables/jquery-3.0.0.min.js") // We're going to use jQuery to scrape
	await tab.untilVisible(".catalog__name") // Make sure we have loaded the right page
    console.log(link);
    const firstLink = await tab.evaluate((arg, callback) => {
     const data = []
      $("p.catalog__name").each((index, element) => {
        data.push({
          //title: $(element).find('a').text(),
          url: $(element).find('a').attr('href')
        })
      })
      callback(null, data)
    })
    await tab.open(baseUrl + firstLink[0].url)
    await tab.untilVisible("table.about__params__table")
    
	// Evaluate a function in the current page DOM context. Execution is sandboxed: page has no access to the Nick context
	// In other words: Open the browser inspector to execute this function in the console
	
	const parametrs = await tab.evaluate((arg, callback) => {
      const data = []
      let merge = {}
      let merge1 = {}
      let merge2 = {}
      let merge3 = {}
      $("table.about__params__table tr").each((index, element) => {
        data.push({
          name: ($(element).find('td').eq(0).text()).replace('\n', '').trim(),
          value: ($(element).find('td').eq(1).text()).replace('\n', '').replace('?', '').trim()
        })
       
       
      })
       $(".breadscrumbs").each((index, element) => {
     var menu1 = $(element).find('.breadscrumbs__item').eq(2).text()
     var menu2 = $(element).find('.breadscrumbs__item').eq(3).text()
     var menu3 = $(element).find('.breadscrumbs__item').eq(4).text()
       merge[menu3] = data
       merge1[menu2] = merge
       merge2[menu1] = merge1
       
      })
	
      callback(null, merge2)
     
    })
	result = parametrs
    output.push(parametrs)
   
     // Send the result back to Phantombuster
//	await tab.screenshot("hacker-news.png") // Why not take a screenshot while we're at it?
}
 await buster.setResultObject(output)
})
.then(() => {
	console.log("Job done!")

	nick.exit()
})
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})