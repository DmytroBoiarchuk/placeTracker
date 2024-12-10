export default {
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',  // Обрабатываем все файлы с .ts и .tsx с помощью babel-jest
    },
    testEnvironment: "jest-environment-jsdom", // Same name of the lib you installed
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // The file you created to extend jest config and "implement" the jest-dom environment in the jest globals
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|svg|ttf|eot|woff|woff2)$': '<rootDir>/test/__mocks__/fileMock.js',
        "\\.(css|less|sass|scss)$": "identity-obj-proxy", // The mock for style related files
        "^@/(.*)$": "<rootDir>/src/$1", // [optional] Are you using aliases?
    },
};
