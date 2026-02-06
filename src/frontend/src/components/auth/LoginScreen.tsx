import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, PieChart, Shield } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        // Handle edge case
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen max-w-md">
        {/* App Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
            <img 
              src="/assets/generated/app-icon.dim_512x512.png" 
              alt="Monthly Payment Tracker" 
              className="w-20 h-20 rounded-2xl"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          Monthly Payment Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
          Track your income and expenses with ease
        </p>

        {/* Features */}
        <div className="w-full space-y-4 mb-12">
          <FeatureItem 
            icon={<Wallet className="w-5 h-5" />}
            title="Manual Entry"
            description="Safely track transactions without bank connections"
          />
          <FeatureItem 
            icon={<PieChart className="w-5 h-5" />}
            title="Visual Insights"
            description="See your monthly income vs expenses at a glance"
          />
          <FeatureItem 
            icon={<Shield className="w-5 h-5" />}
            title="Secure & Private"
            description="Your data stays private with Internet Identity"
          />
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={isLoggingIn}
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
        >
          {isLoggingIn ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Connecting...
            </>
          ) : (
            'Get Started'
          )}
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          Secure authentication powered by Internet Identity
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}
