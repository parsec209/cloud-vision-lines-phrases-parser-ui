# cloud-vision-lines-phrases-parser-ui

UI that demonstrates the functionality of the cloud-vision-lines-phrases and cloud-vision-lines-phrases-parser packages. See https://www.npmjs.com/package/cloud-vision-lines-phrases and https://www.npmjs.com/package/cloud-vision-lines-phrases-parser. 

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run serve
```

## Use

The two js files in ./src/util show what the returned result looks like when inputting a Google batch file annotation (see https://cloud.google.com/vision/docs/file-small-batch) into the cloud-vision-lines-phrases module. The result, in addition to containing the unaltered Google batch file annotation, also contains an added lineList object which is used as a prop in the Parsers component, and it is the source of the sample text that populates the UI. The original image files are in ./src/assets/sampleDocs. The bounding box coordinates from the lineList's text unit objects are used to approximate the position of the text within the original image file. IMPORTANT NOTE: use the bounding box borders (that can be switched on and off around the text units within the UI) as your point of reference for determining the position of one text unit relative to another text unit, DO NOT look at just the text itself for this. For example, there may be times where it does not look like a text unit is directly beneath another text unit, but when you switch on their bounding box borders, you may see that they actually do horizontally overlap. You can switch between the two sample lineLists in ./src/util by going to .src/App.vue and commenting or uncommenting the imported annotations.

