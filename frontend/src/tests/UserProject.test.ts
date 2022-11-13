import UserProject, { MethodOptions } from "../scripts/UserProject";

// let userProject = new UserProject("TEST");

// describe("Instantiation", () => {
//   test("User Project Instantiates Correctly", () => {
//     expect(UserProject._idCount).toBe(0);
//     expect(userProject._accountName).toBe("TEST");
//     expect(userProject._activeWorkingFileId).toBe("0");
//     expect(userProject._activeWorkingFolderId).toBe("0");
//     expect(userProject._selectedUserItemIdList.length).toBe(0);
//     expect(userProject._userFileList.length).toBe(0);
//     expect(userProject._userFolderList.length).toBe(0);
//     expect(userProject._userItemIdList.length).toBe(0);
//     expect(userProject._userTree.root).toEqual({
//       id: "0",
//       parentId: "0",
//       layer: 0,
//       children: [],
//     });
//   });
// });

// describe("Accessors", () => {
//   test("Accessors implementation", () => {
//     expect(userProject.accountName).toBe("TEST");
//     expect(userProject.activeWorkingFileId).toBe("0");
//     expect(userProject.activeWorkingFolderId).toBe("0");
//     expect(userProject.selectedUserItemIdList.length).toBe(0);
//     expect(userProject.userTree.root).toEqual({
//       id: "0",
//       parentId: "0",
//       layer: 0,
//       children: [],
//     });
//   });
// });

// describe("Private Instance Methods", () => {});

// describe("Public Instance Methods", () => {
//   test("Get Item Reference By Id for id 0 (root) and a non-existent id", () => {
//     expect(userProject.getItemReferenceById("0")).toBeFalsy();
//     expect(userProject.getItemReferenceById("1f")).toBeFalsy();
//   });
// });

// describe("Private Static Methods", () => {
//   test("Handle Set Up", () => {
//     let newUserProject = UserProject._handleSetUp(userProject);

//     //Test type, instantiation, accessors and instance methods of the new user project
//     expect(newUserProject instanceof UserProject).toBeTruthy();
//     expect(UserProject._idCount).toBe(0);
//     expect(newUserProject._accountName).toBe("TEST");
//     expect(newUserProject._activeWorkingFileId).toBe("0");
//     expect(newUserProject._activeWorkingFolderId).toBe("0");
//     expect(newUserProject._selectedUserItemIdList.length).toBe(0);
//     expect(newUserProject._userFileList.length).toBe(0);
//     expect(newUserProject._userFolderList.length).toBe(0);
//     expect(newUserProject._userItemIdList.length).toBe(0);
//     expect(newUserProject._userTree.root).toEqual({
//       id: "0",
//       parentId: "0",
//       layer: 0,
//       children: [],
//     });

//     //test accessors
//     expect(newUserProject.accountName).toBe("TEST");
//     expect(newUserProject.activeWorkingFileId).toBe("0");
//     expect(newUserProject.activeWorkingFolderId).toBe("0");
//     expect(newUserProject.selectedUserItemIdList.length).toBe(0);
//     expect(newUserProject.userTree.root).toEqual({
//       id: "0",
//       parentId: "0",
//       layer: 0,
//       children: [],
//     });

//     //Test get item reference by id
//     expect(newUserProject.getItemReferenceById("0")).toBeFalsy();
//     expect(newUserProject.getItemReferenceById("1f")).toBeFalsy();
//   });
//   test("Handle Clean Up", () => {
//     expect(UserProject._handleCleanUp(userProject)).toBe(userProject);
//   });
// });

// describe("Public Static Methods", () => {
//   test("handle create file", () => {
//     let options: MethodOptions = {
//       method: "handleCreateFile",
//       name: "new file",
//       iconColor: "#f00",
//     };
//     let newUserProject = UserProject.handleCreateFile(userProject, options);
//     expect(newUserProject).toBeTruthy();
//     if (newUserProject) {
//       //Get the new file
//       let fileId = newUserProject.userTree.root.children[0].id;
//       let newfile = newUserProject.getItemReferenceById(fileId);
//       expect(newfile).toBeTruthy();

//       //Private fields check
//       expect(UserProject._idCount).toBe(1);
//       expect(newUserProject._accountName).toBe("TEST");
//       expect(newUserProject._activeWorkingFileId).toBe("1f");
//       expect(newUserProject._activeWorkingFolderId).toBe("0");
//       expect(newUserProject._selectedUserItemIdList.length).toBe(1);
//       expect(newUserProject._selectedUserItemIdList[0]).toBe("1f");
//       expect(newUserProject._userFileList.length).toBe(1);
//       expect(newUserProject._userFileList[0]).toEqual(newfile);
//       expect(newUserProject._userFolderList.length).toBe(0);
//       expect(newUserProject._userItemIdList.length).toBe(1);
//       expect(newUserProject._userItemIdList[0]).toBe("1f");
//       expect(newUserProject._userTree.root.children.length).toBe(1);
//       expect(newUserProject._userTree.root.children[0]).toEqual({
//         id: "1f",
//         parentId: "0",
//         layer: 1,
//         children: [],
//       });

//       //Accessors check
//       expect(newUserProject.accountName).toBe("TEST");
//       expect(newUserProject.activeWorkingFileId).toBe("1f");
//       expect(newUserProject.activeWorkingFolderId).toBe("0");
//       expect(newUserProject.selectedUserItemIdList.length).toBe(1);
//       expect(newUserProject.selectedUserItemIdList[0]).toBe("1f");
//       expect(newUserProject.userTree.root.children[0]).toEqual({
//         id: "1f",
//         parentId: "0",
//         layer: 1,
//         children: [],
//       });

//       //New file check
//       if (newfile) {
//         expect(newfile.id).toBe("1f");
//         expect(newfile.name).toBe("new file");
//         expect(newfile.iconColor).toBe("#f00");
//         expect(newfile.type).toBe("file");
//         expect(newfile.isVisibleInFileExplorer).toBeTruthy();
//       }
//     }
//   });
// });
