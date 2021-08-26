const { Command, InvalidArgumentError } = require('commander');
const { isIP } = require('net');
const pkg = require('../package.json');

// adding the cli flags/options
const program = new Command();
program
  .version(pkg.version)
  .option('-s, --server', 'Start a server', false)
  .option('-c, --client', 'Start a client', false)
  .requiredOption(
    '-h, --host <IP>',
    'Host to listen for connections (server) or connect (client)',
    (value) => {
      if (!isIP(value)) throw new InvalidArgumentError('Not an IP.');
      return value;
    }
  )
  .requiredOption(
    '-p, --port <number>',
    'Port to listen for connections (server) or connect (client)',
    (value) => {
      const parsed = Number.parseInt(value, 10);
      if (Number.isNaN(parsed)) throw new InvalidArgumentError('Not a number.');
      return parsed;
    }
  )
  .parse(process.argv);

const flags = program.opts();

try {
  // you can start a server or client, but not both or neither
  if (flags.server == flags.client)
    throw new InvalidArgumentError(
      `Start a server or a client${flags.server ? ', not both.' : '.'}`
    );

  // require the service selected, and start it
  const service = require(flags.server ? './server.js' : './client.js');
  service.start(flags.host, flags.port);
} catch (err) {
  console.error(err.message);
}
