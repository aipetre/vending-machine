import { Interface as ReadlineInterface } from 'node:readline/promises';

enum VendingMachineStateEnum {
  clientMode = 'clientMode',
  adminMode = 'adminMode',
}

const acceptedCoinsMap = {
  '0.05': 5,
  '0.10': 10,
  '0.20': 20,
  '0.50': 50,
  '1': 100,
  '2': 200,
};

type CoinType = keyof typeof acceptedCoinsMap;

const defaultCostMatrix = {
  'Coke': 150,
  'Pepsi': 145,
  'Water': 90,
};

const defaultInventory = {
  'Coke': 15,
  'Pepsi': 10,
  'Water': 20,
};

type Inventory = { [key: string]: number };
type CostMatrix = { [key: string]: number };

/**
 * Utility function to display a number with 2 decimals
 * @param amount {number}
 * @returns {string} =
 */
function displayAmount(amount: number) {
  return (amount / 100).toFixed(2);
}

export class VendingMachineState {
  private rl: ReadlineInterface;

  private ADMIN_PIN = '1234';

  private state: VendingMachineStateEnum;

  // the total amount of money in the machine
  private earnedAmount = 0;

  // the available money to use to purchase products
  private availableAmount = 0;

  // inventory of the vending machine
  private inventory: Inventory = { ...defaultInventory };

  // the matrix cost of the products in the vending machine
  private costMatrix: CostMatrix = { ...defaultCostMatrix };

  private setState(newState: VendingMachineStateEnum) {
    this.state = newState;
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      throw new Error(`Unknown error received ${error}`);
    }
  }

  private validateCoin(coin: CoinType): number {
    if (!acceptedCoinsMap[coin]) {
      throw new Error(`${coin} is not an accepted amount. Please insert 0.05, 0.10, 0.20, 0.50, 1, 2 coins`);
    }

    return acceptedCoinsMap[coin]
  }

  private validateProductSelection(product: string) {
    if (!this.inventory![product]) {
      throw new Error(`'${product}' is not a valid product selection.\n`);
    }

    if (this.inventory![product] === 0) {
      throw new Error(`'${product}' is not in stock anymore.\n`);
    }
  }

  private getProductCost(product: string): number {
    // Note: Not validating here since we are assuming validateProductSelection did this already
    return this.costMatrix[product];
  }

  private validatePurchase(productCost: number) {
    if (productCost > this.availableAmount) {
      throw new Error(`Insufficient money.`);
    }
  }

  private cancelRequest() {
    if (this.availableAmount > 0) {
      console.log(`Returning money: ${this.availableAmount}`);
      this.availableAmount = 0
    }
  }

  private async enterAdminMode() {
    const code = await this.rl.question('Please enter PIN code:\n');

    if (code !== this.ADMIN_PIN) {
      this.rl.pause();
    } else {
      console.log('The vending machine is entering admin mode');
      this.setState(VendingMachineStateEnum.adminMode);
    }
  }

  private purchaseProduct(product: string) {
    try {
      this.validateProductSelection(product);
      const productCost = this.getProductCost(product);
      this.validatePurchase(productCost);

      // update inventory
      this.inventory[product]--;
      console.log(`Dispensing ${product}...`);
      // update total amount in the vending machine;
      this.earnedAmount = this.earnedAmount + productCost;

      const changeToReturn = this.availableAmount - productCost;
      if (changeToReturn) {
        console.log(`Your change is ${displayAmount(changeToReturn)}`);
      }

      // reset available amount
      this.availableAmount = 0;
      console.log('Thank you for your purchase');
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private async handleClientModeInput(input: string) {
    if (/^cancel$/i.test(input)) {
      this.cancelRequest();
    } else if (/^adminMode$/i.test(input)) {
      this.enterAdminMode();
    } else if (/[a-z]/i.test(input)) {
      this.purchaseProduct(input);
    } else {
      // default assuming money is added
      this.addMoney(input as CoinType);
    }
  }

  private async resetState() {
    const confirm = await this.rl.question('Are you sure you want to reset vending machine state? Type \'yes\' to confirm\n');

    if (confirm.match(/^yes$/i)) {
      this.earnedAmount = 0;
      this.costMatrix = defaultCostMatrix;
      this.inventory = defaultInventory;
      console.log('Vending machine is reset to default state');
    } else {
      console.log('Reset action aborted. You are still in admin mode');
    }
  }

  private async enterClientMode() {
    console.log('The vending machine is entering client mode');
    this.setState(VendingMachineStateEnum.clientMode);
    console.log(`Available amount: ${displayAmount(this.availableAmount)}`);
  }

  private viewStocksAndBalance() {
    console.log(`Vending Machine balance is: ${displayAmount(this.earnedAmount)}`);

    Object.keys(this.inventory).forEach((product: string) => {
      console.log(`Product: '${product}'; Price ${displayAmount(this.costMatrix[product])}; Inventory: ${this.inventory[product]}`);
    });
  }

  private async handleAdminModeInput(input: string) {
    if (/^reset$/i.test(input)) {
      this.resetState();
    } else if (/^exit$/i.test(input)) {
      this.enterClientMode();
    } else if (/^view$/i.test(input)) {
      this.viewStocksAndBalance()
    }
  }

  private addMoney(coin: CoinType) {
    try {
      const money = this.validateCoin(coin);
      this.availableAmount += money;
      console.log(`Available amount: ${displayAmount(this.availableAmount)}`);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  public constructor(rl: ReadlineInterface) {
    console.log(`Welcome to Ionut's Vending Machine`);
    this.rl = rl;
    this.state = VendingMachineStateEnum.clientMode;
  }

  public async handleInput(input: string) {
    if (this.state === VendingMachineStateEnum.clientMode) {
      await this.handleClientModeInput(input);
    } else {
      this.handleAdminModeInput(input);
    }
  }
}
