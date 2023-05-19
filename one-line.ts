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
let sourceDoc = app.activeDocument;
let RGBColorElements = [
	[127, 53, 178], //ultraviolet purple
	[191, 191, 191], //Gray matter light grey INACTIVE
	[201, 0, 172], // Fireworks magenta
	[50, 127, 239], //Stratosphere blue
	[58, 220, 201], // Inifinity turquoise
	[255, 255, 255], // white
	[0, 0, 0], // Black
];
// New CMYK values dont math rgb exatcly in new branding 2022 so we stopped the exact comparison part of the script.
// Intent is different colors in print for optimum pop of colors
let CMYKColorElements = [
	[65, 91, 0, 0], //ultraviolet purple
	[0, 0, 0, 25], //Gray matter light grey INACTIVE
	[16, 96, 0, 0], // Fireworks magenta
	[78, 47, 0, 0], //Stratosphere blue
	[53, 0, 34, 0], // Inifinity turquoise  
	[0, 0, 0, 0], // white
	[0, 0, 0, 100], // Black
];
// Make sure you have the font below installed, ask for font from client
let desiredFont = "Graphik-Regular";
let exportSizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16]; //sizes to export
let violetIndex = 0; //these are for converting to inverse and inactive versions
let grayIndex = 1;
let whiteIndex = 5;
let blackIndex = 6;
//loop default 
let i;
// folder and naming creations

let sourceDocName = sourceDoc.name.slice(0, -3);
let iconFilename = sourceDoc.name.split(".")[0];
let name = sourceDoc.name.split(".")[0];
let destFolder = Folder(sourceDoc.path + "/" + name);


// New
let wtwName = "wtw";
//New asset types names
let primaryName = "pri";
let alternateName = "alt";
let iconName = "icn";
let expressiveIconName = "exp";
let expressiveArtworkName = "art";

// New color names
let fullColorName = "fc";
let oneColorName = "1c";

// New style names
let standardName = "std";
let inactiveName = "inact";


// New artwork color names
let positiveColorName = "pos";
let inverseColorName = "inv";
let blackColorName = "blk";
let whiteColorName = "wht";

// New bg color names
let transparentBgColorName = "t";
let whiteBgColorName = "w";
let blackBgColorName = "k";

// New color mode names
let fourColorProcessName = "4cp";
let pantoneColorName = "pms";
let rgbColorName = "rgb";

// New size names
let croppedToArtworkName = "crp";

// New folder names
let primaryLockupFolderName = "Primary_lockup";
let alternativeLockupFolderName = "Alternate_lockup";
let iconFolderName = "Icon";
let iconInLayoutFolderName = "Icon_in_layout";
let expressiveFolderName = "Expressive";
let inactiveFolderName = "inactive";
let positiveFolderName = "positive";
let inverseTransparentFolderName = "inverse_transparent_bg";
let inverseWhiteBgFolderName = "inverse_white_bg";
//End new
// Lockups
let lockupName = "Lockup";
let lockup1 = "Lockup1";
let lockup2 = "Lockup2";
let eightByFour = "800x400";
let tenByFive = "1024x512";

// Colors
let rgbName = "RGB";
let cmykName = "CMYK";
//Folder creations
let pngName = "png";
let jpgName = "jpg";
let svgName = "svg";
let svgCroppedName = "svg_cropped";
let epsName = "eps";
let rebuild = true;
// let gutter = 32;
// hide guides
let guideLayer = sourceDoc.layers["Guidelines"];

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
	// New folders
	// Primary lockup folders
	new Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${cmykName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${rgbName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`).create();
	// Alternate lockup folders
	new Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${rgbName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`).create();
	// Icon lockup folders
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inactiveFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${positiveFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inverseTransparentFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inverseWhiteBgFolderName}`).create();
	// Expressive lockup folders
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgCroppedName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${jpgName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${svgName}`).create();
	new Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${pngName}`).create();

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



function iconGen() {

	/*****************************
This block creates the 3rd artboard, 
it has to remain here or the inverse function doesn't work correctly up to line 784
******************************/
	//select the contents on artboard 0
	let sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
	let colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
	let iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
	let iconOffset = CSTasks.getOffset(
		iconGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	/********************************
	Create new artboard with text lockup
	*********************************/
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


	// make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
	app.executeMenuCommand('Colors9');

	if (sel.length == 0) {
		//if nothing is in the artboard
		alert("Please try again with artwork on the main 256x256 artboard.");
		return;
	}

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
	textRef.textRange.characterAttributes.size = 179;
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



	// new position of icon in text banner 1 without padding
	mastPos = [
		sourceDoc.artboards[2].artboardRect[0],
		sourceDoc.artboards[2].artboardRect[1],
	];
	CSTasks.translateObjectTo(mast, mastPos);

	//make icon fill whole area

	function placeIconLockup1Correctly0(mast, maxSize) {
		let getArtLayer = sourceDoc.layers.getByName('Art');
		let landingZoneSquare = getArtLayer.pathItems.rectangle(
			-384,
			0,
			256,
			256);
		let setLandingZoneSquareColor = new RGBColor();
		setLandingZoneSquareColor.red = 12;
		setLandingZoneSquareColor.green = 28;
		setLandingZoneSquareColor.blue = 151;
		landingZoneSquare.fillColor = setLandingZoneSquareColor;
		landingZoneSquare.name = "LandingZone"
		landingZoneSquare.filled = false;
		/*@ts-ignore*/
		landingZoneSquare.move(getArtLayer, ElementPlacement.PLACEATEND);
		// start moving expressive icon into our new square landing zone
		let placedmastBannerIconOnText = mast;
		let landingZone = sourceDoc.pathItems.getByName("LandingZone");
		let preferredWidth = (256);
		let preferredHeight = (256);
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

		//do it again to be sure
		let W = mast.width,
			H = mast.height,
			MW = maxSize.W,
			MH = maxSize.H,
			factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
		mast.resize(factor, factor);
	}
	placeIconLockup1Correctly0(mast, { W: 256, H: 256 });

	// mast.left = 0;
	// mast.top = -384;

	/*********************************************************************
	All exports from artboard 0
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

	//save the classic PNGs in icon folder
	let masterStartWidth =
		rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
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
	// let svgMasterCoreStartWidth =
	// 	rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
	// for (let i = 0; i < exportSizes.length; i++) {
	// 	let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
	// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
	// 	CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	// }

	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex = CSTasks.indexRGBColors(rgbDoc.pathItems, colors);
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

	// for (let i = 0; i < exportSizes.length; i++) {
	// 	let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
	// 	let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
	// 	let cmykSaveOpts = new EPSSaveOptions();
	// 	cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
	// }
	// inverse color cmyk doc
	CSTasks.convertColorCMYK(cmykDoc.pathItems, colors[violetIndex][1], colors[whiteIndex][1]
	);

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
	// Save a cropped SVG 

	// let svgMasterCoreStartWidthCroppedSvg =
	// 	rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
	// for (let i = 0; i < exportSizes.length; i++) {
	// 	let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
	// 	let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
	// 	CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	// }

	//convert violet to white and save svg
	CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]
	);

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


	/***************** 
	Expressive icon exports
	***************/

	//select the contents on artboard 0
	let selExp = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
	let iconGroupExp = CSTasks.createGroup(sourceDoc, selExp); //group the selection (easier to work with)
	let iconOffsetExp = CSTasks.getOffset(
		iconGroupExp.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[1])
	);

	/*********************************************************************
	All exports from new file with expressive icon copied across
	**********************************************************************/
	let rgbExpDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		0,
		DocumentColorSpace.RGB
	);

	rgbExpDoc.swatches.removeAll();

	let rgbExpGroup = iconGroupExp.duplicate(
		rgbExpDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let rgbExpLoc = [
		rgbExpDoc.artboards[0].artboardRect[0] + iconOffsetExp[0],
		rgbExpDoc.artboards[0].artboardRect[1] + iconOffsetExp[1],
	];
	CSTasks.translateObjectTo(rgbExpGroup, rgbExpLoc);

	CSTasks.ungroupOnce(rgbExpGroup);

	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
	}

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
	// it is not working because an extra stripe color is interfering, making the array not match
	//index the RGB colors for conversion to CMYK. An inelegant location.
	//CSTasks.indexRGBColors(rgbExpDoc.pathItems, colorsExp);
	//convert violet to white and save as
	//CSTasks.convertColorRGB(rgbExpDoc.pathItems, colorsExp[violetIndex][0], colorsExp[whiteIndex][0]);


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
	let selExp2 = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
	let iconGroupExp2 = CSTasks.createGroup(sourceDoc, selExp2); //group the selection (easier to work with)
	let iconOffsetExp2 = CSTasks.getOffset(
		iconGroupExp2.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[1])
	);

	/*********************************************************************
	All exports from new file with expressive icon copied across
	**********************************************************************/
	let rgbExpDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		0,
		DocumentColorSpace.RGB
	);

	rgbExpDocCroppedVersion.swatches.removeAll();

	let rgbExpGroup2 = iconGroupExp2.duplicate(
		rgbExpDocCroppedVersion.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let rgbExpLoc2 = [
		rgbExpDocCroppedVersion.artboards[0].artboardRect[0] + iconOffsetExp2[0],
		rgbExpDocCroppedVersion.artboards[0].artboardRect[1] + iconOffsetExp2[1],
	];
	CSTasks.translateObjectTo(rgbExpGroup2, rgbExpLoc2);
	// remove padding here befor exporting
	function placeIconLockup1Correctly2(rgbExpGroup2, maxSize) {

		let W = rgbExpGroup2.width,
			H = rgbExpGroup2.height,
			MW = maxSize.W,
			MH = maxSize.H,
			factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
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
	let selExp3 = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
	let iconGroupExp3 = CSTasks.createGroup(sourceDoc, selExp3); //group the selection (easier to work with)
	let iconOffsetExp3 = CSTasks.getOffset(
		iconGroupExp3.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[1])
	);
	/****************
	CMYK exports x4 (EPS only)
	****************/

	//open a new document with CMYK colorspace, and duplicate the icon to the new document
	let cmykDocExp = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		0,
		DocumentColorSpace.CMYK
	);
	cmykDocExp.swatches.removeAll();

	//need to reverse the order of copying the group to get the right color ordering
	let cmykGroupExp = iconGroupExp3.duplicate(
		cmykDocExp.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATBEGINNING
	);
	let cmykLocExp = [
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
cleanup
************/
	CSTasks.ungroupOnce(iconGroup);
	sourceDoc.selection = null;








	/************ 
	Final cleanup
	************/
	CSTasks.ungroupOnce(iconGroupExp);
	sourceDoc.selection = null;

}
iconGen();


