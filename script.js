document.addEventListener('DOMContentLoaded', function () {
    const term = new Terminal({
        cursorBlink: true,
        rows: 20, // Default rows
    });
    // Note: FitAddon is not available directly via the global `Terminal` object when using CDN.
    // For simplicity in this step, we'll manage resize manually or skip FitAddon for now.
    // If FitAddon is crucial, it needs to be imported correctly, possibly requiring a build step or different CDN.

    term.open(document.getElementById('terminal'));
    // A simple way to make it fit, not as robust as FitAddon
    function fitTerminal() {
        const terminalContainer = document.getElementById('terminal-container');
        // Basic fitting logic, can be improved. xterm.js's FitAddon is more sophisticated.
        const  termDimensions = term.proposeDimensions();
        if (termDimensions && terminalContainer.clientWidth) {
            const cols = Math.floor(terminalContainer.clientWidth / termDimensions.cols);
            //const rows = Math.floor(terminalContainer.clientHeight / termDimensions.rows);
            // For now, keep rows fixed or make it configurable.
            term.resize(cols, term.rows);
        }
    }

    fitTerminal();


    term.writeln('Welcome to the Web SSH Client!');
    term.writeln('Initializing terminal...');
    term.writeln('NOTE: Actual SSH connection requires a backend WebSocket server.');

    let socket;

    function connectToServer() {
        // Replace with your WebSocket server endpoint
        // const wsUrl = 'ws://localhost:8080/ssh';
        // socket = new WebSocket(wsUrl);

        term.writeln('Attempting to connect to WebSocket server (not implemented yet)...');

        // Placeholder for actual WebSocket connection
        // socket.onopen = () => {
        //     term.writeln('WebSocket connection established.');
        //     // You might want to send initial connection parameters here
        //     // e.g., socket.send(JSON.stringify({ host: 'ubuntu@thebigone.johnny-airlines.co.uk', key: 'USER_SSH_KEY_CONTENT' }));
        // };

        // socket.onmessage = (event) => {
        //     // Data received from server (SSH output)
        //     term.write(typeof event.data === 'string' ? event.data : new Uint8Array(event.data));
        // };

        // socket.onerror = (error) => {
        //     term.writeln(`WebSocket error: ${error.message}`);
        // };

        // socket.onclose = () => {
        //     term.writeln('WebSocket connection closed.');
        // };
    }

    // Call this function when the user wants to connect (e.g., after providing an SSH key)
    // connectToServer();


    term.onData(data => {
        // If WebSocket is connected, send data to server
        // if (socket && socket.readyState === WebSocket.OPEN) {
        //     socket.send(data);
        // } else {
            // For now, just echo it back locally
            term.write(data);
            term.writeln('\n[No backend connected. Echoing locally.]');
        // }
    });

    window.addEventListener('resize', () => {
        fitTerminal();
    });
});
