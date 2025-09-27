import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Star, 
  Play, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Award,
  Flame,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  gradeLevel: string;
  subjects: string[];
  isAuthenticated: boolean;
  joinedDate: string;
}

interface Recommendation {
  id: string;
  title: string;
  subject: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'video' | 'quiz' | 'reading';
  thumbnail: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  completed: boolean;
}

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1250);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    window.location.href = "/";
  };

  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Introduction to Algebra",
      subject: "Mathematics",
      duration: "15 min",
      difficulty: "Beginner",
      type: "video",
      thumbnail: "📊"
    },
    {
      id: "2", 
      title: "Chemical Reactions Quiz",
      subject: "Science",
      duration: "10 min",
      difficulty: "Intermediate",
      type: "quiz",
      thumbnail: "🔬"
    },
    {
      id: "3",
      title: "Essay Writing Techniques",
      subject: "English",
      duration: "20 min", 
      difficulty: "Intermediate",
      type: "reading",
      thumbnail: "📝"
    },
    {
      id: "4",
      title: "World War II Timeline",
      subject: "History",
      duration: "12 min",
      difficulty: "Beginner",
      type: "video",
      thumbnail: "🏛️"
    }
  ];

  const dailyGoals: Goal[] = [
    {
      id: "1",
      title: "Watch 2 educational videos",
      progress: 1,
      target: 2,
      completed: false
    },
    {
      id: "2",
      title: "Complete 1 quiz",
      progress: 1,
      target: 1,
      completed: true
    },
    {
      id: "3",
      title: "Read for 30 minutes",
      progress: 20,
      target: 30,
      completed: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success text-success-foreground';
      case 'Intermediate': return 'bg-warning text-warning-foreground';
      case 'Advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'quiz': return <CheckCircle className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EduLearn
              </h1>
              <div className="hidden sm:block text-muted-foreground">
                Welcome back, {user.username}!
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-warning">
                <Flame className="h-5 w-5" />
                <span className="font-semibold">{currentStreak} day streak</span>
              </div>
              
              <div className="flex items-center gap-2 text-accent">
                <Star className="h-5 w-5" />
                <span className="font-semibold">{totalPoints.toLocaleString()} pts</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Smart Recommendations */}
            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recommended for You
                </CardTitle>
                <p className="text-muted-foreground">
                  Personalized content based on your interests and progress
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((item) => (
                    <Card key={item.id} className="hover:shadow-elevated transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{item.thumbnail}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">
                              {item.subject}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs px-2 py-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.duration}
                                </Badge>
                                <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(item.difficulty)}`}>
                                  {item.difficulty}
                                </Badge>
                              </div>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                {getTypeIcon(item.type)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Showcase */}
            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-success-light rounded-lg">
                    <Award className="h-8 w-8 text-success" />
                    <div>
                      <div className="font-semibold text-success">Quiz Master</div>
                      <div className="text-xs text-success/80">Completed 5 quizzes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-accent-light rounded-lg">
                    <Flame className="h-8 w-8 text-accent" />
                    <div>
                      <div className="font-semibold text-accent">Streak Hero</div>
                      <div className="text-xs text-accent/80">7 day learning streak</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-warning-light rounded-lg">
                    <Star className="h-8 w-8 text-warning" />
                    <div>
                      <div className="font-semibold text-warning">Point Collector</div>
                      <div className="text-xs text-warning/80">1,000+ points earned</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goals */}
            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal.title}</span>
                      {goal.completed && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <Progress 
                      value={(goal.progress / goal.target) * 100} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {goal.progress} / {goal.target} {goal.completed ? "✓ Complete" : ""}
                    </div>
                  </div>
                ))}
                
                <Button className="w-full mt-4 bg-gradient-learning">
                  Set New Goals
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lessons Completed</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quizzes Passed</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Study Time</span>
                  <span className="font-semibold">8.5 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Grade Level</span>
                  <Badge variant="outline">{user.gradeLevel}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}