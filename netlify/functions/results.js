exports.handler = async (event, context) => {
    const gameID = event.queryStringParameters.gameID;
    const customer = event.pathParameters.customer;
  
    const ogTitle = `Results for ${customer}`;
    const ogDescription = `${customer} game results! Someone took the lead!`;
    const ogImage = `https://favoritecreative.com/puttputtgo/shareable/saves/castle-golf/${gameID}.jpg`;
  
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta property="og:title" content="${ogTitle}">
          <meta property="og:description" content="${ogDescription}">
          <meta property="og:image" content="${ogImage}">
        </head>
        <body>
          <h1>Results for ${customer}</h1>
          <p>Game ID: ${gameID}</p>
          <script>
          fetch('/static/js/')
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainScript = Array.from(doc.scripts).find(script => script.src.includes('main'));
            if (mainScript) {
              const scriptElement = document.createElement('script');
              scriptElement.src = mainScript.src;
              document.body.appendChild(scriptElement);
            }
          });
          </script>
        </body>
      </html>
    `;
  
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: html,
    };
  };