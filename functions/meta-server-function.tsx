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
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
      this should be the normal page

      `
    }; 
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