import { normalize, sep } from "path";

const NodeModuleDir = sep + "node_modules" + sep;

/**
 * Finds all the CommonJS files and their ancestors that require the `filename`.
 * 
 * @param includes By default, the function searches every cached file except
 *  the ones in `node_modules` and the `require.main.filename`. We can provide
 *  this argument to set more specific files that can be searched.
 */
export default function requireChain(
    filename: string,
    includes: string[] | ((files: string[]) => string[]) | undefined = void 0,
) {
    const defaultEntries = Object.getOwnPropertyNames(require.cache).filter(id => {
        return id !== require.main?.filename && !id.includes(NodeModuleDir);
    });
    let entries = Array.isArray(includes) ? includes : defaultEntries;

    if (typeof includes === "function") {
        entries = includes(entries);
    }

    return findRequireChain(normalize(filename), entries, []);
}

function findRequireChain(
    filename: string,
    includes: string[],
    preResults: string[] = []
): string[] {
    const dependents: string[] = includes.filter(id => {
        return id !== filename && !preResults.includes(id);
    }).filter(id => {
        const _module = require.cache[id] as NodeJS.Module;
        return _module.children.some(child => child.id === filename);
    });

    return dependents.reduce((dependents, dep) => [
        ...dependents,
        ...findRequireChain(dep, includes, [...preResults, ...dependents])
    ], dependents);
}
