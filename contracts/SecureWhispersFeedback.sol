// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecureWhispersFeedback is SepoliaConfig {
    using FHE for *;
    
    struct Feedback {
        euint32 feedbackId;
        euint32 authorId;
        euint32 contentHash;
        euint32 timestamp;
        ebool isEncrypted;
        address submitter;
        uint256 publicTimestamp;
    }
    
    struct User {
        euint32 userId;
        euint32 reputation;
        ebool isVerified;
        address walletAddress;
        uint256 registrationTime;
    }
    
    struct Proposal {
        euint32 proposalId;
        euint32 totalFeedback;
        euint32 averageRating;
        ebool isActive;
        address creator;
        uint256 creationTime;
        uint256 deadline;
    }
    
    mapping(uint256 => Feedback) public feedbacks;
    mapping(uint256 => User) public users;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public userAddressToId;
    mapping(address => uint256[]) public userFeedbacks;
    mapping(uint256 => uint256[]) public proposalFeedbacks;
    
    uint256 public feedbackCounter;
    uint256 public userCounter;
    uint256 public proposalCounter;
    
    address public owner;
    address public verifier;
    
    event FeedbackSubmitted(uint256 indexed feedbackId, uint256 indexed proposalId, address indexed submitter);
    event UserRegistered(uint256 indexed userId, address indexed walletAddress);
    event ProposalCreated(uint256 indexed proposalId, address indexed creator);
    event ProposalClosed(uint256 indexed proposalId, uint256 totalFeedback);
    event UserVerified(uint256 indexed userId, bool isVerified);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    function registerUser() public returns (uint256) {
        require(userAddressToId[msg.sender] == 0, "User already registered");
        
        uint256 userId = userCounter++;
        
        users[userId] = User({
            userId: FHE.asEuint32(0), // Will be set properly later
            reputation: FHE.asEuint32(100), // Initial reputation
            isVerified: FHE.asEbool(false),
            walletAddress: msg.sender,
            registrationTime: block.timestamp
        });
        
        userAddressToId[msg.sender] = userId;
        
        emit UserRegistered(userId, msg.sender);
        return userId;
    }
    
    function createProposal(uint256 _deadline) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        uint256 proposalId = proposalCounter++;
        
        proposals[proposalId] = Proposal({
            proposalId: FHE.asEuint32(0), // Will be set properly later
            totalFeedback: FHE.asEuint32(0),
            averageRating: FHE.asEuint32(0),
            isActive: FHE.asEbool(true),
            creator: msg.sender,
            creationTime: block.timestamp,
            deadline: _deadline
        });
        
        emit ProposalCreated(proposalId, msg.sender);
        return proposalId;
    }
    
    function submitFeedback(
        uint256 proposalId,
        externalEuint32 contentHash,
        externalEuint32 rating,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(proposals[proposalId].creator != address(0), "Proposal does not exist");
        require(block.timestamp <= proposals[proposalId].deadline, "Proposal deadline has passed");
        require(userAddressToId[msg.sender] != 0, "User must be registered");
        
        // Check if user already submitted feedback for this proposal
        uint256[] memory userFeedbackList = userFeedbacks[msg.sender];
        for (uint256 i = 0; i < userFeedbackList.length; i++) {
            require(feedbacks[userFeedbackList[i]].submitter != msg.sender || 
                    proposalFeedbacks[proposalId][i] != proposalId, 
                    "User already submitted feedback for this proposal");
        }
        
        uint256 feedbackId = feedbackCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalContentHash = FHE.fromExternal(contentHash, inputProof);
        euint32 internalRating = FHE.fromExternal(rating, inputProof);
        
        feedbacks[feedbackId] = Feedback({
            feedbackId: FHE.asEuint32(0), // Will be set properly later
            authorId: FHE.asEuint32(userAddressToId[msg.sender]),
            contentHash: internalContentHash,
            timestamp: FHE.asEuint32(block.timestamp),
            isEncrypted: FHE.asEbool(true),
            submitter: msg.sender,
            publicTimestamp: block.timestamp
        });
        
        // Update proposal statistics
        proposals[proposalId].totalFeedback = FHE.add(proposals[proposalId].totalFeedback, FHE.asEuint32(1));
        
        // Calculate new average rating (simplified - in practice would need more complex FHE operations)
        proposals[proposalId].averageRating = FHE.add(proposals[proposalId].averageRating, internalRating);
        
        // Update mappings
        userFeedbacks[msg.sender].push(feedbackId);
        proposalFeedbacks[proposalId].push(feedbackId);
        
        emit FeedbackSubmitted(feedbackId, proposalId, msg.sender);
        return feedbackId;
    }
    
    function closeProposal(uint256 proposalId) public {
        require(proposals[proposalId].creator == msg.sender, "Only proposal creator can close it");
        require(block.timestamp > proposals[proposalId].deadline, "Proposal deadline not reached");
        
        proposals[proposalId].isActive = FHE.asEbool(false);
        
        emit ProposalClosed(proposalId, proposalFeedbacks[proposalId].length);
    }
    
    function verifyUser(uint256 userId, bool isVerified) public onlyVerifier {
        require(users[userId].walletAddress != address(0), "User does not exist");
        
        users[userId].isVerified = FHE.asEbool(isVerified);
        
        emit UserVerified(userId, isVerified);
    }
    
    function updateUserReputation(uint256 userId, euint32 newReputation) public onlyVerifier {
        require(users[userId].walletAddress != address(0), "User does not exist");
        
        users[userId].reputation = newReputation;
    }
    
    function getProposalInfo(uint256 proposalId) public view returns (
        address creator,
        uint256 creationTime,
        uint256 deadline,
        bool isActive,
        uint256 feedbackCount
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.creator,
            proposal.creationTime,
            proposal.deadline,
            true, // FHE.decrypt(proposal.isActive) - will be decrypted off-chain
            proposalFeedbacks[proposalId].length
        );
    }
    
    function getFeedbackInfo(uint256 feedbackId) public view returns (
        address submitter,
        uint256 publicTimestamp,
        bool isEncrypted
    ) {
        Feedback storage feedback = feedbacks[feedbackId];
        return (
            feedback.submitter,
            feedback.publicTimestamp,
            true // FHE.decrypt(feedback.isEncrypted) - will be decrypted off-chain
        );
    }
    
    function getUserInfo(address userAddress) public view returns (
        uint256 userId,
        address walletAddress,
        uint256 registrationTime,
        uint256 feedbackCount
    ) {
        uint256 id = userAddressToId[userAddress];
        if (id == 0) {
            return (0, address(0), 0, 0);
        }
        
        return (
            id,
            users[id].walletAddress,
            users[id].registrationTime,
            userFeedbacks[userAddress].length
        );
    }
    
    function getUserFeedbacks(address userAddress) public view returns (uint256[] memory) {
        return userFeedbacks[userAddress];
    }
    
    function getProposalFeedbacks(uint256 proposalId) public view returns (uint256[] memory) {
        return proposalFeedbacks[proposalId];
    }
    
    function getEncryptedFeedbackData(uint256 feedbackId) public view returns (
        uint8 contentHash,
        uint8 rating,
        uint8 timestamp,
        uint8 authorId
    ) {
        // These values are encrypted and will be decrypted off-chain
        // In a real implementation, you would return the encrypted values
        return (0, 0, 0, 0);
    }
    
    function getEncryptedProposalStats(uint256 proposalId) public view returns (
        uint8 totalFeedback,
        uint8 averageRating
    ) {
        // These values are encrypted and will be decrypted off-chain
        return (0, 0);
    }
    
    function getEncryptedUserReputation(uint256 userId) public view returns (uint8) {
        // This value is encrypted and will be decrypted off-chain
        return 0;
    }
    
    // Emergency functions
    function setVerifier(address _verifier) public onlyOwner {
        verifier = _verifier;
    }
    
    function pauseContract() public onlyOwner {
        // In a real implementation, you would add a pause mechanism
        // This is a placeholder for emergency situations
    }
    
    function unpauseContract() public onlyOwner {
        // In a real implementation, you would add an unpause mechanism
        // This is a placeholder for emergency situations
    }
}
