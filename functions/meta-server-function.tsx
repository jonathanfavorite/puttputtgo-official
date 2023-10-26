const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const customerList = [
  "castle-golf"
];

const getImageURL = (customerID, type = "normal") => {
  switch(type)
  {
    case "normal":
      return `www.blobwebsite.com/seo/${customerID}.jpg`;
    case "twitter":
      return `www.blobwebsite.com/seo/${customerID}.jpg`;
    default:
      return `www.blobwebsite.com/seo/${customerID}.jpg`;
  }
}

const customerDetails = [
  {
    id: "castle-golf",
    title: "Castle Golf",
    description: "A fun game for the whole family!",
    imageUrl: "https://your-website.com/images/castle-golf.png"
  }
]


exports.handler = async function(event, context) {
  // Check the user-agent from the request headers
  const userAgent = event.headers['user-agent'].toLowerCase();
  const isCrawler = userAgent.includes('googlebot') || userAgent.includes('facebookexternalhit'); // ... other crawlers


   const pathParameters = event.path.split("/");
   const customer = pathParameters[1]; 

  if (isCrawler) {
    // Extract gameID from query parameters
    const { gameID } = event.queryStringParameters;
    const gameData = await fetchGameData(gameID);
   


    // Construct the dynamic meta tags with the game data
    const metaTags = `
      <title>${gameData.title}</title>
      <meta name="description" content="${gameData.description}">
      <meta property="og:title" content="${gameData.title}">
      <meta property="og:description" content="${gameData.description}">
      <meta property="og:image" content="${gameData.imageUrl}">`;

    // Generate the full HTML response
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      ${JSON.stringify({
        event: event,
        pathParameters: pathParameters,
        customer: customer,
      })}
        ${metaTags}
     
      </head>
      <body>
       
      </body>
      </html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: htmlResponse,
    };
  } else {
    try {
      // Construct the file path. Since we're not sure of the exact structure, we'll use an environment variable.
      // NETLIFY_BUILD_BASE is an environment variable provided by Netlify that gives the base path.
      const basePath = process.env.NETLIFY_BUILD_BASE || '/var/task/';
      const filePath = path.join(basePath, 'build', 'index.html');

      // Attempt to read the file from this path
      const indexHtml = fs.readFileSync(filePath, 'utf-8');

      // Serve the file's contents
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: indexHtml,
      };
    } catch (error) {
      console.error('Error serving index.html:', error);
      // If there's an issue reading the file, log the error and return a 500 status code
      return {
        statusCode: 500,
        body: 'Internal Server Error: Unable to serve page: ' + JSON.stringify(error),
      };
    }
  }
  }
};

const fetchGameData = async (gameID) => {

  let data = {
    title: 'Some Random Customer',
    description: 'A fun game for the whole family!',
    imageUrl: 'https://your-website.com/images/customer.png'
  };
  /*
const response = await fetch(`https://your-api.com/games/${gameID}`);
  const data = await response.json();
  return data; // assuming this returns an object with { title, description, imageUrl }
  */
  return data;
};
