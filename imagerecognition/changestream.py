#!/usr/bin/env python3
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

from array import array
import os
from PIL import Image
import sys
import time

import pymongo
#from bson.json_util import dumps
from json import dumps
import time
import random
import demo_settings

def main():
    # Define the MongoDB Connection
    conn=pymongo.MongoClient(demo_settings.URI_STRING)
    db = conn[demo_settings.DATABASE_NAME]
    collection = db[demo_settings.COLLECTION_NAME]

    computervision_client = ComputerVisionClient(demo_settings.endpoint, CognitiveServicesCredentials(demo_settings.subscription_key))

    # Define the change_stream object 
    change_stream = collection.watch([{ "$match" : {"operationType" : "insert" } }],full_document="updateLookup")

    print()
    print("Listening for changes...")
    print()

    # Execute logic for every change in the stream
    for change in change_stream:
        # Print the change document
        print(dumps(change,indent=2,default=str))
        print(change["fullDocument"]["_id"])

        # for word in change["fullDocument"]["imageDescription"].split():
        #    print (word)
        # tags = change["fullDocument"]["imageDescription"].split()

        tags = []
        remote_image_url = change["fullDocument"]["imageURI"]

        try:
            tags_result_remote = computervision_client.tag_image(remote_image_url )
            for tag in tags_result_remote.tags:
                print("'{}' with confidence {:.2f}%".format(tag.name, tag.confidence * 100))
                tags.append(tag.name)
        except:
            print("An image recognition error occurred")

        collection.update_one({"_id":change["fullDocument"]["_id"]},{"$set": { "tags": tags }})

if __name__ == "__main__":
    try:
        main()
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to MongoDB: %s" % e)


