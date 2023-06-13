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
alert(" \n\nThis is the two line second bold font script   \n\nThis script only works locally not on a server, Tutorial: https://youtu.be/LyBhBLMQc8w  \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/WTW_107405_product_logo_template_script   \n\n Make sure that all colors are set to rgb colors in your template. Especially the stripes of the expressive artboard. If not, some exports won't be correct. \n\nOpen your own.ai template or the provided ones in folders called test. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Make sure you have the Graphik font installed on your CPU. \n\nYou must have the folder called images in the parent folder, this is where wtw_logo.ai is saved so it can be imported into the big purple banner and exported as assets. Otherwise you will get an error that says error = svgFile. If the svgFile is still not working, try opening it again in Illustrator and save as, this happens because your Illustrator has been updated to a newer version. \n\nIllustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease use underscores instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");
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
    [0, 0, 0],
    [128, 128, 128],
    [147, 0, 130],
    [52, 84, 153],
    [51, 151, 129],
    [153, 153, 153],
    [72, 8, 111], // expressive purple banner bg 
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
    [0, 0, 0, 100],
    [0, 0, 0, 50],
    [51, 100, 11, 1],
    [90, 70, 0, 16],
    [25, 0, 17, 0],
    [0, 0, 0, 40],
    [85, 100, 0, 23], // expressive purple banner bg 
];
// Make sure you have the font below installed, ask for font from client
var desiredFontReg = "Graphik-Regular";
var desiredFontBold = "Graphik-Medium";
var exportSizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16]; //sizes to export
var violetIndex = 0; //these are for converting to inverse and inactive versions
var grayIndex = 1;
var whiteIndex = 5;
var blackIndex = 6;
var darkGreyIndex = 7;
var darkPurpleIndex = 12;
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
var positiveOnWhiteFolderName = "positive_white_bg";
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
    tasks.setFont = function (textRef, desiredFontBold) {
        var foundFont = false;
        /*@ts-ignore*/
        for (var i_2 = 0; i_2 < textFonts.length; i_2++) {
            /*@ts-ignore*/
            if (textFonts[i_2].name == desiredFontBold) {
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
            // NOTE: Do not perform the Artboard Creation Work if there are unmatched colors due to new palettes CMYK and RGB no longer matching.
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
            tasks.createTextFrame(doc, unmatchedString, errorMsgPos, 40);
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
    new Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(positiveOnWhiteFolderName)).create();
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
var appNamePrimary = prompt("What text do you want to put in the first line of the primary lockup and the first line of the ultraviolet dark banner lockup?");
// request a second line of text
var appNamePrimary2 = prompt("What text do you want to put in the second line of the primary lockup and the second line of the ultraviolet dark banner lockup?");
//request a name for the icon, and place that as text on the last lockup artboard
var appNameAlternate = prompt("What text do you want to put in the alternate lockup?");
//#endregion
function iconExportArtboard0() {
    //#region INDEX ONLY FOR CMYK conversion
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    // open a doc just for color indexing
    /*********************************************************************
All exports from artboard 0
**********************************************************************/
    var indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.RGB);
    indexRgbDoc.swatches.removeAll();
    var IndexRgbGroup = iconGroup.duplicate(indexRgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var IndexRgbLoc = [
        indexRgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
        indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);
    CSTasks.ungroupOnce(IndexRgbGroup);
    app.executeMenuCommand('Colors9');
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);
    // alert(colorIndex.toString())
    // return;
    //close and clean up 
    indexRgbDoc.close(SaveOptions.DONOTSAVECHANGES);
    indexRgbDoc = null;
    //#endregion
    //#region CORE EXPORTS RGB 
    /*****************************
    This block creates the 3rd artboard,
    it has to remain here or the inverse function doesn't work correctly
    ******************************/
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
    app.executeMenuCommand('Colors9');
    //save the classic PNGs in icon folder
    var masterStartWidth = rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
    for (var i_9 = 0; i_9 < exportSizes.length; i_9++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(exportSizes[i_9], ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(positiveFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i_9]);
    }
    //save the classic PNGs on white in icon folder
    for (var i_10 = 0; i_10 < exportSizes.length; i_10++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(whiteBgColorName, "_").concat(rgbColorName, "_").concat(exportSizes[i_10], ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(positiveOnWhiteFolderName)) + filename);
        CSTasks.scaleAndExportNonTransparentPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i_10]);
    }
    //save a classic EPS into the icon folder
    for (var i_11 = 0; i_11 < exportSizes.length; i_11++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        /*@ts-ignore*/
        rgbSaveOpts.cmykPostScript = false;
        rgbDoc.saveAs(destFile, rgbSaveOpts);
    }
    //save a classic SVG in icon folder
    var svgMasterCoreStartWidth = rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
    for (var i_12 = 0; i_12 < exportSizes.length; i_12++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    app.executeMenuCommand('Colors9');
    //convert violet to white and save as EPS
    CSTasks.convertColorRGB(rgbDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //save set of inverted pngs in icon folder
    for (var i_13 = 0; i_13 < exportSizes.length; i_13++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, "_").concat(exportSizes[i_13], ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inverseTransparentFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i_13]);
    }
    // save an inverted eps in icon folder
    for (var i_14 = 0; i_14 < exportSizes.length; i_14++) {
        var inverseFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".eps");
        var inverseFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + inverseFilename);
        var rgbSaveOpts = new EPSSaveOptions();
        rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    }
    // save inverted svg in icon folder
    for (var i_15 = 0; i_15 < exportSizes.length; i_15++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to inactive color (WTW Icon DARK grey) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[darkGreyIndex][0], 100);
    // save an inactive png to icon folder
    for (var i_16 = 0; i_16 < exportSizes.length; i_16++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inactiveFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    // save 2 inactive svgs to icon folder
    for (var i_17 = 0; i_17 < exportSizes.length; i_17++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to light gray matter (WTW Icon light gray at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[grayIndex][0], 100);
    // save an inactive png to icon folder, same as above different name
    for (var i_18 = 0; i_18 < exportSizes.length; i_18++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inactiveFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    // save 2 inactive svgs to icon folder, same as above different name
    for (var i_19 = 0; i_19 < exportSizes.length; i_19++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to white color (WTW Icon white at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[whiteIndex][0], 100);
    // save a white eps in icon folder
    for (var i_20 = 0; i_20 < exportSizes.length; i_20++) {
        var inverseFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".eps");
        var inverseFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + inverseFilename);
        var rgbSaveOpts = new EPSSaveOptions();
        rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    }
    // save white svg in icon folder
    for (var i_21 = 0; i_21 < exportSizes.length; i_21++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to black color (WTW Icon black at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[blackIndex][0], 100);
    // save a black eps in icon folder
    for (var i_22 = 0; i_22 < exportSizes.length; i_22++) {
        var inverseFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var inverseFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + inverseFilename);
        var rgbSaveOpts = new EPSSaveOptions();
        rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    }
    // save a black svg in icon folder
    for (var i_23 = 0; i_23 < exportSizes.length; i_23++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //close and clean up 
    rgbDoc.close(SaveOptions.DONOTSAVECHANGES);
    rgbDoc = null;
    //#endregion
    //#region CORE EXPORT RGB CROPPED
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
    var svgMasterCoreStartWidthCroppedSvg = rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
    for (var i_24 = 0; i_24 < exportSizes.length; i_24++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    //convert violet to white and save svg
    CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    // Save a inversed cropped SVG 
    for (var i_25 = 0; i_25 < exportSizes.length; i_25++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert color to white
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[whiteIndex][0], 100);
    // Save a white cropped SVG 
    for (var i_26 = 0; i_26 < exportSizes.length; i_26++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert to black color
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[blackIndex][0], 100);
    // Save a black cropped SVG 
    for (var i_27 = 0; i_27 < exportSizes.length; i_27++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert to inactive color (WTW Icon DARK grey) and save 
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[darkGreyIndex][0], 100);
    // save inactive positive svg to icon folder
    for (var i_28 = 0; i_28 < exportSizes.length; i_28++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFile, svgMasterCoreStartWidthCroppedSvg, exportSizes[2]);
    }
    //convert to light gray matter (WTW Icon light gray at 100% opacity) and save 
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], 100);
    // save inactive inverted light grey svg to icon folder
    for (var i_29 = 0; i_29 < exportSizes.length; i_29++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(inverseColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFile, svgMasterCoreStartWidthCroppedSvg, exportSizes[2]);
    }
    //close and clean up
    rgbDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
    rgbDocCroppedVersion = null;
    //#endregion
    //#region CORE EXPORT CMYK
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
    app.executeMenuCommand('Colors9');
    //alert(colorIndex.toString())
    CSTasks.convertToCMYK(cmykDoc, cmykDoc.pathItems, colors, colorIndex);
    for (var i_30 = 0; i_30 < exportSizes.length; i_30++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    // inverse color cmyk doc
    CSTasks.convertColorCMYK(cmykDoc.pathItems, colors[violetIndex][1], colors[whiteIndex][1]);
    for (var i_31 = 0; i_31 < exportSizes.length; i_31++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    //convert to white color cmyk doc (WTW Icon white at 100% opacity) and save 
    CSTasks.convertAll(cmykDoc.pathItems, colors[whiteIndex][0], 100);
    for (var i_32 = 0; i_32 < exportSizes.length; i_32++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(inverseColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    app.executeMenuCommand('Colors9');
    // alert(colorIndex.toString())
    //convert to black color cmyk doc (WTW Icon black at 100% opacity) and save EPS
    //CSTasks.convertAll(cmykDoc.pathItems, colors[blackIndex][0], 100);
    var black = new CMYKColor();
    black.cyan = 0;
    black.magenta = 0;
    black.yellow = 0;
    black.black = 100;
    // Get a reference to the active document
    var doc = app.activeDocument;
    // Iterate over all path items in the document
    for (var i_33 = 0; i_33 < doc.pathItems.length; i_33++) {
        var path = doc.pathItems[i_33];
        // Change the fill color to CMYK black
        path.fillColor = black;
    }
    for (var i_34 = 0; i_34 < exportSizes.length; i_34++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    //close and clean up
    cmykDoc.close(SaveOptions.DONOTSAVECHANGES);
    cmykDoc = null;
    //#endregion
}
iconExportArtboard0();
function iconExportExpressiveArtboard1() {
    //#region INDEX ONLY FOR CMYK conversion
    //select the contents on artboard 0
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[1]));
    // open a doc just for color indexing
    /*********************************************************************
All exports from artboard 0
**********************************************************************/
    var indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 1, DocumentColorSpace.RGB);
    indexRgbDoc.swatches.removeAll();
    var IndexRgbGroup = iconGroup.duplicate(indexRgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var IndexRgbLoc = [
        indexRgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
        indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);
    CSTasks.ungroupOnce(IndexRgbGroup);
    app.executeMenuCommand('Colors9');
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);
    // alert(colorIndex.toString())
    // return;
    //close and clean up 
    indexRgbDoc.close(SaveOptions.DONOTSAVECHANGES);
    indexRgbDoc = null;
    //#endregion
    //#region EXPRESSIVE RGB EXPORTS
    /*****************
        Expressive icon exports
        ***************/
    /*********************************************************************
    All exports from new file with expressive icon copied across
    **********************************************************************/
    var rgbExpDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 1, DocumentColorSpace.RGB);
    rgbExpDoc.swatches.removeAll();
    var rgbExpGroup = iconGroup.duplicate(rgbExpDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var rgbExpLoc = [
        rgbExpDoc.artboards[0].artboardRect[0] + iconOffset[0],
        rgbExpDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(rgbExpGroup, rgbExpLoc);
    CSTasks.ungroupOnce(rgbExpGroup);
    app.executeMenuCommand('Colors9');
    var masterStartWidth = rgbExpDoc.artboards[0].artboardRect[2] - rgbExpDoc.artboards[0].artboardRect[0];
    for (var i_35 = 0; i_35 < exportSizes.length; i_35++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    //save a expressive EPS into the expressive icon folder
    for (var i_36 = 0; i_36 < exportSizes.length; i_36++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(epsName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        /*@ts-ignore*/
        rgbSaveOpts.cmykPostScript = false;
        rgbExpDoc.saveAs(destFile, rgbSaveOpts);
    }
    for (var i_37 = 0; i_37 < exportSizes.length; i_37++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    //convert violet to white
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    //convert violet to white and save as
    CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex2 = CSTasks.indexRGBColors(rgbExpDoc.pathItems, colors);
    for (var i_38 = 0; i_38 < exportSizes.length; i_38++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    //save a expressive EPS into the expressive icon folder
    for (var i_39 = 0; i_39 < exportSizes.length; i_39++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(epsName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        /*@ts-ignore*/
        rgbSaveOpts.cmykPostScript = false;
        rgbExpDoc.saveAs(destFile, rgbSaveOpts);
    }
    for (var i_40 = 0; i_40 < exportSizes.length; i_40++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    //close and clean up
    rgbExpDoc.close(SaveOptions.DONOTSAVECHANGES);
    rgbExpDoc = null;
    //#endregion
    //#region EXPRESSIVE RGB CROPPED
    // exp svg crop
    /*********************************************************************
    All exports from new file with expressive icon copied across
    **********************************************************************/
    var rgbExpDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 1, DocumentColorSpace.RGB);
    rgbExpDocCroppedVersion.swatches.removeAll();
    var rgbExpGroup2 = iconGroup.duplicate(rgbExpDocCroppedVersion.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var rgbExpLoc2 = [
        rgbExpDocCroppedVersion.artboards[0].artboardRect[0] + iconOffset[0],
        rgbExpDocCroppedVersion.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(rgbExpGroup2, rgbExpLoc2);
    // remove padding here befor exporting
    function placeIconLockup1Correctly2(rgbExpGroup2, maxSize) {
        var W = rgbExpGroup2.width, H = rgbExpGroup2.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        rgbExpGroup2.resize(factor, factor);
    }
    placeIconLockup1Correctly2(rgbExpGroup2, { W: 256, H: 256 });
    CSTasks.ungroupOnce(rgbExpGroup2);
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    var svgdExpMasterCoreStartWidthCroppedSvg = rgbExpDocCroppedVersion.artboards[0].artboardRect[2] - rgbExpDocCroppedVersion.artboards[0].artboardRect[0];
    for (var i_41 = 0; i_41 < exportSizes.length; i_41++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbExpDocCroppedVersion, destFileCroppedSvg, svgdExpMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    //convert violet to white and save as
    CSTasks.convertColorRGB(rgbExpDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    for (var i_42 = 0; i_42 < exportSizes.length; i_42++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbExpDocCroppedVersion, destFileCroppedSvg, svgdExpMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //close and clean up
    rgbExpDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
    rgbExpDocCroppedVersion = null;
    //#endregion
    //#region EXPRESSIVE CMYK
    // eps cmyk
    // exp svg crop
    /****************
    CMYK exports x4 (EPS only)
    ****************/
    //open a new document with CMYK colorspace, and duplicate the icon to the new document
    var cmykDocExp = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 1, DocumentColorSpace.CMYK);
    cmykDocExp.swatches.removeAll();
    //need to reverse the order of copying the group to get the right color ordering
    var cmykGroupExp = iconGroup.duplicate(cmykDocExp.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var cmykLocExp = [
        cmykDocExp.artboards[0].artboardRect[0] + iconOffset[0],
        cmykDocExp.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(cmykGroupExp, cmykLocExp);
    CSTasks.ungroupOnce(cmykGroupExp);
    app.executeMenuCommand('Colors8');
    CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex);
    for (var i_43 = 0; i_43 < exportSizes.length; i_43++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(epsName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDocExp.saveAs(cmykDestFile, cmykSaveOpts);
    }
    app.executeMenuCommand('Colors8');
    // get white index
    CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex2);
    //Invert
    CSTasks.convertColorCMYK(cmykDocExp.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    for (var i_44 = 0; i_44 < exportSizes.length; i_44++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconFolderName, "/").concat(epsName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDocExp.saveAs(cmykDestFile, cmykSaveOpts);
    }
    //close and clean up
    cmykDocExp.close(SaveOptions.DONOTSAVECHANGES);
    cmykDocExp = null;
    /************
    Final cleanup
    ************/
    CSTasks.ungroupOnce(iconGroup);
    sourceDoc.selection = null;
    //#endregion
}
iconExportExpressiveArtboard1();
function createAndExportArtboard2() {
    //#region ARTBOARD2 CREATION
    //select the contents on artboard 0 
    //place icon and text in the first generated lockup artboard 
    /*****************************
This block creates the 2nd artboard,
it has to remain here or the inverse function doesn't work correctly
******************************/
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
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
        // create new artboard
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
    if (sel.length == 0) {
        //if nothing is in the artboard
        alert("Please try again with artwork on the main 256x256 artboard.");
        return;
    }
    // get icon
    var mast = iconGroup.duplicate(iconGroup.layer, 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // get icon new pos
    var mastPos = [
        sourceDoc.artboards[2].artboardRect[0],
        sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
    ];
    // paste icon
    CSTasks.translateObjectTo(mast, mastPos);
    // add text from prompt
    var textRef = sourceDoc.textFrames.add();
    textRef.contents = appNamePrimary;
    textRef.textRange.characterAttributes.size = 89;
    CSTasks.setFont(textRef, desiredFontReg);
    //vertically align the baseline to be 147.2 px above the bottom of the artboard
    var bottomEdge = sourceDoc.artboards[2].artboardRect[3] +
        0.575 * sourceDoc.artboards[0].artboardRect[2] -
        sourceDoc.artboards[0].artboardRect[0]; //147.2px (0.575*256px) above the bottom edge of the artboard
    var vOffset = CSTasks.getOffset(textRef.anchor, [0, bottomEdge]);
    textRef.translate(0, -vOffset[1]);
    //create an outline of the text
    var textGroup = textRef.createOutline();
    //horizontally align the left edge of the text to be 64px to the right of the edge
    var rightEdge = mast.position[0] +
        mast.width +
        64; //64px (0.25*256px) right of the icon
    // alert(mast.position[0].toString())
    // alert(mast.width.toString())
    // alert(rightEdge.toString())
    var hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
    textGroup.translate(-hOffset[0], 0);
    //resize the artboard to be only a little wider than the text
    // second line from second prompt
    var textRef2 = sourceDoc.textFrames.add();
    textRef2.contents = appNamePrimary2;
    textRef2.textRange.characterAttributes.size = 107;
    CSTasks.setFont(textRef2, desiredFontBold);
    //vertically align the second baseline to be 44.8 px above the bottom of the artboard
    var bottomEdge2 = sourceDoc.artboards[2].artboardRect[3] +
        0.175 * sourceDoc.artboards[0].artboardRect[2] -
        sourceDoc.artboards[0].artboardRect[0]; //44.8px (0.175*256px) above the bottom edge of the artboard
    var vOffset2 = CSTasks.getOffset(textRef2.anchor, [0, bottomEdge2]);
    textRef2.translate(0, -vOffset2[1]);
    //create an outline of the text
    var textGroup2 = textRef2.createOutline();
    //horizontally align the left edge of the text to be 64px to the right of the edge
    var rightEdge2 = mast.position[0] +
        mast.width +
        64; //64px (0.25*256px) right of the icon
    // alert(mast.position[0].toString())
    // alert(mast.width.toString())
    // alert(rightEdge2.toString())
    var hOffset2 = CSTasks.getOffset(textGroup2.position, [rightEdge2, 0]);
    textGroup2.translate(-hOffset2[0], 0);
    if (textGroup.width.toString() > textGroup2.width.toString()) {
        //alert("text 1 longer than text 2!");
        //resize the artboard to be only a little wider than the text 1
        var leftMargin = mast.position[0] - sourceDoc.artboards[2].artboardRect[0];
        var newWidth = textGroup.position[0] +
            textGroup.width -
            sourceDoc.artboards[2].artboardRect[0] +
            leftMargin + 8;
        var resizedRect = CSTasks.newRect(sourceDoc.artboards[2].artboardRect[0], -sourceDoc.artboards[2].artboardRect[1], newWidth, 256);
        sourceDoc.artboards[2].artboardRect = resizedRect;
    }
    else {
        //alert("text 2 longer than text 1!");
        //resize the artboard to be only a little wider than the text 2
        var leftMargin2 = mast.position[0] - sourceDoc.artboards[2].artboardRect[0];
        var newWidth2 = textGroup2.position[0] +
            textGroup2.width -
            sourceDoc.artboards[2].artboardRect[0] +
            leftMargin2 + 8;
        var resizedRect2 = CSTasks.newRect(sourceDoc.artboards[2].artboardRect[0], -sourceDoc.artboards[2].artboardRect[1], newWidth2, 256);
        sourceDoc.artboards[2].artboardRect = resizedRect2;
    }
    // make the text black
    var rgbBlack = new RGBColor();
    rgbBlack.red = 0;
    rgbBlack.green = 0;
    rgbBlack.blue = 0;
    // Loop through each path item in the text group
    for (var i_45 = 0; i_45 < textGroup.pathItems.length; i_45++) {
        textGroup.pathItems[i_45].fillColor = rgbBlack;
    }
    for (var i_46 = 0; i_46 < textGroup2.pathItems.length; i_46++) {
        textGroup2.pathItems[i_46].fillColor = rgbBlack;
    }
    //#endregion
    //#region INDEX ONLY FOR CMYK conversion
    // open a doc just for color indexing
    /*********************************************************************
    All exports from artboard 0
    **********************************************************************/
    var indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 2, DocumentColorSpace.RGB);
    indexRgbDoc.swatches.removeAll();
    var IndexRgbGroup = iconGroup.duplicate(indexRgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var IndexRgbLoc = [
        indexRgbDoc.artboards[0].artboardRect[0],
        indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);
    CSTasks.ungroupOnce(IndexRgbGroup);
    //get the text offset for exporting
    var mastTextOffset2 = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    // duplicate text
    var mastText2 = textGroup.duplicate(indexRgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc2 = [
        indexRgbDoc.artboards[0].artboardRect[0] + mastTextOffset2[0],
        indexRgbDoc.artboards[0].artboardRect[1] + mastTextOffset2[1],
    ];
    // paste text
    CSTasks.translateObjectTo(mastText2, mastTextLoc2);
    app.executeMenuCommand('Colors9');
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);
    //close and clean up 
    indexRgbDoc.close(SaveOptions.DONOTSAVECHANGES);
    indexRgbDoc = null;
    //#endregion
    //#region ARTBOARD2 RGB EXPORTS
    //select the contents on artboard 0
    /********************
    Lockup export core RGB (EPS)
    ********************/
    //open a new doc and copy and position the icon and the lockup text
    var mastDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 2, DocumentColorSpace.RGB);
    mastDoc.swatches.removeAll();
    // duplicate icon
    var mastGroup = iconGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // get correct position
    var mastLoc = [
        mastDoc.artboards[0].artboardRect[0],
        mastDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    // paste icon
    CSTasks.translateObjectTo(mastGroup, mastLoc);
    CSTasks.ungroupOnce(mastGroup);
    //get the text offset for exporting
    var mastTextOffset = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    // duplicate text
    var mastText = textGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc = [
        mastDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
        mastDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
    ];
    // paste text
    CSTasks.translateObjectTo(mastText, mastTextLoc);
    CSTasks.ungroupOnce(mastGroup);
    //get the text 2 offset for exporting
    var mastTextOffset3 = CSTasks.getOffset(textGroup2.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    // duplicate text
    var mastText3 = textGroup2.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc3 = [
        mastDoc.artboards[0].artboardRect[0] + mastTextOffset3[0],
        mastDoc.artboards[0].artboardRect[1] + mastTextOffset3[1],
    ];
    // paste text
    CSTasks.translateObjectTo(mastText3, mastTextLoc3);
    // save a text and lockup PNG
    var masterStartHeight = mastDoc.artboards[0].artboardRect[3] - mastDoc.artboards[0].artboardRect[1];
    var masterStartWidth = mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
    for (var i_47 = 0; i_47 < exportSizes.length; i_47++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_48 = 0; i_48 < exportSizes.length; i_48++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, 256);
    }
    //save a text and lockup EPS
    for (var i_49 = 0; i_49 < exportSizes.length; i_49++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    CSTasks.convertColorRGB(mastDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    CSTasks.convertColorRGB(mastDoc.pathItems, colors[blackIndex][0], colors[whiteIndex][0]);
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex2 = CSTasks.indexRGBColors(mastDoc.pathItems, colors);
    //save a text and lockup PNG
    for (var i_50 = 0; i_50 < exportSizes.length; i_50++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_51 = 0; i_51 < exportSizes.length; i_51++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup EPS
    for (var i_52 = 0; i_52 < exportSizes.length; i_52++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[blackIndex][0], 100);
    // save a text and lockup PNG
    for (var i_53 = 0; i_53 < exportSizes.length; i_53++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_54 = 0; i_54 < exportSizes.length; i_54++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup EPS
    for (var i_55 = 0; i_55 < exportSizes.length; i_55++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[whiteIndex][0], 100);
    // save a text and lockup PNG
    for (var i_56 = 0; i_56 < exportSizes.length; i_56++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_57 = 0; i_57 < exportSizes.length; i_57++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup EPS
    for (var i_58 = 0; i_58 < exportSizes.length; i_58++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[darkGreyIndex][0], 100);
    // save a text and lockup PNG
    for (var i_59 = 0; i_59 < exportSizes.length; i_59++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_60 = 0; i_60 < exportSizes.length; i_60++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[grayIndex][0], 100);
    //save a text and lockup SVG
    for (var i_61 = 0; i_61 < exportSizes.length; i_61++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    // save a text and lockup PNG
    for (var i_62 = 0; i_62 < exportSizes.length; i_62++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
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
        mastDocCMYK.artboards[0].artboardRect[0],
        mastDocCMYK.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    CSTasks.ungroupOnce(mastGroupCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
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
    CSTasks.ungroupOnce(mastGroupCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    app.executeMenuCommand('Colors8');
    CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);
    //get the text line 2 offset for exporting
    var mastTextOffsetCMYK2 = CSTasks.getOffset(textGroup2.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    var mastTextCMYK2 = textGroup2.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var mastTextLocCMYK2 = [
        mastDocCMYK.artboards[0].artboardRect[0] + mastTextOffsetCMYK2[0],
        mastDocCMYK.artboards[0].artboardRect[1] + mastTextOffsetCMYK2[1],
    ];
    CSTasks.translateObjectTo(mastTextCMYK2, mastTextLocCMYK2);
    //save a text and lockup EPS
    for (var i_63 = 0; i_63 < exportSizes.length; i_63++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.ungroupOnce(mastGroupCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    app.executeMenuCommand('Colors8');
    CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex2);
    CSTasks.convertColorCMYK(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //save a text and lockup inverse EPS
    for (var i_64 = 0; i_64 < exportSizes.length; i_64++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    var CMYKblack = new CMYKColor();
    CMYKblack.cyan = 0;
    CMYKblack.magenta = 0;
    CMYKblack.yellow = 0;
    CMYKblack.black = 100;
    // Get a reference to the active document
    var doc = app.activeDocument;
    // Iterate over all path items in the document
    for (var i_65 = 0; i_65 < doc.pathItems.length; i_65++) {
        var path = doc.pathItems[i_65];
        // Change the fill color to CMYK black
        path.fillColor = CMYKblack;
    }
    //save a text and lockup EPS
    for (var i_66 = 0; i_66 < exportSizes.length; i_66++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDocCMYK.pathItems, colors[whiteIndex][0], 100);
    //save a text and lockup EPS
    for (var i_67 = 0; i_67 < exportSizes.length; i_67++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(primaryName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(primaryLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
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
    //select the contents on artboard 1
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
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
    // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
    app.executeMenuCommand('Colors9');
    if (sel.length == 0) {
        //if nothing is in the artboard
        alert("Please try again with artwork on the main second 256x256 artboard.");
        return;
    }
    /********************************
    Create new expressive artboard 3 with lockup and text
    *********************************/
    var mastBannerIconOnText = iconGroup.duplicate(iconGroup.layer, 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
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
    function placeIconOnArtboard3InMainFile(mastBannerIconOnText, maxSize) {
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
    placeIconOnArtboard3InMainFile(mastBannerIconOnText, { W: 460, H: 460 });
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
    mainRect.fillColor = colors[darkPurpleIndex][0];
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
    imagePlacedItem.embed();
    var textRef = sourceDoc.textFrames.add();
    //use the areaText method to create the text frame
    var pathRef = sourceDoc.pathItems.rectangle(-850, -800, 480, 400);
    /*@ts-ignore*/
    textRef = sourceDoc.textFrames.areaText(pathRef);
    textRef.contents = appNamePrimary;
    textRef.textRange.characterAttributes.size = 52;
    textRef.textRange.paragraphAttributes.hyphenation = false;
    // textRef.textRange.characterAttributes.horizontalScale = 2299;
    textRef.textRange.characterAttributes.fillColor = colors[whiteIndex][0];
    CSTasks.setFont(textRef, desiredFontReg);
    //create an outline of the text
    var textGroup = textRef.createOutline();
    //horizontally align the left edge of the text to be 96px to the right of the edge
    var rightEdge = 64;
    var hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
    textGroup.translate(-hOffset[0], 0);
    var textRef2 = sourceDoc.textFrames.add();
    //use the areaText method to create the text frame
    var pathRef2 = sourceDoc.pathItems.rectangle(-910, -800, 480, 400);
    /*@ts-ignore*/
    textRef2 = sourceDoc.textFrames.areaText(pathRef2);
    textRef2.contents = appNamePrimary2;
    textRef2.textRange.characterAttributes.size = 62;
    textRef2.textRange.paragraphAttributes.hyphenation = false;
    // textRef2.textRange.characterAttributes.horizontalScale = 2299;
    textRef2.textRange.characterAttributes.fillColor = colors[whiteIndex][0];
    CSTasks.setFont(textRef2, desiredFontBold);
    //create an outline of the text
    var textGroup2 = textRef2.createOutline();
    //horizontally align the left edge of the text to be 96px to the right of the edge
    var rightEdge2 = 64;
    var hOffset2 = CSTasks.getOffset(textGroup2.position, [rightEdge2, 0]);
    textGroup2.translate(-hOffset2[0], 0);
    var resizedRect = CSTasks.newRect(sourceDoc.artboards[3].artboardRect[0], -sourceDoc.artboards[3].artboardRect[1], 1024, 512);
    sourceDoc.artboards[3].artboardRect = resizedRect;
    //#endregion
    //#region ARTBOARD3 EXPORTS RGB
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
    function placeIconInNewDocArtboard3(mastGroup, maxSize) {
        var setLandingZoneSquareColor = new RGBColor();
        setLandingZoneSquareColor.red = 121;
        setLandingZoneSquareColor.green = 128;
        setLandingZoneSquareColor.blue = 131;
        landingZoneSquare3.fillColor = setLandingZoneSquareColor;
        landingZoneSquare3.name = "LandingZone3";
        landingZoneSquare3.filled = false;
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
    placeIconInNewDocArtboard3(mastGroup, { W: 460, H: 460 });
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
    var mastText2 = textGroup2.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc2 = [
        mastDoc.artboards[0].artboardRect[0] + 63,
        mastDoc.artboards[0].artboardRect[1] - 124,
    ];
    CSTasks.translateObjectTo(mastText2, mastTextLoc2);
    // add new style purple banner elements
    var myMainArtworkLayerMastDoc = mastDoc.layers.getByName('Layer 1');
    var myMainPurpleBgLayerMastDoc = mastDoc.layers.add();
    myMainPurpleBgLayerMastDoc.name = "Main_Purple_BG_layer";
    var GetMyMainPurpleBgLayerMastDoc = mastDoc.layers.getByName('Main_Purple_BG_layer');
    var mainRectMastDoc = GetMyMainPurpleBgLayerMastDoc.pathItems.rectangle(-784, 0, 1024, 512);
    mainRectMastDoc.filled = true;
    mainRectMastDoc.fillColor = colors[darkPurpleIndex][0];
    mainRectMastDoc.stroked = false;
    /*@ts-ignore*/
    GetMyMainPurpleBgLayerMastDoc.move(myMainArtworkLayerMastDoc, ElementPlacement.PLACEATEND);
    // svg wtw logo for new purple lockup
    var imagePlacedItemMastDoc = myMainArtworkLayerMastDoc.placedItems.add();
    var svgFileMastDoc = File("".concat(sourceDoc.path, "/../images/wtw_logo.ai"));
    imagePlacedItemMastDoc.file = svgFileMastDoc;
    imagePlacedItemMastDoc.top = -1189;
    imagePlacedItemMastDoc.left = 62;
    imagePlacedItemMastDoc.embed();
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
    mainClipRectMastDoc.filled = false;
    mainClipRectMastDoc.fillColor = setClipBgColorMastDoc;
    // select all for clipping here
    sourceDoc.selectObjectsOnActiveArtboard();
    // clip!
    app.executeMenuCommand('makeMask');
    app.executeMenuCommand('Colors9');
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(mastDoc.pathItems, colors);
    //save a banner PNG
    for (var i_68 = 0; i_68 < exportSizes.length; i_68++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(expressiveArtworkName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, 512, 1024);
    }
    //save a banner SVG
    for (var i_69 = 0; i_69 < exportSizes.length; i_69++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(expressiveArtworkName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
    }
    // save banner JPG
    for (var i_70 = 0; i_70 < exportSizes.length; i_70++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(expressiveArtworkName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".jpg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(jpgName)) + filename);
        CSTasks.scaleAndExportJPEG(mastDoc, destFile, 512, 1024);
    }
    // save banner EPS
    for (var i_71 = 0; i_71 < exportSizes.length; i_71++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(expressiveArtworkName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(epsName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    //close and clean up
    mastDoc.close(SaveOptions.DONOTSAVECHANGES);
    mastDoc = null;
    //#endregion
    //#region ARTBOARD3 EXPORTS CMYK
    /********************
        Purple Lockup with text export in new file to save
        ********************/
    //open a new doc and copy and position the icon and the lockup text
    // duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
    var mastDocCMYK = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 3, DocumentColorSpace.CMYK);
    mastDocCMYK.swatches.removeAll();
    // let textRef = mastDocCMYK.textFrames.add();
    //create an outline of the text
    // let textGroup = textRef.createOutline();
    var mastGroupCMYK = iconGroup.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // new icon width in rebrand
    // mastGroupCMYK.width = 460;
    // mastGroupCMYK.height = 460;
    // new icon position
    var mastLocCMYK = [
        mastDocCMYK.artboards[0].artboardRect[0],
        mastDocCMYK.artboards[0].artboardRect[1],
    ];
    CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);
    /********************************
    Custom function to create a landing square to place the icon correctly
    Some icons have width or height less than 256 so it needed special centering geometrically
    you can see the landing zone square by changing fill to true and uncommenting color
    *********************************/
    // create a landing zone square to place icon inside
    //moved it outside the function itself so we can delete it after so it doesn't get exported
    var getArtLayer4 = mastDocCMYK.layers.getByName('Layer 1');
    var landingZoneSquare4 = getArtLayer4.pathItems.rectangle(-845, 571, 460, 460);
    function placeIconLockup1Correctly4(mastGroupCMYK, maxSize) {
        // let setLandingZoneSquareColor = new RGBColor();
        // setLandingZoneSquareColor.red = 121;
        // setLandingZoneSquareColor.green = 128;
        // setLandingZoneSquareColor.blue = 131;
        // landingZoneSquare4.fillColor = setLandingZoneSquareColor;
        landingZoneSquare4.name = "LandingZone3";
        landingZoneSquare4.filled = false;
        /*@ts-ignore*/
        landingZoneSquare4.move(getArtLayer4, ElementPlacement.PLACEATEND);
        // start moving expressive icon into our new square landing zone
        var placedmastGroupCMYK = mastGroupCMYK;
        var landingZone = mastDocCMYK.pathItems.getByName("LandingZone3");
        var preferredWidth = (460);
        var preferredHeight = (460);
        // do the width
        var widthRatio = (preferredWidth / placedmastGroupCMYK.width) * 100;
        if (placedmastGroupCMYK.width != preferredWidth) {
            placedmastGroupCMYK.resize(widthRatio, widthRatio);
        }
        // now do the height
        var heightRatio = (preferredHeight / placedmastGroupCMYK.height) * 100;
        if (placedmastGroupCMYK.height != preferredHeight) {
            placedmastGroupCMYK.resize(heightRatio, heightRatio);
        }
        // now let's center the art on the landing zone
        var centerArt = [placedmastGroupCMYK.left + (placedmastGroupCMYK.width / 2), placedmastGroupCMYK.top + (placedmastGroupCMYK.height / 2)];
        var centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
        placedmastGroupCMYK.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);
        // need another centered proportioning to fix it exactly in correct position
        var W = mastGroupCMYK.width, H = mastGroupCMYK.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
        mastGroupCMYK.resize(factor, factor);
    }
    placeIconLockup1Correctly4(mastGroupCMYK, { W: 460, H: 460 });
    // delete the landing zone
    landingZoneSquare4.remove();
    CSTasks.ungroupOnce(mastGroupCMYK);
    var mastTextCMYK = textGroup.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextCMYKLoc = [
        mastDocCMYK.artboards[0].artboardRect[0] + 63,
        mastDocCMYK.artboards[0].artboardRect[1] - 64,
    ];
    CSTasks.translateObjectTo(mastTextCMYK, mastTextCMYKLoc);
    var mastTextCMYK2 = textGroup2.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextCMYKLoc2 = [
        mastDocCMYK.artboards[0].artboardRect[0] + 63,
        mastDocCMYK.artboards[0].artboardRect[1] - 124,
    ];
    CSTasks.translateObjectTo(mastTextCMYK2, mastTextCMYKLoc2);
    // add new style purple banner elements
    var myMainArtworkLayerMastDocCMYK = mastDocCMYK.layers.getByName('Layer 1');
    var myMainPurpleBgLayerMastDocCMYK = mastDocCMYK.layers.add();
    myMainPurpleBgLayerMastDocCMYK.name = "Main_Purple_BG_layer";
    var GetMyMainPurpleBgLayerMastDocCMYK = mastDocCMYK.layers.getByName('Main_Purple_BG_layer');
    var mainRectMastDocCMYK = GetMyMainPurpleBgLayerMastDocCMYK.pathItems.rectangle(-784, 0, 1024, 512);
    mainRectMastDocCMYK.fillColor = colors[darkPurpleIndex][0];
    mainRectMastDocCMYK.filled = true;
    mainRectMastDocCMYK.stroked = false;
    /*@ts-ignore*/
    GetMyMainPurpleBgLayerMastDocCMYK.move(myMainArtworkLayerMastDocCMYK, ElementPlacement.PLACEATEND);
    // svg wtw logo for new purple lockup
    var imagePlacedItemMastDocCMYK = myMainArtworkLayerMastDocCMYK.placedItems.add();
    var svgFileMastDocCMYK = File("".concat(sourceDoc.path, "/../images/wtw_logo.ai"));
    imagePlacedItemMastDocCMYK.file = svgFileMastDocCMYK;
    imagePlacedItemMastDocCMYK.top = -1189;
    imagePlacedItemMastDocCMYK.left = 62;
    imagePlacedItemMastDocCMYK.embed();
    // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
    var myCroppingLayerMastDocCMYK = mastDocCMYK.layers.add();
    myCroppingLayerMastDocCMYK.name = "crop";
    var GetMyCroppingLayerMastDocCMYK = mastDocCMYK.layers.getByName('crop');
    mastDocCMYK.activeLayer = GetMyCroppingLayerMastDocCMYK;
    mastDocCMYK.activeLayer.hasSelectedArtwork = true;
    // insert clipping rect here
    var mainClipRectMastDocCMYK = GetMyCroppingLayerMastDocCMYK.pathItems.rectangle(-784, 0, 1024, 512);
    // let setClipBgColorMastDocCMYK = new CMYKColor();
    // setClipBgColorMastDocCMYK.cyan = 90;
    // setClipBgColorMastDocCMYK.magenta = 100;
    // setClipBgColorMastDocCMYK.yellow = 22;
    // setClipBgColorMastDocCMYK.black = 11;
    mainClipRectMastDocCMYK.filled = false;
    //mainClipRectMastDocCMYK.fillColor = setClipBgColorMastDocCMYK;
    // select all for clipping here
    sourceDoc.selectObjectsOnActiveArtboard();
    // clip!
    app.executeMenuCommand('makeMask');
    // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
    app.executeMenuCommand('Colors8');
    CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);
    // save banner EPS 
    for (var i_72 = 0; i_72 < exportSizes.length; i_72++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(expressiveIconName, "_").concat(expressiveArtworkName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveFolderName, "/").concat(iconInLayoutFolderName, "/").concat(epsName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    //close and clean up
    mastDocCMYK.close(SaveOptions.DONOTSAVECHANGES);
    mastDocCMYK = null;
    //#endregion
}
createAndExportArtboard3();
function createAndExportArtboard4Alternate() {
    //#region ARTBOARD4 CREATION
    //select the contents on artboard 0
    //place icon and text in the first generated lockup artboard 
    /*****************************
This block creates the 2nd artboard,
it has to remain here or the inverse function doesn't work correctly
******************************/
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    /********************************
Create new artboard with text lockup
*********************************/
    //if there are four artboards, create the new fifth lockup artboard
    if (sourceDoc.artboards.length == 4 &&
        sourceDoc.artboards[0].artboardRect[2] -
            sourceDoc.artboards[0].artboardRect[0] ==
            256 &&
        sourceDoc.artboards[0].artboardRect[1] -
            sourceDoc.artboards[0].artboardRect[3] ==
            256) {
        // create new artboard
        var firstRect = sourceDoc.artboards[0].artboardRect;
        sourceDoc.artboards.add(CSTasks.newRect(firstRect[1], firstRect[2] + 1168, 2400, 256));
    }
    //if the lockup artboard is present, check if rebuilding or just exporting
    else if (sourceDoc.artboards.length == 5 &&
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
    if (sel.length == 0) {
        //if nothing is in the artboard
        alert("Please try again with artwork on the main 256x256 artboard.");
        return;
    }
    // get icon
    var mast = iconGroup.duplicate(iconGroup.layer, 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // get icon new pos
    var mastPos = [
        sourceDoc.artboards[4].artboardRect[0],
        sourceDoc.artboards[4].artboardRect[1] + iconOffset[1],
    ];
    // paste icon
    CSTasks.translateObjectTo(mast, mastPos);
    // add text from prompt
    var textRef = sourceDoc.textFrames.add();
    textRef.contents = appNameAlternate;
    textRef.textRange.characterAttributes.size = 182;
    CSTasks.setFont(textRef, desiredFontReg);
    //vertically align the baseline to be 64 px above the bottom of the artboard
    var bottomEdge = sourceDoc.artboards[4].artboardRect[3] +
        0.25 * sourceDoc.artboards[0].artboardRect[2] -
        sourceDoc.artboards[4].artboardRect[0]; //64px (0.25*256px) above the bottom edge of the artboard
    var vOffset = CSTasks.getOffset(textRef.anchor, [0, bottomEdge]);
    textRef.translate(0, -vOffset[1]);
    //create an outline of the text
    var textGroup = textRef.createOutline();
    //horizontally align the left edge of the text to be 64px to the right of the edge
    var rightEdge = mast.position[0] +
        mast.width +
        64; //64px (0.25*256px) right of the icon
    // alert(mast.position[0].toString())
    // alert(mast.width.toString())
    // alert(rightEdge.toString())
    var hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
    textGroup.translate(-hOffset[0], 0);
    //resize the artboard to be only a little wider than the text
    var leftMargin = mast.position[0] - sourceDoc.artboards[4].artboardRect[0];
    var newWidth = textGroup.position[0] +
        textGroup.width -
        sourceDoc.artboards[4].artboardRect[0] +
        leftMargin + 8;
    var resizedRect = CSTasks.newRect(sourceDoc.artboards[4].artboardRect[0], -sourceDoc.artboards[4].artboardRect[1], newWidth, 256);
    sourceDoc.artboards[4].artboardRect = resizedRect;
    // make the text black
    var rgbBlack = new RGBColor();
    rgbBlack.red = 0;
    rgbBlack.green = 0;
    rgbBlack.blue = 0;
    // Loop through each path item in the text group
    for (var i_73 = 0; i_73 < textGroup.pathItems.length; i_73++) {
        textGroup.pathItems[i_73].fillColor = rgbBlack;
    }
    //#endregion
    //#region INDEX ONLY FOR CMYK conversion
    // open a doc just for color indexing
    /*********************************************************************
All exports from artboard 0
**********************************************************************/
    var indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 4, DocumentColorSpace.RGB);
    indexRgbDoc.swatches.removeAll();
    var IndexRgbGroup = iconGroup.duplicate(indexRgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var IndexRgbLoc = [
        indexRgbDoc.artboards[0].artboardRect[0],
        indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);
    CSTasks.ungroupOnce(IndexRgbGroup);
    //get the text offset for exporting
    var mastTextOffset2 = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    // duplicate text
    var mastText2 = textGroup.duplicate(indexRgbDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc2 = [
        indexRgbDoc.artboards[0].artboardRect[0] + mastTextOffset2[0],
        indexRgbDoc.artboards[0].artboardRect[1] + mastTextOffset2[1],
    ];
    // paste text
    CSTasks.translateObjectTo(mastText2, mastTextLoc2);
    app.executeMenuCommand('Colors9');
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);
    //close and clean up 
    indexRgbDoc.close(SaveOptions.DONOTSAVECHANGES);
    indexRgbDoc = null;
    //#endregion
    //#region ARTBOARD2 RGB EXPORTS
    //select the contents on artboard 0
    /********************
    Lockup export core RGB (EPS)
    ********************/
    //open a new doc and copy and position the icon and the lockup text
    var mastDoc = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 4, DocumentColorSpace.RGB);
    mastDoc.swatches.removeAll();
    // duplicate icon
    var mastGroup = iconGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // get correct position
    var mastLoc = [
        mastDoc.artboards[0].artboardRect[0],
        mastDoc.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    // paste icon
    CSTasks.translateObjectTo(mastGroup, mastLoc);
    CSTasks.ungroupOnce(mastGroup);
    //get the text offset for exporting
    var mastTextOffset = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    // duplicate text
    var mastText = textGroup.duplicate(mastDoc.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    // text position
    var mastTextLoc = [
        mastDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
        mastDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
    ];
    // paste text
    CSTasks.translateObjectTo(mastText, mastTextLoc);
    // save a text and lockup PNG
    var masterStartHeight = mastDoc.artboards[0].artboardRect[3] - mastDoc.artboards[0].artboardRect[1];
    var masterStartWidth = mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
    for (var i_74 = 0; i_74 < exportSizes.length; i_74++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_75 = 0; i_75 < exportSizes.length; i_75++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, 256);
    }
    //save a text and lockup EPS
    for (var i_76 = 0; i_76 < exportSizes.length; i_76++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    // you need this to invert correctly
    app.executeMenuCommand('Colors9');
    CSTasks.convertColorRGB(mastDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    CSTasks.convertColorRGB(mastDoc.pathItems, colors[blackIndex][0], colors[whiteIndex][0]);
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex2 = CSTasks.indexRGBColors(mastDoc.pathItems, colors);
    //save a text and lockup PNG
    for (var i_77 = 0; i_77 < exportSizes.length; i_77++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_78 = 0; i_78 < exportSizes.length; i_78++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup EPS
    for (var i_79 = 0; i_79 < exportSizes.length; i_79++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[blackIndex][0], 100);
    // save a text and lockup PNG
    for (var i_80 = 0; i_80 < exportSizes.length; i_80++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_81 = 0; i_81 < exportSizes.length; i_81++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup EPS
    for (var i_82 = 0; i_82 < exportSizes.length; i_82++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDoc.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDoc.pathItems, colors[whiteIndex][0], 100);
    // save a text and lockup PNG
    for (var i_83 = 0; i_83 < exportSizes.length; i_83++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(pngName)) + filename);
        CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup SVG
    for (var i_84 = 0; i_84 < exportSizes.length; i_84++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
    }
    //save a text and lockup EPS
    for (var i_85 = 0; i_85 < exportSizes.length; i_85++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".eps");
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
    var mastDocCMYK = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 4, DocumentColorSpace.CMYK);
    mastDocCMYK.swatches.removeAll();
    var mastGroupCMYK = iconGroup.duplicate(mastDocCMYK.layers[0], 
    /*@ts-ignore*/
    ElementPlacement.PLACEATEND);
    var mastLocCMYK = [
        mastDocCMYK.artboards[0].artboardRect[0],
        mastDocCMYK.artboards[0].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    CSTasks.ungroupOnce(mastGroupCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
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
    CSTasks.ungroupOnce(mastGroupCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    app.executeMenuCommand('Colors8');
    CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);
    //save a text and lockup EPS
    for (var i_86 = 0; i_86 < exportSizes.length; i_86++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.ungroupOnce(mastGroupCMYK);
    mastDocCMYK.selectObjectsOnActiveArtboard();
    app.executeMenuCommand('Colors8');
    CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex2);
    CSTasks.convertColorCMYK(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //save a text and lockup inverse EPS
    for (var i_87 = 0; i_87 < exportSizes.length; i_87++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    var CMYKblack = new CMYKColor();
    CMYKblack.cyan = 0;
    CMYKblack.magenta = 0;
    CMYKblack.yellow = 0;
    CMYKblack.black = 100;
    // Get a reference to the active document
    var doc = app.activeDocument;
    // Iterate over all path items in the document
    for (var i_88 = 0; i_88 < doc.pathItems.length; i_88++) {
        var path = doc.pathItems[i_88];
        // Change the fill color to CMYK black
        path.fillColor = CMYKblack;
    }
    //save a text and lockup EPS
    for (var i_89 = 0; i_89 < exportSizes.length; i_89++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(blackColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    CSTasks.convertAll(mastDocCMYK.pathItems, colors[whiteIndex][0], 100);
    //save a text and lockup EPS
    for (var i_90 = 0; i_90 < exportSizes.length; i_90++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(alternateName, "_").concat(oneColorName, "_").concat(standardName, "_").concat(whiteColorName, "_").concat(fourColorProcessName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(alternativeLockupFolderName, "/").concat(epsName, "/").concat(cmykName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        mastDocCMYK.saveAs(destFile, rgbSaveOpts);
    }
    //close and clean up
    mastDocCMYK.close(SaveOptions.DONOTSAVECHANGES);
    mastDocCMYK = null;
    //#endregion
}
createAndExportArtboard4Alternate();
// this opens the folder where the assets are saved
var scriptsFolder = Folder(sourceDoc.path + "/");
scriptsFolder.execute();
