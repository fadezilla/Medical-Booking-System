const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

//FIFO Queue
let queue = [];
let currentNumber = null;
let nextNumber = generateRandomNumber();

function generateRandomNumber(){
    return Math.floor(Math.random() * 1001);
}

function addToQueue(number){
    queue.push(number);
}

function removeFromQueue(){
    return queue.shift();
}

wss.on('connection', (ws) => {
    console.log('client connected');
    currentNumber = generateRandomNumber();
    ws.send(JSON.stringify({ type: 'currentNumber', data: currentNumber }));

    ws.on('message', (message) => {
        message = message.toString();
        console.log('Received message:', message);
        if(message === 'takeNumber') {
            addToQueue(currentNumber);
            let prevNumber = currentNumber
            currentNumber = nextNumber;
            nextNumber = generateRandomNumber();
            ws.send(JSON.stringify({ type: 'currentNumber', data: currentNumber }));
            ws.send(JSON.stringify({ type: 'nextNumber', data: nextNumber }));
            ws.send(JSON.stringify({ type: 'userNumber', data: prevNumber }));
            console.log(queue);
            // Updates the next in line on the receptionist page whenever a client arrives
            const nextPatientNumber = queue[0];
            if(nextPatientNumber !== undefined){
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'nextPatientNumber', data: nextPatientNumber }));
                    }
                });
            }
        } else if (message === 'callPatient'){
            const nextPatientDisplay = queue[1];
            const nextPatientNumber = queue[0];
            if(nextPatientNumber !== undefined){
                removeFromQueue();
                ws.send(JSON.stringify({ type: 'nextPatientNumber', data: nextPatientDisplay}))
            }
            console.log(queue);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(8003, () => {
    console.log('WebsSocket server started on port 8003')
});