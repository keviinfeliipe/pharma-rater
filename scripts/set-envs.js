const { writeFileSync, mkdirSync, mkdir } = require('fs');

require('dotenv').config()

const targetPath = './src/environments/environment.ts';

const envFileContend = `
export const environment = {
    mapbox_key: "${ process.env['MAPBOX_KEY'] }",
};
`;

mkdirSync('./src/environments/',{ recursive: true });

writeFileSync( targetPath, envFileContend );