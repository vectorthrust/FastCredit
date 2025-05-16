// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FastCredit
 * @dev NFT representing a user's financial identity and rank
 */
contract FastCredit is ERC721URIStorage, AccessControl, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Rank system instead of numerical credit score
    enum Rank { NONE, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND }
    
    // Role for minting and updating passports
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Mapping from token ID to rank
    mapping(uint256 => Rank) private _passportRanks;
    
    // Mapping from token ID to total verified income
    mapping(uint256 => uint256) private _verifiedIncomes;
    
    // Mapping from user address to token ID
    mapping(address => uint256) private _userPassports;
    
    // Mapping from token ID to original stake amount
    mapping(uint256 => uint256) private _stakeAmounts;

    // Mapping to track if token ID exists
    mapping(uint256 => bool) private _tokenExists;
    
    // Emitted when a credit passport is updated
    event PassportUpdated(uint256 indexed tokenId, Rank newRank, uint256 newTotalIncome);
    
    constructor() ERC721("FastCredit", "FCRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _transferOwnership(msg.sender);
    }
    
    /**
     * @dev Creates a new credit passport
     * @param user Address of the passport owner
     * @param initialRank Initial rank
     * @param stakeAmount Amount of USDC staked
     * @param initialIncome Initial verified income amount
     * @param uri Metadata URI for the NFT
     * @return tokenId The ID of the newly created passport
     */
    function createPassport(
        address user,
        Rank initialRank,
        uint256 stakeAmount,
        uint256 initialIncome,
        string memory uri
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        // require(_userPassports[user] == 0, "User already has a credit passport");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(user, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        _passportRanks[newTokenId] = initialRank;
        _stakeAmounts[newTokenId] = stakeAmount;
        _verifiedIncomes[newTokenId] = initialIncome;
        _userPassports[user] = newTokenId;
        _tokenExists[newTokenId] = true;
        
        emit PassportUpdated(newTokenId, initialRank, initialIncome);
        
        return newTokenId;
    }
    
    /**
     * @dev Updates an existing credit passport with new verified income and rank
     * @param tokenId ID of the passport to update
     * @param newRank Updated rank
     * @param additionalIncome Additional verified income to add
     * @param newUri Updated metadata URI
     */
    function updatePassport(
        uint256 tokenId,
        Rank newRank,
        uint256 additionalIncome,
        string memory newUri
    ) public onlyRole(MINTER_ROLE) {
        require(_tokenExists[tokenId], "Passport does not exist");
        
        _passportRanks[tokenId] = newRank;
        _verifiedIncomes[tokenId] += additionalIncome;
        _setTokenURI(tokenId, newUri);
        
        emit PassportUpdated(tokenId, newRank, _verifiedIncomes[tokenId]);
    }
    
    /**
     * @dev Returns passport information
     * @param tokenId ID of the passport
     * @return rank Current rank
     * @return stakeAmount Original stake amount
     * @return verifiedIncome Total verified income
     */
    function getPassportInfo(uint256 tokenId) public view returns (
        Rank rank, 
        uint256 stakeAmount, 
        uint256 verifiedIncome
    ) {
        require(_tokenExists[tokenId], "Passport does not exist");
        return (
            _passportRanks[tokenId], 
            _stakeAmounts[tokenId], 
            _verifiedIncomes[tokenId]
        );
    }
    
    /**
     * @dev Returns a user's passport token ID
     * @param user Address of the user
     * @return tokenId User's passport token ID (0 if none exists)
     */
    function getUserPassport(address user) public view returns (uint256) {
        return _userPassports[user];
    }
    
    /**
     * @dev Returns the rank of a passport
     * @param tokenId ID of the passport
     * @return rank Passport rank
     */
    function getPassportRank(uint256 tokenId) public view returns (Rank) {
        require(_tokenExists[tokenId], "Passport does not exist");
        return _passportRanks[tokenId];
    }

    /**
     * @dev Returns rank as a string
     * @param rank The rank enum value
     * @return rankStr The rank as a string
     */
    function rankToString(Rank rank) public pure returns (string memory) {
        if (rank == Rank.BRONZE) return "BRONZE";
        if (rank == Rank.SILVER) return "SILVER";
        if (rank == Rank.GOLD) return "GOLD";
        if (rank == Rank.PLATINUM) return "PLATINUM";
        if (rank == Rank.DIAMOND) return "DIAMOND";
        return "NONE";
    }
    
    /**
     * @dev Required override for OpenZeppelin contracts
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 