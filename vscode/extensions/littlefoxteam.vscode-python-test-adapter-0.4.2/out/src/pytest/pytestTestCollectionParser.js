"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const path = tslib_1.__importStar(require("path"));
const utilities_1 = require("../utilities");
const DISCOVERED_TESTS_START_MARK = '==DISCOVERED TESTS BEGIN==';
const DISCOVERED_TESTS_END_MARK = '==DISCOVERED TESTS END==';
function parseTestSuites(content, cwd) {
    const from = content.indexOf(DISCOVERED_TESTS_START_MARK);
    const to = content.indexOf(DISCOVERED_TESTS_END_MARK);
    const discoveredTestsJson = content.substring(from + DISCOVERED_TESTS_START_MARK.length, to);
    const discoveryResult = JSON.parse(discoveredTestsJson);
    const allTests = (discoveryResult.tests || [])
        .map(line => (Object.assign(Object.assign({}, line), { id: line.id.replace(/::\(\)/g, '') })))
        .filter(line => line.id)
        .map(line => splitModule(line, cwd))
        .filter(line => line)
        .map(line => line);
    const suites = Array.from(utilities_1.groupBy(allTests, t => t.modulePath).entries())
        .map(([modulePath, tests]) => ({
        type: 'suite',
        id: modulePath,
        label: path.basename(modulePath),
        file: modulePath,
        tooltip: modulePath,
        children: toTestSuites(tests.map(t => ({
            idHead: t.modulePath,
            idTail: t.testPath,
            line: t.line,
            path: modulePath,
        }))),
    }));
    const aggregatedErrors = Array.from(utilities_1.groupBy((discoveryResult.errors || []), e => e.file).entries())
        .map(([file, messages]) => ({
        file: path.resolve(cwd, file),
        message: messages.map(e => e.message).join(os.EOL),
    }));
    const discoveryErrorSuites = aggregatedErrors.map(({ file }) => ({
        type: 'test',
        id: file,
        file,
        label: `Discovery error in ${path.basename(file)}`,
    }));
    return {
        suites: suites.concat(discoveryErrorSuites),
        errors: aggregatedErrors.map(e => ({ id: e.file, message: e.message })),
    };
}
exports.parseTestSuites = parseTestSuites;
function toTestSuites(tests) {
    if (utilities_1.empty(tests)) {
        return [];
    }
    const testsAndSuites = utilities_1.groupBy(tests, t => t.idTail.includes('::'));
    const firstLevelTests = toFirstLevelTests(testsAndSuites.get(false));
    const suites = toSuites(testsAndSuites.get(true));
    return firstLevelTests.concat(suites);
}
function toSuites(suites) {
    if (!suites) {
        return [];
    }
    return Array.from(utilities_1.groupBy(suites.map(test => splitTest(test)), group => group.idHead).entries())
        .map(([suite, suiteTests]) => ({
        type: 'suite',
        id: suite,
        label: suiteTests[0].name,
        file: suiteTests[0].path,
        children: toTestSuites(suiteTests),
        tooltip: suite,
    }));
}
function toFirstLevelTests(tests) {
    if (!tests) {
        return [];
    }
    return tests.map(test => {
        const testId = `${test.idHead}::${test.idTail}`;
        return {
            id: testId,
            label: test.idTail,
            type: 'test',
            file: test.path,
            line: test.line,
            tooltip: testId,
        };
    });
}
function splitTest(test) {
    const separatorIndex = test.idTail.indexOf('::');
    return {
        idHead: `${test.idHead}::${test.idTail.substring(0, separatorIndex)}`,
        idTail: test.idTail.substring(separatorIndex + 2),
        name: test.idTail.substring(0, separatorIndex),
        path: test.path,
        line: test.line,
    };
}
function splitModule(test, cwd) {
    const separatorIndex = test.id.indexOf('::');
    if (separatorIndex < 0) {
        return null;
    }
    return {
        modulePath: path.resolve(cwd, test.id.substring(0, separatorIndex)),
        testPath: test.id.substring(separatorIndex + 2),
        line: test.line,
    };
}
//# sourceMappingURL=pytestTestCollectionParser.js.map