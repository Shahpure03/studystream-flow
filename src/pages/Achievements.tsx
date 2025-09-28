import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    Trophy,
    Star,
    Award,
    Flame,
    Target,
    BookOpen,
    CheckCircle,
    Crown,
    Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mockService from "@/services/mockService";
import { Achievement } from "@/data/mockData";

interface AchievementCategory {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    achievements: Achievement[];
}

export default function Achievements() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [achievements,setAchievements] = useState<Achievement[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [selectedCategory,setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        const loadAchievements = async () => {
            try {
                const result = await mockService.getAchievements('user-1');
                setAchievements(result.achievements);
            } catch (error) {
                console.error('Error loading achievements:',error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAchievements();
    },[]);

    const achievementCategories: AchievementCategory[] = [
        {
            id: 'learning',
            name: 'Learning',
            description: 'Master new skills and knowledge',
            icon: <BookOpen className="h-5 w-5" />,
            color: 'text-blue-600',
            achievements: achievements.filter(a => a.title.includes('Quiz') || a.title.includes('Course'))
        },
        {
            id: 'streak',
            name: 'Streak',
            description: 'Maintain consistent learning habits',
            icon: <Flame className="h-5 w-5" />,
            color: 'text-orange-600',
            achievements: achievements.filter(a => a.title.includes('Streak'))
        },
        {
            id: 'points',
            name: 'Points',
            description: 'Earn points through activities',
            icon: <Star className="h-5 w-5" />,
            color: 'text-yellow-600',
            achievements: achievements.filter(a => a.title.includes('Point'))
        },
        {
            id: 'special',
            name: 'Special',
            description: 'Unique and rare achievements',
            icon: <Crown className="h-5 w-5" />,
            color: 'text-purple-600',
            achievements: achievements.filter(a => !a.title.includes('Quiz') && !a.title.includes('Streak') && !a.title.includes('Point'))
        }
    ];

    const getAchievementIcon = (title: string) => {
        if (title.includes('Quiz')) return <CheckCircle className="h-6 w-6" />;
        if (title.includes('Streak')) return <Flame className="h-6 w-6" />;
        if (title.includes('Point')) return <Star className="h-6 w-6" />;
        return <Award className="h-6 w-6" />;
    };

    const getAchievementColor = (title: string) => {
        if (title.includes('Quiz')) return 'text-green-600';
        if (title.includes('Streak')) return 'text-orange-600';
        if (title.includes('Point')) return 'text-yellow-600';
        return 'text-purple-600';
    };

    const getTotalPoints = () => {
        return achievements.reduce((total,achievement) => total + achievement.points_awarded,0);
    };

    const getCompletionRate = () => {
        // Simulate completion rate based on achievements earned
        return Math.min(achievements.length * 25,100);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading achievements...</p>
                </div>
            </div>
        );
    }

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievementCategories.find(cat => cat.id === selectedCategory)?.achievements || [];

    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* Header */}
            <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/dashboard')}
                                className="mr-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <h1 className="text-xl font-semibold">Achievements</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-warning">
                                <Star className="h-5 w-5" />
                                <span className="font-semibold">{getTotalPoints()} pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    <Trophy className="h-4 w-4 mr-2" />
                                    All Achievements ({achievements.length})
                                </Button>
                                {achievementCategories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? 'default' : 'ghost'}
                                        className="w-full justify-start"
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        <span className={category.color}>{category.icon}</span>
                                        <span className="ml-2">{category.name}</span>
                                        <Badge variant="secondary" className="ml-auto">
                                            {category.achievements.length}
                                        </Badge>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Progress Overview */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Overall Progress</span>
                                        <span className="text-sm font-semibold">{getCompletionRate()}%</span>
                                    </div>
                                    <Progress value={getCompletionRate()} className="h-2" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Total Points</span>
                                        <span className="font-semibold text-warning">{getTotalPoints()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Achievements Earned</span>
                                        <span className="font-semibold text-success">{achievements.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Current Streak</span>
                                        <span className="font-semibold text-primary">7 days</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Achievements Grid */}
                    <div className="lg:col-span-3">
                        {filteredAchievements.length === 0 ? (
                            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                                <CardContent className="text-center py-12">
                                    <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start learning to unlock your first achievement!
                                    </p>
                                    <Button
                                        onClick={() => navigate('/dashboard')}
                                        className="bg-gradient-primary hover:opacity-90"
                                    >
                                        Start Learning
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAchievements.map((achievement) => (
                                    <Card key={achievement.id} className="shadow-card border-0 bg-card/95 backdrop-blur-sm hover:shadow-elevated transition-all duration-300">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-3 rounded-full bg-muted/50 ${getAchievementColor(achievement.title)}`}>
                                                        {getAchievementIcon(achievement.title)}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                                                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-success text-success-foreground">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Earned
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Points Awarded</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 text-warning" />
                                                        <span className="font-semibold">{achievement.points_awarded}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Earned On</span>
                                                    <span className="text-sm font-medium">
                                                        {new Date(achievement.earned_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="pt-2 border-t">
                                                    <div className="flex items-center gap-2 text-success">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Achievement Unlocked!</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Upcoming Achievements */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm mt-8">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Upcoming Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="p-2 rounded-full bg-muted">
                                            <Zap className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Speed Learner</div>
                                            <div className="text-xs text-muted-foreground">Complete 3 courses in one day</div>
                                        </div>
                                        <Badge variant="outline">Locked</Badge>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="p-2 rounded-full bg-muted">
                                            <Crown className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Knowledge Master</div>
                                            <div className="text-xs text-muted-foreground">Earn 5,000 total points</div>
                                        </div>
                                        <Badge variant="outline">Locked</Badge>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="p-2 rounded-full bg-muted">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Subject Expert</div>
                                            <div className="text-xs text-muted-foreground">Master all subjects</div>
                                        </div>
                                        <Badge variant="outline">Locked</Badge>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="p-2 rounded-full bg-muted">
                                            <Flame className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Streak Legend</div>
                                            <div className="text-xs text-muted-foreground">30 day learning streak</div>
                                        </div>
                                        <Badge variant="outline">Locked</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
