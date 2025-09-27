import { useState,useEffect } from "react";
import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X,Sparkles } from "lucide-react";
import { FunFact } from "@/data/funFacts";

interface FunFactBoxProps {
    fact: FunFact;
    isVisible: boolean;
    onClose: () => void;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function FunFactBox({ fact,isVisible,onClose,position = 'top' }: FunFactBoxProps) {
    const [isAnimating,setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false),300);
            return () => clearTimeout(timer);
        }
    },[isVisible]);

    if (!isVisible) return null;

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            case 'bottom':
                return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
            default:
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
        }
    };

    const getAnimationClasses = () => {
        if (isAnimating) {
            switch (position) {
                case 'top':
                    return 'animate-slide-in-from-bottom';
                case 'bottom':
                    return 'animate-slide-in-from-top';
                case 'left':
                    return 'animate-slide-in-from-right';
                case 'right':
                    return 'animate-slide-in-from-left';
                default:
                    return 'animate-slide-in-from-bottom';
            }
        }
        return '';
    };

    const getTypeIcon = () => {
        switch (fact.type) {
            case 'joke':
                return '😄';
            case 'fact':
                return '💡';
            case 'riddle':
                return '🤔';
            default:
                return '✨';
        }
    };

    const getTypeColor = () => {
        switch (fact.type) {
            case 'joke':
                return 'border-yellow-200 bg-yellow-50';
            case 'fact':
                return 'border-blue-200 bg-blue-50';
            case 'riddle':
                return 'border-purple-200 bg-purple-50';
            default:
                return 'border-primary/20 bg-primary/5';
        }
    };

    return (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
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
                                    {fact.type === 'joke' ? 'Joke' : fact.type === 'fact' ? 'Fun Fact' : 'Riddle'}
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
