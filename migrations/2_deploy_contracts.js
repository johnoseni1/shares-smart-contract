const IterableMapping = artifacts.require("IterableMapping");
const Ownable = artifacts.require("Ownable");
const RevShare = artifacts.require("RevShare");

module.exports = function (deployer) {
    deployer.deploy(IterableMapping);
    deployer.deploy(Ownable);
    deployer.link(Ownable, RevShare);
    deployer.link(IterableMapping, RevShare);
    deployer.deploy(RevShare);
};
