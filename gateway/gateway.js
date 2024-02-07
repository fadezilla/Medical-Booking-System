const express = require('express');
const fetch = require('node-fetch');
const path = require('path')

const app = express();
app.use(express.json()); 

const services = {
  patients: { port: 8001 },
  receptionist: { port: 8002 },
  websocket: { port: 8003 },
};

const forwardRequest = async (req, res, serviceName) => {
  const service = services[serviceName]; 
  if (!service) {
    res.status(404).send('Service not found');
    return;
  }

  const path = req.originalUrl.replace(`/${serviceName}`, '');
  const url = `http://localhost:${service.port}${path}`;
  
  const options = {
    method: req.method,
    headers: { ...req.headers, host: `localhost:${service.port}` },
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : null,
  };

  try {
    console.log('Forwarding to', url);
    const response = await fetch(url, options);

    res.status(response.status);
    response.headers.get('content-type')?.includes('application/json')
      ? res.json(await response.json())
      : res.send(await response.text());
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: error.message });
  }
};

Object.keys(services).forEach((serviceName) => {
  app.use(`/${serviceName}`, (req, res) =>
    forwardRequest(req, res, serviceName),
  );
});
// Serving the functions directly as they won`t load otherwise
app.get('/javascript/takeNumber.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'patient', 'public', 'javascript', 'takeNumber.js'));
  });

app.get('/javascript/callPatient.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'receptionist', 'public', 'javascript', 'callPatient.js'));
  });

const port = 8000;
app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}/`);
});