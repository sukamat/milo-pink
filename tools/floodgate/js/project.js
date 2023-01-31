import {
  getConfig
} from "./config.js";
import {
  getUrlInfo,
  getDocPathFromUrl,
} from '../../loc/utils.js';
import {
  getProjectFileStatus,
  getHelixAdminApiUrl,
  readProjectFile,
} from '../../loc/project.js';

let project;
let projectDetail;

function getFloodgateUrl(url) {
  if (!url) {
    return undefined;
  }
  let urlArr = url.split('--');
  urlArr[1] += '-pink';
  return urlArr.join('--');
}

async function initProject() {
  if (project) return project;
  const config = await getConfig();
  const urlInfo = getUrlInfo();
  if (!urlInfo.isValid()) {
    throw new Error('Invalid Url Parameters that point to project file');
  }

  // helix API to get the details/status of the file
  const hlxAdminStatusUrl = getHelixAdminApiUrl(urlInfo, config.admin.api.status.baseURI);
  console.log(`hlxAdminStatusUrl: ${hlxAdminStatusUrl}`);

  // get the status of the project file
  const projectFileStatus = await getProjectFileStatus(hlxAdminStatusUrl, urlInfo.sp);
  if (!projectFileStatus || !projectFileStatus?.webPath) {
    throw new Error('Project file does not have valid web path');
  }
  console.log('projectFileStatus :: ');
  console.log(projectFileStatus);

  const projectPath = projectFileStatus.webPath;
  console.log(`projectPath: ${projectPath}`);
  const projectUrl = `${urlInfo.origin}${projectPath}`;
  console.log(`projectUrl: ${projectUrl}`);
  const projectName = projectFileStatus.edit.name;
  console.log(`projectName: ${projectName}`);

  project = {
    url: projectUrl,
    path: projectPath,
    name: projectName,
    excelPath: `${projectPath.substring(0, projectPath.lastIndexOf('/'))}/${projectName}`,
    sp: urlInfo.sp,
    owner: urlInfo.owner,
    repo: urlInfo.repo,
    ref: urlInfo.ref,
    async getDetail() {
      const projectFileJson = await readProjectFile(projectUrl);
      if (!projectFileJson) {
        return {};
      }

      const urlsData = projectFileJson.urls.data;
      const urls = new Map();
      const filePaths = new Map();
      urlsData.forEach((urlRow) => {
        const url = urlRow.URL;
        const docPath = getDocPathFromUrl(url);
        urls.set(url, {
          doc: {
            filePath: docPath,
            url: url,
            fg: {
              url: getFloodgateUrl(url),
              sp: {},
            },
          }
        });
        if (filePaths.has(docPath)) {
          map.get(docPath).push(url);
        } else {
          map.set(docPath, [url]);
        }
        //addOrAppendToMap(filePaths, docPath, `urls|${url}|doc`);
      });

      projectDetail = {
        url: projectUrl,
        name: projectName,
        urls,
        filePaths,
      };

      window.projectDetail = projectDetail;
      return projectDetail;

    }
  }
  return project;
}

export {
  initProject,
}
