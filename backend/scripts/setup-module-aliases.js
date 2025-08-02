const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  packageJson._moduleAliases = {
    "@": "./dist/"
  };
  console.log('✅ Production mode: Module aliases set to ./dist/');
} else {
  packageJson._moduleAliases = {
    "@": "./"
  };
  console.log('✅ Development mode: Module aliases set to ./');
}

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2)); 