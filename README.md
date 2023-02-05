# cloud-vision-lines-phrases-parser-ui

UI that demonstrates the functionality of the [cloud-vision-lines-phrases](https://www.npmjs.com/package/cloud-vision-lines-phrases) and [cloud-vision-lines-phrases-parser](https://www.npmjs.com/package/cloud-vision-lines-phrases-parser) packages. 

Check out an interactive demo on [CodeSandbox](https://codesandbox.io/s/github/parsec209/cloud-vision-lines-phrases-parser-ui).

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run serve
```

## Use

These [two js files](https://github.com/parsec209/cloud-vision-lines-phrases-parser-ui/tree/main/src/util) show what the returned result looks like when inputting a Google [batch file annotation](https://cloud.google.com/vision/docs/file-small-batch) into the [cloud-vision-lines-phrases](https://www.npmjs.com/package/cloud-vision-lines-phrases) module. The result, in addition to containing the unaltered Google batch file annotation, also contains an added lineList object which is used as a prop in the Parsers component, and it is the source of the sample text that populates the UI. You can also check out the [original image files](https://github.com/parsec209/cloud-vision-lines-phrases-parser-ui/tree/main/src/assets/sampleDocs). The bounding box coordinates from the lineList's text unit objects are used to approximate the position of the text within the original image file. IMPORTANT NOTE: use the bounding box borders (that can be switched on and off around the text units within the UI) as your point of reference for determining the position of one text unit relative to another text unit, DO NOT look at just the text itself for this. For example, there may be times where it does not look like a text unit is directly beneath another text unit, but when you switch on their bounding box borders, you may see that they actually do horizontally overlap. You can switch between the two sample js files by navigating [here](https://github.com/parsec209/cloud-vision-lines-phrases-parser-ui/tree/main/src) and commenting or uncommenting the imported annotations within the App.vue file.

