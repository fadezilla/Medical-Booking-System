const ws = new WebSocket('ws://localhost:8003');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    console.log('Received WebSocket message:', event.data);
    const data = JSON.parse(event.data);
    if(data.type === 'nextPatientNumber') {
        document.getElementById('nextNumber').innerText = data.data;
    }
};

function callPatient() {
    console.log('Calling patient...')
    ws.send('callPatient');
};