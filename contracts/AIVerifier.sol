// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./FastCredit.sol";

/**
 * @title AIVerifier
 * @dev Handles verification of user income data through an oracle pattern
 */
contract AIVerifier is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    // Reference to the FastCredit NFT
    FastCredit public fastCredit;
    
    // Verification request structure
    struct VerificationRequest {
        address user;
        uint256 requestId;
        string dataReference;
        bool isProcessed;
        uint256 timestamp;
        uint256 verifiedIncome;
    }
    
    // Mapping from request ID to verification request
    mapping(uint256 => VerificationRequest) private _requests;
    
    // Counter for request IDs
    uint256 private _requestIdCounter;
    
    // Income thresholds for rank boosts
    uint256 public bronzeIncomeThreshold = 1000 * 10**6;    // $1,000
    uint256 public silverIncomeThreshold = 5000 * 10**6;    // $5,000
    uint256 public goldIncomeThreshold = 10000 * 10**6;     // $10,000
    uint256 public platinumIncomeThreshold = 25000 * 10**6; // $25,000
    uint256 public diamondIncomeThreshold = 50000 * 10**6;  // $50,000
    
    // Events
    event VerificationRequested(uint256 indexed requestId, address indexed user, string dataReference);
    event VerificationCompleted(uint256 indexed requestId, address indexed user, uint256 verifiedIncome, bool success);
    
    constructor(address _fastCredit) {
        fastCredit = FastCredit(_fastCredit);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }
    
    /**
     * @dev Sets income thresholds for ranks
     */
    function setIncomeThresholds(
        uint256 bronze,
        uint256 silver,
        uint256 gold,
        uint256 platinum,
        uint256 diamond
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bronzeIncomeThreshold = bronze;
        silverIncomeThreshold = silver;
        goldIncomeThreshold = gold;
        platinumIncomeThreshold = platinum;
        diamondIncomeThreshold = diamond;
    }
    
    /**
     * @dev Requests verification of income data
     * @param dataReference Reference to data (IPFS hash or other identifier)
     */
    function requestVerification(string memory dataReference) external returns (uint256) {
        require(fastCredit.getUserPassport(msg.sender) > 0, "You must have a passport first");
        
        _requestIdCounter++;
        
        _requests[_requestIdCounter] = VerificationRequest({
            user: msg.sender,
            requestId: _requestIdCounter,
            dataReference: dataReference,
            isProcessed: false,
            timestamp: block.timestamp,
            verifiedIncome: 0
        });
        
        emit VerificationRequested(_requestIdCounter, msg.sender, dataReference);
        
        return _requestIdCounter;
    }
    
    /**
     * @dev Called by the oracle to fulfill verification requests
     * @param requestId ID of the verification request
     * @param verifiedIncome Verified income amount from analysis
     * @param success Whether the verification was successful
     * @param metadataUri Updated metadata URI for the passport
     */
    function fulfillVerification(
        uint256 requestId,
        uint256 verifiedIncome,
        bool success,
        string memory metadataUri
    ) external onlyRole(ORACLE_ROLE) {
        VerificationRequest storage request = _requests[requestId];
        require(request.user != address(0), "Request does not exist");
        require(!request.isProcessed, "Request already processed");
        
        request.isProcessed = true;
        
        if (success) {
            request.verifiedIncome = verifiedIncome;
            
            // Update the user's passport with the new verified income
            uint256 passportId = fastCredit.getUserPassport(request.user);
            
            if (passportId > 0) {
                (
                    FastCredit.Rank currentRank, 
                    uint256 stakeAmount, 
                    uint256 currentIncome
                ) = fastCredit.getPassportInfo(passportId);
                
                uint256 totalIncome = currentIncome + verifiedIncome;
                
                // Determine new rank based on total verified income
                FastCredit.Rank newRank = determineRank(
                    currentRank,
                    stakeAmount,
                    totalIncome
                );
                
                // Update passport
                fastCredit.updatePassport(
                    passportId, 
                    newRank, 
                    verifiedIncome, 
                    metadataUri
                );
            }
        }
        
        emit VerificationCompleted(requestId, request.user, verifiedIncome, success);
    }
    
    /**
     * @dev Determines rank based on stake amount and income
     * @param currentRank Current rank of the passport
     * @param stakeAmount Amount staked
     * @param totalIncome Total verified income
     * @return newRank The new rank
     */
    function determineRank(
        FastCredit.Rank currentRank,
        uint256 stakeAmount,
        uint256 totalIncome
    ) public view returns (FastCredit.Rank) {
        // The basic principle: rank can increase based on either stake or income
        // but never decrease
        
        // Determine rank based on income
        FastCredit.Rank incomeRank;
        if (totalIncome >= diamondIncomeThreshold) {
            incomeRank = FastCredit.Rank.DIAMOND;
        } else if (totalIncome >= platinumIncomeThreshold) {
            incomeRank = FastCredit.Rank.PLATINUM;
        } else if (totalIncome >= goldIncomeThreshold) {
            incomeRank = FastCredit.Rank.GOLD;
        } else if (totalIncome >= silverIncomeThreshold) {
            incomeRank = FastCredit.Rank.SILVER;
        } else if (totalIncome >= bronzeIncomeThreshold) {
            incomeRank = FastCredit.Rank.BRONZE;
        } else {
            incomeRank = FastCredit.Rank.NONE;
        }
        
        // Return the highest rank between current, income-based, and stake-based
        if (uint(currentRank) >= uint(incomeRank)) {
            return currentRank; // Keep current rank if it's higher
        } else {
            return incomeRank; // Otherwise use income-based rank
        }
    }
    
    /**
     * @dev Gets details of a verification request
     * @param requestId ID of the verification request
     */
    function getRequestDetails(uint256 requestId) external view returns (
        address user,
        string memory dataReference,
        bool isProcessed,
        uint256 timestamp,
        uint256 verifiedIncome
    ) {
        VerificationRequest storage request = _requests[requestId];
        require(request.user != address(0), "Request does not exist");
        
        return (
            request.user,
            request.dataReference,
            request.isProcessed,
            request.timestamp,
            request.verifiedIncome
        );
    }
} 