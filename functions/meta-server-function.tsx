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

   // Fetch the related data for this game (e.g., from your database or an external API)

   const pathParameters = event.path.split("/");
   const customer = pathParameters[1]; // since it's usually the first segment after the initial /

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
        <!-- Other headers like CSS links, etc. -->
      </head>
      <body>
        <!-- Your usual app content -->
      </body>
      </html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: htmlResponse,
    };
  } else {
    try {
      // Assuming your build outputs to a "build" folder
      // Adjust the path according to your project structure
      const filePath = path.join('', '', 'index.html');
  
      const fileContents = fs.readFileSync(filePath, 'utf8');
  
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: fileContents,
      };
    } catch (error) {
      // handle file read error
      console.error('Error reading index.html:', error);
      return {
        statusCode: 500,
        body: 'Internal Server Error: ' + JSON.stringify(error),
      };
    }
  }
};

const fetchGameData = async (gameID) => {
  // Replace this with your actual data fetching logic
  let data = {
    title: 'Castle Golf',
    description: 'A fun game for the whole family!',
    imageUrl: 'https://your-website.com/images/castle-golf.png'
  };
  /*
const response = await fetch(`https://your-api.com/games/${gameID}`);
  const data = await response.json();
  return data; // assuming this returns an object with { title, description, imageUrl }
  */
  return data;
};
