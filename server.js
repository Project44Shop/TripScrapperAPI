const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3009;
const apiUrl = process.env.API_URL || "htgtps://www.makalius.lt/google-ads-feed/?type=facebookAdAll";

const axios = require('axios');
const xml2js = require('xml2js');

// Enable CORS for all routes
app.use(cors());

const fetchAndParseXML = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Origin': 'http://localhost', // Optional
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    const xmlData = response.data;
    return await xml2js.parseStringPromise(xmlData, { explicitArray: false });
  } catch (error) {
    console.error('Error fetching or parsing XML:', error);
    throw new Error('Failed to fetch or parse XML data');
  }
};

// Function to extract items from parsed XML
const extractItems = (result) => {
  return result.rss.channel.item.map(item => ({
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
  }));
};

// Route for fetching all deals
app.get('/allDeals', async (req, res) => {
  try {
    const result = await fetchAndParseXML(apiUrl);
    const items = extractItems(result);
    res.json(items);
  } catch (error) {
    res.status(500).send('Error fetching or processing data');
  }
});

// Route for fetching "poilsinės" deals
app.get('/poilsines', async (req, res) => {
  try {
    const result = await fetchAndParseXML(apiUrl);
    const items = extractItems(result);
    
    // Filter items with productType 'poilsinės'
    const filteredItems = items.filter(item => item.productType && item.productType.trim().toLowerCase() === 'poilsinės');
    console.log('Filtered Items:', filteredItems);

    res.json(filteredItems);
  } catch (error) {
    res.status(500).send('Error fetching or processing data');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
