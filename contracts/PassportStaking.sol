// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./FastCredit.sol";

/**
 * @title FastCreditStaking
 * @dev Allows users to stake FTN once to mint their Credit Passport NFTs
 */
contract FastCreditStaking is Ownable, ReentrancyGuard {
    // Reference to the FastCredit NFT
    FastCredit public fastCredit;
    
    // Minimum stake amount (in FTN)
    uint256 public minimumStakeAmount = 0.05 ether; // 0.05 FTN
    
    // Lock period - time user must wait before unstaking (30 days)
    uint256 public lockPeriod = 30 days;
    
    // Staking thresholds for different ranks (in FTN)
    uint256 public bronzeThreshold = 0.05 ether;    // 0.05 FTN
    uint256 public silverThreshold = 0.1 ether;     // 0.1 FTN
    uint256 public goldThreshold = 0.2 ether;       // 0.2 FTN
    uint256 public platinumThreshold = 0.5 ether;   // 0.5 FTN
    uint256 public diamondThreshold = 1 ether;      // 1 FTN
    
    // Mapping from user address to stake info
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        bool hasUnstaked;
    }
    mapping(address => StakeInfo) private _stakes;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event PassportCreated(address indexed user, uint256 tokenId, FastCredit.Rank rank);
    
    constructor(address _fastCredit) {
        fastCredit = FastCredit(_fastCredit);
        _transferOwnership(msg.sender);
    }
    
    /**
     * @dev Sets the minimum stake amount
     * @param amount New minimum stake amount
     */
    function setMinimumStakeAmount(uint256 amount) external onlyOwner {
        minimumStakeAmount = amount;
    }

    /**
     * @dev Sets the lock period
     * @param period New lock period in seconds
     */
    function setLockPeriod(uint256 period) external onlyOwner {
        lockPeriod = period;
    }

    /**
     * @dev Sets the rank thresholds
     */
    function setRankThresholds(
        uint256 bronze,
        uint256 silver,
        uint256 gold,
        uint256 platinum,
        uint256 diamond
    ) external onlyOwner {
        bronzeThreshold = bronze;
        silverThreshold = silver;
        goldThreshold = gold;
        platinumThreshold = platinum;
        diamondThreshold = diamond;
    }

    /**
     * @dev Determines rank based on stake amount
     */
    function determineRank(uint256 stakeAmount) public view returns (FastCredit.Rank) {
        if (stakeAmount >= diamondThreshold) {
            return FastCredit.Rank.DIAMOND;
        } else if (stakeAmount >= platinumThreshold) {
            return FastCredit.Rank.PLATINUM;
        } else if (stakeAmount >= goldThreshold) {
            return FastCredit.Rank.GOLD;
        } else if (stakeAmount >= silverThreshold) {
            return FastCredit.Rank.SILVER;
        } else if (stakeAmount >= bronzeThreshold) {
            return FastCredit.Rank.BRONZE;
        } else {
            return FastCredit.Rank.NONE;
        }
    }
    
    /**
     * @dev Stakes FTN to create a Credit Passport
     * @param initialMetadataURI Initial metadata URI for new passport
     */
    function stake(string memory initialMetadataURI) external payable nonReentrant {
        require(msg.value >= minimumStakeAmount, "Stake amount too low");
        // Allow multiple stakes: accumulate amount and update timestamp
        _stakes[msg.sender].amount += msg.value;
        _stakes[msg.sender].timestamp = block.timestamp;
        _stakes[msg.sender].hasUnstaked = false;
        
        // Determine rank based on total staked amount
        FastCredit.Rank rank = determineRank(_stakes[msg.sender].amount);
        
        // Mint a new passport NFT for every stake (for demo flexibility)
        uint256 tokenId = fastCredit.createPassport(
            msg.sender,
            rank,
            _stakes[msg.sender].amount,
            0, // Initial income is 0
            initialMetadataURI
        );
        
        emit Staked(msg.sender, msg.value);
        emit PassportCreated(msg.sender, tokenId, rank);
    }
    
    /**
     * @dev Unstakes FTN after lock period
     */
    function unstake() external nonReentrant {
        StakeInfo storage info = _stakes[msg.sender];
        require(info.amount > 0, "No stake found");
        require(!info.hasUnstaked, "Already unstaked");
        require(block.timestamp >= info.timestamp + lockPeriod, "Still locked");
        
        uint256 amount = info.amount;
        info.hasUnstaked = true;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Gets stake info for a user
     */
    function getStakeInfo(address user) external view returns (uint256 amount, uint256 timestamp, bool hasUnstaked) {
        StakeInfo storage info = _stakes[user];
        return (info.amount, info.timestamp, info.hasUnstaked);
    }
    
    // Allow contract to receive FTN
    receive() external payable {}
} 