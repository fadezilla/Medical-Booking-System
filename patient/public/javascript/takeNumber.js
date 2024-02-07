const ws = new WebSocket('ws://localhost:8003');

ws.onopen = () => {
    console.log('Connected to the WebSocket server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'currentNumber') {
        document.getElementById('currentNumber').innerText = data.data;
    } else if (data.type === 'userNumber'){
        document.getElementById('userNumber').style.display = 'block'
        document.getElementById('takenNumber').innerText = data.data;
    }
};

function takeNumber() {
    ws.send('takeNumber');
}
