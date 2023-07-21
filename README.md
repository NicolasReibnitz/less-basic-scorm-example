# less-basic-scorm-example

A fully featured SCORM video player using the simpleshow interactive implementation of the [pipwerks-scorm-api-wrapper](https://github.com/allanhortle/pipwerks-scorm-api-wrapper). The resulting packages are compatible with any LMS that supports SCORM v1.2, SCORM 2004 3rd Edition, or SCORM 2004 4th Edition.

After running build the SCORM zip packages are available in the `dist-scorm` folder.

### Features

-   [x] course completion is set to completed when video is finished
-   [x] course success is set to passed when video is finished (not available with SCORM v1.2)
-   [x] score is set to the percentage of the video that has been watched
-   [x] the current time of the video is saved when the course is closed and restored when the course is opened again (bookmarking)
-   [x] if the SuccessFactors LMS is detected, `cmi.core.exit` is set to an empty string instead of the standard `logout` when the course is closed (this is a workaround for a bug in SuccessFactors)

### Usage

```bash
npm install

# run the development server
npm run dev

# build the production version
npm run build
```

Made with ❤️ and 🕷️ in 𝕯𝖆𝖘 𝕷𝖆𝖇𝖔𝖗𝖆𝖙𝖔𝖗𝖞®
