import { serializeNode } from "./serializer";

// Show the UI
figma.showUI(__html__, { width: 400, height: 600 });

// Load API Key on startup
figma.clientStorage.getAsync("gemini_api_key").then((apiKey) => {
  if (apiKey) {
    figma.ui.postMessage({ type: "load-api-key", data: apiKey });
  }
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'save-api-key') {
    await figma.clientStorage.setAsync("gemini_api_key", msg.data);
  }
  
  if (msg.type === 'create-rect') { // 'create-rect' is actually 'convert-selection'
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify("Please select a frame first.");
      return;
    }

    figma.notify(`Processing ${selection.length} nodes...`);
    
    const serialized = selection.map(node => serializeNode(node));
    // console.log("Serialized JSON:", JSON.stringify(serialized, null, 2));

    // Send result back to UI
    figma.ui.postMessage({ 
      type: 'selection-json', 
      data: serialized 
    });
  }
};

