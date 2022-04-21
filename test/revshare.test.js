const RevShare = artifacts.require('RevShare');
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

const toBN = web3.utils.toBN;

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

contract('RevShare Contract Test Suite', (accounts) => {
    let revshare;

    describe("Smart Contract Events", () => {
        it("should emit an event when add function is called", async () => {

            let name = "$example.pointer.com";
            let value = 10;

            revshare = await RevShare.new({ from: accounts[0] });
            let tx = await revshare.add(name, value);

            truffleAssert.eventEmitted(tx, 'PaymentPointerAdded', (ev) => {
                return ev.name == name && ev.revenueShare == value && ev.newPercentageTotal == value;
            });

        })

        it("should emit an event when remove function is called", async () => {

            let name = "$example.pointer.com";
            let value = 10;

            revshare = await RevShare.new({ from: accounts[0] });
            await revshare.add(name, value);
            let tx = await revshare.remove(0);

            truffleAssert.eventEmitted(tx, 'PaymentPointerRemoved', (ev) => {
                return ev.name == name && ev.revenueShare == value && ev.newPercentageTotal == 0;
            });

        })

        it("should fail if no data entries exist in the smart contract storage", async () => {

            revshare = await RevShare.new({ from: accounts[0] });

            truffleAssert.reverts(
                revshare.pickPointer(10)
            );

        })


        it("should fail if input number choice for picking a pointer is larger than the total sum of percentage shares stored ", async () => {

            let name = "$example.pointer.com";
            let value = 10;

            revshare = await RevShare.new({ from: accounts[0] });
            await revshare.add(name, value);

            truffleAssert.reverts(
                revshare.pickPointer(20)
            );

        })


    });


    describe("Main Smart Contract Interactions", () => {

        it("should return an array of payment pointer entry items that are in the smart contract ", async () => {

            let arrOfPaymentPointerInputData = [[0, "$example1.pointer.com", 25], [1, "$example2.pointer.com", 25], [2, "$example3.pointer.com", 25], [3, "$example4.pointer.com", 25]]

            let arrOfPaymentPointerInputDataToCompare = [[toBN(0), "$example1.pointer.com", toBN(25)], [toBN(1), "$example2.pointer.com", toBN(25)], [toBN(2), "$example3.pointer.com", toBN(25)], [toBN(3), "$example4.pointer.com", toBN(25)]]

            let arrOfPaymentPointerDataResults = []

            revshare = await RevShare.new({ from: accounts[0] });

            await revshare.add(arrOfPaymentPointerInputData[0][1], arrOfPaymentPointerInputData[0][2]);
            await revshare.add(arrOfPaymentPointerInputData[1][1], arrOfPaymentPointerInputData[1][2]);
            await revshare.add(arrOfPaymentPointerInputData[2][1], arrOfPaymentPointerInputData[2][2]);
            await revshare.add(arrOfPaymentPointerInputData[3][1], arrOfPaymentPointerInputData[3][2]);

            const arraySizeNum = (await revshare.getArraySize()).toNumber();
            const arrayStartNum = (await revshare.getArrayStart()).toNumber();

            let i = arraySizeNum;
            let index = arrayStartNum;

            arrOfPaymentPointerDataResults = await getArrayOfPaymentPointerEntries(i, index, revshare);

            assert.deepEqual(arrOfPaymentPointerInputDataToCompare, arrOfPaymentPointerDataResults);


        })

        it("should return an array of payment pointer entries, excluding the entry that has been deleted ", async () => {

            let arrOfPaymentPointerInputData = [[0, "$example1.pointer.com", 25], [1, "$example2.pointer.com", 25], [2, "$example3.pointer.com", 25], [3, "$example4.pointer.com", 25]]

            let arrOfPaymentPointerInputDataToCompare = [[toBN(0), "$example1.pointer.com", toBN(25)], [toBN(2), "$example3.pointer.com", toBN(25)], [toBN(3), "$example4.pointer.com", toBN(25)]]

            let arrOfPaymentPointerDataResults = []

            revshare = await RevShare.new({ from: accounts[0] });

            await revshare.add(arrOfPaymentPointerInputData[0][1], arrOfPaymentPointerInputData[0][2]);
            await revshare.add(arrOfPaymentPointerInputData[1][1], arrOfPaymentPointerInputData[1][2]);
            await revshare.remove(arrOfPaymentPointerInputData[1][0]);
            await revshare.add(arrOfPaymentPointerInputData[2][1], arrOfPaymentPointerInputData[2][2]);
            await revshare.add(arrOfPaymentPointerInputData[3][1], arrOfPaymentPointerInputData[3][2]);

            const arraySizeNum = (await revshare.getArraySize()).toNumber();
            const arrayStartNum = (await revshare.getArrayStart()).toNumber();

            let i = arraySizeNum;
            let index = arrayStartNum;

            arrOfPaymentPointerDataResults = await getArrayOfPaymentPointerEntries(i, index, revshare);

            assert.deepEqual(arrOfPaymentPointerInputDataToCompare, arrOfPaymentPointerDataResults);

        })

        it("should return a payment pointer names relevant to the input number chosen", async () => {

            let arrOfPaymentPointerInputData = [[0, "$example1.pointer.com", 25], [1, "$example2.pointer.com", 25], [2, "$example3.pointer.com", 25], [3, "$example4.pointer.com", 25]]

            revshare = await RevShare.new({ from: accounts[0] });

            await revshare.add(arrOfPaymentPointerInputData[0][1], arrOfPaymentPointerInputData[0][2]);
            await revshare.add(arrOfPaymentPointerInputData[1][1], arrOfPaymentPointerInputData[1][2]);
            await revshare.add(arrOfPaymentPointerInputData[2][1], arrOfPaymentPointerInputData[2][2]);
            await revshare.add(arrOfPaymentPointerInputData[3][1], arrOfPaymentPointerInputData[3][2]);

            assert.equal("$example1.pointer.com", await revshare.pickPointer(20))
            assert.equal("$example2.pointer.com", await revshare.pickPointer(40))
            assert.equal("$example3.pointer.com", await revshare.pickPointer(60))
            assert.equal("$example4.pointer.com", await revshare.pickPointer(80))

        })


        it("should return return the total sum of all shares", async () => {

            let arrOfPaymentPointerInputData = [[0, "$example1.pointer.com", 25], [1, "$example2.pointer.com", 25], [2, "$example3.pointer.com", 25], [3, "$example4.pointer.com", 25]]

            let totalPercentage;

            revshare = await RevShare.new({ from: accounts[0] });

            await revshare.add(arrOfPaymentPointerInputData[0][1], arrOfPaymentPointerInputData[0][2]);
            await revshare.add(arrOfPaymentPointerInputData[1][1], arrOfPaymentPointerInputData[1][2]);
            await revshare.add(arrOfPaymentPointerInputData[2][1], arrOfPaymentPointerInputData[2][2]);
            await revshare.add(arrOfPaymentPointerInputData[3][1], arrOfPaymentPointerInputData[3][2]);

            totalPercentage = await revshare.getTotalPercentage();

            assert.isTrue(toBN(100).eq(totalPercentage));


        })


    });

})
