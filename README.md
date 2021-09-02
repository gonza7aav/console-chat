# console-chat

A really simple chat room using the [Net](https://nodejs.org/dist/latest-v14.x/docs/api/net.html) module in _Node.js_.

## 🚧 Prerequisites

- _[Node.js](https://nodejs.org/)_

## 🛠️ Install

1. Download this repository

2. Install the dependencies

   ```console
   npm install
   ```

## 🚀 Usage

### 🏭 Server

Start the server with the IP and port where it will listen for connections

```console
npm run server -- [-h | --host] <IP> [-p | --port] <port>
```

### 🏠 Client

Start the client with the IP and port of the server

```console
npm run client -- [-h | --host] <IP> [-p | --port] <port>
```

Use `!members` to see the usernames of those who connected; or `!exit` to leave the chat room

## 📝 License

Copyright © 2021 _Aguirre Gonzalo Adolfo_.
This project is _[MIT](LICENSE)_ licensed.
