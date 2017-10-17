pragma solidity ^0.4.15;

//basic ownership contract
contract Owned {
    address public owner;

    //ensures only owner can call functions
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    //constructor makes sets owner to contract deployer
    function Owned() public { owner = msg.sender;}

    //update owner
    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
        NewOwner(msg.sender, _newOwner);
    }

    event NewOwner(address indexed oldOwner, address indexed newOwner);
}

contract PresaleFundCollector is Owned {
    /** What is the minimum buy in */
    uint public weiMinimumLimit;

    mapping (address => bool) public whitelist;

    event WhitelistUpdated(address whitelistedAddress, bool isWhitelisted);
    event EmptiedToWallet(address wallet);
    event CouldNotInvest(address investor, uint value);
    event Invested(address investor, uint value);

    function PresaleFundCollector(uint _weiMinimumLimit) public {
        require(_weiMinimumLimit != 0);

        weiMinimumLimit = _weiMinimumLimit;
    }

    function updateWhitelist(address whitelistedAddress, bool isWhitelisted) public onlyOwner {
        whitelist[whitelistedAddress] = isWhitelisted;
        WhitelistUpdated(whitelistedAddress, isWhitelisted);
    }

    function invest() public payable {
        require(whitelist[msg.sender]);
        if (!whitelist[msg.sender]) {
            CouldNotInvest(msg.sender, msg.value);
            revert();
        } else {
            Invested(msg.sender, msg.value);
        }
    }

    function emptyToWallet(address walletAddress) public onlyOwner {
        walletAddress.transfer(this.balance);
        EmptiedToWallet(walletAddress);
    }

    /** Explicitly call function from your wallet. */
    function() public payable {
        revert();
    }
}