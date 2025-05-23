import { useRef, useEffect } from "react";

interface Node {
  id: string;
  files?: Node[];
  [key: string]: any; // Allow additional properties
}

interface SearchDFSProps<T> {
  data: T[];
  cond: (item: T, index: number) => boolean;
  childPathKey?: string;
}

interface SearchDFSResult<T> {
  parent: T | null;
  item: T | null;
  nextSibling: T | null;
  previousSibling: T | null;
}

// @deprecated
export const findNodeById = (nodes: Node[], id: string): Node | undefined => {
  let final: Node | undefined;

  function findNode(nodes: Node[], id: string) {
    nodes.forEach((n) => {
      if (n.id === id) {
        final = n;
        return;
      }
      if (n.files) findNode(n.files, id);
    });
  }

  findNode(nodes, id);

  return final;
};

export const searchDFS = <T extends { [key: string]: any }>({
  data,
  cond,
  childPathKey = "files",
}: SearchDFSProps<T>): SearchDFSResult<T> => {
  let final: T | null = null;
  let parentPath: T[] = [];
  let parent: T | null = null;
  let next: T | null = null;
  let prev: T | null = null;

  const recursiveFind = (tree: T[]) => {
    tree.forEach((item, index) => {
      if (cond(item, index)) {
        final = item;

        if (parentPath) {
          parentPath.forEach((p) => {
            // Check if parent has the `current item`
            if (p && p[childPathKey]?.includes(item)) {
              parent = p;
              // Set next & previous indexes
              next = p[childPathKey][index + 1] || null;
              prev = p[childPathKey][index - 1] || null;
            } else {
              parent = tree as any; // Cast to any to avoid type issues
              // If parent is null, check the root of the tree
              next = tree[index + 1] || null;
              prev = tree[index - 1] || null;
            }
          });
        }
        return;
      }
      if (item[childPathKey]) {
        // Push parent stack
        parentPath.push(item);
        recursiveFind(item[childPathKey]);
      }
    });
  };

  recursiveFind(data);
  return {
    parent,
    item: final,
    nextSibling: next,
    previousSibling: prev,
  };
};

export const useDidMountEffect = (func: () => void, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export const createFile = ({ name }: { name: string }) => ({
  name,
  type: "file",
});

export const createFolder = ({ name }: { name: string }) => ({
  name,
  type: "folder",
  files: [],
});