import Lottie from "react-lottie";
import loadingAnimation from "../assets/json/loading-animation.json";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center z-50">
      {/* Main Loading Container */}
      <div className="flex flex-col items-center justify-center max-w-md w-full px-4">
        
        {/* Lottie Animation Container */}
        <div className="relative mb-8">
          <div className="w-48 h-48 md:w-64 md:h-64">
            <Lottie
              options={defaultOptions}
              height="100%"
              width="100%"
            />
          </div>
          
          {/* Animated Pulse Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-blue-200 animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ClubSphere
          </h2>
          
          <div className="space-y-2">
            <p className="text-gray-600 text-lg font-medium">
              Loding...
            </p>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Your club is getting ready.
            </p>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="mt-8 w-full max-w-xs">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-[loadingBar_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Loading Dots Animation */}
        <div className="mt-6 flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Optional: Loading Stats */}
        <div className="mt-8 flex justify-center space-x-6 text-sm text-gray-500">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 animate-pulse">
              •••
            </div>
            <div>Member connection</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-indigo-600 animate-pulse">
              •••
            </div>
            <div>Event Loading</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 animate-pulse">
              •••
            </div>
            <div>Data sync</div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute bottom-10 text-center text-gray-400 text-sm">
        <p>Wait a moment...</p>
      </div>
    </div>
  );
};

export default Loading;