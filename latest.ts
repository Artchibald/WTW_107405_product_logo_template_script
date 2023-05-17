// #target Illustrator 
/************************************************
 * ** README https://github.com/Artchibald/2022_icon_rebrand_scripts
 
Script to automate creating variations and exporting files for WTW icons
Starting with an open AI file with a single icon on a single 256 x 256 artboard
– Creates a new artboard at 16x16
- Creates a new artboard at 24x24
- Creates a new artboard at 1400x128
(if these artboards already exist, optionally clears and rebuilds these artboards instead)
- Adds resized copies of the icon to the artboards
- Asks for the name of the icon and adds text to the lockup icon
- Asks for purple banner text
- Creates a purple banner 1024 x 512 with text, the icon and logo
- Creates a purple banner 800 x 400 with icon and logo, no text
- Creates exports of the icon:
- RGB EPS
- RGB inverse EPS
- RGB inactive EPS
- PNGs at 1024, 256, 128, 64, 48, 32
- RGB lockup
- CMYK EPS 
- CMYK inverse EPS
- Purple banner with text exports
- Purple banner no text exports
- Opens created folder root
- Add instructions in the alert below and in the readme and in the instructions.txt before packaging up with the files in /test/ so the end user can try everything in Illustrator with one zip.
************************************************/
alert(" \n\nThis script only works locally not on a server. \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/2022_icon_rebrand_scripts   \n\nVideo set up tutorial available here: https://youtu.be/yxtrt7nkOjA. \n\nOpen your own.ai template or the provided ones in folders called test. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Make sure you have the Graphik font installed on your CPU. \n\nYou must have the folder called images in the parent folder, this is where wtw_logo.ai is saved so it can be imported into the big purple banner and exported as assets. Otherwise you will get an error that says error = svgFile. \n\nIllustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease try to use underscore instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");

/********************************* 
VARIABLES YOU MIGHT NEED TO CHANGE 
**********************************/
let sourceDoc = app.activeDocument;
let RGBColorElements = [
   [127, 53, 178], //ultraviolet purple
   [191, 191, 191], //Gray matter light grey
   [201, 0, 172], // Fireworks magenta
   [50, 127, 239], //Stratosphere blue
   [58, 220, 201], // Inifinity turquoise
   [255, 255, 255], // white
   [128, 128, 128], // Dark grey (unused)
];
// New CMYK values dont math rgb exatcly in new branding 2022 so we stopped the exact comparison part of the script.
// Intent is different colors in print for optimum pop of colors
let CMYKColorElements = [
   [65, 91, 0, 0], //ultraviolet purple
   [0, 0, 0, 25], //Gray matter light grey
   [16, 96, 0, 0], // Fireworks magenta
   [78, 47, 0, 0], //Stratosphere blue
   [53, 0, 34, 0], // Inifinity turquoise  
   [0, 0, 0, 0], // white
   [0, 0, 0, 50], // Dark grey (unused)
];
// Make sure you have the font below installed, ask for font from client
let desiredFont = "Graphik-Regular";
let exportSizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16]; //sizes to export
let violetIndex = 0; //these are for converting to inverse and inactive versions
let grayIndex = 1;
let whiteIndex = 5;
//loop default 
let i;
// folder creations
let coreName = "Core";
let expressiveName = "Expressive";
let inverseName = "Inverse";
let inactiveName = "Inactive";
let sourceDocName = sourceDoc.name.slice(0, -3);
// Lockups
let lockupName = "Lockup";
let lockup1 = "Lockup1";
let lockup2 = "Lockup2";
let eightByFour = "800x400";
let tenByFive = "1024x512";

// Colors
let rgbName = "RGB";
let cmykName = "CMYK";
let onWhiteName = "onFFF";
// type
let croppedName = "Cropped"
//Folder creations
let pngName = "png";
let jpgName = "jpg";
let svgName = "svg";
let epsName = "eps";
let iconFilename = sourceDoc.name.split(".")[0];
let rebuild = true;
// let gutter = 32;
// hide guides
let guideLayer = sourceDoc.layers["Guidelines"];
let name = sourceDoc.name.split(".")[0];
let destFolder = Folder(sourceDoc.path + "/" + name);

// 800x500 names
let sixteenTenName = "1610";
let smallName = "small";
let largeName = "large";

/**********************************
Module for image manipulation tasks 
***********************************/

// this is a typescript feature to help debugging 
interface Task {
   getArtboardCorner(artboard: any);
   getOffset(itemPos: any, referencePos: any);
   translateObjectTo(object: any, destination: any);
   clearArtboard(doc: any, index: any);
   selectContentsOnArtboard(doc: any, i: any);
   createGroup(doc: any, collection: any);
   ungroupOnce(group: any);
   newDocument(sourceDoc: any, colorSpace: any);
   duplicateArtboardInNewDoc(sourceDoc: any,
      artboardIndex: number,
      colorspace: any);
   scaleAndExportPNG(doc: any, destFile: any, startWidth: any, desiredWidth: any);
   scaleAndExportNonTransparentPNG(doc: any, destFile: any, startWidth: any, desiredWidth: any);
   scaleAndExportSVG(doc: any, destFile: any, startWidth: any, desiredWidth: any);
   scaleAndExportJPEG(doc: any, destFile: any, startWidth: any, desiredWidth: any);
   newRect(x: any, y: any, width: any, height: any);
   setFont(textRef: any, desiredFont: any);
   createTextFrame(doc: any, message: any, pos: any, size: any);
   initializeColors(RGBArray: any, CMYKArray: any);
   matchRGB(color: any, matchArray: any);
   matchColorsRGB(color1: any, color2: any);
   convertColorCMYK(pathItems: any, startColor: any, endColor: any)
   matchRGB(color: any, matchArray: any);
   matchColorsRGB(color1: any, color2: any);
   convertColorCMYK(pathItems: any, startColor: any, endColor: any)
   matchColorsCMYK(color1: any, color2: any): any;
   convertColorRGB(pathItems: any, startColor: any, endColor: any);
   convertAll(pathItems: any, endColor: any, opcty: any);
   indexRGBColors(pathItems: any, matchArray: any);
   convertToCMYK(doc: any, pathItems: any, colorArray: any, colorIndex: any);
   unique(a: any): any;
}


// All reusable functions are in CSTasks below
let CSTasks = (function () {
   let tasks: Task = {} as Task;

   /********************
      POSITION AND MOVEMENT
      ********************/

   //takes an artboard
   //returns its left top corner as an array [x,y]
   tasks.getArtboardCorner = function (artboard) {
      let corner = [artboard.artboardRect[0], artboard.artboardRect[1]];
      return corner;
   };

   //takes an array [x,y] for an item's position and an array [x,y] for the position of a reference point
   //returns an array [x,y] for the offset between the two points
   tasks.getOffset = function (itemPos, referencePos) {
      let offset = [itemPos[0] - referencePos[0], itemPos[1] - referencePos[1]];
      return offset;
   };

   //takes an object (e.g. group) and a destination array [x,y]
   //moves the group to the specified destination
   tasks.translateObjectTo = function (object, destination) {
      let offset = tasks.getOffset(object.position, destination);
      object.translate(-offset[0], -offset[1]);
   };

   //takes a document and index of an artboard
   //deletes everything on that artboard
   tasks.clearArtboard = function (doc, index) {
      //clears an artboard at the given index
      doc.selection = null;
      doc.artboards.setActiveArtboardIndex(index);
      doc.selectObjectsOnActiveArtboard();
      let sel = doc.selection; // get selection
      for (i = 0; i < sel.length; i++) {
         sel[i].remove();
      }
   };

   /*********************************
      SELECTING, GROUPING AND UNGROUPING
      **********************************/

   //takes a document and the index of an artboard in that document's artboards array
   //returns a selection of all the objects on that artboard
   tasks.selectContentsOnArtboard = function (doc, i) {
      doc.selection = null;
      doc.artboards.setActiveArtboardIndex(i);
      doc.selectObjectsOnActiveArtboard();
      return doc.selection;
   };

   //takes a document and a collection of objects (e.g. selection)
   //returns a group made from that collection
   tasks.createGroup = function (doc, collection) {
      let newGroup = doc.groupItems.add();
      for (i = 0; i < collection.length; i++) {
         collection[i].moveToBeginning(newGroup);
      }
      return newGroup;
   };

   //takes a group
   //ungroups that group at the top layer (no recursion for nested groups)
   tasks.ungroupOnce = function (group) {
      for (i = group.pageItems.length - 1; i >= 0; i--) {
         group.pageItems[i].move(
            group.pageItems[i].layer,
            /*@ts-ignore*/
            ElementPlacement.PLACEATEND
         );
      }
   };

   /****************************
      CREATING AND SAVING DOCUMENTS
      *****************************/

   //take a source document and a colorspace (e.g. DocumentColorSpace.RGB)
   //opens and returns a new document with the source document's units and the specified colorspace
   tasks.newDocument = function (sourceDoc, colorSpace) {
      let preset = new DocumentPreset();
      /*@ts-ignore*/
      preset.colorMode = colorSpace;
      /*@ts-ignore*/
      preset.units = sourceDoc.rulerUnits;
      /*@ts-ignore*/
      let newDoc = app.documents.addDocument(colorSpace, preset);
      newDoc.pageOrigin = sourceDoc.pageOrigin;
      newDoc.rulerOrigin = sourceDoc.rulerOrigin;
      return newDoc;
   };

   //take a source document, artboard index, and a colorspace (e.g. DocumentColorSpace.RGB)
   //opens and returns a new document with the source document's units and specified artboard, the specified colorspace
   tasks.duplicateArtboardInNewDoc = function (
      sourceDoc,
      artboardIndex,
      colorspace
   ) {
      let rectToCopy = sourceDoc.artboards[artboardIndex].artboardRect;
      let newDoc = tasks.newDocument(sourceDoc, colorspace);
      newDoc.artboards.add(rectToCopy);
      newDoc.artboards.remove(0);
      return newDoc;
   };

   //takes a document, destination file, starting width and desired width
   //scales the document proportionally to the desired width and exports as a PNG
   tasks.scaleAndExportPNG = function (doc, destFile, startWidth, desiredWidth) {
      let scaling = (100.0 * desiredWidth) / startWidth;
      let options = new ExportOptionsPNG24();
      /*@ts-ignore*/
      options.antiAliasing = true;
      /*@ts-ignore*/
      options.transparency = true;
      /*@ts-ignore*/
      options.artBoardClipping = true;
      /*@ts-ignore*/
      options.horizontalScale = scaling;
      /*@ts-ignore*/
      options.verticalScale = scaling;
      doc.exportFile(destFile, ExportType.PNG24, options);
   };
   //takes a document, destination file, starting width and desired width
   //scales the document proportionally to the desired width and exports as a NON TRANSPARENT PNG
   tasks.scaleAndExportNonTransparentPNG = function (doc, destFile, startWidth, desiredWidth) {
      let scaling = (100.0 * desiredWidth) / startWidth;
      let options = new ExportOptionsPNG24();
      /*@ts-ignore*/
      options.antiAliasing = true;
      /*@ts-ignore*/
      options.transparency = false;
      /*@ts-ignore*/
      options.artBoardClipping = true;
      /*@ts-ignore*/
      options.horizontalScale = scaling;
      /*@ts-ignore*/
      options.verticalScale = scaling;
      doc.exportFile(destFile, ExportType.PNG24, options);
   };

   //takes a document, destination file, starting width and desired width
   //scales the document proportionally to the desired width and exports as a SVG
   tasks.scaleAndExportSVG = function (doc, destFile, startWidth, desiredWidth) {
      let scaling = (100.0 * desiredWidth) / startWidth;
      let options = new ExportOptionsSVG();
      /*@ts-ignore*/
      options.horizontalScale = scaling;
      /*@ts-ignore*/
      options.verticalScale = scaling;
      // /*@ts-ignore*/
      // options.transparency = true;
      /*@ts-ignore*/
      // options.compressed = false; 
      // /*@ts-ignore*/
      // options.saveMultipleArtboards = true;
      // /*@ts-ignore*/
      // options.artboardRange = ""
      // options.cssProperties.STYLEATTRIBUTES = false;
      // /*@ts-ignore*/
      // options.cssProperties.PRESENTATIONATTRIBUTES = false;
      // /*@ts-ignore*/
      // options.cssProperties.STYLEELEMENTS = false;
      // /*@ts-ignore*/
      // options.artBoardClipping = true;
      doc.exportFile(destFile, ExportType.SVG, options);
   };

   //takes a document, destination file, starting width and desired width
   //scales the document proportionally to the desired width and exports as a JPG
   tasks.scaleAndExportJPEG = function (doc, destFile, startWidth, desiredWidth) {
      let scaling = (100.0 * desiredWidth) / startWidth;
      let options = new ExportOptionsJPEG();
      /*@ts-ignore*/
      options.antiAliasing = true;
      /*@ts-ignore*/
      options.artBoardClipping = true;
      /*@ts-ignore*/
      options.horizontalScale = scaling;
      /*@ts-ignore*/
      options.verticalScale = scaling;
      /*@ts-ignore*/
      options.qualitySetting = 100;
      doc.exportFile(destFile, ExportType.JPEG, options);
   };

   //takes left x, top y, width, and height
   //returns a Rect that can be used to create an artboard
   tasks.newRect = function (x, y, width, height) {
      let rect = [];
      rect[0] = x;
      rect[1] = -y;
      rect[2] = width + x;
      rect[3] = -(height + y);
      return rect;
   };

   /***
   TEXT
   ****/

   //takes a text frame and a string with the desired font name
   //sets the text frame to the desired font or alerts if not found
   tasks.setFont = function (textRef, desiredFont) {
      let foundFont = false;
      /*@ts-ignore*/
      for (let i = 0; i < textFonts.length; i++) {
         /*@ts-ignore*/
         if (textFonts[i].name == desiredFont) {
            /*@ts-ignore*/
            textRef.textRange.characterAttributes.textFont = textFonts[i];
            foundFont = true;
            break;
         }
      }
      if (!foundFont)
         alert(
            "Didn't find the font. Please check if the font is installed or check the script to make sure the font name is right."
         );
   };

   //takes a document, message string, position array and font size
   //creates a text frame with the message
   tasks.createTextFrame = function (doc, message, pos, size) {
      let textRef = doc.textFrames.add();
      textRef.contents = message;
      textRef.left = pos[0];
      textRef.top = pos[1];
      textRef.textRange.characterAttributes.size = size;
   };

   /***************
      COLOR CONVERSION
      ****************/

   //takes two equal-length arrays of corresponding colors [[R,G,B], [R2,G2,B2],...] and [[C,M,Y,K],[C2,M2,Y2,K2],...] (fairly human readable)
   //returns an array of ColorElements [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...] (usable by the script for fill colors etc.)
   tasks.initializeColors = function (RGBArray, CMYKArray) {
      let colors = new Array(RGBArray.length);

      for (let i = 0; i < RGBArray.length; i++) {
         let rgb = new RGBColor();
         rgb.red = RGBArray[i][0];
         rgb.green = RGBArray[i][1];
         rgb.blue = RGBArray[i][2];

         let cmyk = new CMYKColor();
         cmyk.cyan = CMYKArray[i][0];
         cmyk.magenta = CMYKArray[i][1];
         cmyk.yellow = CMYKArray[i][2];
         cmyk.black = CMYKArray[i][3];

         colors[i] = [rgb, cmyk];
      }
      return colors;
   };

   //take a single RGBColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
   //returns the index in the array if it finds a match, otherwise returns -1
   tasks.matchRGB = function (color, matchArray) {
      //compares a single color RGB color against RGB colors in [[RGB],[CMYK]] array
      for (let i = 0; i < matchArray.length; i++) {
         if (
            Math.abs(color.red - matchArray[i][0].red) < 1 &&
            Math.abs(color.green - matchArray[i][0].green) < 1 &&
            Math.abs(color.blue - matchArray[i][0].blue) < 1
         ) {
            //can't do equality because it adds very small decimals
            return i;
         }
      }
      return -1;
   };

   //take a single RGBColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
   //returns the index in the array if it finds a match, otherwise returns -1
   tasks.matchColorsRGB = function (color1, color2) {
      //compares two colors to see if they match
      if (
         Math.abs(color1.red - color2.red) < 1 &&
         Math.abs(color1.green - color2.green) < 1 &&
         Math.abs(color1.blue - color2.blue) < 1
      ) {
         //can't do equality because it adds very small decimals
         return true;
      }
      return false;
   };

   //takes a pathItems array, startColor and endColor and converts all pathItems with startColor into endColor
   tasks.convertColorCMYK = function (pathItems, startColor, endColor) {
      for (i = 0; i < pathItems.length; i++) {
         if (tasks.matchColorsCMYK(pathItems[i].fillColor, startColor))
            pathItems[i].fillColor = endColor;
      }
   };

   //take a single CMYKColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
   //returns the index in the array if it finds a match, otherwise returns -1
   tasks.matchColorsCMYK = function (color1, color2) {
      //compares two colors to see if they match
      if (
         Math.abs(color1.cyan - color2.cyan) < 1 &&
         Math.abs(color1.magenta - color2.magenta) < 1 &&
         Math.abs(color1.yellow - color2.yellow) < 1 &&
         Math.abs(color1.black - color2.black) < 1
      ) {
         //can't do equality because it adds very small decimals
         return true;
      }
      return false;
   };

   //takes a pathItems array, startColor and endColor and converts all pathItems with startColor into endColor
   tasks.convertColorRGB = function (pathItems, startColor, endColor) {
      for (i = 0; i < pathItems.length; i++) {
         if (tasks.matchColorsRGB(pathItems[i].fillColor, startColor))
            pathItems[i].fillColor = endColor;
      }
   };

   //takes a pathItems array, endColor and opacity and converts all pathItems into endColor at the specified opacity
   tasks.convertAll = function (pathItems, endColor, opcty) {
      for (i = 0; i < pathItems.length; i++) {
         pathItems[i].fillColor = endColor;
         pathItems[i].opacity = opcty;
      }
   };

   //takes a collection of pathItems and an array of specified RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
   //returns an array with an index to the RGB color if it is in the array
   tasks.indexRGBColors = function (pathItems, matchArray) {
      let colorIndex = new Array(pathItems.length);
      for (i = 0; i < pathItems.length; i++) {
         let itemColor = pathItems[i].fillColor;
         colorIndex[i] = tasks.matchRGB(itemColor, matchArray);
      }
      return colorIndex;
   };

   //takes a doc, collection of pathItems, an array of specified colors and an array of colorIndices
   //converts the fill colors to the indexed CMYK colors and adds a text box with the unmatched colors
   //Note that this only makes sense if you've previously indexed the same path items and haven't shifted their positions in the pathItems array
   tasks.convertToCMYK = function (doc, pathItems, colorArray, colorIndex) {
      let unmatchedColors = [];
      for (i = 0; i < pathItems.length; i++) {
         if (colorIndex[i] >= 0 && colorIndex[i] < colorArray.length)
            pathItems[i].fillColor = colorArray[colorIndex[i]][1];
         else {
            let unmatchedColor =
               "(" +
               pathItems[i].fillColor.red +
               ", " +
               pathItems[i].fillColor.green +
               ", " +
               pathItems[i].fillColor.blue +
               ")";
            unmatchedColors.push(unmatchedColor);
         }
      }
      if (unmatchedColors.length > 0) {
         // NOTE: Don't perform the Artboard Creation Work if there are unmatched colors due to new palettes CMYK and RGB no longer matching.
         return;
         alert(
            "One or more colors don't match the brand palette and weren't converted."
         );
         unmatchedColors = tasks.unique(unmatchedColors);
         let unmatchedString = "Unconverted colors:";
         for (let i = 0; i < unmatchedColors.length; i++) {
            unmatchedString = unmatchedString + "\n" + unmatchedColors[i];
         }
         let errorMsgPos = [Infinity, Infinity]; //gets the bottom left of all the artboards
         for (let i = 0; i < doc.artboards.length; i++) {
            let rect = doc.artboards[i].artboardRect;
            if (rect[0] < errorMsgPos[0]) errorMsgPos[0] = rect[0];
            if (rect[3] < errorMsgPos[1]) errorMsgPos[1] = rect[3];
         }
         errorMsgPos[1] = errorMsgPos[1] - 20;

         tasks.createTextFrame(doc, unmatchedString, errorMsgPos, 18);
      }
   };

   //takes an array
   //returns a sorted array with only unique elements
   tasks.unique = function (a) {
      let sorted;
      let uniq;
      if (a.length > 0) {
         sorted = a.sort();
         uniq = [sorted[0]];
         for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] != sorted[i - 1]) uniq.push(sorted[i]);
         }
         return uniq;
      }
      return [];
   };
   return tasks;

})();

/**********************************
** HIDE / SHOW SOME LAYERS NEEDED
***********************************/
try {
   guideLayer.visible = false;
} catch (e) {
   alert(
      "Issue with layer hiding the Guidelines layer (do not change name from exactly Guidelines).",
      e.message
   );
}
/*****************************
create export folder if needed
******************************/
try {
   new Folder(`${sourceDoc.path}/${sourceDocName}`).create();
   // Core folder
   new Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${jpgName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${svgName}`).create();
   // Expressive folder 
   new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`).create();
   new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`).create();
} catch (e) {
   alert(
      "Issues with creating setup folders. Check your file permission properties.",
      e.message
   );
}
/*****************************
Moving both prompts to the top of the file for efficiency purposes
******************************/
//request a name for the icon, and place that as text on the lockup artboard
let appNameCore = prompt("What name do you want to put in the first Core lockup?");

//request a name for the icon, and place that as text on the lockup artboard
let appNameExpressive = prompt("What name do you want to put in the second Expressive lockup?");
/****************
 _________                       
\_   ___ \  ___________   ____  
/    \  \/ /  _ \_  __ \_/ __ \ 
\     \___(  <_> )  | \/\  ___/ 
 \______  /\____/|__|    \___  >
        \/                   \/ 
 ***************/
/**********************************
 Core
***********************************/

function mainCore() {

   /******************
   set up artboards
   ******************/

   //if there are two artboards at 256x256, create the new third lockup artboard
   if (
      sourceDoc.artboards.length == 2 &&
      sourceDoc.artboards[0].artboardRect[2] -
      sourceDoc.artboards[0].artboardRect[0] ==
      256 &&
      sourceDoc.artboards[0].artboardRect[1] -
      sourceDoc.artboards[0].artboardRect[3] ==
      256
   ) {
      // alert("More than 2 artboards detected!");
      let firstRect = sourceDoc.artboards[0].artboardRect;
      sourceDoc.artboards.add(
         // CSTasks.newRect(firstRect[1] * 2.5 + gutter, firstRect[2], 2400, 256)
         // CSTasks.newRect(firstRect[1] * 0.5, firstRect[2], 2400, 256)

         CSTasks.newRect(firstRect[1], firstRect[2] + 128, 2400, 256)
      );
   }

   //if the lockup artboard is present, check if rebuilding or just exporting
   else if (
      sourceDoc.artboards.length == 3 &&
      sourceDoc.artboards[1].artboardRect[1] -
      sourceDoc.artboards[1].artboardRect[3] ==
      256
   ) {
      rebuild = confirm(
         "It looks like your artwork already exists. This script will rebuild the lockup and export various EPS and PNG versions. Do you want to proceed?"
      );
      if (rebuild) CSTasks.clearArtboard(sourceDoc, 1);
      else return;
   }

   //otherwise abort
   else {
      alert("Please try again with 2 artboards that are 256x256px.");
      return;
   }
   //select the contents on artboard 0
   let sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);

   // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
   app.executeMenuCommand('Colors9');

   if (sel.length == 0) {
      //if nothing is in the artboard
      alert("Please try again with artwork on the main 256x256 artboard.");
      return;
   }

   let colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
   let iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
   let iconOffset = CSTasks.getOffset(
      iconGroup.position,
      CSTasks.getArtboardCorner(sourceDoc.artboards[0])
   );

   /********************************
   Create new artboard with lockup
   *********************************/

   //place icon on lockup
   /*@ts-ignore*/
   let mast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
   let mastPos = [
      sourceDoc.artboards[2].artboardRect[0] + iconOffset[0],
      sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(mast, mastPos);



   let textRef = sourceDoc.textFrames.add();
   textRef.contents = appNameCore;
   textRef.textRange.characterAttributes.size = 178;
   CSTasks.setFont(textRef, desiredFont);

   //vertically align the baseline to be 64 px above the botom of the artboard
   let bottomEdge =
      sourceDoc.artboards[2].artboardRect[3] +
      0.25 * sourceDoc.artboards[0].artboardRect[2] -
      sourceDoc.artboards[0].artboardRect[0]; //64px (0.25*256px) above the bottom edge of the artboard
   let vOffset = CSTasks.getOffset(textRef.anchor, [0, bottomEdge]);
   textRef.translate(0, -vOffset[1]);

   //create an outline of the text
   let textGroup = textRef.createOutline();

   //horizontally align the left edge of the text to be 96px to the right of the edge
   let rightEdge =
      mast.position[0] +
      mast.width +
      0.375 * sourceDoc.artboards[0].artboardRect[2] -
      sourceDoc.artboards[0].artboardRect[0]; //96px (0.375*256px) right of the icon
   let hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
   textGroup.translate(-hOffset[0], 0);

   //resize the artboard to be only a little wider than the text
   let leftMargin = mast.position[0] - sourceDoc.artboards[2].artboardRect[0];
   let newWidth =
      textGroup.position[0] +
      textGroup.width -
      sourceDoc.artboards[2].artboardRect[0] +
      leftMargin;
   let resizedRect = CSTasks.newRect(
      sourceDoc.artboards[2].artboardRect[0],
      -sourceDoc.artboards[2].artboardRect[1],
      newWidth,
      256
   );
   sourceDoc.artboards[2].artboardRect = resizedRect;

   //get the text offset for exporting
   let mastTextOffset = CSTasks.getOffset(
      textGroup.position,
      CSTasks.getArtboardCorner(sourceDoc.artboards[2])
   );


   /*********************************************************************
   RGB export (EPS, PNGs at multiple sizes, inactive EPS and inverse EPS)
   **********************************************************************/
   let rgbDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      0,
      DocumentColorSpace.RGB
   );

   rgbDoc.swatches.removeAll();

   let rgbGroup = iconGroup.duplicate(
      rgbDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let rgbLoc = [
      rgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroup, rgbLoc);

   CSTasks.ungroupOnce(rgbGroup);

   //save a master PNG
   let masterStartWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}`) + filename);
      CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[0]);
   }

   //save a master SVG 
   let svgMasterCoreStartWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}`) + filename);
      CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[0]);
   }

   //save a master SVG in Core SVG
   let svgMasterCoreStartWidth2 =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${svgName}`) + filename);
      CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth2, exportSizes[0]);
   }

   //save all sizes of PNG into the export folder
   let startWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}_${rgbName}_${exportSizes[i]}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth, exportSizes[i]);
   }
   // non transparent png exports
   let startWidthonFFF =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}_${rgbName}_${onWhiteName}_${exportSizes[i]}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filename);
      CSTasks.scaleAndExportNonTransparentPNG(rgbDoc, destFile, startWidthonFFF, exportSizes[i]);
   }

   //save all sizes of JPEG into the export folder
   let jpegStartWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}_${rgbName}_${exportSizes[i]}.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(rgbDoc, destFile, jpegStartWidth, exportSizes[i]);
   }

   //save EPS into the export folder
   let filename = `/${iconFilename}_${coreName}_${rgbName}.eps`;
   let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + filename);
   let rgbSaveOpts = new EPSSaveOptions();
   /*@ts-ignore*/
   rgbSaveOpts.cmykPostScript = false;
   rgbDoc.saveAs(destFile, rgbSaveOpts);

   //index the RGB colors for conversion to CMYK. An inelegant location.
   let colorIndex = CSTasks.indexRGBColors(rgbDoc.pathItems, colors);
   //convert violet to white and save as EPS
   CSTasks.convertColorRGB(
      rgbDoc.pathItems,
      colors[violetIndex][0],
      colors[whiteIndex][0]
   );

   let inverseFilename = `/${iconFilename}_${inverseName}_${rgbName}.eps`;
   let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + inverseFilename);
   rgbDoc.saveAs(inverseFile, rgbSaveOpts);

   //save inverse file in all the PNG sizes
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}_${inverseName}_${rgbName}_${exportSizes[i]}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth, exportSizes[i]);
   }

   //convert to inactive color (WTW Icon grey at 100% opacity) and save as EPS
   CSTasks.convertAll(rgbDoc.pathItems, colors[grayIndex][0], 100);

   let inactiveFilename = `/${iconFilename}_${inactiveName}_${rgbName}.eps`;
   let inactiveFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + inactiveFilename);
   rgbDoc.saveAs(inactiveFile, rgbSaveOpts);

   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${coreName}_${inactiveName}_${rgbName}_${exportSizes[i]}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth, exportSizes[i]);
   }

   //close and clean up
   rgbDoc.close(SaveOptions.DONOTSAVECHANGES);
   rgbDoc = null;


   /*********************************************************************
   Export an SVG on a white background
   **********************************************************************/
   let rgbDocOnFFF = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      0,
      DocumentColorSpace.RGB
   );

   rgbDocOnFFF.swatches.removeAll();
   let rgbGroupOnFFF = iconGroup.duplicate(
      rgbDocOnFFF.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATBEGINNING
   );
   let rgbLocOnFFF = [
      rgbDocOnFFF.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDocOnFFF.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroupOnFFF, rgbLocOnFFF);

   CSTasks.ungroupOnce(rgbGroupOnFFF);

   // Add a white square bg here to save svg on white
   let getArtLayer = rgbDocOnFFF.layers.getByName('Layer 1');
   let myMainPurpleBgLayerOnFFF = rgbDocOnFFF.layers.add();
   myMainPurpleBgLayerOnFFF.name = "Main_Purple_BG_layer";
   let GetMyMainPurpleBgLayerOnFFF = rgbDocOnFFF.layers.getByName('Main_Purple_BG_layer');
   let landingZoneSquareOnFFF = GetMyMainPurpleBgLayerOnFFF.pathItems.rectangle(
      0,
      0,
      256,
      256);
   let setLandingZoneSquareOnFFFColor = new RGBColor();
   setLandingZoneSquareOnFFFColor.red = 255;
   setLandingZoneSquareOnFFFColor.green = 255;
   setLandingZoneSquareOnFFFColor.blue = 255;
   landingZoneSquareOnFFF.fillColor = setLandingZoneSquareOnFFFColor;
   landingZoneSquareOnFFF.name = "bgSquareForSvgOnFF"
   landingZoneSquareOnFFF.filled = true;
   landingZoneSquareOnFFF.stroked = false;

   /*@ts-ignore*/
   GetMyMainPurpleBgLayerOnFFF.move(getArtLayer, ElementPlacement.PLACEATEND);

   //close and clean up
   rgbDocOnFFF.close(SaveOptions.DONOTSAVECHANGES);
   rgbDocOnFFF = null;


   /*********************************************************************
   RGB cropped export (JPG, PNGs at 16 and 24 sizes), squares, cropped to artwork
   **********************************************************************/
   let rgbDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      0,
      DocumentColorSpace.RGB
   );

   rgbDocCroppedVersion.swatches.removeAll();

   let rgbGroupCropped = iconGroup.duplicate(
      rgbDocCroppedVersion.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let rgbLocCropped = [
      rgbDocCroppedVersion.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDocCroppedVersion.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroupCropped, rgbLocCropped);

   // remove padding here befor exporting
   function placeIconLockup1Correctly(rgbGroupCropped, maxSize) {

      let W = rgbGroupCropped.width,
         H = rgbGroupCropped.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      rgbGroupCropped.resize(factor, factor);
   }
   placeIconLockup1Correctly(rgbGroupCropped, { W: 256, H: 256 });

   CSTasks.ungroupOnce(rgbGroupCropped);
   // below we export croped only versions
   // // non transparent png exports
   let startWidthCroppedOnFFF =
      rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   //24x24
   let filenameCropped24PngOnFFF = `/${iconFilename}_${coreName}_${rgbName}_${onWhiteName}_${exportSizes[7]}.png`;
   let destFileCropped24PngOnFFF = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped24PngOnFFF);
   CSTasks.scaleAndExportNonTransparentPNG(rgbDocCroppedVersion, destFileCropped24PngOnFFF, startWidthCroppedOnFFF, exportSizes[7]);
   //16x16
   let filenameCropped16PngOnFFF = `/${iconFilename}_${coreName}_${rgbName}_${onWhiteName}_${exportSizes[8]}.png`;
   let destFileCropped16PngOnFFF = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped16PngOnFFF);
   CSTasks.scaleAndExportNonTransparentPNG(rgbDocCroppedVersion, destFileCropped16PngOnFFF, startWidthCroppedOnFFF, exportSizes[8]);

   // save cropped 16 and 24 sizes of PNG into the export folder
   let startWidthCropped =
      rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   //24x24
   let filenameCropped24Png = `/${iconFilename}_${coreName}_${rgbName}_${exportSizes[7]}.png`;
   let destFileCropped24Png = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped24Png);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped24Png, startWidthCropped, exportSizes[7]);
   //16x16
   let filenameCropped16Png = `/${iconFilename}_${coreName}_${rgbName}_${exportSizes[8]}.png`;
   let destFileCropped16Png = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped16Png);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped16Png, startWidthCropped, exportSizes[8]);

   // save cropped 16 and 24 sizes of JPEG into the export folder
   let jpegStartWidthCropped =
      rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   //24x24
   let filenameCropped24Jpg = `/${iconFilename}_${coreName}_${rgbName}_${exportSizes[7]}.jpg`;
   let destFileCropped24Jpg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${jpgName}`) + filenameCropped24Jpg);
   CSTasks.scaleAndExportJPEG(rgbDocCroppedVersion, destFileCropped24Jpg, jpegStartWidthCropped, exportSizes[7]);
   //16x16
   let filenameCropped16Jpg = `/${iconFilename}_${coreName}_${rgbName}_${exportSizes[8]}.jpg`;
   let destFileCropped16Jpg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${jpgName}`) + filenameCropped16Jpg);
   CSTasks.scaleAndExportJPEG(rgbDocCroppedVersion, destFileCropped16Jpg, jpegStartWidthCropped, exportSizes[8]);

   // Save a cropped png
   let filenameCropped1024Png = `/${iconFilename}_${coreName}_${croppedName}.png`;
   let destFileCropped1024Png = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped1024Png);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped1024Png, startWidthCropped, exportSizes[0]);

   // Save a cropped SVG 
   let svgMasterCoreStartWidthCroppedSvg =
      rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   let filenameCroppedSvg = `/${iconFilename}_${coreName}_${croppedName}.svg`;
   let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${svgName}`) + filenameCroppedSvg);
   CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);

   //convert color to white
   CSTasks.convertColorRGB(
      rgbDocCroppedVersion.pathItems,
      colors[violetIndex][0],
      colors[whiteIndex][0]
   );

   // save cropped 16 and 24 sizes of PNG into the export folder
   let startWidthCroppedInversed =
      rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   //24x24  
   let filenameCropped24PngInversed = `/${iconFilename}_${coreName}_${inverseName}_${rgbName}_${exportSizes[7]}.png`;
   let destFileCropped24PngInversed = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped24PngInversed);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped24PngInversed, startWidthCroppedInversed, exportSizes[7]);
   //16x16
   let filenameCropped16PngInversed = `/${iconFilename}_${coreName}_${inverseName}_${rgbName}_${exportSizes[8]}.png`;
   let destFileCropped16PngInversed = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped16PngInversed);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped16PngInversed, startWidthCropped, exportSizes[8]);

   //convert to inactive color
   CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], 100);

   // save cropped 16 and 24 sizes of PNG into the export folder
   let startWidthCroppedInactive =
      rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   //24x24  
   let filenameCropped24PngInactive = `/${iconFilename}_${coreName}_${inactiveName}_${rgbName}_${exportSizes[7]}.png`;
   let destFileCropped24PngInactive = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped24PngInactive);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped24PngInactive, startWidthCroppedInactive, exportSizes[7]);
   //16x16
   let filenameCropped16PngInactive = `/${iconFilename}_${coreName}_${inactiveName}_${rgbName}_${exportSizes[8]}.png`;
   let destFileCropped16PngInactive = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${pngName}`) + filenameCropped16PngInactive);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped16PngInactive, startWidthCropped, exportSizes[8]);

   //close and clean up
   rgbDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
   rgbDocCroppedVersion = null;


   /****************
   CMYK export (EPS) (Inverse)
   ****************/

   //open a new document with CMYK colorspace, and duplicate the icon to the new document
   let cmykDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      0,
      DocumentColorSpace.CMYK
   );
   cmykDoc.swatches.removeAll();

   //need to reverse the order of copying the group to get the right color ordering
   let cmykGroup = iconGroup.duplicate(
      cmykDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATBEGINNING
   );
   let cmykLoc = [
      cmykDoc.artboards[0].artboardRect[0] + iconOffset[0],
      cmykDoc.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(cmykGroup, cmykLoc);
   CSTasks.ungroupOnce(cmykGroup);

   CSTasks.convertToCMYK(cmykDoc, cmykDoc.pathItems, colors, colorIndex);

   //save EPS into the export folder
   let cmykFilename = `/${iconFilename}_${coreName}_${cmykName}.eps`;
   let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + cmykFilename);
   let cmykSaveOpts = new EPSSaveOptions();
   cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);

   // //convert violet to white and save as EPS
   // CSTasks.convertColorCMYK(
   //    cmykDoc.pathItems,
   //    colors[violetIndex][1],
   //    colors[whiteIndex][1]
   // );

   // //save inverse EPS into the export folder
   // let cmykFilename2 = `/${iconFilename}_${inverseName}_${cmykName}.eps`;
   // let cmykDestFile2 = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + cmykFilename2);
   // let cmykSaveOpts2 = new EPSSaveOptions();
   // cmykDoc.saveAs(cmykDestFile2, cmykSaveOpts2);

   // //convert to inactive color
   // CSTasks.convertAll(cmykDoc.pathItems, colors[grayIndex][0], 100);

   // //save CMYK EPS into the export folder
   // let CMYKFilename2 = `/${iconFilename}_${inactiveName}_${cmykName}.eps`;
   // let CMYKDestFile2 = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + CMYKFilename2);
   // let CMYKSaveOpts2 = new EPSSaveOptions();
   // /*@ts-ignore*/
   // CMYKSaveOpts2.cmykPostScript = false;
   // cmykDoc.saveAs(CMYKDestFile2, CMYKSaveOpts2);

   //close and clean up
   cmykDoc.close(SaveOptions.DONOTSAVECHANGES);
   cmykDoc = null;


   /********************
   Lockup export core CMYK (EPS)
   ********************/
   //open a new doc and copy and position the icon and the lockup text
   let mastCMYKDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      1,
      DocumentColorSpace.CMYK
   );
   mastCMYKDoc.swatches.removeAll();

   let mastCMYKGroup = iconGroup.duplicate(
      mastCMYKDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let mastCMYKLoc = [
      mastCMYKDoc.artboards[0].artboardRect[0] + iconOffset[0],
      mastCMYKDoc.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(mastCMYKGroup, mastCMYKLoc);
   CSTasks.ungroupOnce(mastCMYKGroup);

   let mastCMYKText = textGroup.duplicate(
      mastCMYKDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let mastCMYKTextLoc = [
      mastCMYKDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
      mastCMYKDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
   ];
   CSTasks.translateObjectTo(mastCMYKText, mastCMYKTextLoc);

   //save CMYK EPS into the export folder
   let mastCMYKFilename = `/${iconFilename}_${lockupName}_${cmykName}.eps`;
   let mastCMYKDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + mastCMYKFilename);
   let mastCMYKSaveOpts = new EPSSaveOptions();
   /*@ts-ignore*/
   mastCMYKSaveOpts.cmykPostScript = false;
   mastCMYKDoc.saveAs(mastCMYKDestFile, mastCMYKSaveOpts);

   //close and clean up
   mastCMYKDoc.close(SaveOptions.DONOTSAVECHANGES);
   mastCMYKDoc = null;


   /********************
   Lockup export core RGB (EPS)
   ********************/

   //open a new doc and copy and position the icon and the lockup text
   let mastDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      1,
      DocumentColorSpace.RGB
   );
   mastDoc.swatches.removeAll();

   let mastGroup = iconGroup.duplicate(
      mastDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let mastLoc = [
      mastDoc.artboards[0].artboardRect[0] + iconOffset[0],
      mastDoc.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(mastGroup, mastLoc);
   CSTasks.ungroupOnce(mastGroup);

   let mastText = textGroup.duplicate(
      mastDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let mastTextLoc = [
      mastDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
      mastDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
   ];
   CSTasks.translateObjectTo(mastText, mastTextLoc);

   //save RGB EPS into the export folder
   let mastFilename = `/${iconFilename}_${lockupName}_${rgbName}.eps`;
   let mastDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${coreName}/${epsName}`) + mastFilename);
   let mastSaveOpts = new EPSSaveOptions();
   /*@ts-ignore*/
   mastSaveOpts.cmykPostScript = false;
   mastDoc.saveAs(mastDestFile, mastSaveOpts);

   //close and clean up
   mastDoc.close(SaveOptions.DONOTSAVECHANGES);
   mastDoc = null;
   /************ 
   Final cleanup
   ************/
   CSTasks.ungroupOnce(iconGroup);
   CSTasks.ungroupOnce(mast);
   sourceDoc.selection = null;

}

mainCore();


/****************
___________                                          .__              
\_   _____/__  ________________   ____   ______ _____|__|__  __ ____  
 |    __)_\  \/  /\____ \_  __ \_/ __ \ /  ___//  ___/  \  \/ // __ \ 
 |        \>    < |  |_> >  | \/\  ___/ \___ \ \___ \|  |\   /\  ___/ 
/_______  /__/\_ \|   __/|__|    \___  >____  >____  >__| \_/  \___  >
        \/      \/|__|               \/     \/     \/              \/ 
 ***************/
/****************
 * Expressive
 ***************/
function mainExpressive() {
   /******************
   Set up purple artboard 3
   ******************/
   //if there are three artboards, create the new fourth(3rd in array) lockup artboard
   if (
      sourceDoc.artboards.length == 3 &&
      sourceDoc.artboards[1].artboardRect[2] -
      sourceDoc.artboards[1].artboardRect[0] ==
      256 &&
      sourceDoc.artboards[1].artboardRect[1] -
      sourceDoc.artboards[1].artboardRect[3] ==
      256
   ) {
      // If there are already  3 artboards. Add a 4th one.
      let firstRect = sourceDoc.artboards[1].artboardRect;
      sourceDoc.artboards.add(
         // this fires but then gets replaced further down
         CSTasks.newRect(firstRect[1], firstRect[2] + 128, 1024, 512)
      );
   }
   //if the lockup artboard is present, check if rebuilding or just exporting
   else if (
      sourceDoc.artboards.length == 3 &&
      sourceDoc.artboards[1].artboardRect[1] -
      sourceDoc.artboards[1].artboardRect[3] ==
      512
   ) {
      rebuild = confirm(
         "It looks like your artwork already exists. This script will rebuild the lockup and export various EPS and PNG versions. Do you want to proceed?"
      );
      if (rebuild) CSTasks.clearArtboard(sourceDoc, 3);
      else return;
   }
   //otherwise abort
   else {
      alert("Please try again with 2 artboards that are 256x256px. Had trouble building artboard 3 (artb. 2 in js)");
      return;
   }

   //select the contents on artboard 1
   let sel = CSTasks.selectContentsOnArtboard(sourceDoc, 1);

   // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
   app.executeMenuCommand('Colors9');

   if (sel.length == 0) {
      //if nothing is in the artboard
      alert("Please try again with artwork on the main second 256x256 artboard.");
      return;
   }

   let colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
   let iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
   let iconOffset = CSTasks.getOffset(
      iconGroup.position,
      CSTasks.getArtboardCorner(sourceDoc.artboards[1])
   );

   /********************************
   Create new expressive artboard with lockup and text
   *********************************/

   /*@ts-ignore*/
   let mastBannerIconOnText = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);

   let mastBannerIconOnTextPos = [
      sourceDoc.artboards[3].artboardRect[0],
      sourceDoc.artboards[3].artboardRect[1],
   ];
   CSTasks.translateObjectTo(mastBannerIconOnText, mastBannerIconOnTextPos);

   /********************************
   Custom function to create a landing square to place the icon correctly
   Some icons have width or height less than 256 so it needed special centering geometrically
   you can see the landing zone square by changing fill to true and uncommenting color
   *********************************/

   // create a landing zone square to place icon inside
   //moved it outside the function itself so we can delete it after so it doesn't get exported
   let getArtLayer = sourceDoc.layers.getByName('Art');
   let landingZoneSquare = getArtLayer.pathItems.rectangle(
      -844,
      572,
      460,
      460);

   function placeIconLockup1Correctly(mastBannerIconOnText, maxSize) {
      // let setLandingZoneSquareColor = new RGBColor();
      // setLandingZoneSquareColor.red = 12;
      // setLandingZoneSquareColor.green = 28;
      // setLandingZoneSquareColor.blue = 151;
      // landingZoneSquare.fillColor = setLandingZoneSquareColor;
      landingZoneSquare.name = "LandingZone"
      landingZoneSquare.filled = false;
      /*@ts-ignore*/
      landingZoneSquare.move(getArtLayer, ElementPlacement.PLACEATEND);

      // start moving expressive icon into our new square landing zone
      let placedmastBannerIconOnText = mastBannerIconOnText;
      let landingZone = sourceDoc.pathItems.getByName("LandingZone");
      let preferredWidth = (460);
      let preferredHeight = (460);
      // do the width
      let widthRatio = (preferredWidth / placedmastBannerIconOnText.width) * 100;
      if (placedmastBannerIconOnText.width != preferredWidth) {
         placedmastBannerIconOnText.resize(widthRatio, widthRatio);
      }
      // now do the height
      let heightRatio = (preferredHeight / placedmastBannerIconOnText.height) * 100;
      if (placedmastBannerIconOnText.height != preferredHeight) {
         placedmastBannerIconOnText.resize(heightRatio, heightRatio);
      }
      // now let's center the art on the landing zone
      let centerArt = [placedmastBannerIconOnText.left + (placedmastBannerIconOnText.width / 2), placedmastBannerIconOnText.top + (placedmastBannerIconOnText.height / 2)];
      let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
      placedmastBannerIconOnText.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

      // need another centered proportioning to fix it exactly in correct position
      let W = mastBannerIconOnText.width,
         H = mastBannerIconOnText.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      mastBannerIconOnText.resize(factor, factor);
   }
   placeIconLockup1Correctly(mastBannerIconOnText, { W: 460, H: 460 });

   // delete the landing zone
   landingZoneSquare.remove();

   // mastBannerIconOnText.width = 460;
   // mastBannerIconOnText.height = 460;

   // new purple bg
   // Add new layer above Guidelines and fill white
   let myMainArtworkLayer = sourceDoc.layers.getByName('Art');
   let myMainPurpleBgLayer = sourceDoc.layers.add();
   myMainPurpleBgLayer.name = "Main_Purple_BG_layer";
   let GetMyMainPurpleBgLayer = sourceDoc.layers.getByName('Main_Purple_BG_layer');
   // mastDoc.activeLayer = GetMyMainPurpleBgLayer;
   // mastDoc.activeLayer.hasSelectedArtwork = true;
   let mainRect = GetMyMainPurpleBgLayer.pathItems.rectangle(
      -784,
      0,
      1024,
      512);
   let setMainVioletBgColor = new RGBColor();
   setMainVioletBgColor.red = 72;
   setMainVioletBgColor.green = 8;
   setMainVioletBgColor.blue = 111;
   mainRect.filled = true;
   mainRect.fillColor = setMainVioletBgColor;
   /*@ts-ignore*/
   GetMyMainPurpleBgLayer.move(myMainArtworkLayer, ElementPlacement.PLACEATEND);

   // let rectRef = sourceDoc.pathItems.rectangle(-850, -800, 400, 300);
   // let setTextBoxBgColor = new RGBColor();
   // setTextBoxBgColor.red = 141;
   // setTextBoxBgColor.green = 141;
   // setTextBoxBgColor.blue = 141;
   // rectRef.filled = true;
   // rectRef.fillColor = setTextBoxBgColor;

   // svg wtw logo for new purple lockup

   let imagePlacedItem = myMainArtworkLayer.placedItems.add();
   let svgFile = File(`${sourceDoc.path}/../images/wtw_logo.ai`);
   imagePlacedItem.file = svgFile;
   imagePlacedItem.top = -1188;
   imagePlacedItem.left = 62;
   /*@ts-ignore*/
   // svgFile.embed();



   let textRef = sourceDoc.textFrames.add();

   //use the areaText method to create the text frame
   var pathRef = sourceDoc.pathItems.rectangle(-850, -800, 480, 400);
   /*@ts-ignore*/
   textRef = sourceDoc.textFrames.areaText(pathRef);

   textRef.contents = appNameExpressive;
   textRef.textRange.characterAttributes.size = 62;

   textRef.textRange.paragraphAttributes.hyphenation = false;
   // textRef.textRange.characterAttributes.horizontalScale = 2299;
   textRef.textRange.characterAttributes.fillColor = colors[whiteIndex][0];
   CSTasks.setFont(textRef, desiredFont);

   //create an outline of the text
   let textGroup = textRef.createOutline();

   //horizontally align the left edge of the text to be 96px to the right of the edge
   let rightEdge = 64;
   let hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
   textGroup.translate(-hOffset[0], 0);

   /*@ts-ignore*/
   let mast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);

   //resize the artboard to be only a little wider than the text
   let leftMargin = mast.position[0] - sourceDoc.artboards[3].artboardRect[0];
   let newWidth =
      textGroup.position[0] +
      textGroup.width -
      sourceDoc.artboards[3].artboardRect[0] +
      leftMargin;
   let resizedRect = CSTasks.newRect(
      sourceDoc.artboards[3].artboardRect[0],
      -sourceDoc.artboards[3].artboardRect[1],
      1024,
      512
   );
   sourceDoc.artboards[3].artboardRect = resizedRect;


   /******************
   Set up purple artboard 4 in main file
   ******************/

   //if there are 3 artboards, create the new fourth lockup artboard

   // creat 00x400 artboard in file
   let FourthMainArtboardFirstRect = sourceDoc.artboards[1].artboardRect;
   sourceDoc.artboards.add(
      // this fires but then gets replaced further down
      CSTasks.newRect(FourthMainArtboardFirstRect[1], FourthMainArtboardFirstRect[2] + 772, 800, 400)
   );

   //select the contents on artboard 1
   let selFourthBanner = CSTasks.selectContentsOnArtboard(sourceDoc, 1);

   // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
   app.executeMenuCommand('Colors9');

   if (selFourthBanner.length == 0) {
      //if nothing is in the artboard
      alert("Please try again with artwork on the main second 256x256 artboard.");
      return;
   }

   /********************************
   Add elements to new fourth artboard with lockup
   *********************************/

   //place icon on lockup
   /*@ts-ignore*/
   let fourthBannerMast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
   let fourthBannerMastPos = [
      sourceDoc.artboards[4].artboardRect[0] + iconOffset[0],
      sourceDoc.artboards[4].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(fourthBannerMast, fourthBannerMastPos);

   /********************************
   Custom function to create a landing square to place the icon correctly
   Some icons have width or height less than 256 so it needed special centering geometrically
   you can see the landing zone square by changing fill to true and uncommenting color
   *********************************/

   // create a landing zone square to place icon inside
   //moved it outside the function itself so we can delete it after so it doesn't get exported
   let getArtLayer2 = sourceDoc.layers.getByName('Art');
   let landingZoneSquare2 = getArtLayer2.pathItems.rectangle(
      -1472,
      444,
      360,
      360);

   function placeIconLockup1Correctly2(fourthBannerMast, maxSize) {
      // let setLandingZoneSquareColor = new RGBColor();
      // setLandingZoneSquareColor.red = 121;
      // setLandingZoneSquareColor.green = 128;
      // setLandingZoneSquareColor.blue = 131;
      // landingZoneSquare2.fillColor = setLandingZoneSquareColor;
      landingZoneSquare2.name = "LandingZone2"
      landingZoneSquare2.filled = false;
      /*@ts-ignore*/
      landingZoneSquare2.move(getArtLayer2, ElementPlacement.PLACEATEND);

      // start moving expressive icon into our new square landing zone
      let placedfourthBannerMast = fourthBannerMast;
      let landingZone = sourceDoc.pathItems.getByName("LandingZone2");
      let preferredWidth = (360);
      let preferredHeight = (360);
      // do the width
      let widthRatio = (preferredWidth / placedfourthBannerMast.width) * 100;
      if (placedfourthBannerMast.width != preferredWidth) {
         placedfourthBannerMast.resize(widthRatio, widthRatio);
      }
      // now do the height
      let heightRatio = (preferredHeight / placedfourthBannerMast.height) * 100;
      if (placedfourthBannerMast.height != preferredHeight) {
         placedfourthBannerMast.resize(heightRatio, heightRatio);
      }
      // now let's center the art on the landing zone
      let centerArt = [placedfourthBannerMast.left + (placedfourthBannerMast.width / 2), placedfourthBannerMast.top + (placedfourthBannerMast.height / 2)];
      let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
      placedfourthBannerMast.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

      // need another centered proportioning to fix it exactly in correct position
      let W = fourthBannerMast.width,
         H = fourthBannerMast.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      fourthBannerMast.resize(factor, factor);
   }
   placeIconLockup1Correctly2(fourthBannerMast, { W: 360, H: 360 });

   // delete the landing zone
   landingZoneSquare2.remove();

   // fourthBannerMast.width = 360;
   // fourthBannerMast.height = 360;

   // new purple bg
   // Add new layer above Guidelines and fill white
   let secondMainArtworkLayer = sourceDoc.layers.getByName('Art');
   let secondMainPurpleBgLayer = sourceDoc.layers.add();
   secondMainPurpleBgLayer.name = "Main_Purple_BG_layer_two";
   let getsecondMainPurpleBgLayer = sourceDoc.layers.getByName('Main_Purple_BG_layer_two');
   let seondMainRect = getsecondMainPurpleBgLayer.pathItems.rectangle(
      -1428,
      0,
      800,
      400);
   let secondMainVioletBgColor = new RGBColor();
   secondMainVioletBgColor.red = 72;
   secondMainVioletBgColor.green = 8;
   secondMainVioletBgColor.blue = 111;
   seondMainRect.filled = true;
   seondMainRect.fillColor = secondMainVioletBgColor;
   /*@ts-ignore*/
   getsecondMainPurpleBgLayer.move(secondMainArtworkLayer, ElementPlacement.PLACEATEND);

   /*@ts-ignore*/
   // svgFile.embed();
   let secondResizedRect = CSTasks.newRect(
      sourceDoc.artboards[4].artboardRect[0],
      -sourceDoc.artboards[4].artboardRect[1],
      800,
      400
   );
   sourceDoc.artboards[4].artboardRect = secondResizedRect;







   /******************
     Set up purple artboard 5 in main file
     ******************/

   //if there are 3 artboards, create the new fourth lockup artboard

   // create 800x500 artboard in file
   let FifthMainArtboardFirstRect = sourceDoc.artboards[1].artboardRect;
   sourceDoc.artboards.add(
      // this fires but then gets replaced further down
      CSTasks.newRect(FifthMainArtboardFirstRect[1], FifthMainArtboardFirstRect[2] + 1316, 800, 500)
   );

   //select the contents on artboard 1
   let selFifthBanner = CSTasks.selectContentsOnArtboard(sourceDoc, 1);

   // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
   app.executeMenuCommand('Colors9');

   if (selFifthBanner.length == 0) {
      //if nothing is in the artboard
      alert("Please try again with artwork on the main second 256x256 artboard.");
      return;
   }

   /********************************
   Add elements to new fifth artboard with lockup
   *********************************/

   //place icon on lockup
   /*@ts-ignore*/
   let fifthBannerMast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
   let fifthBannerMastPos = [
      sourceDoc.artboards[5].artboardRect[0] + iconOffset[0],
      sourceDoc.artboards[5].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(fifthBannerMast, fifthBannerMastPos);

   /********************************
   Custom function to create a landing square to place the icon correctly
   Some icons have width or height less than 256 so it needed special centering geometrically
   you can see the landing zone square by changing fill to true and uncommenting color
   *********************************/

   // create a landing zone square to place icon inside
   //moved it outside the function itself so we can delete it after so it doesn't get exported
   let getArtLayer5 = sourceDoc.layers.getByName('Art');
   let landingZoneSquare5 = getArtLayer5.pathItems.rectangle(
      -2024,
      352,
      456,
      456);

   function placeIconLockup1Correctly5(fifthBannerMast, maxSize) {
      // let setLandingZoneSquareColor = new RGBColor();
      // setLandingZoneSquareColor.red = 121;
      // setLandingZoneSquareColor.green = 128;
      // setLandingZoneSquareColor.blue = 131;
      // landingZoneSquare5.fillColor = setLandingZoneSquareColor;
      landingZoneSquare5.name = "LandingZone2"
      landingZoneSquare5.filled = false;
      /*@ts-ignore*/
      landingZoneSquare5.move(getArtLayer5, ElementPlacement.PLACEATEND);

      // start moving expressive icon into our new square landing zone
      let placedfifthBannerMast = fifthBannerMast;
      let landingZone = sourceDoc.pathItems.getByName("LandingZone2");
      let preferredWidth = (456);
      let preferredHeight = (456);
      // do the width
      let widthRatio = (preferredWidth / placedfifthBannerMast.width) * 100;
      if (placedfifthBannerMast.width != preferredWidth) {
         placedfifthBannerMast.resize(widthRatio, widthRatio);
      }
      // now do the height
      let heightRatio = (preferredHeight / placedfifthBannerMast.height) * 100;
      if (placedfifthBannerMast.height != preferredHeight) {
         placedfifthBannerMast.resize(heightRatio, heightRatio);
      }
      // now let's center the art on the landing zone
      let centerArt = [placedfifthBannerMast.left + (placedfifthBannerMast.width / 2), placedfifthBannerMast.top + (placedfifthBannerMast.height / 2)];
      let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
      placedfifthBannerMast.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

      // need another centered proportioning to fix it exactly in correct position
      let W = fifthBannerMast.width,
         H = fifthBannerMast.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      fifthBannerMast.resize(factor, factor);
   }
   placeIconLockup1Correctly5(fifthBannerMast, { W: 456, H: 456 });

   // delete the landing zone
   landingZoneSquare5.remove();

   // fifthBannerMast.width = 456;
   // fifthBannerMast.height = 456;

   // new purple bg
   // Add new layer above Guidelines and fill white
   let fifthMainArtworkLayer = sourceDoc.layers.getByName('Art');
   let fifthMainPurpleBgLayer = sourceDoc.layers.add();
   fifthMainPurpleBgLayer.name = "Main_Purple_BG_layer_two";
   let getfifthMainPurpleBgLayer = sourceDoc.layers.getByName('Main_Purple_BG_layer_two');
   let fifthMainRect = getfifthMainPurpleBgLayer.pathItems.rectangle(
      -1972,
      0,
      800,
      500);
   let fifthMainVioletBgColor = new RGBColor();
   fifthMainVioletBgColor.red = 72;
   fifthMainVioletBgColor.green = 8;
   fifthMainVioletBgColor.blue = 111;
   fifthMainRect.filled = true;
   fifthMainRect.fillColor = fifthMainVioletBgColor;
   /*@ts-ignore*/
   getfifthMainPurpleBgLayer.move(fifthMainArtworkLayer, ElementPlacement.PLACEATEND);

   /*@ts-ignore*/
   // svgFile.embed();
   let fifthResizedRect = CSTasks.newRect(
      sourceDoc.artboards[5].artboardRect[0],
      -sourceDoc.artboards[5].artboardRect[1],
      800,
      500
   );
   sourceDoc.artboards[5].artboardRect = fifthResizedRect;




   /*********************************************************************
   Export an SVG on a white background
   **********************************************************************/
   let rgbDocOnFFF = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      1,
      DocumentColorSpace.RGB
   );

   rgbDocOnFFF.swatches.removeAll();
   let rgbGroupOnFFF = iconGroup.duplicate(
      rgbDocOnFFF.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATBEGINNING
   );
   let rgbLocOnFFF = [
      rgbDocOnFFF.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDocOnFFF.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroupOnFFF, rgbLocOnFFF);

   CSTasks.ungroupOnce(rgbGroupOnFFF);
   // Add a white square bg here to save svg on white
   let getArtLayerOnFFF = rgbDocOnFFF.layers.getByName('Layer 1');
   let myMainPurpleBgLayerOnFFF = rgbDocOnFFF.layers.add();
   myMainPurpleBgLayerOnFFF.name = "Main_Purple_BG_layer";
   let GetMyMainPurpleBgLayerOnFFF = rgbDocOnFFF.layers.getByName('Main_Purple_BG_layer');
   let landingZoneSquareOnFFF = GetMyMainPurpleBgLayerOnFFF.pathItems.rectangle(
      0,
      400,
      256,
      256);
   let setLandingZoneSquareOnFFFColor = new RGBColor();
   setLandingZoneSquareOnFFFColor.red = 255;
   setLandingZoneSquareOnFFFColor.green = 255;
   setLandingZoneSquareOnFFFColor.blue = 255;
   landingZoneSquareOnFFF.fillColor = setLandingZoneSquareOnFFFColor;
   landingZoneSquareOnFFF.name = "bgSquareForSvgOnFF"
   landingZoneSquareOnFFF.filled = true;
   landingZoneSquareOnFFF.stroked = false;

   /*@ts-ignore*/
   GetMyMainPurpleBgLayerOnFFF.move(getArtLayerOnFFF, ElementPlacement.PLACEATEND);
   //save a master SVG 
   // let svgMasterCoreStartWidthOnFFF =
   //    rgbDocOnFFF.artboards[0].artboardRect[2] - rgbDocOnFFF.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${onWhiteName}.svg`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}`) + filename);
   //    CSTasks.scaleAndExportSVG(rgbDocOnFFF, destFile, svgMasterCoreStartWidthOnFFF, exportSizes[2]);
   // }

   //close and clean up
   rgbDocOnFFF.close(SaveOptions.DONOTSAVECHANGES);
   rgbDocOnFFF = null;


   /*********************************************************************
   RGB export (EPS, PNGs at multiple sizes, inactive EPS and inverse EPS)
   **********************************************************************/
   let rgbDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      1,
      DocumentColorSpace.RGB
   );

   rgbDoc.swatches.removeAll();

   let rgbGroup = iconGroup.duplicate(
      rgbDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let rgbLoc = [
      rgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroup, rgbLoc);

   CSTasks.ungroupOnce(rgbGroup);

   //save a 1024 JPG
   let jpegStartWidth1024 =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(rgbDoc, destFile, jpegStartWidth1024, exportSizes[0]);
   }

   //save a master PNG
   let masterStartWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}`) + filename);
      CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[0]);
   }

   //save a master SVG
   let svgMasterCoreStartWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}`) + filename);
      CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[0]);
   }

   // png 1024
   let startWidth1024 =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth1024, exportSizes[0]);
   }
   // png 512
   // let startWidth512 =
   //    rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${exportSizes[1]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth512, exportSizes[1]);
   // }

   // non transparent 1024 png export
   // let startWidthonFFF1024 =
   //    rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${onWhiteName}_${exportSizes[0]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportNonTransparentPNG(rgbDoc, destFile, startWidthonFFF1024, exportSizes[0]);
   // }
   // non transparent 512 png export
   // let startWidthonFFF512 =
   //    rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${onWhiteName}_${exportSizes[1]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportNonTransparentPNG(rgbDoc, destFile, startWidthonFFF512, exportSizes[1]);
   // }

   //save all sizes of SVG into the export folder
   // we dont need to loop svg, they are scaleable
   let svgCoreStartWidth =
      rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[1];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
      CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgCoreStartWidth, exportSizes[0]);
   }

   //save EPS into the export folder
   let filename = `/${iconFilename}_${expressiveName}_${rgbName}.eps`;
   let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + filename);
   let rgbSaveOpts = new EPSSaveOptions();
   /*@ts-ignore*/
   rgbSaveOpts.cmykPostScript = false;
   rgbDoc.saveAs(destFile, rgbSaveOpts);

   //index the RGB colors for conversion to CMYK. An inelegant location.
   let colorIndex = CSTasks.indexRGBColors(rgbDoc.pathItems, colors);
   //convert violet to white and save as EPS
   CSTasks.convertColorRGB(
      rgbDoc.pathItems,
      colors[violetIndex][0],
      colors[whiteIndex][0]
   );

   // let inverseFilename = `/${iconFilename}_${expressiveName}_${inverseName}_${rgbName}.eps`;
   // let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + inverseFilename);
   // rgbDoc.saveAs(inverseFile, rgbSaveOpts);

   //save inverse 1024 file in all the PNG sizes
   // let startWidthonFFFInversed1024 =
   //    rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${inverseName}_${rgbName}_${exportSizes[0]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidthonFFFInversed1024, exportSizes[0]);
   // }

   //save inverse 512 file in all the PNG sizes
   // let startWidthonFFFInversed512 =
   //    rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${inverseName}_${rgbName}_${exportSizes[1]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidthonFFFInversed512, exportSizes[1]);
   // }

   //save inverse file in all the SVG sizes
   // let startWidth =
   //    rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${inverseName}_${rgbName}_${exportSizes[2]}.svg`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
   //    CSTasks.scaleAndExportSVG(rgbDoc, destFile, startWidth, exportSizes[2]);
   // }

   //convert to inactive color (WTW Icon grey at 100% opacity) and save as EPS
   CSTasks.convertAll(rgbDoc.pathItems, colors[grayIndex][0], 100);

   // let inactiveFilename = `/${iconFilename}_${expressiveName}_${inactiveName}_${rgbName}.eps`;
   // let inactiveFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + inactiveFilename);
   // rgbDoc.saveAs(inactiveFile, rgbSaveOpts);

   // save inactive png 1024
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${inactiveName}_${rgbName}_${exportSizes[0]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth, exportSizes[0]);
   // }
   // save inactive png 512
   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${inactiveName}_${rgbName}_${exportSizes[1]}.png`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
   //    CSTasks.scaleAndExportPNG(rgbDoc, destFile, startWidth, exportSizes[1]);
   // }

   // for (let i = 0; i < exportSizes.length; i++) {
   //    let filename = `/${iconFilename}_${expressiveName}_${inactiveName}_${rgbName}_${exportSizes[2]}.svg`;
   //    let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
   //    CSTasks.scaleAndExportSVG(rgbDoc, destFile, startWidth, exportSizes[2]);
   // }

   //close and clean up
   rgbDoc.close(SaveOptions.DONOTSAVECHANGES);
   rgbDoc = null;


   /*********************************************************************
   RGB cropped export (JPG, PNGs at 16 and 24 sizes), squares, cropped to artwork
   **********************************************************************/
   let rgbDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      1,
      DocumentColorSpace.RGB
   );

   rgbDocCroppedVersion.swatches.removeAll();

   let rgbGroupCropped = iconGroup.duplicate(
      rgbDocCroppedVersion.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let rgbLocCropped = [
      rgbDocCroppedVersion.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDocCroppedVersion.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroupCropped, rgbLocCropped);

   // remove padding here befor exporting
   function resizeCroppedExpressiveIcon(rgbGroupCropped, maxSize) {

      let W = rgbGroupCropped.width,
         H = rgbGroupCropped.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      rgbGroupCropped.resize(factor, factor);
   }
   resizeCroppedExpressiveIcon(rgbGroupCropped, { W: 256, H: 256 });

   CSTasks.ungroupOnce(rgbGroupCropped);

   // Save a cropped SVG 
   // let svgMasterCoreStartWidthCroppedSvg =
   //    rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   // let filenameCroppedSvg = `/${iconFilename}_${expressiveName}_${exportSizes[8]}_${croppedName}.svg`;
   // let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filenameCroppedSvg);
   // CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[8]);

   //convert color to white
   CSTasks.convertColorRGB(
      rgbDocCroppedVersion.pathItems,
      colors[violetIndex][0],
      colors[whiteIndex][0]
   );

   // no point making an inversed jpg, it is white on white, so futile

   // Save a cropped SVG
   // let svgMasterCoreStartWidthCroppedSvgInversed =
   //    rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   // let filenameCroppedSvgInversed = `/${iconFilename}_${expressiveName}_${exportSizes[8]}_${inverseName}_${croppedName}.svg`;
   // let destFileCroppedSvgInversed = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filenameCroppedSvgInversed);
   // CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvgInversed, svgMasterCoreStartWidthCroppedSvgInversed, exportSizes[8]);

   //convert to inactive color
   CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], 100);

   // Save a cropped SVG
   // let svgMasterCoreStartWidthCroppedSvgInactive =
   //    rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
   // let filenameCroppedSvgInactive = `/${iconFilename}_${expressiveName}_${exportSizes[8]}_${inactiveName}_${croppedName}.svg`;
   // let destFileCroppedSvgInactive = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filenameCroppedSvgInactive);
   // CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvgInactive, svgMasterCoreStartWidthCroppedSvgInactive, exportSizes[8]);

   //close and clean up
   rgbDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
   rgbDocCroppedVersion = null;


   /****************
   CMYK export (EPS)
   ****************/

   //open a new document with CMYK colorspace, and duplicate the icon to the new document
   let cmykDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      0,
      DocumentColorSpace.CMYK
   );
   cmykDoc.swatches.removeAll();

   //need to reverse the order of copying the group to get the right color ordering
   let cmykGroup = iconGroup.duplicate(
      cmykDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATBEGINNING
   );
   let cmykLoc = [
      cmykDoc.artboards[0].artboardRect[0] + iconOffset[0],
      cmykDoc.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(cmykGroup, cmykLoc);
   CSTasks.ungroupOnce(cmykGroup);

   CSTasks.convertToCMYK(cmykDoc, cmykDoc.pathItems, colors, colorIndex);

   //save a 1024 JPG CMYK
   let jpegStartWidth1024CMYK =
      cmykDoc.artboards[0].artboardRect[2] - cmykDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${cmykName}.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(cmykDoc, destFile, jpegStartWidth1024CMYK, exportSizes[0]);
   }

   // png 1024 CMYK
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${cmykName}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(cmykDoc, destFile, jpegStartWidth1024CMYK, exportSizes[0]);
   }
   // svg CMYK
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${cmykName}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
      CSTasks.scaleAndExportSVG(cmykDoc, destFile, jpegStartWidth1024CMYK, exportSizes[0]);
   }

   //save EPS into the export folder CMYKß
   let cmykFilename = `/${iconFilename}_${expressiveName}_${cmykName}.eps`;
   let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + cmykFilename);
   let cmykSaveOpts = new EPSSaveOptions();
   cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);

   //convert violet to white and save as EPS
   CSTasks.convertColorCMYK(
      cmykDoc.pathItems,
      colors[violetIndex][1],
      colors[whiteIndex][1]
   );

   // let cmykInverseFilename = `/${iconFilename}_${expressiveName}_${inverseName}_${cmykName}.eps`;
   // let cmykInverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + cmykInverseFilename);
   // cmykDoc.saveAs(cmykInverseFile, rgbSaveOpts);

   //close and clean up
   cmykDoc.close(SaveOptions.DONOTSAVECHANGES);
   cmykDoc = null;




   /********************
   Purple Lockup with text export 
   ********************/
   //open a new doc and copy and position the icon and the lockup text
   // duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
   let mastDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      3,
      DocumentColorSpace.RGB
   );
   mastDoc.swatches.removeAll();

   let mastGroup = iconGroup.duplicate(
      mastDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   // new icon width in rebrand
   // mastGroup.width = 460;
   // mastGroup.height = 460;

   // new icon position
   let mastLoc = [
      mastDoc.artboards[0].artboardRect[0],
      mastDoc.artboards[0].artboardRect[1],
   ];
   CSTasks.translateObjectTo(mastGroup, mastLoc);

   /********************************
   Custom function to create a landing square to place the icon correctly
   Some icons have width or height less than 256 so it needed special centering geometrically
   you can see the landing zone square by changing fill to true and uncommenting color
   *********************************/

   // create a landing zone square to place icon inside
   //moved it outside the function itself so we can delete it after so it doesn't get exported
   let getArtLayer3 = mastDoc.layers.getByName('Layer 1');
   let landingZoneSquare3 = getArtLayer3.pathItems.rectangle(
      -845,
      571,
      460,
      460);

   function placeIconLockup1Correctly3(mastGroup, maxSize) {
      // let setLandingZoneSquareColor = new RGBColor();
      // setLandingZoneSquareColor.red = 121;
      // setLandingZoneSquareColor.green = 128;
      // setLandingZoneSquareColor.blue = 131;
      // landingZoneSquare3.fillColor = setLandingZoneSquareColor;
      landingZoneSquare3.name = "LandingZone3"
      landingZoneSquare3.filled = false;
      /*@ts-ignore*/
      landingZoneSquare3.move(getArtLayer3, ElementPlacement.PLACEATEND);

      // start moving expressive icon into our new square landing zone
      let placedmastGroup = mastGroup;
      let landingZone = mastDoc.pathItems.getByName("LandingZone3");
      let preferredWidth = (460);
      let preferredHeight = (460);
      // do the width
      let widthRatio = (preferredWidth / placedmastGroup.width) * 100;
      if (placedmastGroup.width != preferredWidth) {
         placedmastGroup.resize(widthRatio, widthRatio);
      }
      // now do the height
      let heightRatio = (preferredHeight / placedmastGroup.height) * 100;
      if (placedmastGroup.height != preferredHeight) {
         placedmastGroup.resize(heightRatio, heightRatio);
      }
      // now let's center the art on the landing zone
      let centerArt = [placedmastGroup.left + (placedmastGroup.width / 2), placedmastGroup.top + (placedmastGroup.height / 2)];
      let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
      placedmastGroup.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

      // need another centered proportioning to fix it exactly in correct position
      let W = mastGroup.width,
         H = mastGroup.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      mastGroup.resize(factor, factor);
   }
   placeIconLockup1Correctly3(mastGroup, { W: 460, H: 460 });

   // delete the landing zone
   landingZoneSquare3.remove();

   CSTasks.ungroupOnce(mastGroup);

   let mastText = textGroup.duplicate(
      mastDoc.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   // text position
   let mastTextLoc = [
      mastDoc.artboards[0].artboardRect[0] + 63,
      mastDoc.artboards[0].artboardRect[1] - 64,
   ];
   CSTasks.translateObjectTo(mastText, mastTextLoc);

   // add new style purple banner elements
   let myMainArtworkLayerMastDoc = mastDoc.layers.getByName('Layer 1');
   let myMainPurpleBgLayerMastDoc = mastDoc.layers.add();
   myMainPurpleBgLayerMastDoc.name = "Main_Purple_BG_layer";
   let GetMyMainPurpleBgLayerMastDoc = mastDoc.layers.getByName('Main_Purple_BG_layer');
   let mainRectMastDoc = GetMyMainPurpleBgLayerMastDoc.pathItems.rectangle(
      -784,
      0,
      1024,
      512);
   let setMainVioletBgColorMastDoc = new RGBColor();
   setMainVioletBgColorMastDoc.red = 72;
   setMainVioletBgColorMastDoc.green = 8;
   setMainVioletBgColorMastDoc.blue = 111;
   mainRectMastDoc.filled = true;
   mainRectMastDoc.fillColor = setMainVioletBgColorMastDoc;
   /*@ts-ignore*/
   GetMyMainPurpleBgLayerMastDoc.move(myMainArtworkLayerMastDoc, ElementPlacement.PLACEATEND);

   // svg wtw logo for new purple lockup
   let imagePlacedItemMastDoc = myMainArtworkLayerMastDoc.placedItems.add();
   let svgFileMastDoc = File(`${sourceDoc.path}/../images/wtw_logo.ai`);
   imagePlacedItemMastDoc.file = svgFileMastDoc;
   imagePlacedItemMastDoc.top = -1189;
   imagePlacedItemMastDoc.left = 62;

   // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
   let myCroppingLayerMastDoc = mastDoc.layers.add();
   myCroppingLayerMastDoc.name = "crop";
   let GetMyCroppingLayerMastDoc = mastDoc.layers.getByName('crop');
   mastDoc.activeLayer = GetMyCroppingLayerMastDoc;
   mastDoc.activeLayer.hasSelectedArtwork = true;
   // insert clipping rect here
   let mainClipRectMastDoc = GetMyCroppingLayerMastDoc.pathItems.rectangle(
      -784,
      0,
      1024,
      512);
   let setClipBgColorMastDoc = new RGBColor();
   setClipBgColorMastDoc.red = 0;
   setClipBgColorMastDoc.green = 255;
   setClipBgColorMastDoc.blue = 255;
   mainClipRectMastDoc.filled = true;
   mainClipRectMastDoc.fillColor = setClipBgColorMastDoc;
   // select all for clipping here
   sourceDoc.selectObjectsOnActiveArtboard();
   // clip!
   app.executeMenuCommand('makeMask');

   //save a banner JPG
   let jpegStartWidth =
      mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${tenByFive}.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(mastDoc, destFile, jpegStartWidth, exportSizes[0]);
   }
   //save a banner PNG
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${tenByFive}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(mastDoc, destFile, jpegStartWidth, 1024);
   }
   //save a banner SVG 
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${tenByFive}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
      CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
   }

   //save RGB EPS into the export folder
   let mastFilename = `/${iconFilename}_${expressiveName}_${rgbName}_${tenByFive}.eps`;
   let mastDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + mastFilename);
   let mastSaveOpts = new EPSSaveOptions();
   /*@ts-ignore*/
   mastSaveOpts.cmykPostScript = false;
   /*@ts-ignore*/
   mastSaveOpts.embedLinkedFiles = true;
   mastDoc.saveAs(mastDestFile, mastSaveOpts);

   //close and clean up
   mastDoc.close(SaveOptions.DONOTSAVECHANGES);
   mastDoc = null;


   /********************
     Purple Lockup 800x400 with no text export
     ********************/
   //open a new doc and copy and position the icon
   // duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
   let mastDocNoText = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      4,
      DocumentColorSpace.RGB
   );
   mastDocNoText.swatches.removeAll();

   let mastGroupNoText = iconGroup.duplicate(
      mastDocNoText.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   // new icon width in rebrand
   // mastGroupNoText.width = 360;
   // mastGroupNoText.height = 360;

   // new icon position
   let mastLocNoText = [
      mastDocNoText.artboards[0].artboardRect[0],
      mastDocNoText.artboards[0].artboardRect[1],
   ];
   CSTasks.translateObjectTo(mastGroupNoText, mastLocNoText);


   /********************************
     Custom function to create a landing square to place the icon correctly
     Some icons have width or height less than 256 so it needed special centering geometrically
     you can see the landing zone square by changing fill to true and uncommenting color
     *********************************/

   // create a landing zone square to place icon inside
   //moved it outside the function itself so we can delete it after so it doesn't get exported
   let getArtLayerIn4thArtboard = mastDocNoText.layers.getByName('Layer 1');
   let landingZoneSquareInFourthArtboard = getArtLayerIn4thArtboard.pathItems.rectangle(
      -1471,
      444,
      360,
      360);

   function placeIconLockupCorrectlyIn4thDoc(mastGroupNoText, maxSize) {
      // let setLandingZoneSquareColor = new RGBColor();
      // setLandingZoneSquareColor.red = 121;
      // setLandingZoneSquareColor.green = 128;
      // setLandingZoneSquareColor.blue = 131;
      // landingZoneSquareInFourthArtboard.fillColor = setLandingZoneSquareColor;
      landingZoneSquareInFourthArtboard.name = "LandingZone4"
      landingZoneSquareInFourthArtboard.filled = false;
      /*@ts-ignore*/
      landingZoneSquareInFourthArtboard.move(getArtLayerIn4thArtboard, ElementPlacement.PLACEATEND);

      // start moving expressive icon into our new square landing zone
      let placedmastGroup = mastGroupNoText;
      let landingZone = mastDocNoText.pathItems.getByName("LandingZone4");
      let preferredWidth = (360);
      let preferredHeight = (360);
      // do the width
      let widthRatio = (preferredWidth / placedmastGroup.width) * 100;
      if (placedmastGroup.width != preferredWidth) {
         placedmastGroup.resize(widthRatio, widthRatio);
      }
      // now do the height
      let heightRatio = (preferredHeight / placedmastGroup.height) * 100;
      if (placedmastGroup.height != preferredHeight) {
         placedmastGroup.resize(heightRatio, heightRatio);
      }
      // now let's center the art on the landing zone
      let centerArt = [placedmastGroup.left + (placedmastGroup.width / 2), placedmastGroup.top + (placedmastGroup.height / 2)];
      let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
      placedmastGroup.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

      // need another centered proportioning to fix it exactly in correct position
      let W = mastGroupNoText.width,
         H = mastGroupNoText.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      mastGroupNoText.resize(factor, factor);
   }
   placeIconLockupCorrectlyIn4thDoc(mastGroupNoText, { W: 360, H: 360 });

   // delete the landing zone
   landingZoneSquareInFourthArtboard.remove();

   CSTasks.ungroupOnce(mastGroupNoText);

   // add new style purple banner 4 elements
   let myMainArtworkLayerMastDocNoText = mastDocNoText.layers.getByName('Layer 1');
   let myMainPurpleBgLayerMastDocNoText = mastDocNoText.layers.add();
   myMainPurpleBgLayerMastDocNoText.name = "Main_Purple_BG_layer";
   let GetMyMainPurpleBgLayerMastDocNoText = mastDocNoText.layers.getByName('Main_Purple_BG_layer');
   let mainRectMastDocNoText = GetMyMainPurpleBgLayerMastDocNoText.pathItems.rectangle(
      -1428,
      0,
      800,
      400);
   let setMainVioletBgColorMastDocNoText = new RGBColor();
   setMainVioletBgColorMastDocNoText.red = 72;
   setMainVioletBgColorMastDocNoText.green = 8;
   setMainVioletBgColorMastDocNoText.blue = 111;
   mainRectMastDocNoText.filled = true;
   mainRectMastDocNoText.fillColor = setMainVioletBgColorMastDocNoText;
   /*@ts-ignore*/
   GetMyMainPurpleBgLayerMastDocNoText.move(myMainArtworkLayerMastDocNoText, ElementPlacement.PLACEATEND);

   // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
   let myCroppingLayerMastDocNoText = mastDocNoText.layers.add();
   myCroppingLayerMastDocNoText.name = "crop";
   let GetMyCroppingLayerMastDocNoText = mastDocNoText.layers.getByName('crop');
   mastDocNoText.activeLayer = GetMyCroppingLayerMastDocNoText;
   mastDocNoText.activeLayer.hasSelectedArtwork = true;
   // insert clipping rect here
   let mainClipRectMastDocNoText = GetMyCroppingLayerMastDocNoText.pathItems.rectangle(
      -1428,
      0,
      800,
      400);
   let setClipBgColorMastDocNoText = new RGBColor();
   setClipBgColorMastDocNoText.red = 0;
   setClipBgColorMastDocNoText.green = 255;
   setClipBgColorMastDocNoText.blue = 255;
   mainClipRectMastDocNoText.filled = true;
   mainClipRectMastDocNoText.fillColor = setClipBgColorMastDocNoText;
   // select all for clipping here
   mastDocNoText.selectObjectsOnActiveArtboard();
   // clip!
   app.executeMenuCommand('makeMask');

   //save a banner JPG
   let jpegStartWidth2 =
      mastDocNoText.artboards[0].artboardRect[2] - mastDocNoText.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${eightByFour}.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(mastDocNoText, destFile, jpegStartWidth2, 800);
   }

   //save a banner PNG
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${eightByFour}.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(mastDocNoText, destFile, jpegStartWidth2, 800);
   }
   //save a banner SVG
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${rgbName}_${eightByFour}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
      CSTasks.scaleAndExportSVG(mastDocNoText, destFile, 400, 800);
   }
   //save RGB EPS into the export folder 
   let mastNoTextFilename = `/${iconFilename}_${expressiveName}_${rgbName}_${eightByFour}.eps`;
   let mastNoTextDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + mastNoTextFilename);
   let mastNoTextSaveOpts = new EPSSaveOptions();
   /*@ts-ignore*/
   mastNoTextSaveOpts.cmykPostScript = false;
   /*@ts-ignore*/
   mastNoTextSaveOpts.embedLinkedFiles = true;
   mastDocNoText.saveAs(mastNoTextDestFile, mastNoTextSaveOpts);

   //close and clean up
   mastDocNoText.close(SaveOptions.DONOTSAVECHANGES);
   mastDocNoText = null;


   /********************
  Purple fifth Lockup with no text export at 800x500
  ********************/
   //open a new doc and copy and position the icon
   // duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
   let mastDocNoText800x500 = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      5,
      DocumentColorSpace.RGB
   );
   mastDocNoText800x500.swatches.removeAll();

   let mastGroupNoText800x500 = iconGroup.duplicate(
      mastDocNoText800x500.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   // new icon width in rebrand
   // mastGroupNoText800x500.width = 360;
   // mastGroupNoText800x500.height = 360;

   // new icon position
   let mastLocNoText800x500 = [
      mastDocNoText800x500.artboards[0].artboardRect[0],
      mastDocNoText800x500.artboards[0].artboardRect[1],
   ];
   CSTasks.translateObjectTo(mastGroupNoText800x500, mastLocNoText800x500);


   /********************************
     Custom function to create a landing square to place the icon correctly
     Some icons have width or height less than 256 so it needed special centering geometrically
     you can see the landing zone square by changing fill to true and uncommenting color
     *********************************/

   // create a landing zone square to place icon inside
   //moved it outside the function itself so we can delete it after so it doesn't get exported
   let getArtLayerIn5thArtboard = mastDocNoText800x500.layers.getByName('Layer 1');
   let landingZoneSquareInFifthArtboard = getArtLayerIn5thArtboard.pathItems.rectangle(
      -2022,
      352,
      456,
      456);

   function placeIconLockupCorrectlyIn5thDoc(mastGroupNoText800x500, maxSize) {

      // let setLandingZoneSquareColor = new RGBColor();
      // setLandingZoneSquareColor.red = 121;
      // setLandingZoneSquareColor.green = 128;
      // setLandingZoneSquareColor.blue = 131;
      // landingZoneSquareInFifthArtboard.fillColor = setLandingZoneSquareColor;

      landingZoneSquareInFifthArtboard.name = "LandingZone4"
      landingZoneSquareInFifthArtboard.filled = false;
      /*@ts-ignore*/
      landingZoneSquareInFifthArtboard.move(getArtLayerIn5thArtboard, ElementPlacement.PLACEATEND);

      // start moving expressive icon into our new square landing zone
      let placedmastGroup = mastGroupNoText800x500;
      let landingZone = mastDocNoText800x500.pathItems.getByName("LandingZone4");
      let preferredWidth = (456);
      let preferredHeight = (456);
      // do the width
      let widthRatio = (preferredWidth / placedmastGroup.width) * 100;
      if (placedmastGroup.width != preferredWidth) {
         placedmastGroup.resize(widthRatio, widthRatio);
      }
      // now do the height
      let heightRatio = (preferredHeight / placedmastGroup.height) * 100;
      if (placedmastGroup.height != preferredHeight) {
         placedmastGroup.resize(heightRatio, heightRatio);
      }
      // now let's center the art on the landing zone
      let centerArt = [placedmastGroup.left + (placedmastGroup.width / 2), placedmastGroup.top + (placedmastGroup.height / 2)];
      let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
      placedmastGroup.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

      // need another centered proportioning to fix it exactly in correct position
      let W = mastGroupNoText800x500.width,
         H = mastGroupNoText800x500.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      mastGroupNoText800x500.resize(factor, factor);
   }
   placeIconLockupCorrectlyIn5thDoc(mastGroupNoText800x500, { W: 456, H: 456 });

   // delete the landing zone
   landingZoneSquareInFifthArtboard.remove();

   CSTasks.ungroupOnce(mastGroupNoText800x500);

   // add new style purple banner 4 elements
   let myMainArtworkLayerMastDocNoText800x500 = mastDocNoText800x500.layers.getByName('Layer 1');
   let myMainPurpleBgLayerMastDocNoText800x500 = mastDocNoText800x500.layers.add();
   myMainPurpleBgLayerMastDocNoText800x500.name = "Main_Purple_BG_layer";
   let GetMyMainPurpleBgLayerMastDocNoText800x500 = mastDocNoText800x500.layers.getByName('Main_Purple_BG_layer');
   let mainRectMastDocNoText800x500 = GetMyMainPurpleBgLayerMastDocNoText800x500.pathItems.rectangle(
      -1972,
      0,
      800,
      500);
   let setMainVioletBgColorMastDocNoText800x500 = new RGBColor();
   setMainVioletBgColorMastDocNoText800x500.red = 72;
   setMainVioletBgColorMastDocNoText800x500.green = 8;
   setMainVioletBgColorMastDocNoText800x500.blue = 111;
   mainRectMastDocNoText800x500.filled = true;
   mainRectMastDocNoText800x500.fillColor = setMainVioletBgColorMastDocNoText800x500;
   /*@ts-ignore*/
   GetMyMainPurpleBgLayerMastDocNoText800x500.move(myMainArtworkLayerMastDocNoText800x500, ElementPlacement.PLACEATEND);

   // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
   let myCroppingLayerMastDocNoText800x500 = mastDocNoText800x500.layers.add();
   myCroppingLayerMastDocNoText800x500.name = "crop";
   let GetMyCroppingLayerMastDocNoText800x500 = mastDocNoText800x500.layers.getByName('crop');
   mastDocNoText800x500.activeLayer = GetMyCroppingLayerMastDocNoText800x500;
   mastDocNoText800x500.activeLayer.hasSelectedArtwork = true;
   // insert clipping rect here
   let mainClipRectMastDocNoText800x500 = GetMyCroppingLayerMastDocNoText800x500.pathItems.rectangle(
      -1972,
      0,
      800,
      500);
   // let setClipBgColorMastDocNoText800x500 = new RGBColor();
   // setClipBgColorMastDocNoText800x500.red = 111;
   // setClipBgColorMastDocNoText800x500.green = 111;
   // setClipBgColorMastDocNoText800x500.blue = 222;
   // mainClipRectMastDocNoText800x500.filled = true;
   // mainClipRectMastDocNoText800x500.fillColor = setClipBgColorMastDocNoText800x500;
   // select all for clipping here
   mastDocNoText800x500.selectObjectsOnActiveArtboard();

   // clip!
   app.executeMenuCommand('makeMask');

   //save a banner JPG
   let jpegStartWidth800x500 =
      mastDocNoText800x500.artboards[0].artboardRect[2] - mastDocNoText800x500.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${sixteenTenName}_1x.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(mastDocNoText800x500, destFile, jpegStartWidth800x500, 800);
   }

   //save a banner PNG
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${sixteenTenName}_1x.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(mastDocNoText800x500, destFile, jpegStartWidth800x500, 800);
   }
   //save a banner SVG
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${sixteenTenName}.svg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filename);
      CSTasks.scaleAndExportSVG(mastDocNoText800x500, destFile, 500, 800);
   }
   //save RGB EPS into the export folder 
   let mastNoTextFilename800x500 = `/${iconFilename}_${expressiveName}_${sixteenTenName}.eps`;
   let mastNoTextDestFile800x500 = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${epsName}`) + mastNoTextFilename800x500);
   let mastNoTextSaveOpts800x500 = new EPSSaveOptions();

   //save a banner JPG @2x
   let jpegStartWidth800x500_2x =
      mastDocNoText800x500.artboards[0].artboardRect[2] - mastDocNoText800x500.artboards[0].artboardRect[0];
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${sixteenTenName}_2x.jpg`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${jpgName}`) + filename);
      CSTasks.scaleAndExportJPEG(mastDocNoText800x500, destFile, jpegStartWidth800x500_2x, 1600);
   }

   //save a banner PNG @2x
   for (let i = 0; i < exportSizes.length; i++) {
      let filename = `/${iconFilename}_${expressiveName}_${sixteenTenName}_2x.png`;
      let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filename);
      CSTasks.scaleAndExportPNG(mastDocNoText800x500, destFile, jpegStartWidth800x500_2x, 1600);
   }

   /*@ts-ignore*/
   mastNoTextSaveOpts800x500.cmykPostScript = false;
   /*@ts-ignore*/
   mastNoTextSaveOpts800x500.embedLinkedFiles = true;
   mastDocNoText800x500.saveAs(mastNoTextDestFile800x500, mastNoTextSaveOpts800x500);

   //close and clean up
   mastDocNoText800x500.close(SaveOptions.DONOTSAVECHANGES);
   mastDocNoText800x500 = null;



   /*********************************************************************
   RGB cropped export (JPG, PNGs at 16 and 24 sizes), squares, cropped to artwork
   **********************************************************************/
   let rgbDocCroppedVersionExpressive = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      1,
      DocumentColorSpace.RGB
   );

   rgbDocCroppedVersionExpressive.swatches.removeAll();

   let rgbGroupCroppedExpressive = iconGroup.duplicate(
      rgbDocCroppedVersionExpressive.layers[0],
      /*@ts-ignore*/
      ElementPlacement.PLACEATEND
   );
   let rgbLocCroppedExpressive = [
      rgbDocCroppedVersionExpressive.artboards[0].artboardRect[0] + iconOffset[0],
      rgbDocCroppedVersionExpressive.artboards[0].artboardRect[1] + iconOffset[1],
   ];
   CSTasks.translateObjectTo(rgbGroupCroppedExpressive, rgbLocCroppedExpressive);

   // remove padding here befor exporting
   function placeIconLockup2Correctly(rgbGroupCroppedExpressive, maxSize) {

      let W = rgbGroupCroppedExpressive.width,
         H = rgbGroupCroppedExpressive.height,
         MW = maxSize.W,
         MH = maxSize.H,
         factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
      rgbGroupCroppedExpressive.resize(factor, factor);
   }
   placeIconLockup2Correctly(rgbGroupCroppedExpressive, { W: 256, H: 256 });

   CSTasks.ungroupOnce(rgbGroupCroppedExpressive);
   // below we export croped only versions
   // // non transparent png exports
   let startWidthCropped =
      rgbDocCroppedVersionExpressive.artboards[0].artboardRect[2] - rgbDocCroppedVersionExpressive.artboards[0].artboardRect[0];
   // Save a cropped png
   let filenameCropped24PngOnFFF = `/${iconFilename}_${expressiveName}_${croppedName}.png`;
   let destFileCropped24PngOnFFF = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${pngName}`) + filenameCropped24PngOnFFF);
   CSTasks.scaleAndExportPNG(rgbDocCroppedVersionExpressive, destFileCropped24PngOnFFF, startWidthCropped, exportSizes[0]);

   // // Save a cropped SVG 
   let filenameCroppedSvg = `/${iconFilename}_${expressiveName}_${croppedName}.svg`;
   let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveName}/${svgName}`) + filenameCroppedSvg);
   CSTasks.scaleAndExportSVG(rgbDocCroppedVersionExpressive, destFileCroppedSvg, startWidthCropped, exportSizes[0]);

   //close and clean up
   rgbDocCroppedVersionExpressive.close(SaveOptions.DONOTSAVECHANGES);
   rgbDocCroppedVersionExpressive = null;




   /************
   Final cleanup
   ************/
   CSTasks.ungroupOnce(iconGroup);
   CSTasks.ungroupOnce(mast);
}

mainExpressive();

// this opens the folder where the assets are saved
var scriptsFolder = Folder(sourceDoc.path + "/");
scriptsFolder.execute();  