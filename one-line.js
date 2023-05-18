// #target Illustrator 
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
alert(" \n\nThis is the one line script   \n\nThis script only works locally not on a server. \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/WTW_107405_product_logo_template_script   \n\nVideo set up tutorial available here: https://youtu.be/XXXXXXXXXX. \n\nOpen your own.ai template or the provided ones in folders called test. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Make sure you have the Graphik font installed on your CPU. \n\nYou must have the folder called images in the parent folder, this is where wtw_logo.ai is saved so it can be imported into the big purple banner and exported as assets. Otherwise you will get an error that says error = svgFile. If the svgFile is still not working, try opening it again in Illustrator and save as, this happens because your Illustrator has been updated to a newer version. \n\nIllustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease use underscores instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");
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
// New
var wtwName = "wtw";
//New asset types names
var primaryName = "pri";
var alternateName = "alt";
var iconName = "icn";
var expressiveIconName = "exp_icn";
var expressiveArtworkName = "art_icn";
// New color names
var fullColorName = "fc";
var oneColorName = "1c";
// New style names
var standardName = "std";
var inactiveName = "inact";
var inactiveFolderName = "inactive";
var positiveFolderName = "positive";
var inverseTransparentFolderName = "inverse_transparent_bg";
var inverseWhiteBgFolderName = "inverse_white_bg";
// New artwork color names
var positiveColorName = "pos";
var inverseColorName = "inv";
var blackColorName = "blk";
var whiteColorName = "wht";
// New bg color names
var transparentBgColorName = "t";
var whiteBgColorName = "w";
var blackBgColorName = "k";
// New color mode names
var fourColorProcessName = "4cp";
var pantoneColorName = "pms";
var rgbColorName = "rgb";
// New size names
var croppedToArtworkName = "crp";
// New folder names
var primaryLockupFolderName = "Primary_lockup";
var alternativeLockupFolderName = "Alternate_lockup";
var iconFolderName = "Icon";
var iconInLayoutFolderName = "Icon_in_layout";
var expressiveFolderName = "Expressive";
//End new
// Lockups
var lockupName = "Lockup";
var lockup1 = "Lockup1";
var lockup2 = "Lockup2";
var eightByFour = "800x400";
var tenByFive = "1024x512";
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
// let gutter = 32;
// hide guides
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
        for (i = 0; i < collection.length; i++) {
            collection[i].moveToBeginning(newGroup);
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
        var rect = [];
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
        var foundFont = false;
        /*@ts-ignore*/
        for (var i_1 = 0; i_1 < textFonts.length; i_1++) {
            /*@ts-ignore*/
            if (textFonts[i_1].name == desiredFont) {
                /*@ts-ignore*/
                textRef.textRange.characterAttributes.textFont = textFonts[i_1];
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
        for (var i_2 = 0; i_2 < RGBArray.length; i_2++) {
            var rgb = new RGBColor();
            rgb.red = RGBArray[i_2][0];
            rgb.green = RGBArray[i_2][1];
            rgb.blue = RGBArray[i_2][2];
            var cmyk = new CMYKColor();
            cmyk.cyan = CMYKArray[i_2][0];
            cmyk.magenta = CMYKArray[i_2][1];
            cmyk.yellow = CMYKArray[i_2][2];
            cmyk.black = CMYKArray[i_2][3];
            colors[i_2] = [rgb, cmyk];
        }
        return colors;
    };
    //take a single RGBColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
    //returns the index in the array if it finds a match, otherwise returns -1
    tasks.matchRGB = function (color, matchArray) {
        //compares a single color RGB color against RGB colors in [[RGB],[CMYK]] array
        for (var i_3 = 0; i_3 < matchArray.length; i_3++) {
            if (Math.abs(color.red - matchArray[i_3][0].red) < 1 &&
                Math.abs(color.green - matchArray[i_3][0].green) < 1 &&
                Math.abs(color.blue - matchArray[i_3][0].blue) < 1) {
                //can't do equality because it adds very small decimals
                return i_3;
            }
        }
        return -1;
    };
    //take a single RGBColor and an array of corresponding RGB and CMYK colors [[RGBColor,CMYKColor],[RGBColor2,CMYKColor2],...]
    //returns the index in the array if it finds a match, otherwise returns -1
    tasks.matchColorsRGB = function (color1, color2) {
        //compares two colors to see if they match
        if (Math.abs(color1.red - color2.red) < 1 &&
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
        if (Math.abs(color1.cyan - color2.cyan) < 1 &&
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
        var colorIndex = new Array(pathItems.length);
        for (i = 0; i < pathItems.length; i++) {
            var itemColor = pathItems[i].fillColor;
            colorIndex[i] = tasks.matchRGB(itemColor, matchArray);
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
            alert("One or more colors don't match the brand palette and weren't converted.");
            unmatchedColors = tasks.unique(unmatchedColors);
            var unmatchedString = "Unconverted colors:";
            for (var i_4 = 0; i_4 < unmatchedColors.length; i_4++) {
                unmatchedString = unmatchedString + "\n" + unmatchedColors[i_4];
            }
            var errorMsgPos = [Infinity, Infinity]; //gets the bottom left of all the artboards
            for (var i_5 = 0; i_5 < doc.artboards.length; i_5++) {
                var rect = doc.artboards[i_5].artboardRect;
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
            for (var i_6 = 1; i_6 < sorted.length; i_6++) {
                if (sorted[i_6] != sorted[i_6 - 1])
                    uniq.push(sorted[i_6]);
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
function iconGen() {
    /******************
    set up artboards
    ******************/
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
        sourceDoc.artboards.add(
        // CSTasks.newRect(firstRect[1] * 2.5 + gutter, firstRect[2], 2400, 256)
        // CSTasks.newRect(firstRect[1] * 0.5, firstRect[2], 2400, 256)
        CSTasks.newRect(firstRect[1], firstRect[2] + 128, 2400, 256));
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
    //select the contents on artboard 0
    var sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
    // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
    app.executeMenuCommand('Colors9');
    if (sel.length == 0) {
        //if nothing is in the artboard
        alert("Please try again with artwork on the main 256x256 artboard.");
        return;
    }
    var colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
    var iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
    var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[0]));
    /********************************
    Create new artboard with lockup
    *********************************/
    //place icon on lockup
    /*@ts-ignore*/
    var mast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
    var mastPos = [
        sourceDoc.artboards[2].artboardRect[0] + iconOffset[0],
        sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
    ];
    CSTasks.translateObjectTo(mast, mastPos);
    var textRef = sourceDoc.textFrames.add();
    textRef.contents = appNameCore;
    textRef.textRange.characterAttributes.size = 178;
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
        leftMargin;
    var resizedRect = CSTasks.newRect(sourceDoc.artboards[2].artboardRect[0], -sourceDoc.artboards[2].artboardRect[1], newWidth, 256);
    sourceDoc.artboards[2].artboardRect = resizedRect;
    //get the text offset for exporting
    var mastTextOffset = CSTasks.getOffset(textGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[2]));
    /*********************************************************************
    RGB export (EPS, PNGs at multiple sizes, inactive EPS and inverse EPS)
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
    var masterStartWidth = rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
    for (var i_7 = 0; i_7 < exportSizes.length; i_7++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(exportSizes[i_7], ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(positiveFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i_7]);
    }
    //save a classic EPS into the icon folder
    for (var i_8 = 0; i_8 < exportSizes.length; i_8++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".eps");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + filename);
        var rgbSaveOpts = new EPSSaveOptions();
        /*@ts-ignore*/
        rgbSaveOpts.cmykPostScript = false;
        rgbDoc.saveAs(destFile, rgbSaveOpts);
    }
    //save a classic SVG in icon folder 
    var svgMasterCoreStartWidth = rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
    for (var i_9 = 0; i_9 < exportSizes.length; i_9++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(positiveColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //index the RGB colors for conversion to CMYK. An inelegant location.
    var colorIndex = CSTasks.indexRGBColors(rgbDoc.pathItems, colors);
    //convert violet to white and save as EPS
    CSTasks.convertColorRGB(rgbDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    //save set of inverted pngs in icon folder
    for (var i_10 = 0; i_10 < exportSizes.length; i_10++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, "__").concat(exportSizes[i_10], ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inverseTransparentFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i_10]);
    }
    // save an inverted eps in icon folder
    for (var i_11 = 0; i_11 < exportSizes.length; i_11++) {
        var inverseFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".eps");
        var inverseFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + inverseFilename);
        var rgbSaveOpts = new EPSSaveOptions();
        rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    }
    // save inverted svg in icon folder
    for (var i_12 = 0; i_12 < exportSizes.length; i_12++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(standardName, "_").concat(inverseColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to inactive color (WTW Icon grey at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[grayIndex][0], 100);
    // save an inactive png to icon folder
    for (var i_13 = 0; i_13 < exportSizes.length; i_13++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(rgbColorName, ".png");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(pngName, "/").concat(inactiveFolderName)) + filename);
        CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
    }
    // save an inactive svg to icon folder 
    for (var i_14 = 0; i_14 < exportSizes.length; i_14++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to white color (WTW Icon white at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[whiteIndex][0], 100);
    // save a white eps in icon folder
    for (var i_15 = 0; i_15 < exportSizes.length; i_15++) {
        var inverseFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".eps");
        var inverseFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + inverseFilename);
        var rgbSaveOpts = new EPSSaveOptions();
        rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    }
    // save white svg in icon folder
    for (var i_16 = 0; i_16 < exportSizes.length; i_16++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
    //convert to black color (WTW Icon black at 100% opacity) and save 
    CSTasks.convertAll(rgbDoc.pathItems, colors[blackIndex][0], 100);
    // save a black eps in icon folder
    for (var i_17 = 0; i_17 < exportSizes.length; i_17++) {
        var inverseFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(rgbColorName, ".eps");
        var inverseFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(rgbName)) + inverseFilename);
        var rgbSaveOpts = new EPSSaveOptions();
        rgbDoc.saveAs(inverseFile, rgbSaveOpts);
    }
    // save a black svg in icon folder
    for (var i_18 = 0; i_18 < exportSizes.length; i_18++) {
        var filename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(rgbColorName, ".svg");
        var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgName)) + filename);
        CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
    }
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
    for (var i_19 = 0; i_19 < exportSizes.length; i_19++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(positiveColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    // inverse color cmyk doc
    CSTasks.convertColorCMYK(cmykDoc.pathItems, colors[violetIndex][1], colors[whiteIndex][1]);
    for (var i_20 = 0; i_20 < exportSizes.length; i_20++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(inverseColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    //convert to white color cmyk doc (WTW Icon white at 100% opacity) and save 
    CSTasks.convertAll(cmykDoc.pathItems, colors[whiteIndex][0], 100);
    for (var i_21 = 0; i_21 < exportSizes.length; i_21++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    //convert to black color cmyk doc (WTW Icon black at 100% opacity) and save EPS
    CSTasks.convertAll(cmykDoc.pathItems, colors[blackIndex][0], 100);
    for (var i_22 = 0; i_22 < exportSizes.length; i_22++) {
        var cmykFilename = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(fourColorProcessName, ".eps");
        var cmykDestFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(epsName, "/").concat(cmykName)) + cmykFilename);
        var cmykSaveOpts = new EPSSaveOptions();
        cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
    }
    //close and clean up
    cmykDoc.close(SaveOptions.DONOTSAVECHANGES);
    cmykDoc = null;
    /*********************************************************************
    RGB cropped export (JPG, PNGs at 16 and 24 sizes), squares, cropped to artwork
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
    for (var i_23 = 0; i_23 < exportSizes.length; i_23++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(positiveColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert violet to white and save as EPS
    CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
    // Save a inversed cropped SVG 
    for (var i_24 = 0; i_24 < exportSizes.length; i_24++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(fullColorName, "_").concat(inverseColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert color to white
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[whiteIndex][0], 100);
    // Save a white cropped SVG 
    for (var i_25 = 0; i_25 < exportSizes.length; i_25++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(whiteColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert to black color
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[blackIndex][0], 100);
    // Save a black cropped SVG 
    for (var i_26 = 0; i_26 < exportSizes.length; i_26++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(blackColorName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //convert to inactive color
    CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], 100);
    // Save a inactive cropped SVG 
    for (var i_27 = 0; i_27 < exportSizes.length; i_27++) {
        var filenameCroppedSvg = "/".concat(wtwName, "_").concat(iconFilename, "_").concat(iconName, "_").concat(oneColorName, "_").concat(inactiveName, "_").concat(rgbColorName, "_").concat(croppedToArtworkName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(iconFolderName, "/").concat(svgCroppedName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
    }
    //close and clean up
    rgbDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
    rgbDocCroppedVersion = null;
    /************
    Final cleanup
    ************/
    CSTasks.ungroupOnce(iconGroup);
    CSTasks.ungroupOnce(mast);
    sourceDoc.selection = null;
}
iconGen();
