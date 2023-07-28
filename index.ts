import { normalize } from "path";

/**
 * Finds all the CommonJS files and their ancestors that require the `filename`.
 * Useful when watching file changes and hot-reload modules. This function helps
 * us retrieve all the dependent files that rely on the changed file, and we can
 * reload them all at once.
 * 
 * @param includes By default, the function searches every cached file except
 *  the ones in `node_modules` and the `require.main.filename`. We can provide
 *  this argument to set specific files that can be searched.
 */
export default function findDependents(
    filename: string,
    includes: string[] | ((files: string[]) => string[]) | undefined = void 0,
    /** @inner */
    preResults: string[] = []
) {
    filename = normalize(filename);
    const cache = require.cache;
    let targets = Array.isArray(includes)
        ? includes
        : Object.getOwnPropertyNames(cache).filter(id => {
            return id !== require.main?.filename && !id.includes("node_modules");
        });

    if (typeof includes === "function") {
        targets = includes(targets);
    }

    const dependents: string[] = [];

    for (const id of targets) {
        const _module = cache[id] as NodeModule;

        if (_module.filename !== filename &&
            !dependents.includes(_module.filename) &&
            !preResults.includes(_module.filename) &&
            _module.children.some(child => child.filename === filename)
        ) {
            dependents.push(_module.filename);
        }
    }

    dependents.forEach((dep) => {
        dependents.push(
            ...findDependents(dep, targets, [...preResults, ...dependents])
        );
    });

    return dependents;
}
