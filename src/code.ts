// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
/// <reference types="@figma/plugin-typings" />


// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width:440, height:554});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  if (msg.type.startsWith('insert-')) {
    const selectedNodes = figma.currentPage.selection;
    const dataArray: string[] = msg.data || []; // rename from `msg.names` to `msg.data` to make it general
    let selectedNodesCount = selectedNodes.length;
    if(selectedNodesCount === 0){
      figma.closePlugin('No text layer selected');
      return;
    }
  
    let count = 0;
    for (let node of selectedNodes) {
      if (node.type === "TEXT") {
        await figma.loadFontAsync(node.fontName as FontName);
        node.characters = dataArray[count % dataArray.length];
        count++;
      }
    }
  
    // Friendly message based on msg.type
    const insertType = msg.type.replace('insert-', '').replace(/([A-Z])/g, ' $1').toLowerCase();
    figma.closePlugin(`Inserted ${count} ${insertType}(s)`);
  }
  
};