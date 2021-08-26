const net = require('net');

const group = new Map();
const messages = [];
const MAX_MESSAGES = 10;

const broadcastMessage = (username, message) => {
  // format the message
  const formattedMessage =
    username !== 'server' ? `[${username}]: ${message}` : message;

  // save the message
  messages.push(formattedMessage);
  if (messages.length > MAX_MESSAGES) messages.shift();

  // send it to the group
  [...group.keys()].map((member) => member.write(formattedMessage));
  console.log(formattedMessage);
};

const handleCommand = (client, message) => {
  const aux = message.split(' ');

  // this will link the client with the username selected
  if (aux[0] === '!setUsername') {
    if (group.has(client)) {
      client.write("You can't change your username once connected");
      return;
    }

    // add the new connection to the group
    group.set(client, aux[1]);
    broadcastMessage('server', `${group.get(client)} has connected`);
  }

  // this will display the members of the group
  if (aux[0] === '!members') {
    const membersString = [...group.values()].reduce(
      (prev, curr) => `${prev}, ${curr}`
    );
    client.write(`The members in the group are: ${membersString}`);
  }
};

const removeUser = (client) => {
  const username = group.get(client);

  // delete it from the group
  group.delete(client);

  // inform to the group
  broadcastMessage('server', `${username} has disconnected`);
};

const startServer = (host, port) => {
  const server = net.createServer((client) => {
    // send the old messages
    if (messages.length > 0)
      client.write(messages.reduce((prev, curr) => `${prev}${curr}\n`, ''));

    // receiving something
    client.on('data', (data) => {
      const { username, message } = JSON.parse(data.toString('utf-8'));

      // handle command or send message
      if (message.startsWith('!')) {
        handleCommand(client, message);
      } else {
        broadcastMessage(username, message.trim());
      }
    });

    // the user exit the chat, then delete it from group
    client.on('end', () => removeUser(client));
  });

  server.listen(port, host, () =>
    console.log(`Starting server at ${host}:${port}`)
  );

  server.on('error', (err) => {
    throw err;
  });

  process.on('SIGINT', () => {
    console.log('Stopping server');
    server.close();
    process.exit(0);
  });
};

module.exports = { start: startServer };
