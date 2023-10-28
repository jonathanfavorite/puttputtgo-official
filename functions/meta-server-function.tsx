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
      
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />

      <!-- add meta og -->
      <meta property="fb:app_id" content="823028086097162" />
      <meta property="og:url" content="https://www.puttputtgo.net/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="PuttPuttGo" />
      <meta property="og:description" content="The official digital scorecard for golf." />
      <meta property="og:image" content="/website/og.jpg" />
      <meta property="og:image:width" content="700" />
      <meta property="og:image:height" content="375" />

      <!-- add meta twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="https://www.puttputtgo.net/">
      <meta name="twitter:title" content="PuttPuttGo">
      <meta name="twitter:description" content="The official digital scorecard for golf.">
      <meta name="twitter:image" content="/website/og.jpg">

      <title>PuttPuttGo | The Official Digital Scorecard for Golf</title>

    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="/manifest.json" />
    <!--


    -->
    <title>PuttPuttGo</title>
  <script defer src="/static/js/bundle.js"></script></head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

    -->
  </body>
</html>

      `
    }; 
  }
};