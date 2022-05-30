
// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {

  console.log(JSON.stringify(query));
    // Data can be extracted from the request as follows:

    const imageURI = query.imageURI; // body.text();
    const imageDescription = query.imageDescription; // body.text();

    const myImageDoc = {"imageURI":imageURI,"imageDescription":imageDescription};
    
    console.log(JSON.stringify(myImageDoc));

    // Querying a mongodb service:
    context.services.get("mongodb-atlas").db("imageRecog").collection("images").insertOne(myImageDoc);

    return "Success";
};