// splitJson.js
const fs = require('fs');
const path = require('path');

// Caminho do arquivo JSON original
const filePath = path.join(__dirname, 'property.json');

// Ler o arquivo JSON original
const rawData = fs.readFileSync(filePath);
const properties = JSON.parse(rawData);

// Configurar parâmetros de divisão
const itemsPerFile = 50; // Número de itens por arquivo
let fileIndex = 1;

for (let i = 0; i < properties.length; i += itemsPerFile) {
    const chunk = properties.slice(i, i + itemsPerFile);
    const fileName = path.join(__dirname, `property_${i + 1}_to_${i + chunk.length}.json`);
    fs.writeFileSync(fileName, JSON.stringify(chunk, null, 2));
    console.log(`Arquivo ${fileName} criado com ${chunk.length} itens.`);
}
