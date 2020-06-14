"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const os_1 = require("os");
const path = tslib_1.__importStar(require("path"));
const xml2js = tslib_1.__importStar(require("xml2js"));
const utilities_1 = require("../utilities");
function parseTestStates(outputXmlFile, cwd) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(outputXmlFile, 'utf8', (readError, data) => {
                if (readError) {
                    return reject(`Can not read test results: ${readError}`);
                }
                xml2js.parseString(data, (parseError, parserResult) => {
                    if (parseError) {
                        return reject(parseError);
                    }
                    try {
                        const results = parseTestResults(parserResult, cwd);
                        resolve(results);
                    }
                    catch (exception) {
                        reject(`Can not parse test results: ${exception}`);
                    }
                });
            });
        });
    });
}
exports.parseTestStates = parseTestStates;
function parseTestResults(parserResult, cwd) {
    if (!parserResult) {
        return [];
    }
    const testSuiteResults = parserResult.testsuites ?
        parserResult.testsuites.testsuite :
        [parserResult.testsuite];
    return testSuiteResults.map(testSuiteResult => {
        if (!Array.isArray(testSuiteResult.testcase)) {
            return [];
        }
        return testSuiteResult.testcase.map(testcase => mapToTestState(testcase, cwd)).filter(x => x);
    }).reduce((r, x) => r.concat(x), []);
}
function mapToTestState(testcase, cwd) {
    const testId = buildTestName(cwd, testcase.$);
    if (!testId) {
        return undefined;
    }
    const [state, output, message] = getTestState(testcase);
    const decorations = getDecorations(state, testcase.$.line, message);
    return {
        state,
        test: testId,
        type: 'test',
        message: output + message,
        decorations,
    };
}
function getDecorations(state, line, message) {
    if (state === 'passed') {
        return [];
    }
    if (!line) {
        return [];
    }
    const lineNumber = parseInt(line, 10);
    return [{
            line: lineNumber,
            message,
        }];
}
function getTestState(testcase) {
    const output = utilities_1.empty(testcase['system-out']) ? '' : testcase['system-out'].join(os_1.EOL) + os_1.EOL;
    if (testcase.error) {
        return ['failed', output, extractErrorMessage(testcase.error)];
    }
    if (testcase.failure) {
        return ['failed', output, extractErrorMessage(testcase.failure)];
    }
    if (testcase.skipped) {
        return ['skipped', output, extractErrorMessage(testcase.skipped)];
    }
    return ['passed', '', output];
}
function extractErrorMessage(errors) {
    if (!errors || !errors.length) {
        return '';
    }
    return errors.map(e => e.$.message + os_1.EOL + e._).join(os_1.EOL);
}
function buildTestName(cwd, test) {
    if (!test || !test.file || !test.name) {
        return undefined;
    }
    const module = path.resolve(cwd, test.file);
    if (!test.classname) {
        return `${module}`;
    }
    const testClass = test.classname.split('.').filter(p => p).filter(p => p !== '()').join('.');
    const { matched, position } = matchModule(testClass, test.file);
    if (!matched) {
        return undefined;
    }
    const testClassParts = testClass.substring(position).split('.').filter(p => p);
    if (testClassParts.length > 0) {
        return `${module}::${testClassParts.join('::')}::${test.name}`;
    }
    else {
        return `${module}::${test.name}`;
    }
}
function matchModule(testClass, testFile) {
    const { matched, position } = matchParentPath(testClass, testFile);
    if (!matched) {
        return { matched: false, position: -1 };
    }
    const { name, ext } = path.parse(testFile);
    if (testClass.startsWith(name, position)) {
        let moduleEndPosition = position + name.length;
        if (ext && testClass.startsWith(ext, moduleEndPosition)) {
            moduleEndPosition += ext.length;
        }
        if (testClass.startsWith('.', moduleEndPosition)) {
            moduleEndPosition += 1;
        }
        return { matched: true, position: moduleEndPosition };
    }
    return { matched: false, position: -1 };
}
function matchParentPath(testClass, testFile) {
    const parentPathToMatch = path.parse(testFile).dir;
    if (!parentPathToMatch) {
        return { matched: true, position: 0 };
    }
    const testFileParentPath = parentPathToMatch.split(path.sep);
    let index = 0;
    const allClassPartsMatchesPath = testFileParentPath.every(pathPart => {
        if (testClass.startsWith(pathPart + '.', index)) {
            index += pathPart.length + 1;
            return true;
        }
        return false;
    });
    return {
        matched: allClassPartsMatchesPath,
        position: index,
    };
}
//# sourceMappingURL=pytestJunitTestStatesParser.js.map