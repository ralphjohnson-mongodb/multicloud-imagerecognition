// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  console.log(JSON.stringify(query));
  // Data can be extracted from the request as follows:

  const atlasSearch = query.atlasSearch; // body.text();

  // response = {};
  // Querying a mongodb service:
  response = context.services.get("mongodb-atlas").db("imageRecog").collection("images").aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query: atlasSearch,
          path: ["imageDescription","tags"] /*
          ,fuzzy:{
          "maxEdits": 1,
          } */
        }
      }
    }
  ]);

  return response;
};
