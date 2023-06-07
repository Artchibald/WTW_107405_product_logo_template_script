<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="images/img.png" alt="Logo" width="180" height="180">
  </a>

<h3 align="center">A Typescript file that converts into ECMA 3 target JS file for use in Adobe Illustrator 2022. JS script that takes 2 icons on 2 artboards @256x256 and exports them into a variety of banners and formats, including company logo and text.</h3>

  <p align="center"> 
    Useful links 
    <br />
    <a href="https://github.com/Artchibald/2022_icon_rebrand_scripts"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/Artchibald/2022_icon_rebrand_scripts/issues">Report Bug</a>
    ·
    <a href="https://github.com/Artchibald/2022_icon_rebrand_scripts/issues">Request Feature</a>
        ·

  </p>
</div> 

<!--# Ref for email comms

 Subject >>>
WTW_55556_Software Product Icons

cc' >>>
 rrdcreativeldn @willistowerswatson.com

# 2022_icon_rebrand_scripts -->

# Video tutorial

https://youtu.be/yxtrt7nkOjA

# Instructions

- This script only works locally not on a server.
- Don't forget to change .txt to .js on the script.
- FULL README: https://github.com/Artchibald/2022_icon_rebrand_scripts  
- Video set up tutorial available here: https://youtu.be/yxtrt7nkOjA.
- Open your own .ai template or the provided ones in folders called test.
- In Illustrator, go to to file > Scripts > Other Scripts > Import our new script.
-  Make sure you have the Graphik font installed on your CPU. 
- You must have the folder called images in the parent folder, this is where wtw_logo.ai is saved so it can be imported into the big purple banner and exported as assets. Otherwise you will get an error that says "error = svgFile".
- Illustrator says (not responding) on PC but it will respond, give Bill Gates some time XD !).
- If you run the script again, you should probably delete the previous assets created. They get intermixed and overwritten. 
- Both artboard sizes must be exactly 256px x 256px. 
- Guides must be on a layer called exactly 'Guidelines'. 
- Icons must be on a layer called exactly 'Art'. 
- Make sure all layers are unlocked to avoid bugs. 
- Exported assets will be saved where the .ai file is saved. 
- Please try to use underscore instead of spaces to avoid bugs in filenames. 
- Make sure you are using the correct swatches/colours. 
- Illustrator check advanced colour mode is correct:  Edit > Assign profile > Must match sRGB IEC61966-2.1.
- Select each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered.
- If it does not save exports as intended, check the file permissions of where the .ai file is saved (right click folder > Properties > Visibility > Read and write access? Also you can try "apply permissions to sub folders too" if you find that option)
- Please do not use the Graphik font in any other projects without permission, this is a copyrighted font, therefore not included in this repo.  
- Any issues: archie ATsymbol archibaldbutler.com.

# Run watch task to compile ts to js

run "npm i" to get node_modules

"npm i types-for-adobe" make sure we have this node module.

tsc -p /NAVIGATE_TO_CODEBASE_FOLDER/tsconfig.json --watch  
 
Or VS code main top nav menu > Terminal > Run Build Task > Watch

# Script overview

- First we have global variables
- Then reusable fuctions with a typescript interface
- Then a function for the core exports
- Then a function for the expressive exports.
- We target the different artboards using their positions in the array
- There are code sections where we duplicate in a new artboard, save out exports, then close the new artboard. In this scenario the array of artboards will always be 0, whereas main doc has 2 artboards, 0 and 1, but also artboards, 2, 3 and 4 get created halfway down the script.
- Script to automate creating variations and exporting files for WTW icons
- Starting with an open AI file with a single icon on a single 256 x 256 artboard
– Creates a new artboard0 at 16x16
- Creates a new artboard1 at 24x24
- Creates a new artboard2 at 1400x128 for old banner style
- Adds a new artboard3 purple masthead with company logo and text 2 area.
- Creates a artboard4 purple banner masthead with no text or logo just, the icon.
- Adds resized copies of the icon to the artboards
- Asks for the name of the icon and adds text to the masthead icon
- Then asks for 2nd masthard text

- Creates exports of the icon:
- RGB EPS
- RGB inverse EPS
- RGB inactive EPS
- PNGs at 1024, 256, 128, 64, 48, 32
- RGB masthead
- CMYK EPS
- CMYK inverse EPS

- The script copies a selected artboard and duplicates the current selection and pastes in a new file, saves some exports and closes the 2nd file multiple times throughout. You would want to duplicate these chunks for new functionality.

From
```
 let someDoc = CSTasks.duplicateArtboardInNewDoc(
      sourceDoc,
      3,
      DocumentColorSpace.RGB
   );
```

To
```
   //close and clean up
   someDoc.close(SaveOptions.DONOTSAVECHANGES);
   someDoc = null;
```

# Consideration

You must have a purple portion of your original icons or the invert to whites wont work and will skip.

Make sure that all the colours in the expressive stripe are set to RGB otherwise the script will have trouble with CMYK colour conversion.

Make sure the dark colours of the expressive stripe are expanded under Object > Expand. The dark stripes width and height must not go beyond 256x256. Sometimes it makes it a large background square. This needs to be resolved first:

[stripes]: images/stripes.jpg


# Script is 4 distinct blocks

- Script starts with global var declarations, standard.
- Then reusable interface with reusable functions.
- Then all the Core exports (sourceDoc.artboards[0].XXXX)
- Then all the expressive exports (sourceDoc.artboards[1].XXXX)
- Extra note: I noticed "let = colorIndex" is needed for CMYK conversions, be sure it isdeclared in the previous new docrgb block, but after the function convertToRGB or cmyk invert further on, does not work.
- Extra note: Make sure you use app.executeCommand colors8 (CMYK) and colors9 (RGB) in the right places or you will have problems with inverts
# Font issues

Font type must be TT (truetype), doesn't work with O (opentype)

# 1 off bug when updating Illustrator

After I updated Illustrator, it couldn't read wtw_logo.ai, so I opened that file in Illustrator, saved it, ran the script again and it worked.

 # Illustrator Edit > Assign profile > Must match sRGB IEC61966-2.1 or it won't work

 # Select each individual colour shape and under Window > Colours make sure each shape colour is set to rgb in burger menu or it won't work!

 # Presentation question what would be liked for folder structure

 # Blockers

 SVG dimensions in their code to be potentially addressed

 # Issue with swatches stopping colours being RGB, trying  Edit > Edit colors > Convert to RGB

- managed to fix with    // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB

```
   app.executeMenuCommand('Colors9');
```

- The list of all these available commands can be useful for a specific task: https://community.adobe.com/t5/illustrator-discussions/a-list-of-illustrator-menu-commands-we-can-call-from-javascript/td-p/7694367


# Briefs and other less important notes

# To do

- Change svg dimensions in their respective code?
- Do we move our resize functions into reusable section at top of script?

# Done

- Create folders for all SVG, EPS, JPG,PNG and try to save them in the right place
- Find bug: One or more colours....
- let tasks: any = {}; line 83, better solution than any?
- Is there a way to edit the viewbox 256 settings in each svg?
- Convert to CMYK breaking script, not working colours undefined
- Inverse action works with old colours not new ones
- do cropped 16 + 24
- documentation - reusability for other devs
- DONE CMYK and RGB don't match this time round! We blocked with a commented return.

# Notes from design brief call 29june

- 1 new brand graphic, magenta colour panels + patterns = perspective
- 2 iconology new style
- if you are manipulating them, follow the pdf process
- Graphic motif I use 100% STRIPE scaling(web)

# Initial call brief

- 24/06/22
- 172 product icons.
- script with outputs
- transferred from old style brand to new style
- kick off monday
- call goes through style and icons
- new style outputted
- 7 outputs
- scale to colours to types of file
- also got versions already
- chris lead designer
- does conversion
- 172x
- old brand to new then approve
- type of files
- core / expressive
- 7 types of outputs
- various styles achieved
- not correct format but structure and sizing and line widht and colours is goood
- naming conventions
- see named swatches
- core is digi and expressive is for marketing annd press
- we had 2 dif. once, 
- target different artboards (by name)
- 2 artboards in same file
- 1 script vs two
- depending on icon categorisation internally
- infinity green is hr
- magenta is consumer
- guides: types of guides
- see grid
- we want rgb cmyk in dif colours
- 1 export is favicon.ico
- stripes: designer chooses which and direction

# TUBS

- Monday 27 June 8 hours, start script edits, convert to typescript without breaking, multiple tests, artboard division breakthrough, separate new file into 2 artboards, core & expressive. Move masthead over to position artboard 3 with JS maths. Lots of reading old script and ai script docs. Drew diagram of intended funcitonalty and passed onto team for review.
- Tue 28 June Reviewed and commented back on expectations spreadsheet. Read up on favicon.ico. Code bugs resolved: Hid guidelines layer before expots start, create expressive folder, move masthead down vertically, successfully add graphik font to script.
- Wed 29 June, morning reorganise all exports into respective folders. Trying to fix RGB colour bug.
- Thu 30 Continued debugging script, progress in spreadsheet required exports, discovered CMYK - RGB mismatch bug
- Fri 1 July continued debugging, call and present latest work, trying ot get SVG on white bg to export
- Mon 4 July Found fix for PNG exports on white bg but not SVG, tried to create a Typescript interface for debugging but not easy in ECMA 3 exports using AI API so parked it for now.
- Tue 5 July more tests on the SVG background white square, it is taking to long to restructure the layers but it is doable, so parked it. In the afternoon I fixed a big RGB colour bug with Chris's help.
- Wed 6 colours no longer have to match exactly, script will not stop anymore if colours dont match. Uses the actual colours from the rebrand pdf in RGB and CMYK.
- Thu 7 troubles with the 4th artboard dimensions that need changing. Had some extensive debugging to stop the fourth artboard from cropping to the size of the text within. Got expressive banner debugged. Just needs aligning in mastDoc.
- Fri 8 new bug Michael Winter helped me with around clipping mask of Masthead eps export. Aligned MastDoc coordinates.
- Monday 11 July built out the last banner in the set 800x400 
- Tuesday 12 july , call with Chris new bug discovered trialing different icons, Call and present with Katie, started documentaiton
- Wed 13 July working major blocker, icon h is not same as icon w, trialling solutions, no success
- Thu 14 July Delivery day, finally fixed calculation from day before, packaged, cleaning, documenting
- Fri 15 July Working on how to crop for cropped pngs 16 and 24 requested by Katie, discussed with Chris McDemott and implementing new stage for this in the js file, also fixed CMYK issue major blocker, implemented on inverse, inactive, onFFF too in Core. Still need to do expressive.
- Mon 18 Jul, clean script more, doc cleanups more, added 2 new export assets as per spreadsheet, Core and Expressive SVG onFFF.
- Tues 19 July Amends and feedback from the design US team implemented, more documentation and video tutrial created
- Wednesday 1/2 day, calls, review, packaging and handoff 
- 2 hours amends Diane Thu 23 June to first icon script (on colour blocks)
- Friday 24 June 1 hour call and set up
- Sat 25 June 3 hours docs review, repo set up, set up typescript installation, remove all errors from original js script copy as TS
- 26 July 2 hours, Katie requested removing expressive jpgs and pngs under 512. Had to repackage and retest.
- 10 (1/2 day), 11, 12 Oct 2022, 2.5 days reworking the whole operation to rectify exports according to brief from Katie.
- Thu 10 Nov - 1/2 day migraine. double check expressive banner crops @8px for Michael Williams, they were out and technically time consuming to correct and review feedback from Katie with attached files.  
# Shorten file names as per Jo request?

# Add swatch to your swatches panel before starting with swtach .ai file. Swatch menu > Other Library...

# New briefs from Katie

- As mentioned, we wanted to explore potential options for exporting the expressive assets onto artboards with specific layouts.
- Please see attached .ai file (social media and email sizes).
- Basically – wondering if we can select a consistent X,Y coordinate and place that expressive icon there, with a dark ultraviolet background, and in the case of the social items – pre-populate the text of the application as well as the logo (assets attached here).
- The text and the logo would also remain locked in a consistent location, and the expressive icon would be consistently cropped.
- Please let me know if you’d like to discuss live. (Example below shows that expressive icon would be cropped – slightly). See email 28 June

# New action for pattern form Diane and Chris, see chat and discuss on call

# New amends 10/10/22

CORE:

- Just core and expressive
- No top level icons
- Cropped
- Naming stuff
- Masthead becomes lockup
- EPS CMYK inverse Core is missing
- Remove jpg inactive from core
- SVG scale down
- SVG core  they want 2 onluy
- core cropped and core
- EPS
- Delete inverse CMYK

EXPRESSIVE:

- EPS
- New name

ask_benix_expressive_RGB_1024x512
ask_benix_expressive_RGB_800x400
ask_benix_expressive_RGB
ask_benix_expressive_CMYK

- All expresiive remove all inactive and expressive, not in core
- Expressive jpg
- only 2, 512 and 1024, delete the jpg expressive folder
- IN JPG Should be the same as EPS in jpg
- Same for PNG, EPS should be in png folder too
- In root folder, top level needs 2 things
- ask benix core 1 png 1 svg
- ask benix expressive 1 png 1 svg

[![explain][explain]](https://github.com/Artchibald/2022_icon_rebrand_scripts)

 
[explain]: images/explain.png