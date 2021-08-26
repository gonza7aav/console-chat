const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
  terminal: true,
});

const clearLastInput = () => {
  rl.output.moveCursor(0, -1);
  rl.output.clearLine(0);
};

const clearCurrentInput = () => {
  rl.output.clearLine(0);
  rl.output.cursorTo(0);
};

const chooseUsername = async () =>
  new Promise((resolve) =>
    rl.question('Username: ', (answer) => {
      clearLastInput();
      rl.output.moveCursor(0, 1);

      resolve(answer.trim());
    })
  );

const sendMessage = (client, username, message) => {
  clearLastInput();

  if (message === '!exit') {
    exitChat(client);
    return;
  }

  // send message
  client.write(
    JSON.stringify({
      username,
      message,
    })
  );
};

const exitChat = (client) => {
  clearCurrentInput();
  client.end(() => {
    console.log('You have disconnected');
    process.exit(0);
  });
};

const startClient = async (host, port) => {
  const username = await chooseUsername();

  const client = net.createConnection(port, host, () => {
    client.on('ready', () => {
      // send command to set username
      sendMessage(client, username, `!setUsername ${username}`);

      // when ready "open" the chat input
      rl.on('line', (input) => sendMessage(client, username, input.trim()));
      rl.prompt(true);
    });

    // receiving messages
    client.on('data', (data) => {
      clearCurrentInput();

      // print message
      console.log(data.toString('utf-8').trim());

      // resume input
      rl.prompt(true);
    });

    // disconnection to server
    client.on('close', () => exitChat(client));
  });

  process.on('SIGINT', () => exitChat(client));
};

module.exports = { start: startClient };
