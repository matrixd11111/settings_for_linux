"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const vscode_1 = require("vscode");
const utilities_1 = require("../utilities");
class VscodeWorkspaceConfiguration {
    constructor(workspaceFolder) {
        this.workspaceFolder = workspaceFolder;
        this.unittestArgumentParser = this.configureUnittestArgumentParser();
        this.pythonConfiguration = this.getPythonConfiguration(workspaceFolder);
        this.testExplorerConfiguration = this.getTestExplorerConfiguration(workspaceFolder);
    }
    pythonPath() {
        return this.pythonConfiguration.get('pythonPath', 'python');
    }
    getCwd() {
        return this.getConfigurationValueOrDefault(this.pythonConfiguration, ['unitTest.cwd', 'testing.cwd'], this.workspaceFolder.uri.fsPath);
    }
    envFile() {
        return this.pythonConfiguration.get('envFile', '${workspaceFolder}/.env');
    }
    getUnittestConfiguration() {
        return {
            isUnittestEnabled: this.isUnitTestEnabled(),
            unittestArguments: this.getUnitTestArguments(),
        };
    }
    getPytestConfiguration() {
        return {
            isPytestEnabled: this.isPytestTestEnabled(),
            pytestArguments: this.getPyTestArguments(),
        };
    }
    getConfigurationValueOrDefault(configuration, keys, defaultValue) {
        return utilities_1.firstNotEmpty(keys.map(key => (() => configuration.get(key))), defaultValue);
    }
    isUnitTestEnabled() {
        const overriddenTestFramework = this.testExplorerConfiguration.get('testFramework', null);
        if (overriddenTestFramework) {
            return 'unittest' === overriddenTestFramework;
        }
        return this.getConfigurationValueOrDefault(this.pythonConfiguration, ['unitTest.unittestEnabled', 'testing.unittestEnabled'], false);
    }
    getUnitTestArguments() {
        const [known] = this.unittestArgumentParser.parseKnownArgs(this.getConfigurationValueOrDefault(this.pythonConfiguration, ['unitTest.unittestArgs', 'testing.unittestArgs'], []));
        return known;
    }
    isPytestTestEnabled() {
        const overriddenTestFramework = this.testExplorerConfiguration.get('testFramework', null);
        if (overriddenTestFramework) {
            return 'pytest' === overriddenTestFramework;
        }
        return this.getConfigurationValueOrDefault(this.pythonConfiguration, ['unitTest.pyTestEnabled', 'testing.pyTestEnabled', 'testing.pytestEnabled'], false);
    }
    getPyTestArguments() {
        return this.getConfigurationValueOrDefault(this.pythonConfiguration, ['unitTest.pyTestArgs', 'testing.pyTestArgs', 'testing.pytestArgs'], []);
    }
    configureUnittestArgumentParser() {
        const argumentParser = new argparse_1.ArgumentParser({
            debug: true,
        });
        argumentParser.addArgument(['-p', '--pattern'], {
            dest: 'pattern',
            defaultValue: 'test*.py',
        });
        argumentParser.addArgument(['-s', '--start-directory'], {
            dest: 'startDirectory',
            defaultValue: '.',
        });
        return argumentParser;
    }
    getConfigurationByName(name, workspaceFolder) {
        return vscode_1.workspace.getConfiguration(name, workspaceFolder.uri);
    }
    getPythonConfiguration(workspaceFolder) {
        return this.getConfigurationByName('python', workspaceFolder);
    }
    getTestExplorerConfiguration(workspaceFolder) {
        return this.getConfigurationByName('pythonTestExplorer', workspaceFolder);
    }
}
exports.VscodeWorkspaceConfiguration = VscodeWorkspaceConfiguration;
//# sourceMappingURL=vscodeWorkspaceConfiguration.js.map