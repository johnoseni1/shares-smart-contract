# Revenue Share Smart Contract

This repository contains the smart contracts used to demonstrate revenue sharing with Web Monetization. The logic is based on the probabilistic revenue sharing example shown on the “webmonetization.org”


## Smart Contracts

### Ownable.sol 
This helps ensure that only the account which deployed the smart contract can access certain function methods.

### IterableMapping.sol  
This helps store the “Payment Pointers” and their associated weights in memory and exposes them so that they are also retrievable.

### RevShare.sol  
This contains the function methods to add, remove, retrieve, or select “Payment Pointers”.

#### RevShare.sol public functions list
##### add
##### remove
##### getOneEntry
##### checkDataContains
##### getArraySize
##### getArrayStart
##### getTotalPercentage
##### pickPointer

To connect the smart contract to a frontend, this following function could be used as an example for retrieving the “Payment Pointer” entries in the smart contract: -


```javascript
// An example helper function to retrieve all of the payment pointer entry items in the smart contract
const getArrayOfPaymentPointerEntries = async (_iteration, _index, _instance) => {
    let _arrOfPaymentPointerDataResults = []

    let i = _iteration;
    let index = _index;
    let revshare = _instance;

    while (i > 0) {
        const isPresent = await revshare.checkDataContains(index);

        if (isPresent) {
            let entry = await revshare.getOneEntry(index);
            _arrOfPaymentPointerDataResults.push([entry.key, entry.name, entry.value]);
            i--;

        }

        index++;

    }

    return _arrOfPaymentPointerDataResults;
}
```

## Getting Started 

Truffle has been used here to help with testing the smart contracts locally and migrating the smart contracts to Ethereum blockchain networks. You can find out more about truffle with this link.

Firstly, install the dependencies. 

```bash
npm install
```
Sign-up for an [Infura](https://infura.io/) account and create an Infura API key. Infura helps to provide easy access to the Ethereum network via the use of APIs.

Setup your local “.env” file with your environment variables to store your “Infura” API key and Ethereum account mnemonic. These items must be kept secret and not published to “Github” or any other public platform, otherwise you could put your application at risk or risk losing funds.

This example uses the Ethereum “Rinkeby” test network. You can configure your local truffle setup via the file called “truffle-config.js”. This file is where you setup your network settings for deploying the smart contract to a local development blockchain or connecting to an external blockchain network.

### Development network

Install "ganche-cli" or install the GUI version of ganache; a link to it can be found [here](https://www.trufflesuite.com/ganache)

```bash
npm install ganche-cli -g
```

In a new window start a local blockchain with ganache

```bash
ganche-cli
```

### External network

Ensure that external network settings are correct in the “truffle-config.js” file.

### Usage

```bash
truffle complie 
```
To complie the smart contracts and create the build files.


```bash
truffle test 
```
To run tests that are found the test folder.


```bash
truffle migrate --network
```
To deploy the smart contracts to your local development network or an external network, based on the settings configured in the “truffle-config.js” file.

## License
[MIT](https://choosealicense.com/licenses/mit/)

