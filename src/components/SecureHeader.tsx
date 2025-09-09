import { Shield, MessageCircle } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

const SecureHeader = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-header py-8 px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_25%_25%,white_0.5px,transparent_0.5px)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Wallet connection in top right */}
      <div className="absolute top-6 right-6 z-10">
        <WalletConnect />
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Speech bubble container */}
        <div className="inline-block relative">
          {/* Main speech bubble */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-secure border border-white/30 relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/20 border-r border-b border-white/30 rotate-45 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-white" />
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Confidential Proposal Feedback
            </h1>
            
            <p className="text-white/90 font-medium">
              🔐 Feedback encrypted by FHE
            </p>
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="mt-8 text-white/80 max-w-2xl mx-auto">
          Share your thoughts securely. All feedback is encrypted using Fully Homomorphic Encryption 
          to ensure complete confidentiality while enabling meaningful analysis.
        </p>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full blur-xl animate-pulse delay-300"></div>
    </header>
  );
};

export default SecureHeader;