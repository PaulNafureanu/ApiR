import { Tree } from "./../scripts/Tree";

// let tree: Tree;

// beforeEach(() => {
//   tree = new Tree();
// });

// describe("Instantiate tree", () => {
//   test("Root is set to the 0 node", () => {
//     expect(tree._root).toEqual({
//       id: "0",
//       parentId: "0",
//       layer: 0,
//       children: [],
//     });
//   });

//   test("Id List contains only the 0 id", () => {
//     expect(tree._idList.length).toBe(1);
//     expect(tree._idList[0]).toBe("0");
//   });

//   test("Different object references", () => {
//     if (tree) {
//       let tree1 = new Tree();
//       let tree2 = new Tree();

//       expect(tree1).not.toBe(tree2);
//       expect(tree1).toEqual(tree2);

//       expect(tree1).toBeTruthy();
//       if (tree1 && tree2) {
//         expect(tree1._root.children).not.toBe(tree2._root.children);
//         expect(tree1._idList.sort()).not.toBe(tree2._idList.sort());
//         expect(tree1._root.children).toEqual(tree2._root.children);
//         expect(tree1._idList.sort()).toEqual(tree2._idList.sort());
//       }
//     }
//   });
// });

// describe("Create Node", () => {
//   test("Node 1f created", () => {
//     let newTree = Tree.createNode("1f", "0", tree);
//     expect(newTree).toBeTruthy();

//     if (newTree) {
//       expect(newTree._root.children[0]).toEqual({
//         id: "1f",
//         parentId: "0",
//         layer: 1,
//         children: [],
//       });
//     }
//   });

//   test("Node 0 creation failed", () => {
//     let newTree = Tree.createNode("0", "0", tree);
//     expect(newTree).toBeFalsy();
//   });

//   test("Parent Node not found", () => {
//     let newTree = Tree.createNode("1f", "2f", tree);
//     expect(newTree).toBeFalsy();
//   });

//   test("Duplicated node creation", () => {
//     let newTree = Tree.createNode("1f", "0", tree);
//     if (newTree) {
//       let newTreeDuplicated = Tree.createNode("1f", "0", newTree);
//       expect(newTreeDuplicated).toBeFalsy();
//     }
//   });

//   test("Creation of Node Children ", () => {
//     let newTree = Tree.createNode("1f", "0", tree);
//     if (newTree) {
//       let newTree2 = Tree.createNode("2f", "1f", newTree);
//       if (newTree2) {
//         expect(newTree2._idList.sort()).toEqual(["0", "1f", "2f"].sort());
//         expect(newTree2._root.children.length).toBe(1);
//         expect(newTree2._root.children[0].children[0]).toEqual({
//           id: "2f",
//           parentId: "1f",
//           layer: 2,
//           children: [],
//         });

//         let newTree3 = Tree.createNode("3f", "2f", newTree2);
//         if (newTree3) {
//           expect(newTree3._idList.sort()).toEqual(
//             ["0", "1f", "2f", "3f"].sort()
//           );
//           expect(newTree3._root.children.length).toBe(1);
//           expect(newTree3._root.children[0].children.length).toBe(1);
//           expect(newTree3._root.children[0].children[0].children[0]).toEqual({
//             id: "3f",
//             parentId: "2f",
//             layer: 3,
//             children: [],
//           });
//         }
//       }
//     }
//   });

//   test("Different object references", () => {
//     if (tree) {
//       let tree1 = Tree.createNode("1f", "0", tree);
//       let tree2 = Tree.createNode("1f", "0", tree);

//       expect(tree1).not.toBe(tree2);
//       expect(tree1).toEqual(tree2);

//       expect(tree1).toBeTruthy();

//       if (tree1) {
//         let tree5 = Tree.createNode("2f", "1f", tree1);
//         expect(tree5).toBeTruthy();

//         if (tree5) {
//           let tree3 = Tree.createNode("3f", "2f", tree5);
//           let tree4 = Tree.createNode("3f", "2f", tree5);

//           expect(tree3).not.toBe(tree4);
//           expect(tree3).toEqual(tree4);

//           expect(tree3).toBeTruthy();

//           if (tree1 && tree2) {
//             expect(tree1._root.children).not.toBe(tree2._root.children);
//             expect(tree1._idList.sort()).not.toBe(tree2._idList.sort());
//             expect(tree1._root.children).toEqual(tree2._root.children);
//             expect(tree1._idList.sort()).toEqual(tree2._idList.sort());
//           }

//           if (tree3 && tree4) {
//             expect(tree3._root.children).not.toBe(tree4._root.children);
//             expect(tree3._idList.sort()).not.toBe(tree4._idList.sort());
//             expect(tree3._root.children).toEqual(tree4._root.children);
//             expect(tree3._idList.sort()).toEqual(tree4._idList.sort());
//           }
//         }
//       }
//     }
//   });
// });

// describe("Delete Node", () => {
//   let newTree: Tree | false;
//   beforeEach(() => {
//     newTree = Tree.createNode("1f", "0", tree);
//     if (newTree) {
//       newTree = Tree.createNode("2f", "0", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("3f", "2f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("4f", "3f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("5f", "2f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("6f", "3f", newTree);
//     }
//     expect(newTree).toBeTruthy();
//   });

//   test("Delete Node 0 failed", () => {
//     if (newTree) {
//       let newTree2 = Tree.deleteNode("0", newTree);
//       expect(newTree2).toBeFalsy();
//     }
//   });

//   test("Delete non existent node failed", () => {
//     if (newTree) {
//       let newTree2 = Tree.deleteNode("-9f", newTree);
//       expect(newTree2).toBeFalsy();
//     }
//   });

//   test("Delete node without children", () => {
//     if (newTree) {
//       let newTree2 = Tree.deleteNode("1f", newTree);
//       if (newTree2) {
//         expect(newTree2._idList.sort()).toEqual(
//           ["0", "2f", "3f", "4f", "5f", "6f"].sort()
//         );
//         expect(newTree2._root.children.length).toBe(1);
//         expect(newTree2._root.children[0].id).toBe("2f");
//       }
//     }
//   });

//   test("Delete node with children", () => {
//     if (newTree) {
//       expect(newTree._root.children.length).toBe(2);
//       let newTree2 = Tree.deleteNode("3f", newTree);
//       expect(newTree2).toBeTruthy();
//       if (newTree2) {
//         expect(newTree2._idList.sort()).toEqual(["0", "1f", "2f", "5f"].sort());
//         expect(newTree2._root.children.length).toBe(2);
//         expect(newTree2._root.children[1].children.length).toBe(1);
//         expect(newTree2._root.children[1].children[0]).toEqual({
//           id: "5f",
//           parentId: "2f",
//           layer: 2,
//           children: [],
//         });

//         newTree2 = Tree.deleteNode("2f", newTree);
//         expect(newTree2).toBeTruthy();
//         if (newTree2) {
//           expect(newTree2._idList.sort()).toEqual(["0", "1f"].sort());
//           expect(newTree2._root.children.length).toBe(1);
//           expect(newTree2._root.children[0]).toEqual({
//             id: "1f",
//             parentId: "0",
//             layer: 1,
//             children: [],
//           });
//         }
//       }
//       newTree2 = Tree.deleteNode("2f", newTree);
//       if (newTree2) {
//         expect(newTree2._idList.sort()).toEqual(["0", "1f"].sort());
//         expect(newTree2._root.children.length).toBe(1);
//         expect(newTree2._root.children[0]).toEqual({
//           id: "1f",
//           parentId: "0",
//           layer: 1,
//           children: [],
//         });
//         newTree2 = Tree.deleteNode("1f", newTree2);
//         expect(newTree2).toBeTruthy();
//         if (newTree2) {
//           expect(newTree2._idList.sort()).toEqual(["0"].sort());
//           expect(newTree2._root).toEqual({
//             id: "0",
//             parentId: "0",
//             layer: 0,
//             children: [],
//           });
//         }
//       }
//     }
//   });

//   test("Delete all", () => {
//     if (newTree) {
//       let newTree2 = Tree.deleteNode("2f", newTree);
//       if (newTree2) {
//         newTree2 = Tree.deleteNode("1f", newTree2);
//         expect(newTree2).toBeTruthy();
//         if (newTree2) {
//           expect(newTree2._idList.sort()).toEqual(["0"].sort());
//           expect(tree._root).toEqual({
//             id: "0",
//             parentId: "0",
//             layer: 0,
//             children: [],
//           });
//         }
//       }
//     }
//   });

//   test("Different object references", () => {
//     if (newTree) {
//       let tree1 = Tree.deleteNode("1f", newTree);
//       let tree2 = Tree.deleteNode("1f", newTree);

//       expect(tree1).not.toBe(tree2);
//       expect(tree1).toEqual(tree2);

//       let tree3 = Tree.deleteNode("3f", newTree);
//       let tree4 = Tree.deleteNode("3f", newTree);

//       expect(tree3).not.toBe(tree4);
//       expect(tree3).toEqual(tree4);

//       expect(tree1).toBeTruthy();
//       expect(tree3).toBeTruthy();

//       if (tree1 && tree2) {
//         expect(tree1._root.children).not.toBe(tree2._root.children);
//         expect(tree1._idList.sort()).not.toBe(tree2._idList.sort());
//         expect(tree1._root.children).toEqual(tree2._root.children);
//         expect(tree1._idList.sort()).toEqual(tree2._idList.sort());
//       }

//       if (tree3 && tree4) {
//         expect(tree3._root.children).not.toBe(tree4._root.children);
//         expect(tree3._idList.sort()).not.toBe(tree4._idList.sort());
//         expect(tree3._root.children).toEqual(tree4._root.children);
//         expect(tree3._idList.sort()).toEqual(tree4._idList.sort());
//       }
//     }
//   });
// });

// describe("Get Node", () => {
//   let newTree: Tree | false;
//   beforeEach(() => {
//     newTree = Tree.createNode("1f", "0", tree);
//     if (newTree) {
//       newTree = Tree.createNode("2f", "0", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("3f", "2f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("4f", "3f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("5f", "2f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("6f", "3f", newTree);
//     }
//     expect(newTree).toBeTruthy();
//   });

//   test("Get node 0", () => {
//     if (newTree) {
//       let node = Tree.getNode("0", newTree);
//       expect(node).toBeTruthy();
//       if (node) {
//         expect(node.id).toBe("0");
//         expect(node.parentId).toBe("0");
//         expect(node.layer).toBe(0);
//         expect(node.children.length).toBe(2);
//         expect(node.children[0].id).toBe("1f");
//         expect(node.children[1].id).toBe("2f");
//       }
//     }
//   });

//   test("Get nested node", () => {
//     if (newTree) {
//       let node = Tree.getNode("3f", newTree);
//       expect(node).toBeTruthy();
//       if (node) {
//         expect(node.id).toBe("3f");
//         expect(node.parentId).toBe("2f");
//         expect(node.layer).toBe(2);
//         expect(node.children.length).toBe(2);
//         expect(node.children[0]).toEqual({
//           id: "4f",
//           parentId: "3f",
//           layer: 3,
//           children: [],
//         });
//         expect(node.children[1]).toEqual({
//           id: "6f",
//           parentId: "3f",
//           layer: 3,
//           children: [],
//         });
//       }
//     }
//   });

//   test("Different object references", () => {
//     if (newTree) {
//       let node1 = Tree.getNode("0", newTree);
//       let node2 = Tree.getNode("0", newTree);

//       expect(node1).not.toBe(node2);
//       expect(node1).toEqual(node2);

//       let node3 = Tree.getNode("3f", newTree);
//       let node4 = Tree.getNode("3f", newTree);

//       expect(node3).not.toBe(node4);
//       expect(node3).toEqual(node4);

//       expect(node1).toBeTruthy();
//       expect(node3).toBeTruthy();

//       if (node1 && node2) {
//         expect(node1.children).not.toBe(node2.children);
//         expect(node1.children).toEqual(node2.children);
//       }

//       if (node3 && node4) {
//         expect(node3.children).not.toBe(node4.children);
//         expect(node3.children).toEqual(node4.children);
//       }
//     }
//   });

//   test("Get non existing node failed", () => {
//     if (newTree) {
//       let node = Tree.getNode("-5f", newTree);
//       expect(node).toBeFalsy();
//     }
//   });
// });

// describe("Move Node", () => {
//   let newTree: Tree | false;
//   beforeEach(() => {
//     newTree = Tree.createNode("1f", "0", tree);
//     if (newTree) {
//       newTree = Tree.createNode("2f", "0", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("3f", "2f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("4f", "3f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("5f", "2f", newTree);
//     }
//     if (newTree) {
//       newTree = Tree.createNode("6f", "3f", newTree);
//     }
//     expect(newTree).toBeTruthy();
//   });

//   test("Move Node 0 failed", () => {
//     if (newTree) {
//       let newTree2 = Tree.moveNode("0", "0", newTree);
//       expect(newTree2).toBeFalsy();
//     }
//   });

//   test("Move non existent node and to a non existent node failed", () => {
//     if (newTree) {
//       let newTree2 = Tree.moveNode("-2", "1f", newTree);
//       expect(newTree2).toBeFalsy();
//       newTree2 = Tree.moveNode("1f", "-3f", newTree);
//       expect(newTree2).toBeFalsy();
//     }
//   });

//   test("Move node with no children", () => {
//     if (newTree) {
//       let newTree2 = Tree.moveNode("1f", "5f", newTree);
//       expect(newTree2).toBeTruthy();
//       if (newTree2) {
//         expect(newTree._idList.sort()).toEqual(newTree2._idList.sort());
//         expect(newTree2._root.children.length).toBe(1);
//         expect(newTree2._root.children[0].id).toBe("2f");
//         expect(newTree2._root.children[0].children.length).toBe(2);
//         let child5f = newTree2._root.children[0].children[1];
//         expect(child5f.id).toBe("5f");
//         expect(child5f.children.length).toBe(1);
//         expect(child5f.children[0]).toEqual({
//           id: "1f",
//           parentId: "5f",
//           layer: 3,
//           children: [],
//         });
//         expect(newTree2._root.children[0].children[0].children.length).toBe(2);
//         expect(
//           newTree2._root.children[0].children[0].children[0].children.length
//         ).toBe(0);
//         expect(
//           newTree2._root.children[0].children[0].children[1].children.length
//         ).toBe(0);
//       }
//     }
//   });

//   test("Move node with children", () => {
//     if (newTree) {
//       let newTree2 = Tree.moveNode("2f", "1f", newTree);
//       expect(newTree2).toBeTruthy();
//       if (newTree2) {
//         expect(newTree._idList.sort()).toEqual(newTree2._idList.sort());
//         expect(newTree2._root.children.length).toBe(1);
//         expect(newTree2._root.children[0].id).toBe("1f");
//         expect(newTree2._root.children[0].children.length).toBe(1);
//         expect(newTree2._root.children[0].children[0].id).toBe("2f");
//         expect(newTree2._root.children[0].children[0].parentId).toBe("1f");
//         expect(newTree2._root.children[0].children[0].layer).toBe(2);
//         expect(newTree2._root.children[0].children[0].children.length).toBe(2);
//         expect(newTree2._root.children[0].children[0].children[1]).toEqual({
//           id: "5f",
//           parentId: "2f",
//           layer: 3,
//           children: [],
//         });
//       }

//       newTree2 = Tree.moveNode("3f", "1f", newTree);
//       expect(newTree2).toBeTruthy();
//       if (newTree2) {
//         expect(newTree._idList.sort()).toEqual(newTree2._idList.sort());
//         expect(newTree2._root.children.length).toBe(2);
//         expect(newTree2._root.children[0].id).toBe("1f");
//         expect(newTree2._root.children[0].children.length).toBe(1);
//         expect(newTree2._root.children[0].children[0].id).toBe("3f");
//         expect(newTree2._root.children[0].children[0].parentId).toBe("1f");
//         expect(newTree2._root.children[0].children[0].layer).toBe(2);
//         expect(newTree2._root.children[0].children[0].children.length).toBe(2);
//         expect(newTree2._root.children[0].children[0].children[1]).toEqual({
//           id: "6f",
//           parentId: "3f",
//           layer: 3,
//           children: [],
//         });
//       }
//     }
//   });

//   test("Different object references", () => {
//     if (newTree) {
//       let tree1 = Tree.moveNode("1f", "5f", newTree);
//       let tree2 = Tree.moveNode("1f", "5f", newTree);

//       expect(tree1).not.toBe(tree2);
//       expect(tree1).toEqual(tree2);

//       let tree3 = Tree.moveNode("3f", "1f", newTree);
//       let tree4 = Tree.moveNode("3f", "1f", newTree);

//       expect(tree3).not.toBe(tree4);
//       expect(tree3).toEqual(tree4);

//       expect(tree1).toBeTruthy();
//       expect(tree3).toBeTruthy();

//       if (tree1 && tree2) {
//         expect(tree1._root.children).not.toBe(tree2._root.children);
//         expect(tree1._idList.sort()).not.toBe(tree2._idList.sort());
//         expect(tree1._root.children).toEqual(tree2._root.children);
//         expect(tree1._idList.sort()).toEqual(tree2._idList.sort());
//       }

//       if (tree3 && tree4) {
//         expect(tree3._root.children).not.toBe(tree4._root.children);
//         expect(tree3._idList.sort()).not.toBe(tree4._idList.sort());
//         expect(tree3._root.children).toEqual(tree4._root.children);
//         expect(tree3._idList.sort()).toEqual(tree4._idList.sort());
//       }
//     }
//   });
// });
