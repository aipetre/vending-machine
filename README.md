# Getting Started

## Prerequisites
 * Node.js@v20.16.0
 * npm@10.8.1

## Install dependencies
```
npm install
```

## Usage
```
npm run start
```

## Interaction with the vending machine
When you start the application in the terminal by default it will run in "client" mode where you can do the following actions:
* Insert coins. Accepted coins are 0.05, 0.10, 0.20, 0.50, 1, 2. To add coins just type in any accepted value.
* Select product. Valid products are: Coke, Pepsi and Water.
* Cancel request. This will return any available money in the vending machine. To cancel just type "cancel".
* Switch to "admin" mode by typing "adminMode". When switching into "admin" mode you will be requested a PIN code (1234).

When the application is in "admin" mode you can do the following actions:
* Reset machine state. This will reset the products stock and reset to zero the internal earned cash. To reset just type "reset", you will be asked to confirm action.
* View stock & earned amount. To perform this action just type "view".
* Switch to to "client" mode by typing "clientMode".
