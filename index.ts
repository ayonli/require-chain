import { normalize, sep } from "path";

const NodeModuleDir = sep + "node_modules" + sep;

/**
 * Finds all the CommonJS files and their ancestors that require the `filename`.
 * 
 * @param includes By default, the function searches every cached file except
 *  the ones in `node_modules` and the `require.main.filename`. We can provide
 *  this argument to set more specific files that can be searched.
 */
export function findDependents(
    filename: string | string[],
    includes: string[] | ((files: string[]) => string[]) | undefined = void 0,
) {
    const defaultEntries = Object.getOwnPropertyNames(require.cache).filter(id => {
        return id !== require.main?.filename && !id.includes(NodeModuleDir);
    });
    let entries = Array.isArray(includes) ? includes : defaultEntries;

    if (typeof includes === "function") {
        entries = includes(entries);
    }

    let results: string[] = [];

    if (typeof filename === "string") {
        filename = normalize(filename);
        return appendDependents(results, filename, entries);
    } else {
        const filenames = filename.map(normalize);

        filenames.forEach(file => {
            appendDependents(results, file, entries);
        });

        results = results.filter(file => !filenames.includes(file));
    }

    return results;

}

function appendDependents(
    results: string[],
    filename: string,
    includes: string[],
): string[] {
    const dependents: string[] = includes.filter(id => {
        if (id !== filename && !results.includes(id)) {
            const _module = require.cache[id] as NodeJS.Module;
            return _module.children.some(child => child.id === filename);
        } else {
            return false;
        }
    });

    results.push(...dependents);

    dependents.forEach(dep => {
        appendDependents(results, dep, includes);
    });

    return results;
}

/**
 * Finds all the CommonJS files and their descendants that required by the
 * `filename`.
 * 
 * @param includes By default, the function searches every cached file except
 *  the ones in `node_modules` and the `require.main.filename`. We can provide
 *  this argument to set more specific files that can be searched.
 */
export function findDependencies(
    filename: string | string[],
    includes: string[] | ((files: string[]) => string[]) | undefined = void 0,
) {
    const defaultEntries = Object.getOwnPropertyNames(require.cache).filter(id => {
        return id !== require.main?.filename && !id.includes(NodeModuleDir);
    });
    let entries = Array.isArray(includes) ? includes : defaultEntries;

    if (typeof includes === "function") {
        entries = includes(entries);
    }

    let results: string[] = [];

    if (typeof filename === "string") {
        filename = normalize(filename);
        const _module = require.cache[filename];

        if (_module) {
            appendDependencies(results, _module, entries, []);
        }

        results = results.filter(file => file !== filename);
    } else {
        const filenames = filename.map(normalize);

        filename.forEach(file => {
            const _module = require.cache[file];

            if (_module) {
                appendDependencies(results, _module, entries, []);
            }
        });

        results = results.filter(file => !filenames.includes(file));
    }

    return results;
}

function appendDependencies(
    deps: string[] = [],
    module: NodeJS.Module,
    includes: string[],
    parents: NodeModule[]
): string[] {
    if (!deps.includes(module.id) && includes.includes(module.id)) {
        deps.push(module.id);
    }

    if (!parents.includes(module) && module.children?.length) {
        module.children.forEach(sub => {
            appendDependencies(deps, sub, includes, [...parents, module]);
        });
    }

    return deps;
}
