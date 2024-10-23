export default async function handler(req, res) {
  const repoOwner = 'phoenixsrd';
  const repoName = 'imagens';
  const folderPath = 'images';

  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

  try {
    const response = await fetch(apiUrl);
    const imagens = await response.json();

    if (response.ok) {
      let html = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Galeria De Imagens</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            .galeria {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 10px;
            }
            .galeria img {
              max-width: 100%;
              height: auto;
              border: 2px solid #ccc;
              border-radius: 5px;
              box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease;
            }
            .galeria img:hover {
              transform: scale(1.05);
            }
            .imagem-container {
              text-align: center;
            }
            .imagem-nome {
              margin-top: 5px;
              color: #555;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>Galeria de Imagens</h1>
          <div class="galeria">
      `;

      imagens.forEach(imagem => {
        if (imagem.type === 'file') {
          const imageUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folderPath}/${imagem.name}`;
          html += `
            <div class="imagem-container">
              <img src="${imageUrl}" alt="${imagem.name}">
              <div class="imagem-nome">${imagem.name}</div>
            </div>
          `;
        }
      });

      html += `
          </div>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      res.status(404).send('Imagens Não Encontradas.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro Ao Buscar As Imagens.');
  }
}
