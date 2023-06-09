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
alert(" \n\nThis is the two line first bold font script   \n\nThis script only works locally not on a server, tutorial: , Tutorial: https://youtu.be/UAcoXn68HKk  \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/WTW_107405_product_logo_template_script   \n\n Make sure that all colors are set to rgb colors in your template. Especially the stripes of the expressive artboard. If not, some exports won't be correct. \n\nOpen your own.ai template or the provided ones in folders called test. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Make sure you have the Graphik font installed on your CPU. \n\nYou must have the folder called images in the parent folder, this is where wtw_logo.ai is saved so it can be imported into the big purple banner and exported as assets. Otherwise you will get an error that says error = svgFile. If the svgFile is still not working, try opening it again in Illustrator and save as, this happens because your Illustrator has been updated to a newer version. \n\nIllustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease use underscores instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");
//#region GLOBAL VARS
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
	[128, 128, 128], // Grey matter dark
	[147, 0, 130], // Fireworks magenta dark pattern CUSTOM COLOR
	[52, 84, 153], // Expressive Strat blue dark pattern @90%
	[51, 151, 129], // Expressive Inf Turquoise dark pattern @80%
	[153, 153, 153], // gray matter dark pattern @80%
	[72, 8, 111], // expressive purple banner bg  
	[235, 101, 215], // FIREWORKS dark mode #EB65D7 RGB 235 101 215 CMYK  26 66 0 0
	[92, 156, 245], // STRAT DARK MODE #5C9CF5 RGB 92 156 245 CMYK  63 34 0 0
	[98, 227, 213], // INFINITY dark mode #62E3D5 RGB 98 227 213 CMYK  55 0 27 0
	[174, 122, 210], // UV DARK MODE #AE7AD2 RGB 174 122 210 CMYK 44 58 0 0 
	[154, 156, 159], // MATTER dark mode #9A9C9F RGB 154 156 159  CMYK  42 31 30 9
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
	[0, 0, 0, 50], // grey matter dark
	[51, 100, 11, 1], // Fireworks magenta dark pattern, CUSTOM COLOR
	[90, 70, 0, 16], // Expressive Strat blue dark pattern @90%
	[69, 21, 54, 10], // Expressive Inf Turquoise dark pattern @80%
	[0, 0, 0, 40], // gray matter dark pattern @80%
	[85, 100, 0, 23], // expressive purple banner bg
	[26, 66, 0, 0], // FIREWORKS dark mode #EB65D7 RGB 235 101 215 CMYK  26 66 0 0
	[63, 34, 0, 0], // STRAT DARK MODE #5C9CF5 RGB 92 156 245 CMYK  63 34 0 0
	[55, 0, 27, 0], // INFINITY dark mode #62E3D5 RGB 98 227 213 CMYK  55 0 27 0
	[44, 58, 0, 0], // UV DARK MODE #AE7AD2 RGB 174 122 210 CMYK 44 58 0 0 
	[42, 31, 30, 9], // MATTER dark mode #9A9C9F RGB 154 156 159  CMYK  42 31 30 9
];
// Make sure you have the font below installed, ask for font from client
let desiredFontReg = "Graphik-Regular";
let desiredFontBold = "Graphik-Medium";
let exportSizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16]; //sizes to export
let violetIndex = 0; //these are for converting to inverse and inactive versions
let grayIndex = 1;
let fireworksIndex = 2;
let stratIndex = 3;
let infinityIndex = 4;
let whiteIndex = 5;
let blackIndex = 6;
let darkGreyIndex = 7;
let magentDarkIndex = 8;
let startDarkIndex = 9;
let infiDarkIndex = 10;
let greyMatterDarkIndex = 11;
let darkPurpleIndex = 12;
let FireworksDMIndex = 13;
let stratDMIndex = 14;
let infiDMIndex = 15;
let uvDMIndex = 16;
let matterDMindex = 17;

//loop default 
let i;
// folder and naming creations
let sourceDocName = sourceDoc.name.slice(0, -3);
let iconFilename = sourceDoc.name.split(".")[0];
let name = sourceDoc.name.split(".")[0];
let destFolder = Folder(sourceDoc.path + "/" + name);
let wtwName = "wtw";
// asset types names
let primaryName = "pri";
let alternateName = "alt";
let iconName = "icn";
let expressiveIconName = "exp";
let expressiveArtworkName = "art";
//  color names
let fullColorName = "fc";
let oneColorName = "1c";
//  style names
let standardName = "std";
let inactiveName = "inact";
let darkModeName = "dm";
//  artwork color names
let positiveColorName = "pos";
let inverseColorName = "inv";
let blackColorName = "blk";
let whiteColorName = "wht";
// bg color names
let transparentBgColorName = "t";
let whiteBgColorName = "w";
let blackBgColorName = "k";
//  color mode names
let fourColorProcessName = "4cp";
let pantoneColorName = "pms";
let rgbColorName = "rgb";
// size names
let croppedToArtworkName = "crp";
// folder names
let primaryLockupFolderName = "Primary_lockup";
let alternativeLockupFolderName = "Alternate_lockup";
let iconFolderName = "Icon";
let iconInLayoutFolderName = "Icon_in_layout";
let expressiveFolderName = "Expressive";
let inactiveFolderName = "inactive";
let positiveFolderName = "positive";
let inverseTransparentFolderName = "inverse_transparent_bg";
let positiveOnWhiteFolderName = "positive_white_bg";
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
let guideLayer = sourceDoc.layers["Guidelines"];

//#endregion
//#region GLOBAL TASKS
/**********************************
Module for image manipulation tasks 
***********************************/
// this is a typescript feature to help debugging 
interface Task {
	getArtboardCorner(artboard: Artboard);
	getOffset(itemPos: number[] | Point, referencePos: number[]): number[];
	translateObjectTo(pageItems: PageItem, mastTextLoc: number[]): void;
	clearArtboard(doc: Document, index: number): void;
	selectContentsOnArtboard(doc: Document, index: number): PageItems;
	createGroup(doc: Document, collection: PageItem[]): GroupItem;
	ungroupOnce(group: any): void;
	newDocument(sourceDoc: Document, colorSpace: DocumentColorSpace): Document;
	duplicateArtboardInNewDoc(sourceDoc: Document, artboardIndex: number, colorspace: DocumentColorSpace): Document;
	scaleAndExportPNG(doc: Document, destFile: File, startWidth: number, desiredWidth: number): void;
	scaleAndExportNonTransparentPNG(doc: Document, destFile: File, startWidth: number, desiredWidth: number): void;
	scaleAndExportSVG(doc: Document, destFile: File, startWidth: number, desiredWidth: number): void;
	scaleAndExportJPEG(doc: Document, destFile: File, startWidth: number, desiredWidth: number): void;
	newRect(x: number, y: number, width: number, height: number): [number, number, number, number];
	setFont(textRef: any, desiredFontBold: string): void;
	createTextFrame(doc: Document, message: string, pos: number[], size: number): any;
	initializeColors(RGBArray: number[][], CMYKArray: number[][]);
	matchRGB(color: RGBColor, matchArray: [RGBColor, CMYKColor][]): number;
	matchColorsRGB(color1: RGBColor | Color, color2: RGBColor | Color): boolean;
	convertColorCMYK(pathItems: PathItems, startColor: CMYKColor | Color, endColor: CMYKColor): void;
	matchColorsCMYK(color1: CMYKColor | Color, color2: CMYKColor | Color): boolean;
	convertColorRGB(pathItems: PathItems, startColor: RGBColor, endColor: RGBColor): void;
	convertAll(pathItems: PathItems, endColor: RGBColor, opacity: number): void;
	convertToCMYK(doc: Document, pathItems: PathItems, colorArray: number[], colorIndex: number[]);
	indexRGBColors(doc: PathItems, colors: [RGBColor, CMYKColor][]): number[];
	unique(unmatchedColors: any);

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
		let offset = tasks.getOffset(object.position, destination) as [number, number];
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
		for (let i = collection.length - 1; i >= 0; i--) {
			collection[i].move(newGroup,
				/*@ts-ignore*/
				ElementPlacement.PLACEATBEGINNING);
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
		let rect: [number, number, number, number] = [x, -y, width + x, -(height + y)];
		return rect;
	};

	/***
	TEXT
	****/

	//takes a text frame and a string with the desired font name
	//sets the text frame to the desired font or alerts if not found
	tasks.setFont = function (textRef, desiredFontBold) {
		let foundFont = false;
		/*@ts-ignore*/
		for (let i = 0; i < textFonts.length; i++) {
			/*@ts-ignore*/
			if (textFonts[i].name == desiredFontBold) {
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
			color1 instanceof RGBColor &&
			color2 instanceof RGBColor &&
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
			color1 instanceof CMYKColor &&
			color2 instanceof CMYKColor &&
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
		let colorIndex: number[] = [];
		for (let i = 0; i < pathItems.length; i++) {
			let itemColor: RGBColor = <RGBColor>pathItems[i].fillColor;
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

			tasks.createTextFrame(doc, unmatchedString, errorMsgPos, 40);
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

//#endregion
//#region SETUP TASKS
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
	new Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${positiveOnWhiteFolderName}`).create();
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
let appNamePrimary = prompt("What text do you want to put in the first line of the primary lockup and the first line of the ultraviolet dark banner lockup?");
// request a second line of text
let appNamePrimary2 = prompt("What text do you want to put in the second line of the primary lockup and the second line of the ultraviolet dark banner lockup?");
//request a name for the icon, and place that as text on the last lockup artboard
let appNameAlternate = prompt("What text do you want to put in the alternate lockup?");

//#endregion

function iconExportArtboard0() {
	//#region INDEX ONLY FOR CMYK conversion
	//select the contents on artboard 0
	let sel = CSTasks.selectContentsOnArtboard(sourceDoc, 0);
	let colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
	let iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
	let iconOffset = CSTasks.getOffset(
		iconGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	// open a doc just for color indexing
	/*********************************************************************
All exports from artboard 0
**********************************************************************/
	let indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		0,
		DocumentColorSpace.RGB
	);

	indexRgbDoc.swatches.removeAll();

	let IndexRgbGroup = iconGroup.duplicate(
		indexRgbDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let IndexRgbLoc = [
		indexRgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
		indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);

	CSTasks.ungroupOnce(IndexRgbGroup);

	app.executeMenuCommand('Colors9');
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);

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

	app.executeMenuCommand('Colors9');
	//save the classic PNGs in icon folder
	let masterStartWidth =
		rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${exportSizes[i]}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${positiveFolderName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i]);
	}

	//save the classic PNGs on white in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${whiteBgColorName}_${rgbColorName}_${exportSizes[i]}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${positiveOnWhiteFolderName}`) + filename);
		CSTasks.scaleAndExportNonTransparentPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i]);
	}

	//save a classic EPS into the icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		/*@ts-ignore*/
		rgbSaveOpts.cmykPostScript = false;
		rgbDoc.saveAs(destFile, rgbSaveOpts);
	}
	//save a classic SVG in icon folder
	let svgMasterCoreStartWidth =
		rgbDoc.artboards[0].artboardRect[2] - rgbDoc.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}

	app.executeMenuCommand('Colors9');

	//convert violet to white and save as EPS
	CSTasks.convertColorRGB(rgbDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);

	//save set of inverted pngs in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}_${exportSizes[i]}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inverseTransparentFolderName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[i]);
	}

	// save an inverted eps in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.eps`;
		let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
		let rgbSaveOpts = new EPSSaveOptions();
		rgbDoc.saveAs(inverseFile, rgbSaveOpts);
	}

	// save inverted svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}

	// convert fireworks, stratosphere, infinity to dark mode
	CSTasks.convertColorRGB(rgbDoc.pathItems, colors[fireworksIndex][0], colors[FireworksDMIndex][0]);
	CSTasks.convertColorRGB(rgbDoc.pathItems, colors[stratIndex][0], colors[stratDMIndex][0]);
	CSTasks.convertColorRGB(rgbDoc.pathItems, colors[infinityIndex][0], colors[infiDMIndex][0]);
	CSTasks.convertColorRGB(rgbDoc.pathItems, colors[grayIndex][0], colors[matterDMindex][0]);


	// save an inverted eps in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.eps`;
		let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
		let rgbSaveOpts = new EPSSaveOptions();
		rgbDoc.saveAs(inverseFile, rgbSaveOpts);
	}

	// save inverted svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}

	//convert to inactive color (WTW Icon DARK grey) and save 
	CSTasks.convertAll(rgbDoc.pathItems, colors[darkGreyIndex][0], 100);

	// save an inactive png to icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inactiveFolderName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
	}



	// save 2 inactive svgs to icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}

	//convert to light gray matter (WTW Icon light gray at 100% opacity) and save 
	CSTasks.convertAll(rgbDoc.pathItems, colors[grayIndex][0], 100);

	// save an inactive png to icon folder, same as above different name
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${pngName}/${inactiveFolderName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbDoc, destFile, masterStartWidth, exportSizes[2]);
	}

	// save 2 inactive svgs to icon folder, same as above different name
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}


	//convert to white color (WTW Icon white at 100% opacity) and save 
	CSTasks.convertAll(rgbDoc.pathItems, colors[whiteIndex][0], 100);

	// save a white eps in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${rgbColorName}.eps`;
		let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
		let rgbSaveOpts = new EPSSaveOptions();
		rgbDoc.saveAs(inverseFile, rgbSaveOpts);
	}

	// save white svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDoc, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}

	//convert to black color (WTW Icon black at 100% opacity) and save 
	CSTasks.convertAll(rgbDoc.pathItems, colors[blackIndex][0], 100);

	// save a black eps in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let inverseFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${rgbColorName}.eps`;
		let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${rgbName}`) + inverseFilename);
		let rgbSaveOpts = new EPSSaveOptions();
		rgbDoc.saveAs(inverseFile, rgbSaveOpts);
	}

	// save a black svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgName}`) + filename);
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
	let svgMasterCoreStartWidthCroppedSvg =
		rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
		CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	}

	// you need this to invert correctly
	app.executeMenuCommand('Colors9');
	//convert violet to white and save svg
	CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]
	);

	// Save a inversed cropped SVG 
	for (let i = 0; i < exportSizes.length; i++) {
		let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
		CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	}

	// convert fireworks, stratosphere, infinity to dark mode
	CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[fireworksIndex][0], colors[FireworksDMIndex][0]);
	CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[stratIndex][0], colors[stratDMIndex][0]);
	CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[infinityIndex][0], colors[infiDMIndex][0]);
	CSTasks.convertColorRGB(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], colors[matterDMindex][0]);

	// save Dark mode inverted svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFile, svgMasterCoreStartWidth, exportSizes[2]);
	}


	//convert color to white
	CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[whiteIndex][0], 100);

	// Save a white cropped SVG 
	for (let i = 0; i < exportSizes.length; i++) {
		let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
		CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	}

	//convert to black color
	CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[blackIndex][0], 100);

	// Save a black cropped SVG 
	for (let i = 0; i < exportSizes.length; i++) {
		let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
		CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	}


	//convert to inactive color (WTW Icon DARK grey) and save 
	CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[darkGreyIndex][0], 100);

	// save inactive positive svg to icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFile, svgMasterCoreStartWidthCroppedSvg, exportSizes[2]);
	}

	//convert to light gray matter (WTW Icon light gray at 100% opacity) and save 
	CSTasks.convertAll(rgbDocCroppedVersion.pathItems, colors[grayIndex][0], 100);

	// save inactive inverted light grey svg to icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${svgCroppedName}`) + filename);
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

	app.executeMenuCommand('Colors9');
	//alert(colorIndex.toString())
	CSTasks.convertToCMYK(cmykDoc, cmykDoc.pathItems, colors, colorIndex);

	for (let i = 0; i < exportSizes.length; i++) {
		let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
		let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
		let cmykSaveOpts = new EPSSaveOptions();
		cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
	}

	// you need this to invert correctly
	app.executeMenuCommand('Colors9');
	// inverse color cmyk doc
	CSTasks.convertColorCMYK(cmykDoc.pathItems, colors[violetIndex][1], colors[whiteIndex][1]);

	for (let i = 0; i < exportSizes.length; i++) {
		let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.eps`;
		let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
		let cmykSaveOpts = new EPSSaveOptions();
		cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
	}
	//convert to white color cmyk doc (WTW Icon white at 100% opacity) and save 
	CSTasks.convertAll(cmykDoc.pathItems, colors[whiteIndex][0], 100);

	for (let i = 0; i < exportSizes.length; i++) {
		let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${whiteColorName}_${inverseColorName}_${fourColorProcessName}.eps`;
		let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
		let cmykSaveOpts = new EPSSaveOptions();
		cmykDoc.saveAs(cmykDestFile, cmykSaveOpts);
	}
	app.executeMenuCommand('Colors9');
	// alert(colorIndex.toString())
	//convert to black color cmyk doc (WTW Icon black at 100% opacity) and save EPS
	//CSTasks.convertAll(cmykDoc.pathItems, colors[blackIndex][0], 100);
	let black = new CMYKColor();
	black.cyan = 0;
	black.magenta = 0;
	black.yellow = 0;
	black.black = 100;
	// Get a reference to the active document
	let doc = app.activeDocument;
	// Iterate over all path items in the document
	for (let i = 0; i < doc.pathItems.length; i++) {
		let path = doc.pathItems[i];
		// Change the fill color to CMYK black
		path.fillColor = black;
	}
	for (let i = 0; i < exportSizes.length; i++) {
		let cmykFilename = `/${wtwName}_${iconFilename}_${iconName}_${oneColorName}_${blackColorName}_${positiveColorName}_${fourColorProcessName}.eps`;
		let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${iconFolderName}/${epsName}/${cmykName}`) + cmykFilename);
		let cmykSaveOpts = new EPSSaveOptions();
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
	let colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
	//select the contents on artboard 0
	let sel = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
	let iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
	let iconOffset = CSTasks.getOffset(
		iconGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[1])
	);
	// open a doc just for color indexing
	/*********************************************************************
All exports from artboard 0
**********************************************************************/
	let indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		1,
		DocumentColorSpace.RGB
	);

	indexRgbDoc.swatches.removeAll();

	let IndexRgbGroup = iconGroup.duplicate(
		indexRgbDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let IndexRgbLoc = [
		indexRgbDoc.artboards[0].artboardRect[0] + iconOffset[0],
		indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);

	CSTasks.ungroupOnce(IndexRgbGroup);

	app.executeMenuCommand('Colors9');
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);

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
	let rgbExpDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		1,
		DocumentColorSpace.RGB
	);

	rgbExpDoc.swatches.removeAll();

	let rgbExpGroup = iconGroup.duplicate(
		rgbExpDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let rgbExpLoc = [
		rgbExpDoc.artboards[0].artboardRect[0] + iconOffset[0],
		rgbExpDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(rgbExpGroup, rgbExpLoc);

	CSTasks.ungroupOnce(rgbExpGroup);
	app.executeMenuCommand('Colors9');

	let masterStartWidth =
		rgbExpDoc.artboards[0].artboardRect[2] - rgbExpDoc.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
	}

	//save a expressive EPS into the expressive icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		/*@ts-ignore*/
		rgbSaveOpts.cmykPostScript = false;
		rgbExpDoc.saveAs(destFile, rgbSaveOpts);
	}

	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
	}

	//convert violet to white
	// you need this to invert correctly

	app.executeMenuCommand('Colors9');

	//convert violet to white and save as
	CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);

	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex2 = CSTasks.indexRGBColors(rgbExpDoc.pathItems, colors);
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
	}

	//save a expressive EPS into the expressive icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${inverseColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		/*@ts-ignore*/
		rgbSaveOpts.cmykPostScript = false;
		rgbExpDoc.saveAs(destFile, rgbSaveOpts);
	}

	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
	}

	// convert fireworks, stratosphere, infinity to dark mode
	CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[fireworksIndex][0], colors[FireworksDMIndex][0]);
	CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[stratIndex][0], colors[stratDMIndex][0]);
	CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[infinityIndex][0], colors[infiDMIndex][0]);
	CSTasks.convertColorRGB(rgbExpDoc.pathItems, colors[grayIndex][0], colors[matterDMindex][0]);

	// save an inverted DARK MODE Png in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(rgbExpDoc, destFile, masterStartWidth, exportSizes[2]);
	}


	// save an inverted DARK MODE eps in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let inverseFilename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.eps`;
		let inverseFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + inverseFilename);
		let rgbSaveOpts = new EPSSaveOptions();
		rgbExpDoc.saveAs(inverseFile, rgbSaveOpts);
	}

	// save inverted DARK MODE svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgName}`) + filename);
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
	let rgbExpDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		1,
		DocumentColorSpace.RGB
	);


	rgbExpDocCroppedVersion.swatches.removeAll();

	let rgbExpGroup2 = iconGroup.duplicate(
		rgbExpDocCroppedVersion.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let rgbExpLoc2 = [
		rgbExpDocCroppedVersion.artboards[0].artboardRect[0] + iconOffset[0],
		rgbExpDocCroppedVersion.artboards[0].artboardRect[1] + iconOffset[1],
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

	// you need this to invert correctly
	app.executeMenuCommand('Colors9');

	let svgdExpMasterCoreStartWidthCroppedSvg =
		rgbExpDocCroppedVersion.artboards[0].artboardRect[2] - rgbExpDocCroppedVersion.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
		CSTasks.scaleAndExportSVG(rgbExpDocCroppedVersion, destFileCroppedSvg, svgdExpMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	}

	// you need this to invert correctly
	app.executeMenuCommand('Colors9');
	//convert violet to white and save as
	CSTasks.convertColorRGB(rgbExpDocCroppedVersion.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);

	for (let i = 0; i < exportSizes.length; i++) {
		let filenameCroppedSvg = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFileCroppedSvg = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgCroppedName}`) + filenameCroppedSvg);
		CSTasks.scaleAndExportSVG(rgbExpDocCroppedVersion, destFileCroppedSvg, svgdExpMasterCoreStartWidthCroppedSvg, exportSizes[0]);
	}

	// convert fireworks, stratosphere, infinity to dark mode
	CSTasks.convertColorRGB(rgbExpDocCroppedVersion.pathItems, colors[fireworksIndex][0], colors[FireworksDMIndex][0]);
	CSTasks.convertColorRGB(rgbExpDocCroppedVersion.pathItems, colors[stratIndex][0], colors[stratDMIndex][0]);
	CSTasks.convertColorRGB(rgbExpDocCroppedVersion.pathItems, colors[infinityIndex][0], colors[infiDMIndex][0]);
	CSTasks.convertColorRGB(rgbExpDocCroppedVersion.pathItems, colors[grayIndex][0], colors[matterDMindex][0]);

	// save inverted DARK MODE svg in icon folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}_${croppedToArtworkName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${svgCroppedName}`) + filename);
		CSTasks.scaleAndExportSVG(rgbExpDocCroppedVersion, destFile, masterStartWidth, exportSizes[2]);
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
	let cmykDocExp = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		1,
		DocumentColorSpace.CMYK
	);
	cmykDocExp.swatches.removeAll();

	//need to reverse the order of copying the group to get the right color ordering
	let cmykGroupExp = iconGroup.duplicate(
		cmykDocExp.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let cmykLocExp = [
		cmykDocExp.artboards[0].artboardRect[0] + iconOffset[0],
		cmykDocExp.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(cmykGroupExp, cmykLocExp);

	CSTasks.ungroupOnce(cmykGroupExp);
	app.executeMenuCommand('Colors8');
	CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex);

	for (let i = 0; i < exportSizes.length; i++) {
		let cmykFilename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
		let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + cmykFilename);
		let cmykSaveOpts = new EPSSaveOptions();
		cmykDocExp.saveAs(cmykDestFile, cmykSaveOpts);
	}
	app.executeMenuCommand('Colors8');
	// get white index
	CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex2);
	//Invert
	CSTasks.convertColorCMYK(cmykDocExp.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);

	for (let i = 0; i < exportSizes.length; i++) {
		let cmykFilename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.eps`;
		let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + cmykFilename);
		let cmykSaveOpts = new EPSSaveOptions();
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
		// create new artboard
		let firstRect = sourceDoc.artboards[0].artboardRect;
		sourceDoc.artboards.add(
			CSTasks.newRect(firstRect[1], firstRect[2] + 128, 2560, 256)
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

	// get icon
	let mast = iconGroup.duplicate(iconGroup.layer,
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND);
	// get icon new pos
	let mastPos = [
		sourceDoc.artboards[2].artboardRect[0],
		sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
	];
	// paste icon
	CSTasks.translateObjectTo(mast, mastPos);

	// add text from prompt
	let textRef = sourceDoc.textFrames.add();
	textRef.contents = appNamePrimary;
	textRef.textRange.characterAttributes.size = 107;
	CSTasks.setFont(textRef, desiredFontBold);

	//vertically align the baseline to be 134.4 px above the bottom of the artboard
	let bottomEdge =
		sourceDoc.artboards[2].artboardRect[3] +
		0.525 * sourceDoc.artboards[0].artboardRect[2] -
		sourceDoc.artboards[0].artboardRect[0]; //134.4px (0.525*256px) above the bottom edge of the artboard
	let vOffset = CSTasks.getOffset(textRef.anchor, [0, bottomEdge]);
	textRef.translate(0, -vOffset[1]);

	//create an outline of the text
	let textGroup = textRef.createOutline();

	//horizontally align the left edge of the text to be 64px to the right of the edge
	let rightEdge =
		mast.position[0] +
		mast.width +
		64; //64px (0.25*256px) right of the icon
	// alert(mast.position[0].toString())
	// alert(mast.width.toString())
	// alert(rightEdge.toString())
	let hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
	textGroup.translate(-hOffset[0], 0);

	//resize the artboard to be only a little wider than the text
	// second line from second prompt
	let textRef2 = sourceDoc.textFrames.add();
	textRef2.contents = appNamePrimary2;
	textRef2.textRange.characterAttributes.size = 89;
	CSTasks.setFont(textRef2, desiredFontReg);

	//vertically align the second baseline to be 44.8 px above the bottom of the artboard
	let bottomEdge2 =
		sourceDoc.artboards[2].artboardRect[3] +
		0.175 * sourceDoc.artboards[0].artboardRect[2] -
		sourceDoc.artboards[0].artboardRect[0]; //44.8px (0.175*256px) above the bottom edge of the artboard
	let vOffset2 = CSTasks.getOffset(textRef2.anchor, [0, bottomEdge2]);
	textRef2.translate(0, -vOffset2[1]);

	//create an outline of the text
	let textGroup2 = textRef2.createOutline();

	//horizontally align the left edge of the text to be 64px to the right of the edge
	let rightEdge2 =
		mast.position[0] +
		mast.width +
		64; //64px (0.25*256px) right of the icon
	// alert(mast.position[0].toString())
	// alert(mast.width.toString())
	// alert(rightEdge2.toString())
	let hOffset2 = CSTasks.getOffset(textGroup2.position, [rightEdge2, 0]);
	textGroup2.translate(-hOffset2[0], 0);

	if (parseFloat(textGroup.width.toString()) > parseFloat(textGroup2.width.toString())) {
		//alert("text 1 longer than text 2!");
		//resize the artboard to be only a little wider than the text 1
		let leftMargin = mast.position[0] - sourceDoc.artboards[2].artboardRect[0];
		let newWidth =
			textGroup.position[0] +
			textGroup.width -
			sourceDoc.artboards[2].artboardRect[0] +
			leftMargin + 8;
		let resizedRect = CSTasks.newRect(
			sourceDoc.artboards[2].artboardRect[0],
			-sourceDoc.artboards[2].artboardRect[1],
			newWidth,
			256
		);
		sourceDoc.artboards[2].artboardRect = resizedRect;
	} else if (parseFloat(textGroup.width.toString()) < parseFloat(textGroup2.width.toString())) {
		//alert("text 2 longer than text 1!");
		//resize the artboard to be only a little wider than the text 2
		let leftMargin2 = mast.position[0] - sourceDoc.artboards[2].artboardRect[0];
		let newWidth2 =
			textGroup2.position[0] +
			textGroup2.width -
			sourceDoc.artboards[2].artboardRect[0] +
			leftMargin2 + 8;
		let resizedRect2 = CSTasks.newRect(
			sourceDoc.artboards[2].artboardRect[0],
			-sourceDoc.artboards[2].artboardRect[1],
			newWidth2,
			256
		);
		sourceDoc.artboards[2].artboardRect = resizedRect2;
	} else {
		alert("Neither were hit");
	}
	// make the text black
	let rgbBlack = new RGBColor();
	rgbBlack.red = 0;
	rgbBlack.green = 0;
	rgbBlack.blue = 0;
	// Loop through each path item in the text group
	for (let i = 0; i < textGroup.pathItems.length; i++) {
		textGroup.pathItems[i].fillColor = rgbBlack;
	}
	for (let i = 0; i < textGroup2.pathItems.length; i++) {
		textGroup2.pathItems[i].fillColor = rgbBlack;
	}

	//#endregion
	//#region INDEX ONLY FOR CMYK conversion
	// open a doc just for color indexing
	/*********************************************************************
All exports from artboard 0
**********************************************************************/
	let indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		2,
		DocumentColorSpace.RGB
	);

	indexRgbDoc.swatches.removeAll();

	let IndexRgbGroup = iconGroup.duplicate(
		indexRgbDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let IndexRgbLoc = [
		indexRgbDoc.artboards[0].artboardRect[0],
		indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);

	CSTasks.ungroupOnce(IndexRgbGroup);
	//get the text offset for exporting
	let mastTextOffset2 = CSTasks.getOffset(
		textGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	// duplicate text
	let mastText2 = textGroup.duplicate(
		indexRgbDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextLoc2 = [
		indexRgbDoc.artboards[0].artboardRect[0] + mastTextOffset2[0],
		indexRgbDoc.artboards[0].artboardRect[1] + mastTextOffset2[1],
	];
	// paste text
	CSTasks.translateObjectTo(mastText2, mastTextLoc2);
	app.executeMenuCommand('Colors9');
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);

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
	let mastDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		2,
		DocumentColorSpace.RGB
	);
	mastDoc.swatches.removeAll();


	// duplicate icon
	let mastGroup = iconGroup.duplicate(
		mastDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);

	// get correct position
	let mastLoc = [
		mastDoc.artboards[0].artboardRect[0],
		mastDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	// paste icon
	CSTasks.translateObjectTo(mastGroup, mastLoc);

	CSTasks.ungroupOnce(mastGroup);
	//get the text offset for exporting
	let mastTextOffset = CSTasks.getOffset(
		textGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	// duplicate text
	let mastText = textGroup.duplicate(
		mastDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextLoc = [
		mastDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
		mastDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
	];
	// paste text
	CSTasks.translateObjectTo(mastText, mastTextLoc);

	CSTasks.ungroupOnce(mastGroup);

	//get the text 2 offset for exporting
	let mastTextOffset3 = CSTasks.getOffset(
		textGroup2.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	// duplicate text
	let mastText3 = textGroup2.duplicate(
		mastDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextLoc3 = [
		mastDoc.artboards[0].artboardRect[0] + mastTextOffset3[0],
		mastDoc.artboards[0].artboardRect[1] + mastTextOffset3[1],
	];
	// paste text
	CSTasks.translateObjectTo(mastText3, mastTextLoc3);

	// save a text and lockup PNG
	let masterStartHeight = mastDoc.artboards[0].artboardRect[3] - mastDoc.artboards[0].artboardRect[1];
	let masterStartWidth =
		mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, 256);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}

	// you need this to invert correctly
	app.executeMenuCommand('Colors9');
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[blackIndex][0], colors[whiteIndex][0]);
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex2 = CSTasks.indexRGBColors(mastDoc.pathItems, colors);

	//save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}

	// convert fireworks, stratosphere, infinity to dark mode
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[fireworksIndex][0], colors[FireworksDMIndex][0]);
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[stratIndex][0], colors[stratDMIndex][0]);
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[infinityIndex][0], colors[infiDMIndex][0]);
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[grayIndex][0], colors[matterDMindex][0]);


	//save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	// save inverted DARK MODE svg in primary folder
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${darkModeName}_${inverseColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}

	CSTasks.convertAll(mastDoc.pathItems, colors[blackIndex][0], 100);

	// save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${blackColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${blackColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${blackColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}


	CSTasks.convertAll(mastDoc.pathItems, colors[whiteIndex][0], 100);

	// save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${whiteColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${whiteColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}
	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${whiteColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}

	CSTasks.convertAll(mastDoc.pathItems, colors[darkGreyIndex][0], 100);
	// save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${inactiveName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}
	CSTasks.convertAll(mastDoc.pathItems, colors[grayIndex][0], 100);

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	// save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${inactiveName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${pngName}`) + filename);
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
	let mastDocCMYK = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		2,
		DocumentColorSpace.CMYK
	);
	mastDocCMYK.swatches.removeAll();
	let mastGroupCMYK = iconGroup.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let mastLocCMYK = [
		mastDocCMYK.artboards[0].artboardRect[0],
		mastDocCMYK.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);


	mastDocCMYK.selectObjectsOnActiveArtboard();

	CSTasks.ungroupOnce(mastGroupCMYK);
	mastDocCMYK.selectObjectsOnActiveArtboard();

	//get the text offset for exporting
	let mastTextOffsetCMYK = CSTasks.getOffset(
		textGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	let mastTextCMYK = textGroup.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let mastTextLocCMYK = [
		mastDocCMYK.artboards[0].artboardRect[0] + mastTextOffsetCMYK[0],
		mastDocCMYK.artboards[0].artboardRect[1] + mastTextOffsetCMYK[1],
	];
	CSTasks.translateObjectTo(mastTextCMYK, mastTextLocCMYK);
	CSTasks.ungroupOnce(mastGroupCMYK);
	mastDocCMYK.selectObjectsOnActiveArtboard();
	app.executeMenuCommand('Colors8');
	CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);

	//get the text line 2 offset for exporting
	let mastTextOffsetCMYK2 = CSTasks.getOffset(
		textGroup2.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	let mastTextCMYK2 = textGroup2.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let mastTextLocCMYK2 = [
		mastDocCMYK.artboards[0].artboardRect[0] + mastTextOffsetCMYK2[0],
		mastDocCMYK.artboards[0].artboardRect[1] + mastTextOffsetCMYK2[1],
	];
	CSTasks.translateObjectTo(mastTextCMYK2, mastTextLocCMYK2);

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDocCMYK.saveAs(destFile, rgbSaveOpts);
	}


	CSTasks.ungroupOnce(mastGroupCMYK);
	mastDocCMYK.selectObjectsOnActiveArtboard();
	app.executeMenuCommand('Colors8');
	CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex2);
	CSTasks.convertColorCMYK(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);

	//save a text and lockup inverse EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDocCMYK.saveAs(destFile, rgbSaveOpts);
	}

	let CMYKblack = new CMYKColor();
	CMYKblack.cyan = 0;
	CMYKblack.magenta = 0;
	CMYKblack.yellow = 0;
	CMYKblack.black = 100;
	// Get a reference to the active document
	let doc = app.activeDocument;
	// Iterate over all path items in the document
	for (let i = 0; i < doc.pathItems.length; i++) {
		let path = doc.pathItems[i];
		// Change the fill color to CMYK black
		path.fillColor = CMYKblack;
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${blackColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDocCMYK.saveAs(destFile, rgbSaveOpts);
	}

	CSTasks.convertAll(mastDocCMYK.pathItems, colors[whiteIndex][0], 100);

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${primaryName}_${oneColorName}_${standardName}_${whiteColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${primaryLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
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
	let colors = CSTasks.initializeColors(RGBColorElements, CMYKColorElements); //initialize the colors from the brand palette
	let sel = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
	let iconGroup = CSTasks.createGroup(sourceDoc, sel); //group the selection (easier to work with)
	/******************
	Set up purple artboard 3 in main file
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
		256
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
	let mastBannerIconOnText = iconGroup.duplicate(iconGroup.layer,
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND);

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

	function placeIconOnArtboard3InMainFile(mastBannerIconOnText, maxSize) {
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
	placeIconOnArtboard3InMainFile(mastBannerIconOnText, { W: 460, H: 460 });

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

	let imagePlacedItem = myMainArtworkLayer.placedItems.add();
	let svgFile = File(`${sourceDoc.path}/../images/wtw_logo.ai`);
	imagePlacedItem.file = svgFile;
	imagePlacedItem.top = -1188;
	imagePlacedItem.left = 62;
	imagePlacedItem.embed();



	let textRef = sourceDoc.textFrames.add();

	//use the areaText method to create the text frame
	let pathRef = sourceDoc.pathItems.rectangle(-850, -800, 900, 400);
	/*@ts-ignore*/
	textRef = sourceDoc.textFrames.areaText(pathRef);

	textRef.contents = appNamePrimary;
	textRef.textRange.characterAttributes.size = 62;

	textRef.textRange.paragraphAttributes.hyphenation = false;
	// textRef.textRange.characterAttributes.horizontalScale = 2299;
	textRef.textRange.characterAttributes.fillColor = colors[whiteIndex][0];
	CSTasks.setFont(textRef, desiredFontBold);

	//create an outline of the text
	let textGroup = textRef.createOutline();

	//horizontally align the left edge of the text to be 96px to the right of the edge
	let rightEdge = 64;
	let hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
	textGroup.translate(-hOffset[0], 0);


	let textRef2 = sourceDoc.textFrames.add();

	//use the areaText method to create the text frame
	let pathRef2 = sourceDoc.pathItems.rectangle(-910, -800, 900, 400);
	/*@ts-ignore*/
	textRef2 = sourceDoc.textFrames.areaText(pathRef2);

	textRef2.contents = appNamePrimary2;
	textRef2.textRange.characterAttributes.size = 52;

	textRef2.textRange.paragraphAttributes.hyphenation = false;
	// textRef2.textRange.characterAttributes.horizontalScale = 2299;
	textRef2.textRange.characterAttributes.fillColor = colors[whiteIndex][0];
	CSTasks.setFont(textRef2, desiredFontReg);

	//create an outline of the text
	let textGroup2 = textRef2.createOutline();

	//horizontally align the left edge of the text to be 96px to the right of the edge
	let rightEdge2 = 64;
	let hOffset2 = CSTasks.getOffset(textGroup2.position, [rightEdge2, 0]);
	textGroup2.translate(-hOffset2[0], 0);


	let resizedRect = CSTasks.newRect(
		sourceDoc.artboards[3].artboardRect[0],
		-sourceDoc.artboards[3].artboardRect[1],
		1024,
		512
	);
	sourceDoc.artboards[3].artboardRect = resizedRect;


	//#endregion
	//#region ARTBOARD3 EXPORTS RGB
	/********************
	Purple Lockup with text export in new file to save
	********************/
	//open a new doc and copy and position the icon and the lockup text
	// duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
	let mastDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		3,
		DocumentColorSpace.RGB
	);
	mastDoc.swatches.removeAll();
	// let textRef = mastDoc.textFrames.add();
	//create an outline of the text
	// let textGroup = textRef.createOutline();
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

	function placeIconInNewDocArtboard3(mastGroup, maxSize) {
		let setLandingZoneSquareColor = new RGBColor();
		setLandingZoneSquareColor.red = 121;
		setLandingZoneSquareColor.green = 128;
		setLandingZoneSquareColor.blue = 131;
		landingZoneSquare3.fillColor = setLandingZoneSquareColor;
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
	placeIconInNewDocArtboard3(mastGroup, { W: 460, H: 460 });

	// delete the landing zone
	landingZoneSquare3.remove();

	CSTasks.ungroupOnce(mastGroup);

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
	mainRectMastDoc.filled = true;
	mainRectMastDoc.fillColor = colors[darkPurpleIndex][0];

	mainRectMastDoc.stroked = false;
	/*@ts-ignore*/
	GetMyMainPurpleBgLayerMastDoc.move(myMainArtworkLayerMastDoc, ElementPlacement.PLACEATEND);

	// svg wtw logo for new purple lockup
	let imagePlacedItemMastDoc = myMainArtworkLayerMastDoc.placedItems.add();
	let svgFileMastDoc = File(`${sourceDoc.path}/../images/wtw_logo.ai`);
	imagePlacedItemMastDoc.file = svgFileMastDoc;
	imagePlacedItemMastDoc.top = -1189;
	imagePlacedItemMastDoc.left = 62;
	imagePlacedItemMastDoc.embed();

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
	mainClipRectMastDoc.filled = false;
	mainClipRectMastDoc.fillColor = setClipBgColorMastDoc;



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

	let mastText2 = textGroup2.duplicate(
		mastDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextLoc2 = [
		mastDoc.artboards[0].artboardRect[0] + 63,
		mastDoc.artboards[0].artboardRect[1] - 124,
	];
	CSTasks.translateObjectTo(mastText2, mastTextLoc2);


	// select all for clipping here
	sourceDoc.selectObjectsOnActiveArtboard();
	// clip!
	app.executeMenuCommand('makeMask');
	app.executeMenuCommand('Colors9');
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex = CSTasks.indexRGBColors(mastDoc.pathItems, colors);


	//save a banner PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, 512, 1024);
	}

	//save a banner SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, 512, 1024);
	}

	// save banner JPG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.jpg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${jpgName}`) + filename);
		CSTasks.scaleAndExportJPEG(mastDoc, destFile, 512, 1024);
	}

	// save banner EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
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
	let mastDocCMYK = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		3,
		DocumentColorSpace.CMYK
	);
	mastDocCMYK.swatches.removeAll();
	// let textRef = mastDocCMYK.textFrames.add();
	//create an outline of the text
	// let textGroup = textRef.createOutline();
	let mastGroupCMYK = iconGroup.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// new icon width in rebrand
	// mastGroupCMYK.width = 460;
	// mastGroupCMYK.height = 460;

	// new icon position
	let mastLocCMYK = [
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
	let getArtLayer4 = mastDocCMYK.layers.getByName('Layer 1');
	let landingZoneSquare4 = getArtLayer4.pathItems.rectangle(
		-845,
		571,
		460,
		460);

	function placeIconLockup1Correctly4(mastGroupCMYK, maxSize) {
		// let setLandingZoneSquareColor = new RGBColor();
		// setLandingZoneSquareColor.red = 121;
		// setLandingZoneSquareColor.green = 128;
		// setLandingZoneSquareColor.blue = 131;
		// landingZoneSquare4.fillColor = setLandingZoneSquareColor;
		landingZoneSquare4.name = "LandingZone3"
		landingZoneSquare4.filled = false;
		/*@ts-ignore*/
		landingZoneSquare4.move(getArtLayer4, ElementPlacement.PLACEATEND);

		// start moving expressive icon into our new square landing zone
		let placedmastGroupCMYK = mastGroupCMYK;
		let landingZone = mastDocCMYK.pathItems.getByName("LandingZone3");
		let preferredWidth = (460);
		let preferredHeight = (460);
		// do the width
		let widthRatio = (preferredWidth / placedmastGroupCMYK.width) * 100;
		if (placedmastGroupCMYK.width != preferredWidth) {
			placedmastGroupCMYK.resize(widthRatio, widthRatio);
		}
		// now do the height
		let heightRatio = (preferredHeight / placedmastGroupCMYK.height) * 100;
		if (placedmastGroupCMYK.height != preferredHeight) {
			placedmastGroupCMYK.resize(heightRatio, heightRatio);
		}
		// now let's center the art on the landing zone
		let centerArt = [placedmastGroupCMYK.left + (placedmastGroupCMYK.width / 2), placedmastGroupCMYK.top + (placedmastGroupCMYK.height / 2)];
		let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
		placedmastGroupCMYK.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

		// need another centered proportioning to fix it exactly in correct position
		let W = mastGroupCMYK.width,
			H = mastGroupCMYK.height,
			MW = maxSize.W,
			MH = maxSize.H,
			factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
		mastGroupCMYK.resize(factor, factor);
	}
	placeIconLockup1Correctly4(mastGroupCMYK, { W: 460, H: 460 });

	// delete the landing zone
	landingZoneSquare4.remove();

	CSTasks.ungroupOnce(mastGroupCMYK);

	// add new style purple banner elements
	let myMainArtworkLayerMastDocCMYK = mastDocCMYK.layers.getByName('Layer 1');
	let myMainPurpleBgLayerMastDocCMYK = mastDocCMYK.layers.add();
	myMainPurpleBgLayerMastDocCMYK.name = "Main_Purple_BG_layer";
	let GetMyMainPurpleBgLayerMastDocCMYK = mastDocCMYK.layers.getByName('Main_Purple_BG_layer');
	let mainRectMastDocCMYK = GetMyMainPurpleBgLayerMastDocCMYK.pathItems.rectangle(
		-784,
		0,
		1024,
		512);

	mainRectMastDocCMYK.fillColor = colors[darkPurpleIndex][0];
	mainRectMastDocCMYK.filled = true;
	mainRectMastDocCMYK.stroked = false;

	/*@ts-ignore*/
	GetMyMainPurpleBgLayerMastDocCMYK.move(myMainArtworkLayerMastDocCMYK, ElementPlacement.PLACEATEND);

	// svg wtw logo for new purple lockup
	let imagePlacedItemMastDocCMYK = myMainArtworkLayerMastDocCMYK.placedItems.add();
	let svgFileMastDocCMYK = File(`${sourceDoc.path}/../images/wtw_logo.ai`);
	imagePlacedItemMastDocCMYK.file = svgFileMastDocCMYK;
	imagePlacedItemMastDocCMYK.top = -1189;
	imagePlacedItemMastDocCMYK.left = 62;
	imagePlacedItemMastDocCMYK.embed();


	// we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
	let myCroppingLayerMastDocCMYK = mastDocCMYK.layers.add();
	myCroppingLayerMastDocCMYK.name = "crop";
	let GetMyCroppingLayerMastDocCMYK = mastDocCMYK.layers.getByName('crop');
	mastDocCMYK.activeLayer = GetMyCroppingLayerMastDocCMYK;
	mastDocCMYK.activeLayer.hasSelectedArtwork = true;
	// insert clipping rect here
	let mainClipRectMastDocCMYK = GetMyCroppingLayerMastDocCMYK.pathItems.rectangle(
		-784,
		0,
		1024,
		512);
	// let setClipBgColorMastDocCMYK = new CMYKColor();
	// setClipBgColorMastDocCMYK.cyan = 90;
	// setClipBgColorMastDocCMYK.magenta = 100;
	// setClipBgColorMastDocCMYK.yellow = 22;
	// setClipBgColorMastDocCMYK.black = 11;
	mainClipRectMastDocCMYK.filled = false;
	//mainClipRectMastDocCMYK.fillColor = setClipBgColorMastDocCMYK;

	CSTasks.ungroupOnce(mastGroupCMYK);

	let mastTextCMYK = textGroup.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextCMYKLoc = [
		mastDocCMYK.artboards[0].artboardRect[0] + 63,
		mastDocCMYK.artboards[0].artboardRect[1] - 64,
	];
	CSTasks.translateObjectTo(mastTextCMYK, mastTextCMYKLoc);


	let mastTextCMYK2 = textGroup2.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextCMYKLoc2 = [
		mastDocCMYK.artboards[0].artboardRect[0] + 63,
		mastDocCMYK.artboards[0].artboardRect[1] - 124,
	];
	CSTasks.translateObjectTo(mastTextCMYK2, mastTextCMYKLoc2);

	// select all for clipping here
	sourceDoc.selectObjectsOnActiveArtboard();

	// clip!
	app.executeMenuCommand('makeMask');
	// make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
	app.executeMenuCommand('Colors8');

	CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);

	// save banner EPS 
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
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
	//if there are four artboards, create the new fifth lockup artboard
	if (
		sourceDoc.artboards.length == 4 &&
		sourceDoc.artboards[0].artboardRect[2] -
		sourceDoc.artboards[0].artboardRect[0] ==
		256 &&
		sourceDoc.artboards[0].artboardRect[1] -
		sourceDoc.artboards[0].artboardRect[3] ==
		256
	) {
		// create new artboard
		let firstRect = sourceDoc.artboards[0].artboardRect;
		sourceDoc.artboards.add(
			CSTasks.newRect(firstRect[1], firstRect[2] + 1168, 2560, 256)
		);
	}

	//if the lockup artboard is present, check if rebuilding or just exporting
	else if (
		sourceDoc.artboards.length == 5 &&
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

	// get icon
	let mast = iconGroup.duplicate(iconGroup.layer,
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND);
	// get icon new pos
	let mastPos = [
		sourceDoc.artboards[4].artboardRect[0],
		sourceDoc.artboards[4].artboardRect[1] + iconOffset[1],
	];
	// paste icon
	CSTasks.translateObjectTo(mast, mastPos);

	// add text from prompt
	let textRef = sourceDoc.textFrames.add();
	textRef.contents = appNameAlternate;
	textRef.textRange.characterAttributes.size = 182;
	CSTasks.setFont(textRef, desiredFontReg);

	//vertically align the baseline to be 64 px above the bottom of the artboard
	let bottomEdge =
		sourceDoc.artboards[4].artboardRect[3] +
		0.25 * sourceDoc.artboards[0].artboardRect[2] -
		sourceDoc.artboards[4].artboardRect[0]; //64px (0.25*256px) above the bottom edge of the artboard
	let vOffset = CSTasks.getOffset(textRef.anchor, [0, bottomEdge]);
	textRef.translate(0, -vOffset[1]);

	//create an outline of the text
	let textGroup = textRef.createOutline();

	//horizontally align the left edge of the text to be 64px to the right of the edge
	let rightEdge =
		mast.position[0] +
		mast.width +
		64; //64px (0.25*256px) right of the icon
	// alert(mast.position[0].toString())
	// alert(mast.width.toString())
	// alert(rightEdge.toString())
	let hOffset = CSTasks.getOffset(textGroup.position, [rightEdge, 0]);
	textGroup.translate(-hOffset[0], 0);

	//resize the artboard to be only a little wider than the text
	let leftMargin = mast.position[0] - sourceDoc.artboards[4].artboardRect[0];
	let newWidth =
		textGroup.position[0] +
		textGroup.width -
		sourceDoc.artboards[4].artboardRect[0] +
		leftMargin + 8;
	let resizedRect = CSTasks.newRect(
		sourceDoc.artboards[4].artboardRect[0],
		-sourceDoc.artboards[4].artboardRect[1],
		newWidth,
		256
	);
	sourceDoc.artboards[4].artboardRect = resizedRect;
	// make the text black
	let rgbBlack = new RGBColor();
	rgbBlack.red = 0;
	rgbBlack.green = 0;
	rgbBlack.blue = 0;
	// Loop through each path item in the text group
	for (let i = 0; i < textGroup.pathItems.length; i++) {
		textGroup.pathItems[i].fillColor = rgbBlack;
	}

	//#endregion
	//#region INDEX ONLY FOR CMYK conversion
	// open a doc just for color indexing
	/*********************************************************************
All exports from artboard 0
**********************************************************************/
	let indexRgbDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		4,
		DocumentColorSpace.RGB
	);

	indexRgbDoc.swatches.removeAll();

	let IndexRgbGroup = iconGroup.duplicate(
		indexRgbDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let IndexRgbLoc = [
		indexRgbDoc.artboards[0].artboardRect[0],
		indexRgbDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(IndexRgbGroup, IndexRgbLoc);

	CSTasks.ungroupOnce(IndexRgbGroup);
	//get the text offset for exporting
	let mastTextOffset2 = CSTasks.getOffset(
		textGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	// duplicate text
	let mastText2 = textGroup.duplicate(
		indexRgbDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextLoc2 = [
		indexRgbDoc.artboards[0].artboardRect[0] + mastTextOffset2[0],
		indexRgbDoc.artboards[0].artboardRect[1] + mastTextOffset2[1],
	];
	// paste text
	CSTasks.translateObjectTo(mastText2, mastTextLoc2);
	app.executeMenuCommand('Colors9');
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex = CSTasks.indexRGBColors(indexRgbDoc.pathItems, colors);

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
	let mastDoc = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		4,
		DocumentColorSpace.RGB
	);
	mastDoc.swatches.removeAll();


	// duplicate icon
	let mastGroup = iconGroup.duplicate(
		mastDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);

	// get correct position
	let mastLoc = [
		mastDoc.artboards[0].artboardRect[0],
		mastDoc.artboards[0].artboardRect[1] + iconOffset[1],
	];
	// paste icon
	CSTasks.translateObjectTo(mastGroup, mastLoc);

	CSTasks.ungroupOnce(mastGroup);
	//get the text offset for exporting
	let mastTextOffset = CSTasks.getOffset(
		textGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	// duplicate text
	let mastText = textGroup.duplicate(
		mastDoc.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	// text position
	let mastTextLoc = [
		mastDoc.artboards[0].artboardRect[0] + mastTextOffset[0],
		mastDoc.artboards[0].artboardRect[1] + mastTextOffset[1],
	];
	// paste text
	CSTasks.translateObjectTo(mastText, mastTextLoc);

	// save a text and lockup PNG
	let masterStartHeight = mastDoc.artboards[0].artboardRect[3] - mastDoc.artboards[0].artboardRect[1];
	let masterStartWidth =
		mastDoc.artboards[0].artboardRect[2] - mastDoc.artboards[0].artboardRect[0];
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, 256);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}

	// you need this to invert correctly
	app.executeMenuCommand('Colors9');
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
	CSTasks.convertColorRGB(mastDoc.pathItems, colors[blackIndex][0], colors[whiteIndex][0]);
	//index the RGB colors for conversion to CMYK. An inelegant location.
	let colorIndex2 = CSTasks.indexRGBColors(mastDoc.pathItems, colors);

	//save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}

	CSTasks.convertAll(mastDoc.pathItems, colors[blackIndex][0], 100);

	// save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${blackColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${blackColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${blackColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDoc.saveAs(destFile, rgbSaveOpts);
	}


	CSTasks.convertAll(mastDoc.pathItems, colors[whiteIndex][0], 100);

	// save a text and lockup PNG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${whiteColorName}_${rgbColorName}.png`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
		CSTasks.scaleAndExportPNG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}

	//save a text and lockup SVG
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${whiteColorName}_${rgbColorName}.svg`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
		CSTasks.scaleAndExportSVG(mastDoc, destFile, masterStartWidth, masterStartHeight);
	}
	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${whiteColorName}_${rgbColorName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${rgbName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
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
	let mastDocCMYK = CSTasks.duplicateArtboardInNewDoc(
		sourceDoc,
		4,
		DocumentColorSpace.CMYK
	);
	mastDocCMYK.swatches.removeAll();
	let mastGroupCMYK = iconGroup.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let mastLocCMYK = [
		mastDocCMYK.artboards[0].artboardRect[0],
		mastDocCMYK.artboards[0].artboardRect[1] + iconOffset[1],
	];
	CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);


	mastDocCMYK.selectObjectsOnActiveArtboard();

	CSTasks.ungroupOnce(mastGroupCMYK);
	mastDocCMYK.selectObjectsOnActiveArtboard();

	//get the text offset for exporting
	let mastTextOffsetCMYK = CSTasks.getOffset(
		textGroup.position,
		CSTasks.getArtboardCorner(sourceDoc.artboards[0])
	);
	let mastTextCMYK = textGroup.duplicate(
		mastDocCMYK.layers[0],
		/*@ts-ignore*/
		ElementPlacement.PLACEATEND
	);
	let mastTextLocCMYK = [
		mastDocCMYK.artboards[0].artboardRect[0] + mastTextOffsetCMYK[0],
		mastDocCMYK.artboards[0].artboardRect[1] + mastTextOffsetCMYK[1],
	];
	CSTasks.translateObjectTo(mastTextCMYK, mastTextLocCMYK);
	CSTasks.ungroupOnce(mastGroupCMYK);
	mastDocCMYK.selectObjectsOnActiveArtboard();
	app.executeMenuCommand('Colors8');
	CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);


	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDocCMYK.saveAs(destFile, rgbSaveOpts);
	}

	CSTasks.ungroupOnce(mastGroupCMYK);
	mastDocCMYK.selectObjectsOnActiveArtboard();
	app.executeMenuCommand('Colors8');
	CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex2);
	CSTasks.convertColorCMYK(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);

	//save a text and lockup inverse EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDocCMYK.saveAs(destFile, rgbSaveOpts);
	}

	let CMYKblack = new CMYKColor();
	CMYKblack.cyan = 0;
	CMYKblack.magenta = 0;
	CMYKblack.yellow = 0;
	CMYKblack.black = 100;
	// Get a reference to the active document
	let doc = app.activeDocument;
	// Iterate over all path items in the document
	for (let i = 0; i < doc.pathItems.length; i++) {
		let path = doc.pathItems[i];
		// Change the fill color to CMYK black
		path.fillColor = CMYKblack;
	}

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${blackColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
		mastDocCMYK.saveAs(destFile, rgbSaveOpts);
	}

	CSTasks.convertAll(mastDocCMYK.pathItems, colors[whiteIndex][0], 100);

	//save a text and lockup EPS
	for (let i = 0; i < exportSizes.length; i++) {
		let filename = `/${wtwName}_${iconFilename}_${alternateName}_${oneColorName}_${standardName}_${whiteColorName}_${fourColorProcessName}.eps`;
		let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
		let rgbSaveOpts = new EPSSaveOptions();
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