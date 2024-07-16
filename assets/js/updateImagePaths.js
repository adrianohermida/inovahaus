const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const jsonFilePath = './assets/js/property.json';

// Caminho para a pasta de imagens
const imagesBasePath = './assets/img/property';

// Função para listar todos os arquivos em uma pasta
const listImagesInDirectory = (directoryPath) => {
  return fs.readdirSync(directoryPath).map(fileName => path.join(directoryPath, fileName));
};

// Carregar o arquivo JSON
let rawData = fs.readFileSync(jsonFilePath);
let properties = JSON.parse(rawData);

// Atualizar o caminho das imagens para cada propriedade
properties.forEach(property => {
  const propertyId = property.id.toString();
  const propertyImagePath = path.join(imagesBasePath, propertyId);

  if (fs.existsSync(propertyImagePath)) {
    const imageFiles = listImagesInDirectory(propertyImagePath);
    property.images = imageFiles.map(file => file.replace(imagesBasePath, '/assets/img/property'));
  } else {
    property.images = [];
  }
});

// Salvar o JSON atualizado de volta no arquivo
fs.writeFileSync(jsonFilePath, JSON.stringify(properties, null, 2), 'utf-8');

console.log('Caminhos das imagens atualizados com sucesso!');
