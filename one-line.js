//#target Illustrator 
//#region README
/************************************************
    * ** README https://github.com/Artchibald/WTW_107405_product_logo_template_script
 
    THIS IS THE ONE LINE SCRIPT

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
//
//#endregion
//alert(" \n\nThis is the one line script   \n\nThis script only works locally not on a server. \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/WTW_107405_product_logo_template_script   \n\nVideo set up tutorial available here: https://youtu.be/XXXXXXXXXX. \n\nOpen your own.ai template or the provided ones in folders called test. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Make sure you have the Graphik font installed on your CPU. \n\nYou must have the folder called images in the parent folder, this is where wtw_logo.ai is saved so it can be imported into the big purple banner and exported as assets. Otherwise you will get an error that says error = svgFile. If the svgFile is still not working, try opening it again in Illustrator and save as, this happens because your Illustrator has been updated to a newer version. \n\nIllustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease use underscores instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");
//#region GLOBAL VARS
/*********************************
VARIABLES YOU MIGHT NEED TO CHANGE
**********************************/
var sourceDoc = app.activeDocument;
var RGBColorElements = [
    [127, 53, 178],
    [191, 191, 191],
    [201, 0, 172],
    [50, 127, 239],
    [58, 220, 201],
    [255, 255, 255],
    [0, 0, 0], // Black
];
// New CMYK values dont math rgb exatcly in new branding 2022 so we stopped the exact comparison part of the script.
// Intent is different colors in print for optimum pop of colors
var CMYKColorElements = [
    [65, 91, 0, 0],
    [0, 0, 0, 25],
    [16, 96, 0, 0],
    [78, 47, 0, 0],
    [53, 0, 34, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 100], // Black
];
// Make sure you have the font below installed, ask for font from client
var desiredFont = "Graphik-Regular";
var exportSizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16]; //sizes to export
var violetIndex = 0; //these are for converting to inverse and inactive versions
var grayIndex = 1;
var whiteIndex = 5;
var blackIndex = 6;
//loop default 
var i;
// folder and naming creations
var sourceDocName = sourceDoc.name.slice(0, -3);
var iconFilename = sourceDoc.name.split(".")[0];
var name = sourceDoc.name.split(".")[0];
var destFolder = Folder(sourceDoc.path + "/" + name);
var wtwName = "wtw";
// asset types names
var primaryName = "pri";
var alternateName = "alt";
var iconName = "icn";
var expressiveIconName = "exp";
var expressiveArtworkName = "art";
//  color names
var fullColorName = "fc";
var oneColorName = "1c";
//  style names
var standardName = "std";
var inactiveName = "inact";
//  artwork color names
var positiveColorName = "pos";
var inverseColorName = "inv";
var blackColorName = "blk";
var whiteColorName = "wht";
// bg color names
var transparentBgColorName = "t";
var whiteBgColorName = "w";
var blackBgColorName = "k";
//  color mode names
var fourColorProcessName = "4cp";
var pantoneColorName = "pms";
var rgbColorName = "rgb";
// size names
var croppedToArtworkName = "crp";
// folder names
var primaryLockupFolderName = "Primary_lockup";
var alternativeLockupFolderName = "Alternate_lockup";
var iconFolderName = "Icon";
var iconInLayoutFolderName = "Icon_in_layout";
var expressiveFolderName = "Expressive";
var inactiveFolderName = "inactive";
var positiveFolderName = "positive";
var inverseTransparentFolderName = "inverse_transparent_bg";
var inverseWhiteBgFolderName = "inverse_white_bg";
// Colors
var rgbName = "RGB";
var cmykName = "CMYK";
//Folder creations
var pngName = "png";
var jpgName = "jpg";
var svgName = "svg";
var svgCroppedName = "svg_cropped";
var epsName = "eps";
var rebuild = true;
var guideLayer = sourceDoc.layers["Guidelines"];
// All reusable functions are in CSTasks below
var CSTasks = (function () {
    var tasks = {};
    /********************
                POSITION AND MOVEMENT
                ********************/
    //takes an artboard
    //returns its left top corner as an array [x,y]
    tasks.getArtboardCorner = function (artboard) {
        var corner = [artboard.artboardRect[0], artboard.artboardRect[1]];
        return corner;
    };
    //takes an array [x,y] for an item's position and an array [x,y] for the position of a reference point
    //returns an array [x,y] for the offset between the two points
    tasks.getOffset = function (itemPos, referencePos) {
        var offset = [itemPos[0] - referencePos[0], itemPos[1] - referencePos[1]];
        return offset;
    };
    //takes an object (e.g. group) and a destination array [x,y]
    //moves the group to the specified destination
    tasks.translateObjectTo = function (object, destination) {
        var offset = tasks.getOffset(object.position, destination);
        object.translate(-offset[0], -offset[1]);
    };
    //takes a document and index of an artboard
    //deletes everything on that artboard
    tasks.clearArtboard = function (doc, index) {
        //clears an artboard at the given index
        doc.selection = null;
        doc.artboards.setActiveArtboardIndex(index);
        doc.selectObjectsOnActiveArtboard();
        var sel = doc.selection; // get selection
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
        var newGroup = doc.groupItems.add();
        for (var i_1 = collection.length - 1; i_1 >= 0; i_1--) {
            collection[i_1].move(newGroup, 
            /*@ts-ignore*/
            ElementPlacement.PLACEATBEGINNING);
        }
        return newGroup;
    };
    //takes a group
    //ungroups that group at the top layer (no recursion for nested groups)
    tasks.ungroupOnce = function (group) {
        for (i = group.pageItems.length - 1; i >= 0; i--) {
            group.pageItems[i].move(group.pageItems[i].layer, 
            /*@ts-ignore*/
            ElementPlacement.PLACEATEND);
        }
    };
    /****************************
                CREATING AND SAVING DOCUMENTS
                *****************************/
    //take a source document and a colorspace (e.g. DocumentColorSpace.RGB)
    //opens and returns a new document with the source document's units and the specified colorspace
    tasks.newDocument = function (sourceDoc, colorSpace) {
        var preset = new DocumentPreset();
        /*@ts-ignore*/
        preset.colorMode = colorSpace;
        /*@ts-ignore*/
        preset.units = sourceDoc.rulerUnits;
        /*@ts-ignore*/
        var newDoc = app.documents.addDocument(colorSpace, preset);
        newDoc.pageOrigin = sourceDoc.pageOrigin;
        newDoc.rulerOrigin = sourceDoc.rulerOrigin;
        return newDoc;
    };
    //take a source document, artboard index, and a colorspace (e.g. DocumentColorSpace.RGB)
    //opens and returns a new document with the source document's units and specified artboard, the specified colorspace
    tasks.duplicateArtboardInNewDoc = function (sourceDoc, artboardIndex, colorspace) {
        var rectToCopy = sourceDoc.artboards[artboardIndex].artboardRect;
        var newDoc = tasks.newDocument(sourceDoc, colorspace);
        newDoc.artboards.add(rectToCopy);
        newDoc.artboards.remove(0);
        return newDoc;
    };
    //takes a document, destination file, starting width and desired width
    //scales the document proportionally to the desired width and exports as a PNG
    tasks.scaleAndExportPNG = function (doc, destFile, startWidth, desiredWidth) {
        var scaling = (100.0 * desiredWidth) / startWidth;
        var options = new ExportOptionsPNG24();
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
        var scaling = (100.0 * desiredWidth) / startWidth;
        var options = new ExportOptionsPNG24();
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
        var scaling = (100.0 * desiredWidth) / startWidth;
        var options = new ExportOptionsSVG();
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
        var scaling = (100.0 * desiredWidth) / startWidth;
        var options = new ExportOptionsJPEG();
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
        var rect = [x, -y, width + x, -(height + y)];
        return rect;
    };
    /***
    TEXT
    ****/
    //takes a text frame and a string with the desired font name
    //sets the text frame to the desired font or alerts if not found
    tasks.setFont = function (textRef, desiredFont) {
        var foundFont = false;
        /*@ts-ignore*/
        for (var i_2 = 0; i_2 < textFonts.length; i_2++) {
            /*@ts-ignore*/
            if (textFonts[i_2].name == desiredFont) {
                /*@ts-ignore*/
                textRef.textRange.characterAttributes.textFont = textFonts[i_2];
                foundFont = true;
                break;
            }
        }
        if (!foundFont)
            alert("Didn't find the font. Please check if the font is installed or check the script to make sure the font name is right.");
    };
    //takes a document, message string, position array and font size
    //creates a text frame with the message
    tasks.createTextFrame = function (doc, message, pos, size) {
        var textRef = doc.textFrames.add();
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
        var colors = new Array(RGBArray.length);
        for (var i_3 = 0; i_3 < RGBArray.length; i_3++) {
            var rgb = new RGBColor();
            rgb.red = RGBArray[i_3][0];
            rgb.green = RGBArray[i_3][1];
            rgb.blue = RGBArray[i_3][2];
            var cmyk = new CMYKColor();
            cmyk.cyan = CMYKArray[i_3][0];
            cmyk.magenta = CMYKArray[i_3][1];
            cmyk.yellow = CMYKArray[i_3][2];
            cmyk.black = CMYKArray[i_3][3];
            colors[i_3] = [rgb, cmyk];
        }
        return colors;
    };
    //take a single RGBColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
    //returns the index in the array if it finds a match, otherwise returns -1
    tasks.matchRGB = function (color, matchArray) {
        //compares a single color RGB color against RGB colors in [[RGB],[CMYK]] array
        for (var i_4 = 0; i_4 < matchArray.length; i_4++) {
            if (Math.abs(color.red - matchArray[i_4][0].red) < 1 &&
                Math.abs(color.green - matchArray[i_4][0].green) < 1 &&
                Math.abs(color.blue - matchArray[i_4][0].blue) < 1) {
                //can't do equality because it adds very small decimals
                return i_4;
            }
        }
        return -1;
    };
    //take a single RGBColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
    //returns the index in the array if it finds a match, otherwise returns -1
    tasks.matchColorsRGB = function (color1, color2) {
        //compares two colors to see if they match
        if (color1 instanceof RGBColor &&
            color2 instanceof RGBColor &&
            Math.abs(color1.red - color2.red) < 1 &&
            Math.abs(color1.green - color2.green) < 1 &&
            Math.abs(color1.blue - color2.blue) < 1) {
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
        if (color1 instanceof CMYKColor &&
            color2 instanceof CMYKColor &&
            Math.abs(color1.cyan - color2.cyan) < 1 &&
            Math.abs(color1.magenta - color2.magenta) < 1 &&
            Math.abs(color1.yellow - color2.yellow) < 1 &&
            Math.abs(color1.black - color2.black) < 1) {
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
        var colorIndex = [];
        for (var i_5 = 0; i_5 < pathItems.length; i_5++) {
            var itemColor = pathItems[i_5].fillColor;
            colorIndex[i_5] = tasks.matchRGB(itemColor, matchArray);
        }
        return colorIndex;
    };
    //takes a doc, collection of pathItems, an array of specified colors and an array of colorIndices
    //converts the fill colors to the indexed CMYK colors and adds a text box with the unmatched colors
    //Note that this only makes sense if you've previously indexed the same path items and haven't shifted their positions in the pathItems array
    tasks.convertToCMYK = function (doc, pathItems, colorArray, colorIndex) {
        var unmatchedColors = [];
        for (i = 0; i < pathItems.length; i++) {
            if (colorIndex[i] >= 0 && colorIndex[i] < colorArray.length)
                pathItems[i].fillColor = colorArray[colorIndex[i]][1];
            else {
                var unmatchedColor = "(" +
                    /*@ts-ignore*/
                    pathItems[i].fillColor.red +
                    ", " +
                    /*@ts-ignore*/
                    pathItems[i].fillColor.green +
                    ", " +
                    /*@ts-ignore*/
                    pathItems[i].fillColor.blue +
                    ")";
                unmatchedColors.push(unmatchedColor);
            }
        }
        if (unmatchedColors.length > 0) {
            // NOTE: Don't perform the Artboard Creation Work if there are unmatched colors due to new palettes CMYK and RGB no longer matching.
            return;
            alert("One or more colors don't match the brand palette and weren't converted.");
            unmatchedColors = tasks.unique(unmatchedColors);
            var unmatchedString = "Unconverted colors:";
            for (var i_6 = 0; i_6 < unmatchedColors.length; i_6++) {
                unmatchedString = unmatchedString + "\n" + unmatchedColors[i_6];
            }
            var errorMsgPos = [Infinity, Infinity]; //gets the bottom left of all the artboards
            for (var i_7 = 0; i_7 < doc.artboards.length; i_7++) {
                var rect = doc.artboards[i_7].artboardRect;
                if (rect[0] < errorMsgPos[0])
                    errorMsgPos[0] = rect[0];
                if (rect[3] < errorMsgPos[1])
                    errorMsgPos[1] = rect[3];
            }
            errorMsgPos[1] = errorMsgPos[1] - 20;
            tasks.createTextFrame(doc, unmatchedString, errorMsgPos, 18);
        }
    };
    //takes an array
    //returns a sorted array with only unique elements
    tasks.unique = function (a) {
        var sorted;
        var uniq;
        if (a.length > 0) {
            sorted = a.sort();
            uniq = [sorted[0]];
            for (var i_8 = 1; i_8 < sorted.length; i_8++) {
                if (sorted[i_8] != sorted[i_8 - 1])
                    uniq.push(sorted[i_8]);
            }
            return uniq;
        }
        return [];
    };
    return tasks;
})();
//#endregion
//#region SETUP TASKS
/**********************************
** HIDE / SHOW SOME LAYERS NEEDED
***********************************/
try {
    guideLayer.visible = false;
}
catch (e) {
    alert("Issue with layer hiding the Guidelines layer (do not change name from exactly Guidelines).", e.message);
}
/*****************************
create export folder if needed
******************************/
try {
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName)).create();
    // New folders
    // Primary lockup folders
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(cmykName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(rgbName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)).create();
    // Alternate lockup folders
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)).create();
    // Icon lockup folders
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inactiveFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(positiveFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inverseTransparentFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inverseWhiteBgFolderName)).create();
    // Expressive lockup folders
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(epsName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(svgName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(svgCroppedName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(pngName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(epsName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(jpgName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(svgName)).create();
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(pngName)).create();
}
catch (e) {
    alert("Issues with creating setup folders. Check your file permission properties.", e.message);
}
/*****************************
Moving both prompts to the top of the file for efficiency purposes
******************************/
//request a name for the icon, and place that as text on the lockup artboard
var appNameCore = prompt("What name do you want to put in the first Core lockup?");
//request a name for the icon, and place that as text on the lockup artboard
var appNameExpressive = prompt("What name do you want to put in the second Expressive lockup?");
//#endregion
function iconGen() {
    //#region CORE EXPORTS
    /*****************************
This block creates the 3rd artboard,
it has to remain here or the inverse function doesn't work correctly
******************************/
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    /*********************************************************************
    All exports from artboard 0
    **********************************************************************/
    var rgbDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.RGB);
    rgbDoc.swatches.removeAll();
    var rgbGroup = iconGroup.duplicate(rgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var rgbLoc = [
        rgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
        rgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(rgbGroup, rgbLoc);
    CSTasks.ungroupOnce(rgbGroup);
    //save the classic PNGs in icon folder
    // let masterStartWidth =
    // 	rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${exportSizes[i]}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${positiveFolderName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i]);
    // }
    //save a classic EPS into the icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + filename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    /*@ts-ignore*/
    // 	rgbSaveOpts.cmykPostScript = false;
    // 	rgbDoc.saveAs(destFile, rgbSaveOpts);
    // }
    //save a classic SVG in icon folder 
    var svgMasterCoreStartWidth = rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(rgbDoc.pathItems, colors);
    //convert violet to white and save as EPS
    CSTasks.convertColorRGB(rgbDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //save set of inverted pngs in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}_${exportSizes[i]}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inverseTransparentFolderName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i]);
    // }
    // save an inverted eps in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.eps`;
    // 	let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    // 	rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    // }
    // save inverted svg in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    //convert to inactive color (WTW Icon grey at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[grayIndex][0], 100);
    // save an inactive png to icon folder, need x2 problem here is spreadsheet, contradiction
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inactiveFolderName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
    // }
    // save an inactive png to icon folder, need x2 problem here is spreadsheet, contradiction
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inactiveFolderName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
    // }
    // save 2 inactive svgs to icon folder, problem in spreadsheet here, contradiction
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    // save 2 inactive svgs to icon folder, problem in spreadsheet here, contradiction
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    //convert to white color (WTW Icon white at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[whiteIndex][0], 100);
    // save a white eps in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${rgbColorName}.eps`;
    // 	let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    // 	rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    // }
    // save white svg in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    //convert to black color (WTW Icon black at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[blackIndex][0], 100);
    // save a black eps in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${rgbColorName}.eps`;
    // 	let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    // 	rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    // }
    // save a black svg in icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    //close and clean up 
    rgbDoc.close(SaveOptions.DONOTSAVECHANGES);
    rgbDoc = null;
    /****************
    CMYK exports x4 (EPS only)
    ****************/
    //open a new document with CMYK colorspace, and duplicate the icon to the new document
    var cmykDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.CMYK);
    cmykDoc.swatches.removeAll();
    //need to reverse the order of copying the group to get the right color ordering
    var cmykGroup = iconGroup.duplicate(cmykDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATBEGINNING);
    var cmykLoc = [
        cmykDoc.artboards[0].artboardRect[0] + iconOffset[0],
        cmykDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(cmykGroup, cmykLoc);
    CSTasks.ungroupOnce(cmykGroup);
    CSTasks.convertToCMYK(cmykDoc, cmykDoc.pathItems, colors, colorIndex);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
    // 	let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
    // 	let cmykSaveOpts = new EPSSaveOptions();
    // 	cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    // }
    // inverse color cmyk doc
    CSTasks.convertColorCMYK(cmykDoc.pathItems, colors[violetIndex][1], colors[whiteIndex][1]);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.eps`;
    // 	let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
    // 	let cmykSaveOpts = new EPSSaveOptions();
    // 	cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    // }
    //convert to white color cmyk doc (WTW Icon white at 100% opacity) and save 
    CSTasks.convertAll(cmykDoc.pathItems, colors[whiteIndex][0], 100);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${fourColorProcessName}.eps`;
    // 	let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
    // 	let cmykSaveOpts = new EPSSaveOptions();
    // 	cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    // }
    //convert to black color cmyk doc (WTW Icon black at 100% opacity) and save EPS
    CSTasks.convertAll(cmykDoc.pathItems, colors[blackIndex][0], 100);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${fourColorProcessName}.eps`;
    // 	let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
    // 	let cmykSaveOpts = new EPSSaveOptions();
    // 	cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    // }
    //close and clean up
    cmykDoc.close(SaveOptions.DONOTSAVECHANGES);
    cmykDoc = null;
    /*********************************************************************
    RGB cropped export (SVG only), squares, cropped to artwork
    **********************************************************************/
    var rgbDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.RGB);
    rgbDocCroppedVersion.swatches.removeAll();
    var rgbGroupCropped = iconGroup.duplicate(rgbDocCroppedVersion.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var rgbLocCropped = [
        rgbDocCroppedVersion.artboards[0].artboardRect[0] + iconOffset[0],
        rgbDocCroppedVersion.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(rgbGroupCropped, rgbLocCropped);
    // remove padding here befor exporting
    function placeIconLockup1Correctly(rgbGroupCropped, maxSize) {
        var W = rgbGroupCropped.width, H = rgbGroupCropped.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        rgbGroupCropped.resize(factor, factor);
    }
    placeIconLockup1Correctly(rgbGroupCropped, { W: 256, H: 256 });
    CSTasks.ungroupOnce(rgbGroupCropped);
    // below we export croped only versions
    // Save a cropped SVG 
    // let svgMasterCoreStartWidthCroppedSvg =
    // 	rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
    // 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
    // 	CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    // }
    //convert violet to white and save svg
    CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    // Save a inversed cropped SVG 
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
    // 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
    // 	CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    // }
    //convert color to white
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[whiteIndex][0], 100);
    // Save a white cropped SVG 
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
    // 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
    // 	CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    // }
    //convert to black color
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[blackIndex][0], 100);
    // Save a black cropped SVG 
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
    // 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
    // 	CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    // }
    //convert to inactive color
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], 100);
    // Save a inactive cropped SVG,need x2 here, contradiction in spreadsheet
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
    // 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
    // 	CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    // }
    //close and clean up
    rgbDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
    rgbDocCroppedVersion = null;
    //#endregion
    //#region EXPRESSIVE EXPORTS
    /*****************
        Expressive icon exports
        ***************/
    //select the contents on artboard 0
    var selExp = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
    var iconGroupExp = CSTasks.createGroup(sourceDoc, selExp); //group the selection (easier to work with)
    var iconOffsetExp = CSTasks.getOffset(iconGroupExp.position, CSTasks.getArtboardCorner(sourceDoc.artboards[1]));
    /*********************************************************************
    All exports from new file with expressive icon copied across
    **********************************************************************/
    var rgbExpDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.RGB);
    rgbExpDoc.swatches.removeAll();
    var rgbExpGroup = iconGroupExp.duplicate(rgbExpDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var rgbExpLoc = [
        rgbExpDoc.artboards[0].artboardRect[0] + iconOffsetExp[0],
        rgbExpDoc.artboards[0].artboardRect[1] + iconOffsetExp[1],
    ];
    CSTasks.translateObjectTo(rgbExpGroup, rgbExpLoc);
    CSTasks.ungroupOnce(rgbExpGroup);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
    // }
    //save a expressive EPS into the expressive icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + filename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    /*@ts-ignore*/
    // 	rgbSaveOpts.cmykPostScript = false;
    // 	rgbExpDoc.saveAs(destFile, rgbSaveOpts);
    // }
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbExpDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    // Parking inverted expressive will come back to this
    //convert violet to white
    //index the RGB colors for conversion to CMYK. An inelegant location.
    //CSTasks.indexRGBColors(rgbExpDoc.pathItems, colorsExp);
    //convert violet to white and save as
    CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${inverseColorName}_${rgbColorName}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
    // }
    //save a expressive EPS into the expressive icon folder
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${inverseColorName}_${rgbColorName}.eps`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + filename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    /*@ts-ignore*/
    // 	rgbSaveOpts.cmykPostScript = false;
    // 	rgbExpDoc.saveAs(destFile, rgbSaveOpts);
    // }
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${inverseColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(rgbExpDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    // }
    //close and clean up
    rgbExpDoc.close(SaveOptions.DONOTSAVECHANGES);
    rgbExpDoc = null;
    // exp svg crop
    //select the contents on artboard 1
    var selExp2 = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
    var iconGroupExp2 = CSTasks.createGroup(sourceDoc, selExp2); //group the selection (easier to work with)
    var iconOffsetExp2 = CSTasks.getOffset(iconGroupExp2.position, CSTasks.getArtboardCorner(sourceDoc.artboards[1]));
    /*********************************************************************
    All exports from new file with expressive icon copied across
    **********************************************************************/
    var rgbExpDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.RGB);
    rgbExpDocCroppedVersion.swatches.removeAll();
    var rgbExpGroup2 = iconGroupExp2.duplicate(rgbExpDocCroppedVersion.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var rgbExpLoc2 = [
        rgbExpDocCroppedVersion.artboards[0].artboardRect[0] + iconOffsetExp2[0],
        rgbExpDocCroppedVersion.artboards[0].artboardRect[1] + iconOffsetExp2[1],
    ];
    CSTasks.translateObjectTo(rgbExpGroup2, rgbExpLoc2);
    // remove padding here befor exporting
    function placeIconLockup1Correctly2(rgbExpGroup2, maxSize) {
        var W = rgbExpGroup2.width, H = rgbExpGroup2.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        rgbExpGroup2.resize(factor, factor);
    }
    placeIconLockup1Correctly2(rgbExpGroup2, { W: 256, H: 256 });
    CSTasks.ungroupOnce(rgbExpGroup2);
    // let svgdExpMasterCoreStartWidthCroppedSvg =
    // 	rgbExpDocCroppedVersion.artboards[0].artboardRect[2] - rgbExpDocCroppedVersion.artboards[0].artboardRect[0];
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
    // 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
    // 	CSTasks.scaleAndExportSVG(rgbExpDocCroppedVersion, destFileCroppedSvg, svgdExpMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    // }
    //close and clean up
    rgbExpDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
    rgbExpDocCroppedVersion = null;
    // eps cmyk
    // exp svg crop
    //select the contents on artboard 1
    var selExp3 = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
    var iconGroupExp3 = CSTasks.createGroup(sourceDoc, selExp3); //group the selection (easier to work with)
    var iconOffsetExp3 = CSTasks.getOffset(iconGroupExp3.position, CSTasks.getArtboardCorner(sourceDoc.artboards[1]));
    /****************
    CMYK exports x4 (EPS only)
    ****************/
    //open a new document with CMYK colorspace, and duplicate the icon to the new document
    var cmykDocExp = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.CMYK);
    cmykDocExp.swatches.removeAll();
    //need to reverse the order of copying the group to get the right color ordering
    var cmykGroupExp = iconGroupExp3.duplicate(cmykDocExp.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATBEGINNING);
    var cmykLocExp = [
        cmykDocExp.artboards[0].artboardRect[0] + iconOffsetExp3[0],
        cmykDocExp.artboards[0].artboardRect[1] + iconOffsetExp3[1],
    ];
    CSTasks.translateObjectTo(cmykGroupExp, cmykLocExp);
    CSTasks.ungroupOnce(cmykGroupExp);
    CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex);
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let cmykFilename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
    // 	let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + cmykFilename);
    // 	let cmykSaveOpts = new EPSSaveOptions();
    // 	cmykDocExp.saveAs(cmykDestFile, cmykSaveOpts);
    // }
    //close and clean up
    cmykDocExp.close(SaveOptions.DONOTSAVECHANGES);
    cmykDocExp = null;
    /************
    Final cleanup
    ************/
    CSTasks.ungroupOnce(iconGroupExp);
    sourceDoc.selection = null;
    //#endregion
}
iconGen();
function createAndExportArtboard2() {
    //#region ARTBOARD2 CREATION
    //select the contents on artboard 0
    //place icon and text in the first generated lockup artboard 
    /*****************************
This block creates the 2nd artboard,
it has to remain here or the inverse function doesn't work correctly
******************************/
    /********************************
Create new artboard with text lockup
*********************************/
    //if there are two artboards at 256x256, create the new third lockup artboard
    if (sourceDoc.artboards.length == 2 &&
        sourceDoc.artboards[0].artboardRect[2] -
            sourceDoc.artboards[0].artboardRect[0] ==
            256 &&
        sourceDoc.artboards[0].artboardRect[1] -
            sourceDoc.artboards[0].artboardRect[3] ==
            256) {
        // alert("More than 2 artboards detected!");
        var firstRect = sourceDoc.artboards[0].artboardRect;
        sourceDoc.artboards.add(CSTasks.newRect(firstRect[1], firstRect[2] + 128, 2400, 256));
    }
    //if the lockup artboard is present, check if rebuilding or just exporting
    else if (sourceDoc.artboards.length == 3 &&
        sourceDoc.artboards[1].artboardRect[1] -
            sourceDoc.artboards[1].artboardRect[3] ==
            256) {
        rebuild = confirm("It looks like your artwork already exists. This script will rebuild the lockup and export various EPS and PNG versions. Do you want to proceed?");
        if (rebuild)
            CSTasks.clearArtboard(sourceDoc, 1);
        else
            return;
    }
    //otherwise abort
    else {
        alert("Please try again with 2 artboards that are 256x256px.");
        return;
    }
    // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
    app.executeMenuCommand('Colors9');
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
    if (sel.length == 0) {
        //if nothing is in the artboard
        alert("Please try again with artwork on the main 256x256 artboard.");
        return;
    }
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    var mast = 
    /*@ts-ignore*/
    iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
    var mastPos = [
        sourceDoc.artboards[2].artboardRect[0] + iconOffset[0],
        sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(mast, mastPos);
    var textRef = sourceDoc.textFrames.add();
    textRef.contents = appNameCore;
    textRef.textRange.characterAttributes.size = 182;
    CSTasks.setFont(textRef, desiredFont);
    //vertically align the baseline to be 64 px above the botom of the artboard
    var bottomEdge = sourceDoc.artboards[2].artboardRect[3] +
        0.25 * sourceDoc.artboards[0].artboardRect[2] -
        sourceDoc.artboards[0].artboardRect[0]; //64px (0.25*256px) above the bottom edge of the artboard
    var vOffset = CSTasks.getOffset(textRef.anchor, [0, bottomEdge]);
    textRef.translate(0, -vOffset[1]);
    //create an outline of the text
    var textGroup = textRef.createOutline();
    //horizontally align the left edge of the text to be 96px to the right of the edge
    var rightEdge = mast.position[0] +
        mast.width +
        0.375 * sourceDoc.artboards[0].artboardRect[2] -
        sourceDoc.artboards[0].artboardRect[0]; //96px (0.375*256px) right of the icon 
    var hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
    textGroup.translate(-hOffset[0], 0);
    //resize the artboard to be only a little wider than the text
    var leftMargin = mast.position[0] - sourceDoc.artboards[2].artboardRect[0];
    var newWidth = textGroup.position[0] +
        textGroup.width -
        sourceDoc.artboards[2].artboardRect[0] +
        leftMargin - 16;
    var resizedRect = CSTasks.newRect(sourceDoc.artboards[2].artboardRect[0], -sourceDoc.artboards[2].artboardRect[1], newWidth, 256);
    sourceDoc.artboards[2].artboardRect = resizedRect;
    // new position of icon in text banner 1 without padding
    mastPos = [
        sourceDoc.artboards[2].artboardRect[0],
        sourceDoc.artboards[2].artboardRect[1],
    ];
    CSTasks.translateObjectTo(mast, mastPos);
    //make icon fill whole area
    var getArtLayer = sourceDoc.layers.getByName('Art');
    var landingZoneSquare = getArtLayer.pathItems.rectangle(-384, 0, 256, 256);
    function placeIconLockup1Correctly0(mast, maxSize, getArtLayer) {
        var setLandingZoneSquareColor = new RGBColor();
        setLandingZoneSquareColor.red = 12;
        setLandingZoneSquareColor.green = 28;
        setLandingZoneSquareColor.blue = 151;
        landingZoneSquare.fillColor = setLandingZoneSquareColor;
        landingZoneSquare.name = "LandingZone";
        landingZoneSquare.filled = false;
        /*@ts-ignore*/
        landingZoneSquare.move(getArtLayer, ElementPlacement.PLACEATEND);
        var placedMastBannerIconOnText = mast;
        var landingZone = sourceDoc.pathItems.getByName("LandingZone");
        var preferredWidth = 256;
        var preferredHeight = 256;
        // Resize the mast icon to the preferred width if necessary
        var widthRatio = (preferredWidth / placedMastBannerIconOnText.width) * 100;
        if (placedMastBannerIconOnText.width != preferredWidth) {
            placedMastBannerIconOnText.resize(widthRatio, widthRatio);
        }
        // Resize the mast icon to the preferred height if necessary
        var heightRatio = (preferredHeight / placedMastBannerIconOnText.height) * 100;
        if (placedMastBannerIconOnText.height != preferredHeight) {
            placedMastBannerIconOnText.resize(heightRatio, heightRatio);
        }
        // Center the mast icon on the landing zone
        var centerArt = [placedMastBannerIconOnText.left + (placedMastBannerIconOnText.width / 2), placedMastBannerIconOnText.top + (placedMastBannerIconOnText.height / 2)];
        var centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
        placedMastBannerIconOnText.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);
        // Resize the mast icon again to ensure it fits within the maximum size
        var W = mast.width, H = mast.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        mast.resize(factor, factor);
    }
    placeIconLockup1Correctly0(mast, { W: 256, H: 256 }, getArtLayer);
    landingZoneSquare.remove();
    //#endregion
    //#region ARTBOARD2 RGB EXPORTS
    //select the contents on artboard 0
    /********************
    Lockup export core RGB (EPS)
    ********************/
    //open a new doc and copy and position the icon and the lockup text
    var mastDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 2, DocumentColorSpace.RGB);
    mastDoc.swatches.removeAll();
    var mastGroup = iconGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var mastLoc = [
        mastDoc.artboards[0].artboardRect[0] + iconOffset[0],
        mastDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(mastGroup, mastLoc);
    CSTasks.ungroupOnce(mastGroup);
    //get the text offset for exporting
    var mastTextOffset = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    var mastText = textGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var mastTextLoc = [
        mastDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
        mastDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
    ];
    CSTasks.translateObjectTo(mastText, mastTextLoc);
    // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
    var GetMyCroppingLayerMastDoc = mastDoc.layers.getByName('Layer 1');
    mastDoc.activeLayer = GetMyCroppingLayerMastDoc;
    mastDoc.activeLayer.hasSelectedArtwork = true;
    // select all for clipping here
    sourceDoc.selectObjectsOnActiveArtboard();
    // save a text and lockup PNG
    var masterStartWidth = mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
    for (var i_9 = 0; i_9 < exportSizes.length; i_9++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, exportSizes[0]);
    }
    //save a text and lockup SVG
    for (var i_10 = 0; i_10 < exportSizes.length; i_10++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
    }
    //save a text and lockup EPS
    for (var i_11 = 0; i_11 < exportSizes.length; i_11++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    // flatten layers test
    // function flattenGroups(group) {
    // 	for (var i = group.pageItems.length - 1; i >= 0; i--) {
    // 		var pageItem = group.pageItems[i];
    // 		if (pageItem.typename === "GroupItem") {
    // 			flattenGroups(pageItem);
    // 		} else {
    // 			// Move the page item to the parent layer
    // 			pageItem.move(pageItem.layer,
    // 				/*@ts-ignore*/
    // 				ElementPlacement.PLACEATEND);
    // 		}
    // 	}
    // }
    // // Usage:
    // var targetGroup = mastDoc.layers[0].groupItems[0]; // Replace with your target group
    // flattenGroups(targetGroup);
    // let colorIndex = CSTasks.indexRGBColors(mastDoc.pathItems, colors);
    // CSTasks.convertToCMYK(mastDoc, mastDoc.pathItems, colors, colorIndex);
    // return;
    //INVERSE NOT WORKING HERE!
    // alert(mastDoc.layers[0].pathItems.length.toString());
    // alert(colors[violetIndex][0].toString())
    // alert(colors[whiteIndex][0].toString())
    CSTasks.convertColorRGB(mastDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //alert(mastDoc.layers[0].groupItems[0].groupItems[0].groupItems[0].pathItems.length.toString());
    return;
    var masterStartWidthPng = mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
    // save a text and lockup PNG
    for (var i_12 = 0; i_12 < exportSizes.length; i_12++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidthPng, exportSizes[0]);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[blackIndex][0], 100);
    // save a text and lockup PNG
    for (var i_13 = 0; i_13 < exportSizes.length; i_13++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidthPng, exportSizes[0]);
    }
    //save a text and lockup SVG
    for (var i_14 = 0; i_14 < exportSizes.length; i_14++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
    }
    //save a text and lockup EPS
    for (var i_15 = 0; i_15 < exportSizes.length; i_15++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[whiteIndex][0], 100);
    // save a text and lockup PNG
    for (var i_16 = 0; i_16 < exportSizes.length; i_16++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidthPng, exportSizes[0]);
    }
    //save a text and lockup SVG
    for (var i_17 = 0; i_17 < exportSizes.length; i_17++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
    }
    //save a text and lockup EPS
    for (var i_18 = 0; i_18 < exportSizes.length; i_18++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    //close and clean up
    mastDoc.close(SaveOptions.DONOTSAVECHANGES);
    mastDoc = null;
    //#endregion
    //#region ARTBOARD CMYK EXPORTS
    //select the contents on artboard 0
    /********************
    Lockup export core CMYK (EPS)
    ********************/
    //open a new doc and copy and position the icon and the lockup text
    var mastDocCMYK = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 2, DocumentColorSpace.CMYK);
    mastDocCMYK.swatches.removeAll();
    var mastGroupCMYK = iconGroup.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var mastLocCMYK = [
        mastDocCMYK.artboards[0].artboardRect[0] + iconOffset[0],
        mastDocCMYK.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);
    CSTasks.ungroupOnce(mastGroupCMYK);
    //get the text offset for exporting
    var mastTextOffsetCMYK = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    var mastTextCMYK = textGroup.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var mastTextLocCMYK = [
        mastDocCMYK.artboards[0].artboardRect[0] + mastTextOffsetCMYK[0],
        mastDocCMYK.artboards[0].artboardRect[1] + mastTextOffsetCMYK[1],
    ];
    CSTasks.translateObjectTo(mastTextCMYK, mastTextLocCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    var colorIndex = CSTasks.indexRGBColors(mastDocCMYK.pathItems, colors);
    CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);
    // save a text and lockup PNG
    var masterStartWidthCMYK = mastDocCMYK.artboards[0].artboardRect[2] - mastDocCMYK.artboards[0].artboardRect[0];
    for (var i_19 = 0; i_19 < exportSizes.length; i_19++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthCMYK, exportSizes[0]);
    }
    //save a text and lockup SVG
    for (var i_20 = 0; i_20 < exportSizes.length; i_20++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
    }
    //save a text and lockup EPS
    for (var i_21 = 0; i_21 < exportSizes.length; i_21++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    // return;
    //INVERSE NOT WORKING HERE!
    // CSTasks.convertColorRGB(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    CSTasks.convertAll(mastDocCMYK.pathItems, colors[blackIndex][0], 100);
    // save a text and lockup PNG
    var masterStartWidthPngCMYK = mastDocCMYK.artboards[0].artboardRect[2] - mastDocCMYK.artboards[0].artboardRect[0];
    for (var i_22 = 0; i_22 < exportSizes.length; i_22++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(fourColorProcessName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthPngCMYK, exportSizes[0]);
    }
    //save a text and lockup SVG
    for (var i_23 = 0; i_23 < exportSizes.length; i_23++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(fourColorProcessName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
    }
    //save a text and lockup EPS
    for (var i_24 = 0; i_24 < exportSizes.length; i_24++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDocCMYK.pathItems, colors[whiteIndex][0], 100);
    // save a text and lockup PNG
    for (var i_25 = 0; i_25 < exportSizes.length; i_25++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(fourColorProcessName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthPng, exportSizes[0]);
    }
    //save a text and lockup SVG
    for (var i_26 = 0; i_26 < exportSizes.length; i_26++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(fourColorProcessName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
    }
    //save a text and lockup EPS
    for (var i_27 = 0; i_27 < exportSizes.length; i_27++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    //close and clean up
    mastDocCMYK.close(SaveOptions.DONOTSAVECHANGES);
    mastDocCMYK = null;
    //#endregion
}
createAndExportArtboard2();
function createAndExportArtboard3() {
    //#region ARTBOARD3 CREATION
    /******************
    Set up purple artboard 3 in main file
    ******************/
    //if there are three artboards, create the new fourth(3rd in array) lockup artboard
    if (sourceDoc.artboards.length == 3 &&
        sourceDoc.artboards[1].artboardRect[2] -
            sourceDoc.artboards[1].artboardRect[0] ==
            256 &&
        sourceDoc.artboards[1].artboardRect[1] -
            sourceDoc.artboards[1].artboardRect[3] ==
            256) {
        // If there are already  3 artboards. Add a 4th one.
        var firstRect = sourceDoc.artboards[1].artboardRect;
        sourceDoc.artboards.add(
        // this fires but then gets replaced further down
        CSTasks.newRect(firstRect[1], firstRect[2] + 128, 1024, 512));
    }
    //if the lockup artboard is present, check if rebuilding or just exporting
    else if (sourceDoc.artboards.length == 3 &&
        sourceDoc.artboards[1].artboardRect[1] -
            sourceDoc.artboards[1].artboardRect[3] ==
            256) {
        rebuild = confirm("It looks like your artwork already exists. This script will rebuild the lockup and export various EPS and PNG versions. Do you want to proceed?");
        if (rebuild)
            CSTasks.clearArtboard(sourceDoc, 3);
        else
            return;
    }
    //otherwise abort
    else {
        alert("Please try again with 2 artboards that are 256x256px. Had trouble building artboard 3 (artb. 2 in js)");
        return;
    }
    //select the contents on artboard 1
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
    // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
    app.executeMenuCommand('Colors9');
    if (sel.length == 0) {
        //if nothing is in the artboard
        alert("Please try again with artwork on the main second 256x256 artboard.");
        return;
    }
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    /********************************
    Create new expressive artboard with lockup and text
    *********************************/
    /*@ts-ignore*/
    var mastBannerIconOnText = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
    var mastBannerIconOnTextPos = [
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
    var getArtLayer = sourceDoc.layers.getByName('Art');
    var landingZoneSquare = getArtLayer.pathItems.rectangle(-844, 572, 460, 460);
    function placeIconLockup1Correctly(mastBannerIconOnText, maxSize) {
        var setLandingZoneSquareColor = new RGBColor();
        setLandingZoneSquareColor.red = 12;
        setLandingZoneSquareColor.green = 28;
        setLandingZoneSquareColor.blue = 151;
        landingZoneSquare.fillColor = setLandingZoneSquareColor;
        landingZoneSquare.name = "LandingZone";
        landingZoneSquare.filled = false;
        /*@ts-ignore*/
        landingZoneSquare.move(getArtLayer, ElementPlacement.PLACEATEND);
        // start moving expressive icon into our new square landing zone
        var placedmastBannerIconOnText = mastBannerIconOnText;
        var landingZone = sourceDoc.pathItems.getByName("LandingZone");
        var preferredWidth = (460);
        var preferredHeight = (460);
        // do the width
        var widthRatio = (preferredWidth / placedmastBannerIconOnText.width) * 100;
        if (placedmastBannerIconOnText.width != preferredWidth) {
            placedmastBannerIconOnText.resize(widthRatio, widthRatio);
        }
        // now do the height
        var heightRatio = (preferredHeight / placedmastBannerIconOnText.height) * 100;
        if (placedmastBannerIconOnText.height != preferredHeight) {
            placedmastBannerIconOnText.resize(heightRatio, heightRatio);
        }
        // now let's center the art on the landing zone
        var centerArt = [placedmastBannerIconOnText.left + (placedmastBannerIconOnText.width / 2), placedmastBannerIconOnText.top + (placedmastBannerIconOnText.height / 2)];
        var centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
        placedmastBannerIconOnText.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);
        // need another centered proportioning to fix it exactly in correct position
        var W = mastBannerIconOnText.width, H = mastBannerIconOnText.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        mastBannerIconOnText.resize(factor, factor);
    }
    placeIconLockup1Correctly(mastBannerIconOnText, { W: 460, H: 460 });
    // delete the landing zone
    landingZoneSquare.remove();
    // mastBannerIconOnText.width = 460;
    // mastBannerIconOnText.height = 460;
    // new purple bg
    // Add new layer above Guidelines and fill white
    var myMainArtworkLayer = sourceDoc.layers.getByName('Art');
    var myMainPurpleBgLayer = sourceDoc.layers.add();
    myMainPurpleBgLayer.name = "Main_Purple_BG_layer";
    var GetMyMainPurpleBgLayer = sourceDoc.layers.getByName('Main_Purple_BG_layer');
    // mastDoc.activeLayer = GetMyMainPurpleBgLayer;
    // mastDoc.activeLayer.hasSelectedArtwork = true;
    var mainRect = GetMyMainPurpleBgLayer.pathItems.rectangle(-784, 0, 1024, 512);
    var setMainVioletBgColor = new RGBColor();
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
    var imagePlacedItem = myMainArtworkLayer.placedItems.add();
    var svgFile = File("".concat(sourceDoc.path, "/../images/wtw_logo.ai"));
    imagePlacedItem.file = svgFile;
    imagePlacedItem.top = -1188;
    imagePlacedItem.left = 62;
    /*@ts-ignore*/
    // svgFile.embed();  
    var textRef = sourceDoc.textFrames.add();
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
    var textGroup = textRef.createOutline();
    //horizontally align the left edge of the text to be 96px to the right of the edge
    var rightEdge = 64;
    var hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
    textGroup.translate(-hOffset[0], 0);
    /*@ts-ignore*/
    var resizedRect = CSTasks.newRect(sourceDoc.artboards[3].artboardRect[0], -sourceDoc.artboards[3].artboardRect[1], 1024, 512);
    sourceDoc.artboards[3].artboardRect = resizedRect;
    //#endregion
    //#region ARTBOARD3 EXPORTS
    /********************
    Purple Lockup with text export in new file to save
    ********************/
    //open a new doc and copy and position the icon and the lockup text
    // duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
    var mastDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 3, DocumentColorSpace.RGB);
    mastDoc.swatches.removeAll();
    // let textRef = mastDoc.textFrames.add();
    //create an outline of the text
    // let textGroup = textRef.createOutline();
    var mastGroup = iconGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // new icon width in rebrand
    // mastGroup.width = 460;
    // mastGroup.height = 460;
    // new icon position
    var mastLoc = [
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
    var getArtLayer3 = mastDoc.layers.getByName('Layer 1');
    var landingZoneSquare3 = getArtLayer3.pathItems.rectangle(-845, 571, 460, 460);
    function placeIconLockup1Correctly3(mastGroup, maxSize) {
        var setLandingZoneSquareColor = new RGBColor();
        setLandingZoneSquareColor.red = 121;
        setLandingZoneSquareColor.green = 128;
        setLandingZoneSquareColor.blue = 131;
        landingZoneSquare3.fillColor = setLandingZoneSquareColor;
        landingZoneSquare3.name = "LandingZone3";
        landingZoneSquare3.filled = true;
        /*@ts-ignore*/
        landingZoneSquare3.move(getArtLayer3, ElementPlacement.PLACEATEND);
        // start moving expressive icon into our new square landing zone
        var placedmastGroup = mastGroup;
        var landingZone = mastDoc.pathItems.getByName("LandingZone3");
        var preferredWidth = (460);
        var preferredHeight = (460);
        // do the width
        var widthRatio = (preferredWidth / placedmastGroup.width) * 100;
        if (placedmastGroup.width != preferredWidth) {
            placedmastGroup.resize(widthRatio, widthRatio);
        }
        // now do the height
        var heightRatio = (preferredHeight / placedmastGroup.height) * 100;
        if (placedmastGroup.height != preferredHeight) {
            placedmastGroup.resize(heightRatio, heightRatio);
        }
        // now let's center the art on the landing zone
        var centerArt = [placedmastGroup.left + (placedmastGroup.width / 2), placedmastGroup.top + (placedmastGroup.height / 2)];
        var centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
        placedmastGroup.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);
        // need another centered proportioning to fix it exactly in correct position
        var W = mastGroup.width, H = mastGroup.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        mastGroup.resize(factor, factor);
    }
    placeIconLockup1Correctly3(mastGroup, { W: 460, H: 460 });
    // delete the landing zone
    landingZoneSquare3.remove();
    CSTasks.ungroupOnce(mastGroup);
    var mastText = textGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc = [
        mastDoc.artboards[0].artboardRect[0] + 63,
        mastDoc.artboards[0].artboardRect[1] - 64,
    ];
    CSTasks.translateObjectTo(mastText, mastTextLoc);
    // add new style purple banner elements
    var myMainArtworkLayerMastDoc = mastDoc.layers.getByName('Layer 1');
    var myMainPurpleBgLayerMastDoc = mastDoc.layers.add();
    myMainPurpleBgLayerMastDoc.name = "Main_Purple_BG_layer";
    var GetMyMainPurpleBgLayerMastDoc = mastDoc.layers.getByName('Main_Purple_BG_layer');
    var mainRectMastDoc = GetMyMainPurpleBgLayerMastDoc.pathItems.rectangle(-784, 0, 1024, 512);
    var setMainVioletBgColorMastDoc = new RGBColor();
    setMainVioletBgColorMastDoc.red = 72;
    setMainVioletBgColorMastDoc.green = 8;
    setMainVioletBgColorMastDoc.blue = 111;
    mainRectMastDoc.filled = true;
    mainRectMastDoc.fillColor = setMainVioletBgColorMastDoc;
    /*@ts-ignore*/
    GetMyMainPurpleBgLayerMastDoc.move(myMainArtworkLayerMastDoc, ElementPlacement.PLACEATEND);
    // svg wtw logo for new purple lockup
    var imagePlacedItemMastDoc = myMainArtworkLayerMastDoc.placedItems.add();
    var svgFileMastDoc = File("".concat(sourceDoc.path, "/../images/wtw_logo.ai"));
    imagePlacedItemMastDoc.file = svgFileMastDoc;
    imagePlacedItemMastDoc.top = -1189;
    imagePlacedItemMastDoc.left = 62;
    // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
    var myCroppingLayerMastDoc = mastDoc.layers.add();
    myCroppingLayerMastDoc.name = "crop";
    var GetMyCroppingLayerMastDoc = mastDoc.layers.getByName('crop');
    mastDoc.activeLayer = GetMyCroppingLayerMastDoc;
    mastDoc.activeLayer.hasSelectedArtwork = true;
    // insert clipping rect here
    var mainClipRectMastDoc = GetMyCroppingLayerMastDoc.pathItems.rectangle(-784, 0, 1024, 512);
    var setClipBgColorMastDoc = new RGBColor();
    setClipBgColorMastDoc.red = 0;
    setClipBgColorMastDoc.green = 255;
    setClipBgColorMastDoc.blue = 255;
    mainClipRectMastDoc.filled = true;
    mainClipRectMastDoc.fillColor = setClipBgColorMastDoc;
    // select all for clipping here
    sourceDoc.selectObjectsOnActiveArtboard();
    // clip!
    app.executeMenuCommand('makeMask');
    //save a banner PNG
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${pngName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(mastDoc, destFile, 512, 1024);
    // }
    //save a banner SVG
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
    // }
    // save banner JPG
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.jpg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${jpgName}`) + filename);
    // 	CSTasks.scaleAndExportJPEG(mastDoc, destFile, 512, 1024);
    // }
    // save banner EPS
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    // 	mastDoc.saveAs(destFile, rgbSaveOpts);
    // }
    //Invert
    CSTasks.convertColorRGB(mastDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    return;
    //save a inverted banner PNG
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.png`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${pngName}`) + filename);
    // 	CSTasks.scaleAndExportPNG(mastDoc, destFile, 512, 1024);
    // }
    //save a inverted banner SVG
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.svg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${svgName}`) + filename);
    // 	CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
    // }
    //save a inverted banner JPG
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.jpg`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${jpgName}`) + filename);
    // 	CSTasks.scaleAndExportJPEG(mastDoc, destFile, 512, 1024);
    // }
    //save a inverted banner EPS
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.eps`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    // 	mastDoc.saveAs(destFile, rgbSaveOpts);
    // }
    var colorIndex = CSTasks.indexRGBColors(mastDoc.pathItems, colors);
    //index the RGB colors for conversion to CMYK. An inelegant location.
    CSTasks.convertToCMYK(mastDoc, mastDoc.pathItems, colors, colorIndex);
    //save a inverted CMYK banner EPS
    // for (let i = 0; i < exportSizes.length; i++) {
    // 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
    // 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
    // 	let rgbSaveOpts = new EPSSaveOptions();
    // 	mastDoc.saveAs(destFile, rgbSaveOpts);
    // }
    //close and clean up
    mastDoc.close(SaveOptions.DONOTSAVECHANGES);
    mastDoc = null;
    //#endregion
}
createAndExportArtboard3();
