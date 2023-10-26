const fetch = require('node-fetch');

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

  if (isCrawler) {
    // Extract gameID from query parameters
    const { gameID } = event.queryStringParameters;

    // Fetch the related data for this game (e.g., from your database or an external API)
    const gameData = await fetchGameData(gameID);
    const pathParameters = event.path.split("/");
    const customer = pathParameters[1]; // since it's usually the first segment after the initial /


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
    // If not a crawler, redirect to the client-side rendered app
    return {
      statusCode: 301,
      headers: { Location: '/' },
    };
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
