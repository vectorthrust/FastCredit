// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./FastCredit.sol";

/**
 * @title FastCreditStaking
 * @dev Allows users to stake USDC once to mint their Credit Passport NFTs
 */
contract FastCreditStaking is Ownable, ReentrancyGuard {
    // Reference to the FastCredit NFT
    FastCredit public fastCredit;
    
    // USDC token contract
    IERC20 public usdcToken;
    
    // Minimum stake amount (in USDC with 6 decimals)
    uint256 public minimumStakeAmount = 10 * 10**6; // 10 USDC
    
    // Lock period - time user must wait before unstaking (30 days)
    uint256 public lockPeriod = 30 days;
    
    // Staking thresholds for different ranks
    uint256 public bronzeThreshold = 10 * 10**6;    // 10 USDC
    uint256 public silverThreshold = 50 * 10**6;    // 50 USDC
    uint256 public goldThreshold = 100 * 10**6;     // 100 USDC
    uint256 public platinumThreshold = 250 * 10**6; // 250 USDC
    uint256 public diamondThreshold = 500 * 10**6;  // 500 USDC
    
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
    
    constructor(address _fastCredit, address _usdcToken) {
        fastCredit = FastCredit(_fastCredit);
        usdcToken = IERC20(_usdcToken);
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
     * @dev Stakes USDC to create a Credit Passport
     * @param amount Amount of USDC to stake
     * @param initialMetadataURI Initial metadata URI for new passport
     */
    function stake(uint256 amount, string memory initialMetadataURI) external nonReentrant {
        require(amount >= minimumStakeAmount, "Stake amount below minimum");
        require(fastCredit.getUserPassport(msg.sender) == 0, "User already has a passport");
        require(_stakes[msg.sender].amount == 0, "User has already staked");
        
        // Transfer USDC from user to contract
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update stake information
        _stakes[msg.sender] = StakeInfo({
            amount: amount,
            timestamp: block.timestamp,
            hasUnstaked: false
        });
        
        emit Staked(msg.sender, amount);
        
        // Determine initial rank based on stake amount
        FastCredit.Rank rank = determineRank(amount);
        
        // Create new passport with initial rank and no verified income
        uint256 newTokenId = fastCredit.createPassport(
            msg.sender,
            rank,
            amount,
            0, // No initial verified income
            initialMetadataURI
        );
        
        emit PassportCreated(msg.sender, newTokenId, rank);
    }
    
    /**
     * @dev Unstakes USDC after lock period
     */
    function unstake() external nonReentrant {
        StakeInfo storage userStake = _stakes[msg.sender];
        uint256 amount = userStake.amount;
        
        require(amount > 0, "No stake found");
        require(!userStake.hasUnstaked, "Already unstaked");
        require(block.timestamp >= userStake.timestamp + lockPeriod, "Lock period not complete");
        
        // Mark as unstaked first to prevent reentrancy
        userStake.hasUnstaked = true;
        
        // Transfer USDC back to user
        require(usdcToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
        
        // Note: Passport NFT is still owned by user but rank will not increase further
        // since the stake has been withdrawn
    }
    
    /**
     * @dev Gets stake information for a user
     * @param user Address of the user
     * @return amount Staked amount
     * @return timestamp Timestamp of stake
     * @return hasUnstaked Whether user has unstaked already
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount, 
        uint256 timestamp, 
        bool hasUnstaked
    ) {
        StakeInfo memory userStake = _stakes[user];
        return (userStake.amount, userStake.timestamp, userStake.hasUnstaked);
    }
} 