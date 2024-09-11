// server.js
const express = require('express');
const app = express();
const port = 3008;

const axios = require('axios');
const xml2js = require('xml2js');


app.get('/allDeals', (req, res) => {
    // Fetch the XML data
axios.get('https://www.makalius.lt/google-ads-feed/?type=facebookAdAll', {
    headers: {
      'Origin': 'http://localhost', // You can omit this if unnecessary
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => {
    const xmlData = response.data;
  
    // Parse the XML into a JavaScript object
    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }
  
      // Extract all items from the parsed XML
      const items = result.rss.channel.item.map(item => {
        return {
          id: item['g:id'],
          productType: item['g:product_type'],
          title: item['g:title'],
          link: item['g:link'],
          image_link: item['g:image_link'],
          description: item['g:description'],
          condition: item['g:condition'],
          availability: item['g:availability'],
          mpn: item['g:mpn'],
          brand: item['g:brand'],
          sale_price: item['g:sale_price'],
          price: item['g:price'],
          google_product_category: item['g:google_product_category']
        };
      });
  
      // Output the items array in JSON format
      res.send(JSON.stringify(items, null, 2));
    //   console.log(JSON.stringify(items, null, 2));
    });
  })
  .catch(error => {
    console.error('Error fetching XML:', error);
  });
//   res.send('Hello World');
});



app.get('/poilsines', (req, res) => {
  // Fetch the XML data
  axios.get('https://www.makalius.lt/google-ads-feed/?type=facebookAdAll', {
    headers: {
      'Origin': 'http://localhost', // You can omit this if unnecessary
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => {
    const xmlData = response.data;

    // Parse the XML into a JavaScript object
    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        res.status(500).send('Error parsing XML');
        return;
      }

      // Extract and log all items from the parsed XML
      const items = result.rss.channel.item.map(item => {
        const productType = item['g:product_type'];
        console.log('Product Type:', productType); // Logging product type

        return {
          id: item['g:id'],
          productType,
          title: item['g:title'],
          link: item['g:link'],
          image_link: item['g:image_link'],
          description: item['g:description'],
          condition: item['g:condition'],
          availability: item['g:availability'],
          mpn: item['g:mpn'],
          brand: item['g:brand'],
          sale_price: item['g:sale_price'],
          price: item['g:price'],
          google_product_category: item['g:google_product_category']
        };
      });

      // Filter items with productType 'poilsines'
      const filteredItems = items.filter(item => {
        return item.productType && item.productType.trim().toLowerCase() === 'poilsinės';
      });

      // If no items are found, log and return an empty array
      console.log('Filtered Items:', filteredItems);

      // Output the filtered items in JSON format
      res.json(filteredItems);
    });
  })
  .catch(error => {
    console.error('Error fetching XML:', error);
    res.status(500).send('Error fetching XML');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
