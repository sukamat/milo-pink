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
  updateProjectWithDocs,
} from './project.js';
import {
  updateProjectInfo,
  updateProjectDetailsUI,
} from './app.js';

let project;
let projectDetail;

function startProject() {
  // TODO: 
}

function copyFilesToFloodgateTree() {
  // TODO: 
}

function promoteFilesToFloodgateTree() {
  // TODO: 
}

function deleteFloodgateTree() {
  // TODO: 
}

function setListeners() {
  document.querySelector('#startProject button').addEventListener('click', startProject);
  document.querySelector('#copyFiles button').addEventListener('click', copyFilesToFloodgateTree);
  document.querySelector('#promoteFiles button').addEventListener('click', promoteFilesToFloodgateTree);
  document.querySelector('#deleteFiles button').addEventListener('click', deleteFloodgateTree);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function displayProjectDetail() {
  if (!projectDetail) {
    return;
  }
  const config = await getConfig();
  if (!config) {
    return;
  }
  updateProjectDetailsUI(projectDetail, config);
}

async function init() {

  try {
    // Set the listeners on the floodgate action buttons
    setListeners();

    // Read the Floodgate Sharepoint Config
    loadingON('Fetching Floodgate Config...');
    const config = await getConfig();
    if (!config) {
      return;
    }
    loadingON('Floodgate Config loaded...');

    // Initialize the Floodgate Project by setting the required project info
    loadingON('Fetching Project Config...');
    project = await initProject();
    loadingON(`Fetching project details for ${project.url}`);

    // Update project name on the admin page
    updateProjectInfo(project);

    // Read the project excel file and parse the data
    projectDetail = await project.getDetails();
    loadingON('Project Details loaded...');

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint!');

    // Inject Sharepoint file metadata
    loadingON('Updating Project with the Sharepoint Docs Data...');
    await updateProjectWithDocs(projectDetail);

    // Render the data on the page
    loadingON('Updating UI..');
    await displayProjectDetail();
    loadingON('UI updated..');
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }
}

export default init;
