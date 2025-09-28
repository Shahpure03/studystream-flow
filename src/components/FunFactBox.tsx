import { useState,useEffect } from "react";
import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X,Sparkles } from "lucide-react";
import { FunFact } from "@/data/funFacts";

interface FunFactBoxProps {
    fact: FunFact;
    isVisible: boolean;
    onClose: () => void;
}

export function FunFactBox({ fact,isVisible,onClose }: FunFactBoxProps) {
    const [isAnimating,setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false),300);
            return () => clearTimeout(timer);
        }
    },[isVisible]);

    if (!isVisible) return null;

    const getAnimationClasses = () => {
        return isAnimating ? "animate-slide-in-from-bottom" : "";
    };

    const getTypeIcon = () => {
        switch (fact.type) {
            case "joke":
                return "😄";
            case "fact":
                return "💡";
            case "riddle":
                return "🤔";
            default:
                return "✨";
        }
    };

    const getTypeColor = () => {
        switch (fact.type) {
            case "joke":
                return "border-yellow-200 bg-yellow-50";
            case "fact":
                return "border-blue-200 bg-blue-50";
            case "riddle":
                return "border-purple-200 bg-purple-50";
            default:
                return "border-primary/20 bg-primary/5";
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <Card className={`shadow-elevated border-2 ${getTypeColor()} min-w-64 max-w-80 ${getAnimationClasses()}`}>
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm">
                                {getTypeIcon()}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    {fact.type === "joke" ? "Joke" : fact.type === "fact" ? "Fun Fact" : "Riddle"}
                                </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                                {fact.content}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function LogoutButton() {
    const handleLogout = () => {
        // Add logout functionality here
        console.log("User logged out");
        // Redirect or clear session
    };

    return (
        <div className="absolute top-4 right-4">
            <Button
                variant="outline"
                onClick={handleLogout}
                className="text-sm font-semibold hover:bg-primary/10 hover:text-primary"
            >
                Logout
            </Button>
        </div>
    );
}
