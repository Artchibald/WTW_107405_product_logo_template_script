
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
 mastDocCMYK.artboards[0].artboardRect[0] + iconOffset[0],
 mastDocCMYK.artboards[0].artboardRect[1] + iconOffset[1],
];
CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);


mastDocCMYK.selectObjectsOnActiveArtboard();

//make icon fill whole area
let getLayer2 = mastDocCMYK.layers.getByName('Layer 1');
let landingZoneSquare3 = getLayer2.pathItems.rectangle(
 -384,
 0,
 256,
 256);
function placeIconOnArtboard4(mastGroupCMYK, maxSize, getLayer2) {
 let setLandingZoneSquareColor = new RGBColor();
 setLandingZoneSquareColor.red = 12;
 setLandingZoneSquareColor.green = 28;
 setLandingZoneSquareColor.blue = 151;

 landingZoneSquare3.fillColor = setLandingZoneSquareColor;
 landingZoneSquare3.name = "LandingZone";
 landingZoneSquare3.filled = false;
 /*@ts-ignore*/
 landingZoneSquare3.move(getLayer2, ElementPlacement.PLACEATEND);

 let placedMastBannerIconOnText = mastGroupCMYK;
 let landingZone = mastDocCMYK.pathItems.getByName("LandingZone");
 let preferredWidth = 256;
 let preferredHeight = 256;

 // Resize the mast icon to the preferred width if necessary
 let widthRatio = (preferredWidth / placedMastBannerIconOnText.width) * 100;
 if (placedMastBannerIconOnText.width != preferredWidth) {
  placedMastBannerIconOnText.resize(widthRatio, widthRatio);
 }

 // Resize the mast icon to the preferred height if necessary
 let heightRatio = (preferredHeight / placedMastBannerIconOnText.height) * 100;
 if (placedMastBannerIconOnText.height != preferredHeight) {
  placedMastBannerIconOnText.resize(heightRatio, heightRatio);
 }

 // Center the mast icon on the landing zone
 let centerArt = [placedMastBannerIconOnText.left + (placedMastBannerIconOnText.width / 2), placedMastBannerIconOnText.top + (placedMastBannerIconOnText.height / 2)];
 let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
 placedMastBannerIconOnText.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

 // Resize the mast icon again to ensure it fits within the maximum size
 let W = mastGroupCMYK.width,
  H = mastGroupCMYK.height,
  MW = maxSize.W,
  MH = maxSize.H,
  factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
 mastGroupCMYK.resize(factor, factor);
}

placeIconOnArtboard4(mastGroupCMYK, { W: 256, H: 256 }, getLayer2);
landingZoneSquare3.remove();

if (mastGroupCMYK.width > mastGroupCMYK.height) {
 //alert("icon is more wide than tall!");
 let verticalOffset = (256 - mastGroupCMYK.height) / 2;
 mastLocCMYK = [
  mastDocCMYK.artboards[0].artboardRect[0],
  mastDocCMYK.artboards[0].artboardRect[1] + -verticalOffset, // vert
 ];
 CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);
} else {
 //alert("icon is more tall than wide!")
 mastLocCMYK = [
  mastDocCMYK.artboards[0].artboardRect[0],
  mastDocCMYK.artboards[0].artboardRect[1],
 ];
 CSTasks.translateObjectTo(mastGroupCMYK, mastLocCMYK);
}
CSTasks.ungroupOnce(mastGroupCMYK);


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


// save a text and lockup PNG
// let masterStartWidthCMYK =
// 	mastDocCMYK.artboards[0].artboardRect[2] - mastDocCMYK.artboards[0].artboardRect[0];
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.png`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
// 	CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthCMYK, exportSizes[0]);
// }

//save a text and lockup SVG
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.svg`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
// 	CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
// }
//save a text and lockup EPS
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
// 	let rgbSaveOpts = new EPSSaveOptions();
// 	mastDocCMYK.saveAs(destFile, rgbSaveOpts);
// }
// not working
// CMYK color doesn'tmatch array
app.executeMenuCommand('Colors8');
CSTasks.convertToCMYK(mastDocCMYK, mastDocCMYK.pathItems, colors, colorIndex);
CSTasks.convertColorCMYK(mastDocCMYK.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
// save a text and lockup inverse PNG
// let masterStartWidthPngCMYK =
// 	mastDocCMYK.artboards[0].artboardRect[2] - mastDocCMYK.artboards[0].artboardRect[0];
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.png`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
// 	CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthPngCMYK, exportSizes[0]);
// }

//save a text and lockup inverse SVG
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.svg`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
// 	CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
// }

//save a text and lockup inverse EPS
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${inverseColorName}_${fourColorProcessName}.eps`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
// 	let rgbSaveOpts = new EPSSaveOptions();
// 	mastDocCMYK.saveAs(destFile, rgbSaveOpts);
// }

CSTasks.convertAll(mastDocCMYK.pathItems, colors[blackIndex][0], 100);

// save a text and lockup PNG
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${blackColorName}_${fourColorProcessName}.png`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
// 	CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthPngCMYK, exportSizes[0]);
// }

//save a text and lockup SVG
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${blackColorName}_${fourColorProcessName}.svg`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
// 	CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
// }
//save a text and lockup EPS
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${blackColorName}_${fourColorProcessName}.eps`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
// 	let rgbSaveOpts = new EPSSaveOptions();
// 	mastDocCMYK.saveAs(destFile, rgbSaveOpts);
// }


CSTasks.convertAll(mastDocCMYK.pathItems, colors[whiteIndex][0], 100);

// save a text and lockup PNG
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${whiteColorName}_${fourColorProcessName}.png`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${pngName}`) + filename);
// 	CSTasks.scaleAndExportPNG(mastDocCMYK, destFile, masterStartWidthPng, exportSizes[0]);
// }

//save a text and lockup SVG
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${whiteColorName}_${fourColorProcessName}.svg`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${svgName}`) + filename);
// 	CSTasks.scaleAndExportSVG(mastDocCMYK, destFile, 512, 1024);
// }
//save a text and lockup EPS
// for (let i = 0; i < exportSizes.length; i++) {
// 	let filename = `/${wtwName}_${iconFilename}_${alternateName}_${fullColorName}_${standardName}_${whiteColorName}_${fourColorProcessName}.eps`;
// 	let destFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${alternativeLockupFolderName}/${epsName}/${cmykName}`) + filename);
// 	let rgbSaveOpts = new EPSSaveOptions();
// 	mastDocCMYK.saveAs(destFile, rgbSaveOpts);
// }

//close and clean up
mastDocCMYK.close(SaveOptions.DONOTSAVECHANGES);
mastDocCMYK = null;
//#endregion
}
createAndExportArtboard2();
