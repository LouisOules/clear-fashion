const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.products-list .products-list__block*')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const color = $(element)
        .find('.product-miniature__color')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.product-miniature__pricing')
          .text(),
        10 //based used to parse the int
      );
      const image = $(element).find('.product-miniature__thumb-link').children("img").attr("data-src");
      const link = $(element).find('.product-miniature__thumb-link').attr('href');
      const brand = 'Montlimart'
      const timestamp = new Date();
      return {name, color, price, image, link, brand, timestamp};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
