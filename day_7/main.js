const fs = require("fs");
const { sum } = require("../utilities/array");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("$")
    .map((c) => {
      const res = c.split("\n");
      let split = res[0].trim().split(" ");
      return {
        command: split[0],
        args: split[1],
        output: res.slice(1).filter((a) => a.trim() !== ""),
      };
    });
  return data;
};

const changeDirectory = (currentDirectory, nextDirectoryName) => {
  if (nextDirectoryName === "..") {
    return currentDirectory.parent;
  }
  if (nextDirectoryName === "/") {
    let curr = currentDirectory;
    while (curr.parent) {
      curr = curr.parent;
    }
    return curr;
  }

  const nextDirectoryNode = currentDirectory.children.find(
    (c) => c.name === nextDirectoryName
  );
  if (nextDirectoryNode) {
    return nextDirectoryNode;
  }
  let node = {
    name: nextDirectoryName,
    children: [],
    files: [],
    parent: currentDirectory,
  };
  currentDirectory.children.push(node);
  return node;
};

const listDirectory = (currentNode, command) => {
  currentNode.files = [];
  command.output.forEach((line) => {
    const [descriptor, name] = line.trim().split(" ");
    if (descriptor === "dir") {
      const hasDirectoryChildAlready = currentNode.children.some(
        (c) => c.name === name
      );
      if (!hasDirectoryChildAlready) {
        let node = { name: name, children: [], files: [], parent: currentNode };
        currentNode.children.push(node);
      }
    } else {
      currentNode.files.push({ size: parseInt(descriptor, 10), name });
    }
  });
  return currentNode;
};
const setSize = (node) => {
  node.children.forEach(setSize);
  let childrenSize = sum(node.children.map((c) => c.size));
  let fileSize = sum(node.files.map((f) => f.size));
  node.size = childrenSize + fileSize;
};

const allDirectories = (currentDirectory) =>
  currentDirectory.children.reduce(
    (acc, c) => {
      return acc.concat(allDirectories(c));
    },
    [currentDirectory]
  );

const buildDirectories = (treeRoot, commands) => {
  let currentDirectory = treeRoot;

  commands.forEach((c) => {
    if (c.command === "cd") {
      currentDirectory = changeDirectory(currentDirectory, c.args);
    } else {
      currentDirectory = listDirectory(currentDirectory, c);
    }
  });
  setSize(treeRoot);
};

const part1 = (filename, debug = false) => {
  const [_makeRoot, ...commands] = parseFile(filename, debug);
  const rootDirectory = { name: "/", children: [] };
  buildDirectories(rootDirectory, commands);

  const directorySizes = allDirectories(rootDirectory)
    .filter((d) => d.size <= 100000)
    .map((d) => d.size);
  return sum(directorySizes);
};

const part2 = (filename, debug = false) => {
  const [_makeRoot, ...commands] = parseFile(filename, debug);
  const treeRoot = { name: "/", children: [] };
  buildDirectories(treeRoot, commands);

  const directories = allDirectories(treeRoot);
  const minSpaceToClear = (70000000 - treeRoot.size - 30000000) * -1;
  return directories
    .sort((a, b) => a.size - b.size)
    .filter((a) => a.size > minSpaceToClear)[0].size;
};

function runPartOnFile({ part, filename, debug, correctAnswer }) {
  console.log(`\nrunning ${part.name} on `, filename);
  const answer = part(filename, debug);
  console.log(`\nanswerfor ${part.name} on ${filename}:`, answer);
  if (correctAnswer && answer !== correctAnswer) {
    throw `oops you broke ${part.name} on ${filename}`;
  }
}

function runPart({ part, correctSampleAnswer, correctInputAnswer }) {
  runPartOnFile({
    part,
    filename: "sample.txt",
    debug: true,
    correctAnswer: correctSampleAnswer,
  });
  runPartOnFile({
    part,
    filename: "input.txt",
    debug: false,
    correctAnswer: correctInputAnswer,
  });
}
runPart({
  part: part1,
  correctSampleAnswer: 95437,
  correctInputAnswer: 1783610,
});
runPart({
  part: part2,
  correctSampleAnswer: 24933642,
  correctInputAnswer: 4370655,
});
