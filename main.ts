import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { VendingMachineState } from './vending-machine';

async function main() {
  const rl = readline.createInterface({ input, output });
  const vm = new VendingMachineState(rl);

  rl.on('line', async (input) => {
    console.log(`Received input: '${input}'`);
    await vm.handleInput(input);
  })

  rl.on('SIGINT', async () => {
    const answer = await rl.question('Are you sure you want to exit?\n');

    if (answer.match(/^y(es)?$/i)) {
      console.log('Goodbye')
      rl.pause();
    }
  });
}

(() => {
  main();
})();