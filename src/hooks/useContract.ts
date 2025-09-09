import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { CONTRACT_CONFIG } from '@/lib/contract-abi';
import { useCallback } from 'react';

export const useSecureWhispersContract = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();
  const { toast } = useToast();

  // Register user
  const registerUser = useCallback(async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register",
        variant: "destructive"
      });
      return;
    }

    try {
      await writeContract({
        address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'registerUser',
      });

      toast({
        title: "User Registered",
        description: "You have been successfully registered",
      });
    } catch (err) {
      console.error('Registration error:', err);
      toast({
        title: "Registration Failed",
        description: "Failed to register user. Please try again.",
        variant: "destructive"
      });
    }
  }, [isConnected, writeContract, toast]);

  // Create proposal
  const createProposal = useCallback(async (deadline: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a proposal",
        variant: "destructive"
      });
      return;
    }

    try {
      await writeContract({
        address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'createProposal',
        args: [BigInt(deadline)],
      });

      toast({
        title: "Proposal Created",
        description: "Your proposal has been created successfully",
      });
    } catch (err) {
      console.error('Proposal creation error:', err);
      toast({
        title: "Proposal Creation Failed",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive"
      });
    }
  }, [isConnected, writeContract, toast]);

  // Submit feedback (simplified version without FHE for now)
  const submitFeedback = useCallback(async (
    proposalId: number,
    contentHash: string,
    rating: number
  ) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit feedback",
        variant: "destructive"
      });
      return;
    }

    try {
      // For now, we'll use a simplified version without FHE encryption
      // In a real implementation, you would encrypt the data using FHE
      const mockContentHash = "0x" + contentHash.padStart(64, '0');
      const mockRating = "0x" + rating.toString(16).padStart(64, '0');
      const mockProof = "0x" + "0".repeat(128);

      await writeContract({
        address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'submitFeedback',
        args: [
          BigInt(proposalId),
          mockContentHash as `0x${string}`,
          mockRating as `0x${string}`,
          mockProof as `0x${string}`
        ],
      });

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been submitted successfully",
      });
    } catch (err) {
      console.error('Feedback submission error:', err);
      toast({
        title: "Feedback Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  }, [isConnected, writeContract, toast]);

  // Close proposal
  const closeProposal = useCallback(async (proposalId: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to close the proposal",
        variant: "destructive"
      });
      return;
    }

    try {
      await writeContract({
        address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'closeProposal',
        args: [BigInt(proposalId)],
      });

      toast({
        title: "Proposal Closed",
        description: "The proposal has been closed successfully",
      });
    } catch (err) {
      console.error('Proposal closing error:', err);
      toast({
        title: "Proposal Closing Failed",
        description: "Failed to close proposal. Please try again.",
        variant: "destructive"
      });
    }
  }, [isConnected, writeContract, toast]);

  return {
    registerUser,
    createProposal,
    submitFeedback,
    closeProposal,
    isPending,
    error,
    isConnected,
    address,
  };
};

// Hook for reading contract data
export const useContractData = () => {
  const { address } = useAccount();

  // Get user info
  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get user feedbacks
  const { data: userFeedbacks, refetch: refetchUserFeedbacks } = useReadContract({
    address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getUserFeedbacks',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get proposal info
  const getProposalInfo = useCallback((proposalId: number) => {
    return useReadContract({
      address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getProposalInfo',
      args: [BigInt(proposalId)],
    });
  }, []);

  // Get proposal feedbacks
  const getProposalFeedbacks = useCallback((proposalId: number) => {
    return useReadContract({
      address: CONTRACT_CONFIG.addresses.sepolia as `0x${string}`,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getProposalFeedbacks',
      args: [BigInt(proposalId)],
    });
  }, []);

  return {
    userInfo,
    userFeedbacks,
    getProposalInfo,
    getProposalFeedbacks,
    refetchUserInfo,
    refetchUserFeedbacks,
  };
};
