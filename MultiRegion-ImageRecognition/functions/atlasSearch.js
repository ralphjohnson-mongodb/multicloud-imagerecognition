// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  /*
  if (query.deleteAll) {
    context.services.get("mongodb-atlas").db("multiregion").collection("images").deleteMany({});
    return "Deleted all - " + query.org;
  }
  */
  
  console.log(JSON.stringify(query));
  // Data can be extracted from the request as follows:

  const atlasSearch = query.atlasSearch; // body.text();
  const atlasAggregation = query.atlasAggregation; // body.text();

  response = {};
  if (!atlasAggregation) {
    // Querying a mongodb service:
    response = context.services.get("mongodb-atlas").db("multiregion").collection("images").aggregate([
      {
        $search: {
          index: 'default',
          text: {
            query: atlasSearch,
            path: ["imageDescription","tags"], /* {
              'wildcard': '*'
            },*/
            /*
            fuzzy:{
            "maxEdits": 1,
            }
            */
          }
        }
      }
    ]);
  } else {
    response = context.services.get("mongodb-atlas").db("multiregion").collection("images").aggregate(atlasAggregation);
  }

  return response;
};
