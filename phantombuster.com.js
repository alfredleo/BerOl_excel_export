// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder"

const Buster = require("phantombuster");
const buster = new Buster();

const Nick = require("nickjs");
const nick = new Nick({
    printNavigation: true,
    printResourceErrors: true,
    printPageErrors: true,
    resourceTimeout: 3000,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
});

let output = [];
const links = [
    "/catalogue/shtukaturki/",
    "/catalogue/shpaklevki/",
    "/catalogue/suhie-smesi-dlya-pola/",
    "/catalogue/montazhnye-i-kladochnye-smesi/",
    /*"/catalogue/gruntovki/",
    "/catalogue/sypuchie-materialy-cement-pesok-keramzit/",
    "/catalogue/dobavki-dlya-stroitelnyh-rastvorov/",
    "/catalogue/klei-dlya-plitki-kamnya-i-izolyacii/",
    "/catalogue/suhie-smesi-i-gruntovki/malye-proekty-melkaya-fasovka/"*/
];
const baseUrl = "https://leroymerlin.ru";
let result = [];
nick.newTab().then(async (tab) => {
    for (let link of links) {
        await tab.open(baseUrl + link);

        //await tab.inject("../injectables/jquery-3.0.0.min.js") // We're going to use jQuery to scrape
        await tab.untilVisible(".catalog__name");
        console.log(link);
        const firstLink = await tab.evaluate((arg, callback) => {
            const data = [];
            $("p.catalog__name").each((index, element) => {
                data.push({
                    // title: $(element).find('a').text(),
                    url: $(element).find('a').attr('href')
                })
            });
            callback(null, data)
        });
        await tab.open(baseUrl + firstLink[0].url);
        await tab.untilVisible("table.about__params__table");

        // Evaluate a function in the current page DOM context. Execution is sandboxed: page has no access to the Nick context
        // In other words: Open the browser inspector to execute this function in the console
        const params = await tab.evaluate((arg, callback) => {
            const data = [];
            $("table.about__params__table tr").each((index, element) => {
                data.push({
                    name: ($(element).find('td').eq(0).text()).replace('\n', '').trim(),
                    value: ($(element).find('td').eq(1).text()).replace('\n', '').replace('?', '').trim()
                })

            });
            callback(null, data)
        });
        result.push(params);
    }
    })
    .then(() => {
        console.log("Job done!");
        console.log(result);
        nick.exit()
    })
    .catch((err) => {
        console.log(`Something went wrong: ${err}`);
        nick.exit(1)
    });