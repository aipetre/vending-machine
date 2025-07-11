import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { VendingMachineState } from './vending-machine';

const welcomeMessage = `Welcome to Ionut's Vending Machine`;

async function main() {
  console.log(welcomeMessage);

  const vm = new VendingMachineState();
  const rl = readline.createInterface({ input, output });

  rl.on('line', (input) => {
    console.log(`Received input: '${input}'`);
  })

  rl.on('SIGINT', async () => {
    const answer = await rl.question('Are you sure you want to exit?\n');

    if (answer.match(/^y(es)?$/i)) rl.pause();
    
    console.log(`Goodbye`);
  });
}

(() => {
  main();
})();