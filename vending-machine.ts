 enum VendingMachineStateEnum  {
  clientMode = 'clientMode',
  adminMode = 'adminMode',
}

const acceptedCoinsMap = {
  '0.05': true,
  '0.10': true,
  '0.20': true,
  '0.50': true,
  '1': true,
  '2': true,
};

type CoinType = keyof typeof acceptedCoinsMap;

const defaultCostMatrix = {
  'Coke': 1.50,
  'Pepsi': 1.45,
  'Water': 0.90,
};

const defaultInventory = {
  'Coke': 15,
  'Pepsi': 10,
  'Water': 20,
};

type Inventory = { [key: string]: number };
type CostMatrix = { [key: string]: number };

export class VendingMachineState {
  state: VendingMachineStateEnum;

  // the total amount of money in the machine
  earnedAmount = 0;

  // the available money to use to purchase products
  availableAmount = 0;

  // inventory of the vending machine
  inventory: Inventory = defaultInventory;

  // the matrix cost of the products in the vending machine
  costMatrix: CostMatrix = defaultCostMatrix;

  private validateCoin(coin: CoinType) {
    if (!acceptedCoinsMap[coin]) {
      throw new Error(`${coin} is not an accepted amount. Please insert 0.05, 0.10, 0.20, 0.50, 1, 2 coins`);
    }
  }

  private validateProductSelection(product: string) {
    if (!this.inventory![product]) {
      throw new Error(`'${product}' is not a valid product selection.\n`);
    }

    if (this.inventory![product] === 0) {
      throw new Error(`'${product}' is not in stock anymore.\n`);
    }
  }

  private getProductCost(product: string) {
    // Note: Not validating here since we are assuming validateProductSelection did this already
    return this.costMatrix[product];
  }

  private validatePurchase(productCost: number) {
    if (productCost > this.availableAmount) {
      throw new Error(`Insufficient money.`);
    }
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      throw new Error(`Unknown error received ${error}`);
    }
  }

  private cancelRequest() {
    if (this.availableAmount > 0) {
      console.log(`Returning money: ${this.availableAmount}`);
      this.availableAmount = 0
    }
  }

  private handleClientModeInput(input: string) {

    if (input.toLowerCase() === 'cancel') {
      this.cancelRequest();
    }
  }

  private handleAdminModeInput(input: string) {
    // TODO
  }

  public updateInventoryAndMatrixCost(newInventory: Inventory, newCostMatrix: CostMatrix) {
    this.inventory = newInventory;
    this.costMatrix = newCostMatrix;
  }

  public addMoney(coin: CoinType) {
    try {
      this.validateCoin(coin);
      const money = Number(coin);
      this.availableAmount += money;
      console.log(`Available amount: ${this.availableAmount}\n`);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  public purchaseProduct(product: string) {
    try {
      this.validateProductSelection(product);
      const productCost = this.getProductCost(product);
      this.validatePurchase(productCost);

      // update inventory
      this.inventory[product]--;
      console.log(`Dispensing ${product}...`);
      // update total amount in the vending machine;
      this.earnedAmount += productCost;

      const changeToReturn = this.availableAmount - productCost;
      if (changeToReturn) {
        console.log(`Your change is ${changeToReturn}`);
      }
      console.log('Thank you for your purchase');
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  public resetState() {
    this.availableAmount = 0;
    this.earnedAmount = 0;
    this.costMatrix = defaultCostMatrix;
    this.inventory = defaultInventory;
  }

  public constructor() {
    this.state = VendingMachineStateEnum.clientMode;
  }

  public handleInput(input: string) {
    if (this.state === VendingMachineStateEnum.clientMode) {
      this.handleClientModeInput(input);
    } else {
      this.handleAdminModeInput(input);
    }
  }
}
