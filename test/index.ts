import foo from "./foo";
import bar from "./bar";
import hello from "./hello";
import { findDependents, findDependencies } from "..";
import { deepStrictEqual } from "assert";
import * as path from "path";

// make sure the modules are imported after compilation
foo();
bar();
hello();

describe("findDependents", () => {
    it("find dependents of the target file", () => {
        const dependents = findDependents(path.join(__dirname, "foo.js"));
        deepStrictEqual(dependents, [
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "index.js"),
            path.join(__dirname, "hello.js")
        ]);
    });

    it("find dependents of multiple files", () => {
        const dependents = findDependents([
            path.join(__dirname, "foo.js"),
            path.join(__dirname, "bar.js")
        ]);
        deepStrictEqual(dependents, [
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

    it("custom included files with a tester", () => {
        const dependents = findDependents(path.join(__dirname, "foo.js"), (files) => {
            return files.filter(file => !file.endsWith("index.js"));
        });
        deepStrictEqual(dependents, [
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "hello.js")
        ]);
    });
});

describe("findDependencies", () => {
    it("find dependencies of the target file", () => {
        const deps = findDependencies(__filename);
        deepStrictEqual(deps, [
            path.join(__dirname, "foo.js"),
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "hello.js"),
            path.join(__dirname, "..", "index.js")
        ]);
    });

    it("find dependencies of multiple files", () => {
        const deps = findDependencies([
            __filename,
            path.join(__dirname, "hello.js")
        ]);
        deepStrictEqual(deps, [
            path.join(__dirname, "foo.js"),
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "..", "index.js")
        ]);
    });

    it("custom included files", () => {
        const deps = findDependencies(__filename, [
            path.join(__dirname, "foo.js"),
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "hello.js")
        ]);
        deepStrictEqual(deps, [
            path.join(__dirname, "foo.js"),
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "hello.js")
        ]);
    });

    it("custom included files with a tester", () => {
        const deps = findDependencies(__filename, (files) => {
            return files.filter(file => !file.endsWith("index.js"));
        });
        deepStrictEqual(deps, [
            path.join(__dirname, "foo.js"),
            path.join(__dirname, "bar.js"),
            path.join(__dirname, "hello.js")
        ]);
    });
})
