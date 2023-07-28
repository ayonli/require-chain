# findDependents

Finds all the CommonJS files and their ancestors that require the `filename`.
Useful when watching file changes and hot-reload modules. This function helps
us retrieve all the dependent files that rely on the changed file, and we can
reload them all at once.

## Example

```js
import findDependents from "find-dependents";
import * as path from "path";

const filename = path.join(__dirname, "test", "foo.js");

const dependents = findDependents(filename);
console.log(dependents);
// [...] files that rely on the given file
```

## API

`findDependents(filename[, includes])`

- `filename: string` The absolute path of the file.
- `includes: string[] | ((files: string[]) => string[])` By default, the
    function searches every cached file except the ones in `node_modules` and
    the `require.main.filename`. We can provide this argument to set specific
    files that can be searched.
