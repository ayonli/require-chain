import foo from "./foo";
import bar from "./bar";
import hello from "./hello";
import findDependents from "..";
import { deepStrictEqual } from "assert";
import * as path from "path";

// make sure the modules are imported after compilation
foo();
bar();
hello();

it("find dependents of the target file", () => {
    const dependents = findDependents(path.join(__dirname, "foo.js"));
    deepStrictEqual(dependents, [
        path.join(__dirname, "bar.js"),
        path.join(__dirname, "index.js"),
        path.join(__dirname, "hello.js")
    ]);
});

it("custom included files", () => {
    const dependents = findDependents(path.join(__dirname, "foo.js"), [
        path.join(__dirname, "bar.js"),
        path.join(__dirname, "hello.js")
    ]);
    deepStrictEqual(dependents, [
        path.join(__dirname, "bar.js"),
        path.join(__dirname, "hello.js")
    ]);
});

it("custom included files with tester", () => {
    const dependents = findDependents(path.join(__dirname, "foo.js"), (files) => {
        return files.filter(file => !file.endsWith("index.js"));
    });
    deepStrictEqual(dependents, [
        path.join(__dirname, "bar.js"),
        path.join(__dirname, "hello.js")
    ]);
});
