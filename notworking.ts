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
 ElementPlacement.PLACEATBEGINNING
);
let cmykLocExp = [
 cmykDocExp.artboards[0].artboardRect[0] + iconOffset[0],
 cmykDocExp.artboards[0].artboardRect[1] + iconOffset[1],
];
CSTasks.translateObjectTo(cmykGroupExp, cmykLocExp);
CSTasks.ungroupOnce(cmykGroupExp);


let colorIndex = CSTasks.indexRGBColors(cmykDocExp.pathItems, colors);
CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex);

cmykDocExp.selectObjectsOnActiveArtboard();


for (let i = 0; i < exportSizes.length; i++) {
 let cmykFilename = `/${wtwName}_${iconFilename}_${expressiveIconName}_${iconName}_${fullColorName}_${standardName}_${positiveColorName}_${fourColorProcessName}.eps`;
 let cmykDestFile = new File(Folder(`${sourceDoc.path}/${sourceDocName}/${expressiveFolderName}/${iconFolderName}/${epsName}`) + cmykFilename);
 let cmykSaveOpts = new EPSSaveOptions();
 cmykDocExp.saveAs(cmykDestFile, cmykSaveOpts);
}
// not working


app.executeMenuCommand('Colors8');
CSTasks.convertToCMYK(cmykDocExp, cmykDocExp.pathItems, colors, colorIndex);
//Invert
CSTasks.convertColorCMYK(cmykDocExp.pathItems, colors[violetIndex][0], colors[whiteIndex][0]);
