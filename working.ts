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
