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
    setListeners();

    loadingON('Fetching Floodgate Config...');
    const config = await getConfig();
    if (!config) {
      return;
    }
    loadingON('Floodgate Config loaded...');

    loadingON('Fetching Project Config...');
    project = await initProject();
    console.log(`project.url: ${project.url}`);
    console.log(`project.path: ${project.path}`);
    console.log(`project.name: ${project.name}`);
    console.log(`project.excelPath: ${project.excelPath}`);
    loadingON(`Fetching project details for ${project.url}`);

    // Update project name
    updateProjectInfo(project);

    projectDetail = await project.getDetails();
    loadingON('Project Details loaded...');

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint!');

    loadingON('Updating Project the Sharepoint Docs Data...');
    await updateProjectWithDocs(projectDetail);

    loadingON('Updating UI..');
    await displayProjectDetail();
    loadingON('UI updated..');
    loadingOFF();

  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }

}

export default init;
