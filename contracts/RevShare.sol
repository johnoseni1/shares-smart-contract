// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.9.0;

import "./IterableMapping.sol";

import "./Ownable.sol";

contract RevShare is Ownable {
    //Struct reference
    itmap data;

    // Apply library functions to the data type.
    using IterableMapping for itmap;

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    event PaymentPointerAdded(
        string name,
        uint256 revenueShare,
        uint256 newPercentageTotal
    );

    // Add item to store
    function add(string memory paymentPointerName, uint256 revShareValue)
        public
        onlyOwner
        returns (uint256 size)
    {
        // require(key <= data.size);

        uint256 key = data.highestKeyForNextEntry;

        uint256 valueToReplace = 0;

        if (data.contains(key)) {
            (, uint256 previousValue, ) = data.iterate_get(key);
            valueToReplace = previousValue;
        }

        require(
            data.percentageTotal + revShareValue - valueToReplace <= 100,
            "Add: maximum percentage total is 100"
        );

        data.insert(key, paymentPointerName, revShareValue);
        if (valueToReplace != 0) data.percentageTotal -= valueToReplace;
        data.percentageTotal += revShareValue;

        emit PaymentPointerAdded(
            paymentPointerName,
            revShareValue,
            data.percentageTotal
        );

        return data.size;
    }

    event PaymentPointerRemoved(
        string name,
        uint256 revenueShare,
        uint256 newPercentageTotal
    );

    // Remove item in store
    function remove(uint256 key) public onlyOwner returns (uint256 size) {
        // bytes memory paymentPointerName;
        string memory name;

        (, uint256 revShareValue, bytes memory paymentPointerName) =
            data.iterate_get(key);

        data.remove(key);

        name = string(paymentPointerName);

        emit PaymentPointerRemoved(name, revShareValue, data.percentageTotal);

        return data.size;
    }

    // Find lowest key value
    function findStart() internal view returns (uint256 s) {
        uint256 lowestKey = type(uint256).max;

        for (
            uint256 i = data.iterate_start();
            data.iterate_valid(i);
            i = data.iterate_next(i)
        ) {
            (uint256 key, , ) = data.iterate_get(i);

            if (key < lowestKey) {
                lowestKey = key;
            }
        }

        return (type(uint256).max == lowestKey) ? 0 : lowestKey;
    }

    function getOneEntry(uint256 index)
        public
        view
        returns (
            uint256 key,
            uint256 value,
            string memory name
        )
    {
        require(
            data.contains(index),
            "Retrievable: Entry record does not exist in storage"
        );

        bytes memory _name;

        (key, value, _name) = data.iterate_get(index);

        name = string(_name);

        return (key, value, name);
    }

    function checkDataContains(uint256 index) public view returns (bool) {
        return data.contains(index);
    }

    function getArraySize() public view returns (uint256) {
        return data.size;
    }

    function getArrayStart() public view returns (uint256) {
        return findStart();
    }

    function getTotalPercentage() public view returns (uint256) {
        return data.percentageTotal;
    }

    function pickPointer(uint256 choice)
        public
        view
        returns (string memory paymentPointerName)
    {
        require(
            choice > 0 && choice <= 100,
            "Selection: input number should be greater than 0 and less than or equal to 100"
        );

        require(
            !(getArraySize() == 0 && getArrayStart() == 0),
            "Data: at least one data entry should exist in the smart contract storage"
        );

        require(
            choice <= data.percentageTotal,
            "Input: input number for choice should be less than the total percentage"
        );

        int256 curValue;

        for (
            uint256 i = data.iterate_start();
            data.iterate_valid(i);
            i = data.iterate_next(i)
        ) {
            (, uint256 value, bytes memory name) = data.iterate_get(i);

            curValue = int256(choice -= value);

            if ((curValue) <= 0) {
                return (string(name));
            }
        }
    }
}
