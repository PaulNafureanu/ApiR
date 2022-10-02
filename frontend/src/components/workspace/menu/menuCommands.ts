let menuCommands = {
  File: {
    count: 10,
    separators: [2, 4, 7, 9],
    commands: {
      "1": {
        name: "New File",
        shortcut: "Ctrl+N",
        callback: "createNewFile",
      },
      "2": {
        name: "New Folder",
        shortcut: "Ctrl+Shift+N",
        callback: "createNewFolder",
      },
      "3": {
        name: "Upload File(s)",
        shortcut: "Ctrl+U",
        callback: "uploadFile",
      },
      "4": {
        name: "Open Recent",
        shortcut: "",
        callback: "openRecent",
      },
      "5": {
        name: "Save File(s)",
        shortcut: "Ctrl+S",
        callback: "saveFile",
      },
      "6": {
        name: "Download File(s)",
        shortcut: "Ctrl+D",
        callback: "downloadFile",
      },
      "7": {
        name: "Download File(s) As",
        shortcut: "Ctrl+Shift+D",
        callback: "downloadFileAs",
      },
      "8": {
        name: "Close File(s)",
        shortcut: "Ctrl+TAB",
        callback: "closeFile",
      },
      "9": {
        name: "Close Folder(s)",
        shortcut: "Ctrl+Shift+TAB",
        callback: "closeFolder",
      },
      "10": {
        name: "Sign Out",
        shortcut: "Esc",
        callback: "signOut",
      },
    },
  },
  Edit: {
    count: 9,
    separators: [2, 5],
    commands: {
      "1": {
        name: "Undo",
        shortcut: "Ctrl+Z",
        callback: "undoMove",
      },
      "2": {
        name: "Redo",
        shortcut: "Ctrl+Y",
        callback: "redoMove",
      },
      "3": {
        name: "Cut",
        shortcut: "Ctrl+X",
        callback: "cutSelection",
      },
      "4": {
        name: "Copy",
        shortcut: "Ctrl+C",
        callback: "copySelection",
      },
      "5": {
        name: "Paste",
        shortcut: "Ctrl+V",
        callback: "pasteSelection",
      },
      "6": {
        name: "Find",
        shortcut: "Ctrl+F",
        callback: "findText",
      },
      "7": {
        name: "Find File",
        shortcut: "Ctrl+Shift+F",
        callback: "findFile",
      },
      "8": {
        name: "Find Question",
        shortcut: "Ctrl+Q",
        callback: "findQuestion",
      },
      "9": {
        name: "Replace",
        shortcut: "Ctrl+H",
        callback: "replaceText",
      },
    },
  },
  Go: {
    count: 5,
    separators: [3],
    commands: {
      "1": {
        name: "Go to Question",
        shortcut: "Alt+Q",
        callback: "goToQuestion",
      },
      "2": {
        name: "Go to File",
        shortcut: "Alt+F",
        callback: "goToFile",
      },
      "3": {
        name: "Go to Folder",
        shortcut: "Alt+Shift+F",
        callback: "goToFolder",
      },
      "4": {
        name: "Go to Google Drive File",
        shortcut: "Alt+,",
        callback: "goToGoogleDriveFile",
      },
      "5": {
        name: "Go to Google Drive Folder",
        shortcut: "Alt+.",
        callback: "goToGoogleDriveFolder",
      },
    },
  },
  Run: {
    count: 3,
    separators: [2],
    commands: {
      "1": {
        name: "Run Quiz File(s)",
        shortcut: "Ctrl+R",
        callback: "runQuizFile",
      },
      "2": {
        name: "Run Quiz Folder(s)",
        shortcut: "Ctrl+Shift+R",
        callback: "runQuizFolder",
      },
      "3": {
        name: "Quiz Settings",
        shortcut: "Alt+R",
        callback: "showQuizSettings",
      },
    },
  },
  Help: {
    count: 2,
    separators: [1],
    commands: {
      "1": {
        name: "Show Tutorial Menu",
        shortcut: "Ctrl+H",
        callback: "showTutorialMenu",
      },
      "2": {
        name: "About",
        shortcut: "",
        callback: "showAbout",
      },
    },
  },
};

export default menuCommands;
