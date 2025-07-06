import { Activity } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex items-center justify-center h-64 sm:h-96">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-500/20 border-t-blue-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}