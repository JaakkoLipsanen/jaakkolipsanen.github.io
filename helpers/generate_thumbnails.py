import sys
import json
from PIL import Image
import smartcrop

from os import listdir
from os.path import isfile, join
import os

sc = smartcrop.SmartCrop()
crop_options = smartcrop.DEFAULTS
crop_options['width'] = 200
crop_options['height'] = 200
crop_options['min_scale'] = 1
crop_options['detail_weight'] = 1
crop_options['saturation_weight'] = 1.2

directory = ""
try:
	directory = sys.argv[1]
except:
	sys.exit("ERROR: You must give folder as argument!!") 

outputDir = directory + "/thumbnails"

if not os.path.exists(outputDir):
    os.makedirs(outputDir)

size = 200, 200
onlyfiles = [f for f in listdir(directory) if isfile(join(directory, f))]
for i in onlyfiles:
	imagePath = directory + "/" + i
	outputImagePath = outputDir + "/" + i
	
	img = Image.open(imagePath)
	ret = sc.crop(img, crop_options)

	topCrop = ret["topCrop"]
	if topCrop is None:
		print("!!! " + imagePath + " could not be cropped. Skipping")
		print(json.dumps(ret, indent=2))
		continue

	box = (topCrop["x"], topCrop["y"], topCrop["x"] + topCrop["width"], topCrop["y"] + topCrop["height"])
	crop = Image.open(imagePath).crop(box)
	crop.thumbnail(size, Image.ANTIALIAS)
	crop.save(outputImagePath, "jpeg")