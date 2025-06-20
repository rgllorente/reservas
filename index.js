const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  clientId: '2d33183e-c1ab-4e8c-a0e9-3815eaf503d1',
  clientSecret: 'eWC8Q~v.3zmDh6_ku7jIP2FaT7.c47e5wV8exbB8',
  tenantId: 'd539d4bf-5610-471a-afc2-1c76685cfefa',
  scope: 'api://enel.com/2d33183e-c1ab-4e8c-a0e9-3815eaf503d1/.default',
  tokenUrl: `https://login.microsoftonline.com/d539d4bf-5610-471a-afc2-1c76685cfefa/oauth2/v2.0/token`
};

app.get('/usuarios', async (req, res) => {
  try {
    const tokenResponse = await axios.post(config.tokenUrl, qs.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: config.scope,
      grant_type: 'client_credentials'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const token = tokenResponse.data.access_token;

    const apiResponse = await axios.get('https://gestion-reservas-backend-dev.endesa.es/api/v1/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(apiResponse.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error llamando a la API');
  }
});

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
