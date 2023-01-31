import {
  getConfig,
} from './config.js';
import {
  loadingOFF,
  loadingON,
} from '../../loc/utils.js';
import {
  connect as connectToSP,
} from '../../loc/sharepoint.js';
import {
  initProject,
} from './project.js';

let project;

function startProject() {

}

function copyFilesToFloodgateTree() {

}

function promoteFilesToFloodgateTree() {

}

function deleteFloodgateTree() {

}

function setListeners() {
  document.querySelector('#startProject button').addEventListener('click', startProject);
  document.querySelector('#copyFiles button').addEventListener('click', copyFilesToFloodgateTree);
  document.querySelector('#promoteFiles button').addEventListener('click', promoteFilesToFloodgateTree);
  document.querySelector('#deleteFiles button').addEventListener('click', deleteFloodgateTree);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function init() {

  try {
    setListeners();

    loadingON('Fetching Floodgate Config...');
    const config = await getConfig();
    if (!config) {
      return;
    }
    loadingON('Floodgate Config loaded...');

    loadingON('Fetching Project Config...');
    project = await initProject();
    loadingON('Refreshing Project Config...');

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint! Updating the Sharepoint Status...');
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }

}

export default init;
