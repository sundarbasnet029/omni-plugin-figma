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

  // Add this new handler for icons
  if (msg.type === 'icon') {
    await insertIcon(msg.iconData);
  }
};

// Function to insert SVG icon
async function insertIcon(iconData: { svg: string, name?: string, collection?: string, iconName?: string }) {
  const selection = figma.currentPage.selection;
  
  try {
    // Parse the SVG string to create a node
    function normalizeSvgSize(svg: string): string {
      return svg
        .replace(/width="[^"]+"/, 'width="24"')
        .replace(/height="[^"]+"/, 'height="24"');
    }
    const svg = normalizeSvgSize(iconData.svg);
    const svgNode = figma.createNodeFromSvg(svg);
    
    if (selection.length === 0) {
      // If no selection, place the icon at the center of the viewport
      svgNode.x = figma.viewport.center.x - svgNode.width;
      svgNode.y = figma.viewport.center.y - svgNode.height;
      
      // Add the icon to the current page
      figma.currentPage.appendChild(svgNode);
      
      // Select the newly created icon
      figma.currentPage.selection = [svgNode];
      
      // Zoom into view
      figma.viewport.scrollAndZoomIntoView([svgNode]);
      
      figma.notify(`Inserted icon${iconData.name ? ': ' + iconData.name : ''}`);
    } else {
      // If there's a selection, replace or insert into selected elements
      let insertedCount = 0;
      
      for (const node of selection) {
        if (node.type === 'FRAME' || node.type === 'GROUP') {
          // Insert icon into frame/group
          const iconCopy = svgNode.clone();
          
          // Center the icon within the frame/group
          iconCopy.x = (node.width - iconCopy.width) / 2;
          iconCopy.y = (node.height - iconCopy.height) / 2;
          
          node.appendChild(iconCopy);
          insertedCount++;
        } else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'STAR' || node.type === 'VECTOR') {
          // Replace the selected shape with the icon
          const iconCopy = svgNode.clone();
          
          // Match the position and size of the original node
          iconCopy.x = node.x;
          iconCopy.y = node.y;
          
          // Optionally resize to match the original node's dimensions
          if (node.width && node.height) {
            const scaleX = node.width / iconCopy.width;
            const scaleY = node.height / iconCopy.height;
            const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio
            
            iconCopy.resize(iconCopy.width * scale, iconCopy.height * scale);
            
            // Center within the original bounds
            iconCopy.x = node.x + (node.width - iconCopy.width) / 2;
            iconCopy.y = node.y + (node.height - iconCopy.height) / 2;
          }
          
          // Insert the icon in the same parent and position
          if (node.parent) {
            const index = node.parent.children.indexOf(node);
            node.parent.insertChild(index, iconCopy);
          }
          
          // Remove the original node
          node.remove();
          insertedCount++;
        }
      }
      
      // Remove the original SVG node if we cloned it
      if (insertedCount > 0) {
        svgNode.remove();
      }
      
      figma.notify(`Inserted icon${iconData.name ? ' ' + iconData.name : ''} into ${insertedCount} element(s)`);
    }
  } catch (error) {
    figma.notify('Failed to insert icon. Invalid SVG format.', { error: true });
    console.error('Failed to insert icon:', error);
  }
}

async function insertRandomAvatar() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: 'Please select an element' });
      figma.closePlugin('No layer selected');
    
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

const CLOUDINARY_AVATARS = [
  'https://res.cloudinary.com/dssyqusif/image/upload/v1753893975/Rectangle-4_evjzzc.jpg',
  'https://res.cloudinary.com/dssyqusif/image/upload/v1753893975/Rectangle-2_dhvciq.jpg',
  'https://res.cloudinary.com/dssyqusif/image/upload/v1753893975/Rectangle-3_vhpsym.jpg',
  // ... add all 25 avatar URLs
  'https://res.cloudinary.com/dssyqusif/image/upload/v1753893975/Rectangle-1_nayq4f.jpg',
  'https://res.cloudinary.com/dssyqusif/image/upload/v1753893975/Rectangle_ru9eri.jpg'
];

function generateRandomAvatarUrl(): string {
  const randomIndex = Math.floor(Math.random() * CLOUDINARY_AVATARS.length);
  return CLOUDINARY_AVATARS[randomIndex];
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