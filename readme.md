

# Image Recognition Interactive Demo
---

## Description
This demo uses a simple set of ~~(Realm)~~ Atlas App Services and Azure cognitive services to demonstrate the powerful "real time" capabilites of MongoDB. 

The demo script will allow your audience to access a web page and provide a URI to an image with an option to add a description. When the image is "saved" an event it triggerd (via change streams) to apply the image recognition capabilities (provided by Azure) and capture the output of this as tags associated with the image. The tags and description of the image can then be queried using Atlas Search and a visual representation of the breakdown of tags can be presented via a Charts dashboard.

**\#Atlas \#AtlasAppServices \#AtlasSearch \#Charts**

## Installation & Set up

- Create an Atlas cluster if you don't already have one. An M0 will work but if you wanted to use the multi-cloud capability in your talk track then ensure you set this up (or show how to set this up).
  - By default, this demo will use a database called `imageRecog` and a collection called `images`. If you did want to change this then ensure you make the changes to the following places:
    - `demo_settings.py`
    - Atlas App Services functions `addImage.js` and `atlasSearch.js` - either modify this directly in the function editor or modify these files before loading the app into Atlas App Services
- Import the sample data set. A small number of doucments have been provided to get you started in the data.json file. Import these in order to create the charts dashboard that will be embedded in the UI.
  - To import, run the following command:
  ```
  mongoimport --uri "mongodb+srv://<user>:<password>@anandsandbox.hluaz.mongodb.net/imageRecog" --collection images --file data.json
  ```
- Create a charts dashboard to embed. Navigate to charts and create a new data source pointing to the `imageRecog` collection in the cluster. Ensure that this data source can be accessed without authenication. Then create a new dashboard and add a simple pie chart that displays breakdown of the tags in the collection. Once you're happy with the chart save and return to the dashboard. On the `...` button of the dashboard you will have an option to embed the chart. Choose this and select the `unauthenticated` tab. Ensure that the toggle for `Enable unauthenticated access` is enabled and choose a refresh rate of 10 seconds. Copy and paste the URL defined in the `src` attribute of the iframe and update the `charts.html` file with this value. You should be able to test this by opening that HTML file in a browser (adjust any other properties like the size as required).
  
- Next, install the Atlas App Services using the [Realm CLI](https://www.mongodb.com/docs/atlas/app-services/cli/realm-cli-push). For example:

```
realm-cli login --api-key="<enter your public key>" --private-api-key="<enter your private key>"

realm-cli push --local "./ImageProcessing"
```
Accept the defaults when creating the app and you should see a message at the end stating that the app was successfully deployed - e.g. `"Successfully pushed app up: imageprocessing-ycgdf"`.

The app installation will not upload the basic client HTML files. Unfortunatly this is something you will need to do manually, but this is OK as you do need to modify these files before uploading them. Follow these steps:
- Log into the App Services and open the newly deployed app.
- Navigate to the `HTTPS Endpoints` and select the `/addImage` endpoint.
- Copy the callback URL displayed for this end point e.g. `"https://eu-west-1.aws.data.mongodb-api.com/app/imageprocessing-ycgdf/endpoint/addImage"` and add this to the URI variable in the sendImage function of the `addImage.html` file located in the "web" directory.
- Repeat the above step for the `/search` HTTPS endpoint replacing the value of the URI variable in the runSearch function of the `atlasSearch.html` file also located in the "web" directory.
- You should be able to test the addition and search of images as well as the loading of the charts dashboard by simply opening the `index.html` file in a browser and navigating to the relevant forms. Once you're happy that you can load & find the images and view the charts dashboard, navigate to the `Hosting` option and enable hosting. (**Note:** you will need to create a search index on the collection to verify that the atlasSearch page does actually work.)
- Once hosting is enabled, click on the `upload files` option and upload the four files located in the "web" directory. These are:
  - index.html
  - atlasSearch.html
  - addImage.html
  - charts.html
- Remember to deploy your changes and thest that you can get to the URL publised in the hosting page.

The final step in the set up is to execute the change streams code which will trigger the API call to Azure's cognitive services. To do this you will need to set up a subscription for these services on Azure as per the [docs](https://docs.microsoft.com/en-gb/azure/cognitive-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=visual-studio&pivots=programming-language-python). When you have set this up make a note of the subscription id. 

Then install the necessary libraries in the location where you plan to run the change streams code. (This can be run on your laptop or it can be run on a compute instance in Azure if your talk track is around multi-cloud and leveraging specific cloud services from different providers.)

```
pip3 install azure-cognitiveservices-vision-computervision
```

Next, navigate to the `ImageRecognition` directory and create a file called `demo_settings.py` (or modify the values if one exist) and set the following properties:
```
URI_STRING = "mongodb+srv://<user>:<password>@anandsandbox.hluaz.mongodb.net/imageRecog"
DATABASE_NAME = "imageRecog"
COLLECTION_NAME = "images"
SUBSCRIPTION_KEY = "value of your azure cognitive services subscription key"
ENDPOINT = "URL of the azure services"
```

Finally run the python script to execute the change streams logic:

```
python3 changestream.py
```

## Demo
Feel free to vary the talk track based on your auidence and the outcomes you're looking for. At a high level the goal is to demonstrate how we MongoDB can be reactive to changes, integrate with cloud native systems to gain insights which can then be accessed in near real time.

- To do this talk through the difference components that are involved in the demo - Atlas, App Services for hosting and functions, Azure Cognitive Services, MongoDB change streams, Atlas Search and charts.
- Use Compass to show the documents in the collection.
- Navigate to the `Add Image` page and run a google search for an appropriate image (ensure you've "find" an image link that you've tested previously). 
- Copy the image URL and it in the field - the image should be displayed.
- Update the description and ensure that the shell running the change streams is displayed so that when you click the save button the changes can be visible.
- When the changes appear in the change streams window, navigate to compass and show the data that's just been added.
- Now go to Atlas and create a search index on the collection (if you have created one previously you may want to either create another index with a different name).
- Then open the search page and perform some random searches. To make these searches more impactful, modify the function execuing the search and comment out/in the logic to run a fuzzy search describing the ease at which you can use this capability to provide a rich user experiece.
- Finally navigate to charts via Atlas and demonstrate how easy it is to create some visual representations of the data. Show the ability to embed the dashboard and navigate back to the HTML page to demonstrate that embedded dashboard. If time allows add a second chart to the dashboard and show how this is immediately reflected in the embedded page.


To make the demo interactive, use one of the many QR Code generators to generate and present a QR code that the audience can use to access the HTML pages. They can then find and load images themselves.
