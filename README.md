# Require Chain

This package is useful when watching file changes and hot-reload modules. It
helps us retrieve all the dependency or the dependent files that related to
the changed file, and we can reload them all at once.

## Example

```js
import { findDependents, findDependencies } from "require-chain";
import * as path from "path";

const filename = path.join(__dirname, "test", "foo.js");

const dependents = findDependents(filename);
console.log(dependents);
// [...] filenames that rely on the given file

const dependencies = findDependencies(filename);
console.log(dependencies);
// [...] filenames that imported by the given file
```

## API

`findDependents(filename[, includes])`

Finds all the CommonJS files and their ancestors that require the `filename`.

- `filename: string | string[]` The absolute path of the file (or files).
- `includes: string[] | ((files: string[]) => string[])` By default, the
    function searches every cached file except the ones in `node_modules` and
    the `require.main.filename`. We can provide this argument to set more
    specific files that can be searched.

`findDependencies(filename[, includes])`

Finds all the CommonJS files and their descendants that required by the
`filename`.

- `filename: string | string[]` The absolute path of the file (or files).
- `includes: string[] | ((files: string[]) => string[])` By default, the
    function searches every cached file except the ones in `node_modules` and
    the `require.main.filename`. We can provide this argument to set more
    specific files that can be searched.

## `module.parent` vs `module.children`

When a module (CommonJS file) is required, the `module.parent` property is
assigned to the first dependent module (AKA the initiator). However, there may
be many dependent files that require the same module, so reversing the
`module.parent` to find its ancestors cannot retrieve all the dependents.

`module.children`, on the other hand, stores all the child modules that the
current module requires, which can be used to scan for the dependency map
through the `require.cache` and retrieve all the related files.

And of course, this package use `module.children` under the hood.
