**DOCUMENTATION**

**DESIGN DECISITION**
1. Microservice architecture: I chose to use an microservice architecture for this project to modularize the application into smaller, independent services. this architecture allows for easier development, deployment and scalability as each service can be deployed, tested and deployed independently.

2. Data structure: for managing the queue of patients in line, I chose to use the FIFO(first-in-first-out) data structure. this is because it closely represents real-life scenario of a queue where the patient who arrives first is the first to be served. Using this structure ensures fairness and efficiency in serving patients.

3. WebSocket communication: Websocket was chosen for the real-time communication between the server and the clients. Web socket provides low-latency and efficient communication between server and clients

4. REST API gateway: I implemented an API gateway to route requests to the appropriate microservices. This helps the internal structure of the microservices and provides a single entry point for clients to access different services.

**Microservice architecture and Workflow:**
1. WebSocket server: this server is responsible for generating random numbers for the queue and managing the queue of patients. It communicates between clients(patients and receptionist) using webSocket protocols. When a patient connects, it generates a random number for the patient and sends it. Upon receiving a 'takeNumber' message from a patient, it adds the that number to the queue, then generates a new number for the next patient, and it notofies all the clients about the new number.

2. Patient microservice: Provides an interface for patients to view their number in line and take a number to get in line. Upon clicking the 'Take this number' button, it sends a 'takeNumber' message to the webSocket server and displays the new random number and the current patients number

3. Receptionist microservice: Provides an interface for the receptionist to call the next patient in line. Upon clicking the 'call patient' button, it removes the next number from the queue and updates the current number to the next number in the queue array.

4. API gateway: Acts as a proxy to route requests from clients to the appropriate microservices.

overall, this architecture allows for efficient communication between clients and the server, seamless management of patient queues, and scalability for future enhancements or additions of microservices.

***RUNNING THE APPLICATION***

1. Prerequisites: 
    * Node.js installed on your machine.
    * NPM(Node package manager) installed

2. Setup:
    * Clone the repository to your local machine.
    * Navigate to the project directoy in your terminal

3. Installation:
    * Run `npm install` to install the necessary dependencies for each microservice(webSocket, Patient, Receptionist) and the API gateway

4. Running microservices
* Start each microservice individually
    * WebSocket Server: cd server and run the command `node webSockerServer.js`
    * Patient microservice: cd patient and run the command `npm start`
    * Receptionist microservice: cd receptionist and run the command `npm start`
    * API gateway: cd gateway and run the comman `node gateway.js`

5. Accessing the application:
* Once all the microservices are running, you can access the application using the following endpoints:
    * Patient interface: `http://localhost:8000/patients`
    * Receptionist interface: `http://localhost:8000/receptionist`

6. Using the application:
    * In the patient interface, click the "Take this number" button take a number to get in the queue.
    * In the receptionist interface, click the "Call patient" button to call the next patient in the queue.

***PACKAGES:***
* Node.js: JavaScript runtime environment.
* Express.js: Web application framework for Node.js.
* WebSocket: Library for WebSocket communication.
* Node-fetch: Library for making HTTP requests.
