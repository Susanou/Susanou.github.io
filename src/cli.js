/* global $, localStorage, Shell */

const errors = {
  invalidDirectory: "Error: not a valid directory",
  noWriteAccess: "Error: you do not have write access to this directory",
  fileNotFound: "Error: file not found in current directory",
  fileNotSpecified: "Error: you did not specify a file",
};

const struct = {
  root: ["about", "resume", "contact"],
  skills: ["programming", "languages"],
  jobs: ["H2R", "ArmatureTech", "GroupeHN"],
};

const commands = {};
let systemData = {};
const rootPath = "users/Susanou/root";

const getDirectory = () => localStorage.directory;
const setDirectory = (dir) => {
  localStorage.directory = dir;
};

// Turn on fullscreen.
const registerFullscreenToggle = () => {
  $(".button.green").click(() => {
    $(".terminal-window").toggleClass("fullscreen");
  });
};
const registerMinimizedToggle = () => {
  $(".button.yellow").click(() => {
    $(".terminal-window").toggleClass("minimized");
  });
};

// Create new directory in current directory.
commands.mkdir = () => errors.noWriteAccess;

// Create new directory in current directory.
commands.touch = () => errors.noWriteAccess;

// Remove file from current directory.
commands.rm = () => errors.noWriteAccess;

// View contents of specified directory.
commands.ls = (directory) => {
  console.log(systemData);
  if (directory === ".." || directory === "~") {
    return systemData["root"];
  }
  return systemData[getDirectory()];
};

// View list of possible commands.
commands.help = () => systemData.help;

// Display current path.
commands.path = () => {
  const dir = getDirectory();
  return dir === "root" ? rootPath : `${rootPath}/${dir}`;
};

// See command history.
commands.history = () => {
  let history = localStorage.history;
  history = history ? Object.values(JSON.parse(history)) : [];
  return `<p>${history.join("<br>")}</p>`;
};

// Move into specified directory.
commands.cd = (newDirectory) => {
  const currDir = getDirectory();
  const dirs = Object.keys(struct);
  const newDir = newDirectory ? newDirectory.trim() : "";

  if (dirs.includes(newDir) && currDir !== newDir) {
    setDirectory(newDir);
  } else if (
    newDir === "" ||
    newDir === "~" ||
    (newDir === ".." && dirs.includes(currDir))
  ) {
    setDirectory("root");
  } else {
    return errors.invalidDirectory;
  }
  return null;
};

// Display contents of specified file.
commands.cat = (filename) => {
  if (!filename) return errors.fileNotSpecified;

  const dir = getDirectory();
  const fileKey = filename.split(".")[0];

  if (fileKey in systemData && struct[dir].includes(fileKey)) {
    return systemData[fileKey];
  }

  return errors.fileNotFound;
};

// Initialize cli.
$(() => {
  registerFullscreenToggle();
  registerMinimizedToggle();
  const cmd = document.getElementById("terminal");

  $.ajaxSetup({ cache: false });
  const pages = [];
  pages.push($.get("pages/about.html"));
  pages.push($.get("pages/contact.html"));
  pages.push($.get("pages/languages.html"));
  pages.push($.get("pages/help.html"));
  pages.push($.get("pages/programming.html"));
  pages.push($.get("pages/resume.html"));
  pages.push($.get("pages/root.html"));
  pages.push($.get("pages/skills.html"));
  pages.push($.get("pages/jobs.html"));
  console.log("I exist");
  $.when
    .apply($, pages)
    .done(
      (
        aboutData,
        contactData,
        languagesData,
        helpData,
        programmingData,
        resumeData,
        rootData,
        skillsData,
        jobsData
      ) => {
        systemData["about"] = aboutData[0];
        systemData["contact"] = contactData[0];
        systemData["languages"] = languagesData[0];
        systemData["help"] = helpData[0];
        systemData["programming"] = programmingData[0];
        systemData["resume"] = resumeData[0];
        systemData["root"] = rootData[0];
        systemData["skills"] = skillsData[0];
        systemData["jobs"] = jobsData[0];      
      }
    );

  const terminal = new Shell(cmd, commands);
});
