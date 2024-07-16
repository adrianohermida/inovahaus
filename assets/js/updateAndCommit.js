const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lista de arquivos JSON a serem atualizados
const jsonFiles = [
  'assets/js/property_1_to_50.json',
  'assets/js/property_51_to_100.json',
  'assets/js/property_101_to_150.json',
  'assets/js/property_151_to_152.json'
];

// Caminho base para a pasta de imagens
const imagesBasePath = './assets/img/property';
const defaultImagePath = 'assets/img/property/600x800.png';

// Função para listar todos os arquivos em uma pasta
const listImagesInDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) return [];
  return fs.readdirSync(directoryPath).map(fileName => path.join(directoryPath, fileName));
};

// Função para criar subpasta e copiar imagem padrão se não existir
const ensureSubfolderWithDefaultImage = (propertyId) => {
  const propertyImagePath = path.join(imagesBasePath, propertyId);
  
  if (!fs.existsSync(propertyImagePath)) {
    fs.mkdirSync(propertyImagePath, { recursive: true });
    const destinationPath = path.join(propertyImagePath, path.basename(defaultImagePath));
    fs.copyFileSync(defaultImagePath, destinationPath);
    console.log(`Subpasta ${propertyImagePath} criada com imagem padrão.`);
  }
  
  return listImagesInDirectory(propertyImagePath);
};

// Função para atualizar o campo de imagens em um arquivo JSON
const updateJsonFile = (filePath) => {
  let rawData = fs.readFileSync(filePath);
  let properties = JSON.parse(rawData);

  properties.forEach(property => {
    const propertyId = property.id.toString();
    let imageFiles = ensureSubfolderWithDefaultImage(propertyId);

    imageFiles = imageFiles.map(file => file.replace(imagesBasePath, '/assets/img/property'));

    property.images = imageFiles;
  });

  fs.writeFileSync(filePath, JSON.stringify(properties, null, 2), 'utf-8');
  console.log(`Caminhos das imagens atualizados com sucesso em ${filePath}`);
};

// Função para executar comandos do Git
const runGitCommand = (command) => {
  execSync(command, { stdio: 'inherit' });
};

// Atualizar todos os arquivos JSON
jsonFiles.forEach(updateJsonFile);

// Configurar Git para usar o token de acesso pessoal
const gitUsername = 'your-github-username';
const githubToken = 'your-github-token';
const repository = 'github.com/your-repo.git';

// Configurar repositório remoto com autenticação
runGitCommand(`git remote set-url origin https://${gitUsername}:${githubToken}@${repository}`);

// Comandos Git
const gitCommands = [
  'git add assets/js/*.json',
  'git commit -m "Atualiza caminhos de imagens nos arquivos JSON"',
  'git push origin main'
];

// Executar comandos Git
gitCommands.forEach(runGitCommand);
