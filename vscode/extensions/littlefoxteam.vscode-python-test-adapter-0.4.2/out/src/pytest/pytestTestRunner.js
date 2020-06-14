"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const path = tslib_1.__importStar(require("path"));
const tmp = tslib_1.__importStar(require("tmp"));
const argparse_1 = require("argparse");
const environmentVariablesLoader_1 = require("../environmentVariablesLoader");
const pythonRunner_1 = require("../pythonRunner");
const utilities_1 = require("../utilities");
const pytestJunitTestStatesParser_1 = require("./pytestJunitTestStatesParser");
const pytestTestCollectionParser_1 = require("./pytestTestCollectionParser");
class PytestTestRunner {
    constructor(adapterId, logger) {
        this.adapterId = adapterId;
        this.logger = logger;
        this.testExecutions = new Map();
    }
    cancel() {
        this.testExecutions.forEach((execution, test) => {
            this.logger.log('info', `Cancelling execution of ${test}`);
            try {
                execution.cancel();
            }
            catch (error) {
                this.logger.log('crit', `Cancelling execution of ${test} failed: ${error}`);
            }
        });
    }
    debugConfiguration(config, test) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const additionalEnvironment = yield environmentVariablesLoader_1.EnvironmentVariablesLoader.load(config.envFile(), process.env, this.logger);
            return {
                module: 'pytest',
                cwd: config.getCwd(),
                args: this.getRunArguments(test, config.getPytestConfiguration().pytestArguments),
                env: additionalEnvironment,
            };
        });
    }
    load(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!config.getPytestConfiguration().isPytestEnabled) {
                this.logger.log('info', 'Pytest test discovery is disabled');
                return { suite: undefined, errors: [] };
            }
            const additionalEnvironment = yield environmentVariablesLoader_1.EnvironmentVariablesLoader.load(config.envFile(), process.env, this.logger);
            this.logger.log('info', `Discovering tests using python path '${config.pythonPath()}' in ${config.getCwd()}`);
            const discoveryArguments = this.getDiscoveryArguments(config.getPytestConfiguration().pytestArguments);
            this.logger.log('info', `Running pytest wrapper with arguments: ${discoveryArguments}`);
            const result = yield pythonRunner_1.runScript({
                pythonPath: config.pythonPath(),
                script: PytestTestRunner.PYTEST_WRAPPER_SCRIPT,
                args: discoveryArguments,
                cwd: config.getCwd(),
                environment: additionalEnvironment,
            }).complete();
            const { suites, errors } = pytestTestCollectionParser_1.parseTestSuites(result.output, config.getCwd());
            if (!utilities_1.empty(errors)) {
                errors.forEach(error => this.logger.log('warn', `Error while collecting tests from file ${error.id}: ${os.EOL}${error.message}`));
            }
            if (utilities_1.empty(suites)) {
                this.logger.log('warn', 'No tests discovered');
                return { suite: undefined, errors };
            }
            utilities_1.setDescriptionForEqualLabels(suites, path.sep);
            return {
                suite: {
                    type: 'suite',
                    id: this.adapterId,
                    label: 'Pytest tests',
                    children: suites,
                },
                errors,
            };
        });
    }
    run(config, test) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.log('info', `Running tests using python path '${config.pythonPath()}' in ${config.getCwd()}`);
            const additionalEnvironment = yield environmentVariablesLoader_1.EnvironmentVariablesLoader.load(config.envFile(), process.env, this.logger);
            const { file, cleanupCallback } = yield this.createTemporaryFile();
            const runArguments = this.getRunArguments(test, config.getPytestConfiguration().pytestArguments)
                .concat([
                `--junitxml=${file}`,
                '--override-ini', 'junit_logging=all',
                '--override-ini', 'junit_family=xunit1'
            ]);
            this.logger.log('info', `Running pytest wrapper with arguments: ${runArguments}`);
            const testExecution = pythonRunner_1.runScript({
                pythonPath: config.pythonPath(),
                script: PytestTestRunner.PYTEST_WRAPPER_SCRIPT,
                cwd: config.getCwd(),
                args: runArguments,
                environment: additionalEnvironment,
            });
            this.testExecutions.set(test, testExecution);
            yield testExecution.complete();
            this.testExecutions.delete(test);
            this.logger.log('info', 'Test execution completed');
            const states = yield pytestJunitTestStatesParser_1.parseTestStates(file, config.getCwd());
            cleanupCallback();
            return states;
        });
    }
    getDiscoveryArguments(rawPytestArguments) {
        const argumentParser = this.configureCommonArgumentParser();
        const [, argumentsToPass] = argumentParser.parseKnownArgs(rawPytestArguments);
        return ['--collect-only'].concat(argumentsToPass);
    }
    getRunArguments(test, rawPytestArguments) {
        const argumentParser = this.configureCommonArgumentParser();
        argumentParser.addArgument(['--setuponly', '--setup-only'], { action: 'storeTrue' });
        argumentParser.addArgument(['--setupshow', '--setup-show'], { action: 'storeTrue' });
        argumentParser.addArgument(['--setupplan', '--setup-plan'], { action: 'storeTrue' });
        argumentParser.addArgument(['--collectonly', '--collect-only'], { action: 'storeTrue' });
        argumentParser.addArgument(['--trace'], { dest: 'trace', action: 'storeTrue' });
        argumentParser.addArgument(['tests'], { nargs: '*' });
        const [knownArguments, argumentsToPass] = argumentParser.parseKnownArgs(rawPytestArguments);
        return argumentsToPass.concat(test !== this.adapterId ?
            [test] :
            knownArguments.tests || []);
    }
    configureCommonArgumentParser() {
        const argumentParser = new argparse_1.ArgumentParser({
            debug: true,
        });
        argumentParser.addArgument(['--rootdir'], { action: 'store', dest: 'rootdir' });
        argumentParser.addArgument(['-x', '--exitfirst'], { dest: 'maxfail', action: 'storeConst', constant: 1 });
        argumentParser.addArgument(['--maxfail'], { dest: 'maxfail', action: 'store', defaultValue: 0 });
        argumentParser.addArgument(['--fixtures', '--funcargs'], { action: 'storeTrue', dest: 'showfixtures', defaultValue: false });
        argumentParser.addArgument(['--fixtures-per-test'], { action: 'storeTrue', dest: 'show_fixtures_per_test', defaultValue: false });
        argumentParser.addArgument(['--lf', '--last-failed'], { action: 'storeTrue', dest: 'lf' });
        argumentParser.addArgument(['--ff', '--failed-first'], { action: 'storeTrue', dest: 'failedfirst' });
        argumentParser.addArgument(['--nf', '--new-first'], { action: 'storeTrue', dest: 'newfirst' });
        argumentParser.addArgument(['--cache-show'], { action: 'storeTrue', dest: 'cacheshow' });
        argumentParser.addArgument(['--lfnf', '--last-failed-no-failures'], { action: 'store', dest: 'last_failed_no_failures', choices: ['all', 'none'], defaultValue: 'all' });
        argumentParser.addArgument(['--pdb'], { dest: 'usepdb', action: 'storeTrue' });
        argumentParser.addArgument(['--pdbcls'], { dest: 'usepdb_cls' });
        argumentParser.addArgument(['--junitxml', '--junit-xml'], { action: 'store', dest: 'xmlpath' });
        argumentParser.addArgument(['--junitprefix', '--junit-prefix'], { action: 'store' });
        return argumentParser;
    }
    createTemporaryFile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                tmp.file((error, file, _, cleanupCallback) => {
                    if (error) {
                        reject(`Can not create temporary file ${file}: ${error}`);
                    }
                    resolve({ file, cleanupCallback });
                });
            });
        });
    }
}
exports.PytestTestRunner = PytestTestRunner;
PytestTestRunner.PYTEST_WRAPPER_SCRIPT = `
from __future__ import print_function

import pytest
import sys
import json
import py


def get_line_number(item):
    location = getattr(item, 'location', None)
    if location is not None:
        return location[1]
    obj = getattr(item, 'obj', None)
    if obj is not None:
        try:
            from _pytest.compat import getfslineno
            return getfslineno(obj)[1]
        except:
            pass
    return None


class PythonTestExplorerDiscoveryOutputPlugin(object):
    def __init__(self):
        self.errors = []

    def __extract_discovered_tests(self, session):
        tests = []
        for item in session.items:
            line = get_line_number(item)
            tests.append({'id': item.nodeid,
                          'line': line})
        return tests

    def __extract_discovery_errors(self):
        errors = []
        for error in self.errors:
            try:
                errors.append({'file': error.location[0] if error.location else None,
                               'message': error.longreprtext})
            except:
                pass
        return errors

    def pytest_collection_finish(self, session):
        print('==DISCOVERED TESTS BEGIN==')
        tests = self.__extract_discovered_tests(session)
        errors = self.__extract_discovery_errors()
        print(json.dumps({'tests': tests,
                          'errors': errors}))
        print('==DISCOVERED TESTS END==')

    def pytest_collectreport(self, report):
        if report.failed:
            self.errors.append(report)


pytest.main(sys.argv[1:], plugins=[PythonTestExplorerDiscoveryOutputPlugin()])`;
//# sourceMappingURL=pytestTestRunner.js.map