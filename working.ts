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
 let setLandingZoneSquareColor = new RGBColor();
 setLandingZoneSquareColor.red = 121;
 setLandingZoneSquareColor.green = 128;
 setLandingZoneSquareColor.blue = 131;
 landingZoneSquare4.fillColor = setLandingZoneSquareColor;
 landingZoneSquare4.name = "LandingZone3"
 landingZoneSquare4.filled = true;
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
let setMainVioletBgColorMastDocCMYK = new RGBColor();
setMainVioletBgColorMastDocCMYK.red = 72;
setMainVioletBgColorMastDocCMYK.green = 8;
setMainVioletBgColorMastDocCMYK.blue = 111;
mainRectMastDocCMYK.filled = true;
mainRectMastDocCMYK.fillColor = setMainVioletBgColorMastDocCMYK;
/*@ts-ignore*/
GetMyMainPurpleBgLayerMastDocCMYK.move(myMainArtworkLayerMastDocCMYK, ElementPlacement.PLACEATEND);

// svg wtw logo for new purple lockup
let imagePlacedItemMastDocCMYK = myMainArtworkLayerMastDocCMYK.placedItems.add();
let svgFileMastDocCMYK = File(`${sourceDoc.path}/../images/wtw_logo.ai`);
imagePlacedItemMastDocCMYK.file = svgFileMastDocCMYK;
imagePlacedItemMastDocCMYK.top = -1189;
imagePlacedItemMastDocCMYK.left = 62;

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
let setClipBgColorMastDocCMYK = new RGBColor();
setClipBgColorMastDocCMYK.red = 0;
setClipBgColorMastDocCMYK.green = 255;
setClipBgColorMastDocCMYK.blue = 255;
mainClipRectMastDocCMYK.filled = true;
mainClipRectMastDocCMYK.fillColor = setClipBgColorMastDocCMYK;
// select all for clipping here
sourceDoc.selectObjectsOnActiveArtboard();


// clip!
app.executeMenuCommand('makeMask');

// save banner EPS 
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${positiveColorName}_${cmykName}.eps`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
// 	let rgbSaveOpts = new EPSSaveOptions();
// 	mastDocCMYK.saveAs(destFile, rgbSaveOpts);
// }
// make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB

app.executeMenuCommand('Colors8');
CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);
//Invert
CSTasks.convertColorCMYK(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
return;
// save banner EPS 
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${expressiveArtworkName}_${fullColorName}_${standardName}_${inverseColorName}_${cmykName}.eps`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconInLayoutFolderName}/${epsName}`) + filename);
// 	let rgbSaveOpts = new EPSSaveOptions();
// 	mastDocCMYK.saveAs(destFile, rgbSaveOpts);
// }
//close and clean up
mastDocCMYK.close(SaveOptions.DONOTSAVECHANGES);
mastDocCMYK = null;
//#endregion
}
createAndExportArtboard3(); 