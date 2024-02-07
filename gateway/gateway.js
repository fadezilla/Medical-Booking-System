const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const services = {
    patients: { port: 8001},
    receptionist: { port: 8002},
    server: { port: 8003},
};

const forwardRequest = async(req, res, serviceName) => {
    const service = services[serviceName];
    if(!service){
        res.status(404).send('service not found');
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
        console.log('forwarding to:', url);
        const response = await fetch(url, options);

        res.status(response.status);
        response.headers.get('content-type')?.includes('application/json')
            ? res.json(await response.json())
            : res.send(await response.text());
    } catch (error) {
        console.error('Error forwaring request:', error);
        res.status(500).json({ error: error.message });
    }
};

Object.keys(services).forEach((serviceName) => {
    app.use(`/${serviceName}`, (req, res) => 
        forwardRequest(req, res, serviceName),
    );
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

const port = 8000;
app.listen(port, () => {
    console.log(`Gateway running at http://localhost:${port}`);
});