export const ERROR_LEVEL = "ERROR";
export const DEBUG_LEVEL = "DEBUG";
export const INFO_LEVEL = "INFO";

const generateLogger = (logtag) => {
    return {
        debug: loggerGenerator(logtag, DEBUG_LEVEL),
        info: loggerGenerator(logtag, INFO_LEVEL),
        error: errorMessageGenerator(logtag)
    }
};

const loggerGenerator = (logtag, level) => {
    const checkForLevel = checkForLevelGenerator(level);
    return (...messages) => {
        if (checkForLevel(window.LOG_LEVEL)) {
            generateSimpleLog(logtag)(...messages);
        }
    }
};

const checkForLevelGenerator = (baseLevel) => (currentLevel) => {
    const baseLevelNumber = mapLevelToNumber(baseLevel);
    const currentLevelNumber = mapLevelToNumber(currentLevel);

    return baseLevelNumber >= currentLevelNumber;
};

const mapLevelToNumber = (level) => {
    const upperCasedLevel = level
        ? level.toUpperCase()
        : undefined;
    switch (upperCasedLevel) {
        case DEBUG_LEVEL:
            return 0;
        case INFO_LEVEL:
            return 1;
        default:
            return 1;
    }
};

const errorMessageGenerator = (logtag) => (...messages) => console.error(logtag, ...messages);

const generateSimpleLog = (logtag) => (...messages) => console.log(logtag, ...messages);

export default generateLogger;
