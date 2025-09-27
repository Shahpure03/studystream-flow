import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import learningHero from "@/assets/learning-hero.jpg";

export function AuthLayout() {
  const [isSignup, setIsSignup] = useState(false);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-muted/50"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              EduLearn
            </h1>
            <p className="text-muted-foreground text-lg">
              Your personalized learning journey starts here
            </p>
          </div>

          <div className="relative">
            {!isSignup ? (
              <div key="login" className="animate-fade-in">
                <LoginForm onToggleForm={toggleForm} />
              </div>
            ) : (
              <div key="signup" className="animate-slide-in">
                <SignupForm onToggleForm={toggleForm} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="flex-1 relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-secondary/20"></div>
        <img
          src={learningHero}
          alt="Students learning together"
          className="w-full h-full object-cover"
        />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-card animate-bounce-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-primary font-semibold">📚 Interactive Lessons</div>
          <div className="text-sm text-muted-foreground">Learn at your own pace</div>
        </div>
        
        <div className="absolute bottom-1/3 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-card animate-bounce-in" style={{ animationDelay: '1s' }}>
          <div className="text-secondary font-semibold">🎯 Smart Goals</div>
          <div className="text-sm text-muted-foreground">Track your progress</div>
        </div>
        
        <div className="absolute top-1/2 right-1/4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-card animate-bounce-in" style={{ animationDelay: '1.5s' }}>
          <div className="text-accent font-semibold">🏆 Achievements</div>
          <div className="text-sm text-muted-foreground">Earn badges & rewards</div>
        </div>
      </div>
    </div>
  );
}