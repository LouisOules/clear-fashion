const saver = require("./savingScrapedData3");
//const cleaner = require("./cleaningJSON");

const websites = [];
//at each index:
//name = 0
//eshopUrl = 1
//scraperPath = 2
//scraped data = 3
//path to scraped data in JSON file = 4

websites.push(['Montlimart','https://www.montlimart.com/101-t-shirts','./eshops/montelimar']);
websites.push(['Dedicatedbrand','https://www.dedicatedbrand.com/en/men/all-men','./eshops/dedicatedbrand']);

//scraping function args(tab of websites)
async function scrapeWebsite(websites) {
    //for each website in the tab
    for (let i = 0; i < websites.length; i++) {
      const website = websites[i];
      //each website has it's scraper file
      const scraper = require(website[2]);
      console.log(`\nScraping ${website[0]} site at: 🐺 ${website[1]}\n`);
      const scrapedData = await scraper.scrape(website[1]);
      console.log(`\nScraping done\n`);
      const jsonData=JSON.stringify(scrapedData)
      //console.log(scrapedData);
      await insertProducts(jsonData);
      console.log(`\ndata sent to DB\n`);
      await saver.saveData(jsonData, website); // save scraped data into json file
    }
  }


async function insertProducts(jsonData) {
    const { MongoClient } = require('mongodb');
    const MONGODB_URI = 'mongodb+srv://louisoules:iyZZqeuQC63HJvI6@cluster0.pdlqo9a.mongodb.net/test?retryWrites=true&writeConcern=majority';
    const MONGODB_DB_NAME = 'clearfashion';
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);

    // Parse the JSON string to get the array of products
    const products = JSON.parse(jsonData);
  
    // Add _id field to documents
    const docs = products.map(product => {
      return {
        ...product,
        _id: product.id // or generate your own _id
      };
    });
  
    const collection = db.collection('products');
    const result = await collection.insertMany(docs);
  
    console.log(result);

    // Close the MongoDB connection
    client.close();
  }

  scrapeWebsite(websites)
  