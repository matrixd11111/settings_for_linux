"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const path = tslib_1.__importStar(require("path"));
const environmentVariablesLoader_1 = require("../environmentVariablesLoader");
const pythonRunner_1 = require("../pythonRunner");
const utilities_1 = require("../utilities");
const unittestScripts_1 = require("./unittestScripts");
const unittestSuitParser_1 = require("./unittestSuitParser");
class UnittestTestRunner {
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
            const unittestArguments = config.getUnittestConfiguration().unittestArguments;
            const testId = this.normalizeDebugTestId(unittestArguments.startDirectory, config.getCwd(), test);
            this.logger.log('info', `Debugging test "${testId}" using python path "${config.pythonPath()}" in ${config.getCwd()}`);
            return {
                module: 'unittest',
                cwd: config.getCwd(),
                args: [testId],
                env: additionalEnvironment,
            };
        });
    }
    load(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!config.getUnittestConfiguration().isUnittestEnabled) {
                this.logger.log('info', 'Unittest test discovery is disabled');
                return { suite: undefined, errors: [] };
            }
            const additionalEnvironment = yield environmentVariablesLoader_1.EnvironmentVariablesLoader.load(config.envFile(), process.env, this.logger);
            const unittestArguments = config.getUnittestConfiguration().unittestArguments;
            this.logger.log('info', `Discovering tests using python path "${config.pythonPath()}" in ${config.getCwd()} ` +
                `with pattern ${unittestArguments.pattern} and start directory ${unittestArguments.startDirectory}`);
            const result = yield pythonRunner_1.runScript({
                pythonPath: config.pythonPath(),
                script: unittestScripts_1.UNITTEST_TEST_RUNNER_SCRIPT,
                args: ['discover', unittestArguments.startDirectory, unittestArguments.pattern],
                cwd: config.getCwd(),
                environment: additionalEnvironment,
            }).complete();
            const { suites, errors } = unittestSuitParser_1.parseTestSuites(result.output, path.resolve(config.getCwd(), unittestArguments.startDirectory));
            if (!utilities_1.empty(errors)) {
                errors.forEach(error => this.logger.log('warn', `Error while collecting tests from file ${error.id}: ${os.EOL}${error.message}`));
            }
            if (utilities_1.empty(suites)) {
                this.logger.log('warn', 'No tests discovered');
                return { suite: undefined, errors: [] };
            }
            utilities_1.setDescriptionForEqualLabels(suites, '.');
            return {
                suite: {
                    type: 'suite',
                    id: this.adapterId,
                    label: 'Unittest tests',
                    children: suites,
                },
                errors,
            };
        });
    }
    run(config, test) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const unittestArguments = config.getUnittestConfiguration().unittestArguments;
            this.logger.log('info', `Running tests using python path "${config.pythonPath()}" in ${config.getCwd()} ` +
                `with pattern ${unittestArguments.pattern} and start directory ${unittestArguments.startDirectory}`);
            const additionalEnvironment = yield environmentVariablesLoader_1.EnvironmentVariablesLoader.load(config.envFile(), process.env, this.logger);
            const testExecution = pythonRunner_1.runScript({
                pythonPath: config.pythonPath(),
                script: unittestScripts_1.UNITTEST_TEST_RUNNER_SCRIPT,
                cwd: config.getCwd(),
                args: test !== this.adapterId ?
                    ['run', unittestArguments.startDirectory, unittestArguments.pattern, test] :
                    ['run', unittestArguments.startDirectory, unittestArguments.pattern],
                environment: additionalEnvironment,
            });
            this.testExecutions.set(test, testExecution);
            const result = yield testExecution.complete();
            this.testExecutions.delete(test);
            return unittestSuitParser_1.parseTestStates(result.output);
        });
    }
    normalizeDebugTestId(startDirectory, cwd, relativeTestId) {
        const relativeStartDirectory = path.isAbsolute(startDirectory) ?
            path.relative(cwd, startDirectory) :
            startDirectory;
        if (relativeStartDirectory === '.') {
            return relativeTestId;
        }
        const testPath = relativeStartDirectory.split(path.sep).join('.').replace(/\.+/, '.');
        if (testPath.endsWith('.')) {
            return testPath + relativeTestId;
        }
        else if (!testPath) {
            return relativeTestId;
        }
        else {
            return testPath + '.' + relativeTestId;
        }
    }
}
exports.UnittestTestRunner = UnittestTestRunner;
//# sourceMappingURL=unittestTestRunner.js.map