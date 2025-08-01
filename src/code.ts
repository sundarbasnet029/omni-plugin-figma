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

  if (msg.type === 'avatar') {
    console.log("Inserting avatar");
    insertRandomAvatar();
  }
};



async function insertRandomAvatar() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: 'Please select an element' });
    return;
  }

  for (const node of selection) {
    if (node.type === 'FRAME' || node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
      try {
        // Get random avatar URL
        const avatarUrl = generateRandomAvatarUrl();
        
        // Fetch and insert image
        const imageBytes = await fetchImageAsBytes(avatarUrl);
        const imageHash = figma.createImage(imageBytes).hash;
        
        // Apply to selected element
        if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
          const fills = clone(node.fills) as Paint[];
          fills.push({
            type: 'IMAGE',
            imageHash: imageHash,
            scaleMode: 'FILL'
          });
          node.fills = fills;
        } else if (node.type === 'FRAME') {
          // Create image node inside frame
          const imageNode = figma.createRectangle();
          imageNode.resize(node.width, node.height);
          imageNode.fills = [{
            type: 'IMAGE',
            imageHash: imageHash,
            scaleMode: 'FIT'
          }];
          node.appendChild(imageNode);
        }
      } catch (error) {
        console.error('Failed to insert avatar:', error);
      }
    }
  }
}

function generateRandomAvatarUrl(): string {
  //const seed = Math.random().toString(36).substring(7);
  // Using DiceBear API for consistent avatar generation
  return `https://api.dicebear.com/9.x/lorelei/png`;
}

async function fetchImageAsBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

function clone(val: any) {
  return JSON.parse(JSON.stringify(val));
}