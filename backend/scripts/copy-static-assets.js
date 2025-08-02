const fs = require('fs');
const path = require('path');

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const files = fs.readdirSync(source);

  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function copyFile(source, destination) {
  const destDir = path.dirname(destination);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(source, destination);
}

console.log('📁 Copying static assets for production...');

const sourceUploads = path.join(__dirname, '../uploads');
const destUploads = path.join(__dirname, '../dist/uploads');

if (fs.existsSync(sourceUploads)) {
  copyDirectory(sourceUploads, destUploads);
  console.log('✅ Uploads folder copied to dist/uploads/');
} else {
  console.log('⚠️  Uploads folder not found, creating empty directory');
  if (!fs.existsSync(destUploads)) {
    fs.mkdirSync(destUploads, { recursive: true });
  }
}

const sourceEnv = path.join(__dirname, '../.env');
const destEnv = path.join(__dirname, '../dist/.env');

if (fs.existsSync(sourceEnv)) {
  copyFile(sourceEnv, destEnv);
  console.log('✅ .env file copied to dist/');
} else {
  console.log('⚠️  .env file not found');
}

const staticFiles = [
  { source: '../package.json', dest: '../dist/package.json' },
  { source: '../.example.env', dest: '../dist/.example.env' }
];

staticFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file.source);
  const destPath = path.join(__dirname, file.dest);
  
  if (fs.existsSync(sourcePath)) {
    copyFile(sourcePath, destPath);
    console.log(`✅ ${file.source} copied to dist/`);
  }
});

console.log('🎉 All static assets copied successfully!'); 