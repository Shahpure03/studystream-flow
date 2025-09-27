import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
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
import authService from "@/services/auth";
import apiService from "@/services/api";
import { FunFactBox } from "@/components/FunFactBox";
import { getRandomMascotFact,getRandomSubjectFact,FunFact } from "@/data/funFacts";
import MascotEasterEgg from './ui/mascot-easter-egg';
import SubjectFunFact from './ui/subject-fun-fact';
import './Dashboard.css';

interface User {
  id: string;
  username: string;
  gradeLevel: string;
  subjects: string[];
  isAuthenticated: boolean;
  joinedDate: string;
  currentStreak?: number;
  totalPoints?: number;
}

interface Recommendation {
  id: string;
  title: string;
  subject: string;
  duration: string;
  duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'video' | 'quiz' | 'reading';
  content_type: 'video' | 'quiz' | 'reading';
  thumbnail: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  completed: boolean;
  current_value: number;
  target_value: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [user,setUser] = useState<User | null>(null);
  const [currentStreak,setCurrentStreak] = useState(0);
  const [totalPoints,setTotalPoints] = useState(0);
  const [recommendations,setRecommendations] = useState<Recommendation[]>([]);
  const [dailyGoals,setDailyGoals] = useState<Goal[]>([]);
  const [achievements,setAchievements] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const { toast } = useToast();

  // Easter egg states
  const [mascotFact,setMascotFact] = useState<FunFact | null>(null);
  const [showMascotFact,setShowMascotFact] = useState(false);
  const [mascotCooldown,setMascotCooldown] = useState(false);
  const [subjectFact,setSubjectFact] = useState<FunFact | null>(null);
  const [showSubjectFact,setShowSubjectFact] = useState(false);
  const [activeSubject,setActiveSubject] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Check authentication
        if (!authService.isAuthenticated()) {
          window.location.href = "/";
          return;
        }

        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setCurrentStreak(currentUser?.currentStreak || 0);
        setTotalPoints(currentUser?.totalPoints || 0);

        // Load recommendations
        if (currentUser?.id) {
          const recsResponse = await apiService.getRecommendations(currentUser.id);
          setRecommendations(recsResponse.recommendations || []);

          // Load goals
          const goalsResponse = await apiService.getGoals(currentUser.id,'daily');
          setDailyGoals(goalsResponse.goals || []);

          // Load achievements
          const achievementsResponse = await apiService.getAchievements(currentUser.id);
          setAchievements(achievementsResponse.achievements || []);
        }
      } catch (error) {
        console.error('Error loading dashboard data:',error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  },[toast]);

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    window.location.href = "/";
  };

  // Mascot easter egg handler
  const handleMascotClick = () => {
    if (mascotCooldown) return;

    setMascotCooldown(true);
    const fact = getRandomMascotFact();
    setMascotFact(fact);
    setShowMascotFact(true);

    // Reset cooldown after 2 seconds
    setTimeout(() => {
      setMascotCooldown(false);
    },2000);
  };

  const handleMascotFactClose = () => {
    setShowMascotFact(false);
    setTimeout(() => setMascotFact(null),300);
  };

  // Subject easter egg handler
  const handleSubjectClick = (subject: string) => {
    // Close any existing subject fact
    if (showSubjectFact) {
      setShowSubjectFact(false);
      setTimeout(() => {
        const fact = getRandomSubjectFact(subject);
        if (fact) {
          setSubjectFact(fact);
          setActiveSubject(subject);
          setShowSubjectFact(true);
        }
      },150);
    } else {
      const fact = getRandomSubjectFact(subject);
      if (fact) {
        setSubjectFact(fact);
        setActiveSubject(subject);
        setShowSubjectFact(true);
      }
    }
  };

  const handleSubjectFactClose = () => {
    setShowSubjectFact(false);
    setTimeout(() => {
      setSubjectFact(null);
      setActiveSubject(null);
    },300);
  };

  // Handle content interaction
  const handleContentStart = async (contentId: string) => {
    try {
      if (user?.id) {
        await apiService.updateProgress(contentId,{
          userId: user.id,
          progressPercentage: 0,
          timeSpent: 0,
          completed: false
        });

        toast({
          title: "Content Started",
          description: "Your progress is being tracked!",
        });

        // Navigate to course detail page
        navigate(`/course/${contentId}`);
      }
    } catch (error) {
      console.error('Error starting content:',error);
    }
  };

  // Handle goal completion
  const handleGoalComplete = async (goalId: string) => {
    try {
      await apiService.updateGoal(goalId,{
        currentValue: 1,
        completed: true
      });

      // Refresh goals
      if (user?.id) {
        const goalsResponse = await apiService.getGoals(user.id,'daily');
        setDailyGoals(goalsResponse.goals || []);
      }

      toast({
        title: "Goal Completed!",
        description: "Great job! Keep up the good work!",
      });
    } catch (error) {
      console.error('Error completing goal:',error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero dashboard-container">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={handleMascotClick}
                  className="text-3xl hover:scale-110 transition-transform duration-200 cursor-pointer"
                  disabled={mascotCooldown}
                >
                  🎓
                </button>
                {mascotFact && (
                  <FunFactBox
                    fact={mascotFact}
                    isVisible={showMascotFact}
                    onClose={handleMascotFactClose}
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  EduLearn
                </h1>
                <div className="hidden sm:block text-muted-foreground text-sm">
                  Welcome back, {user.username}!
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-warning opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Flame className="h-5 w-5" />
                <span className="font-semibold">{currentStreak} day streak</span>
              </div>

              <div className="flex items-center gap-2 text-accent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Star className="h-5 w-5" />
                <span className="font-semibold">{totalPoints.toLocaleString()} pts</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
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
                  {recommendations.length > 0 ? recommendations.map((item) => (
                    <Card key={item.id} className="hover:shadow-elevated transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{item.thumbnail_url || "📚"}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                onClick={() => handleSubjectClick(item.subject)}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
                              >
                                <span>{item.subject}</span>
                                <span className="text-xs">✨</span>
                              </button>
                              {subjectFact && activeSubject === item.subject && (
                                <FunFactBox
                                  fact={subjectFact}
                                  isVisible={showSubjectFact}
                                  onClose={handleSubjectFactClose}
                                />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs px-2 py-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.duration_minutes} min
                                </Badge>
                                <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(item.difficulty)}`}>
                                  {item.difficulty}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleContentStart(item.id)}
                              >
                                {getTypeIcon(item.content_type)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recommendations available yet. Complete some content to get personalized suggestions!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Showcase */}
            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-warning" />
                    Recent Achievements
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/achievements')}
                  >
                    View All
                  </Button>
                </div>
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
                {dailyGoals.length > 0 ? dailyGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal.title}</span>
                      {goal.completed && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <Progress
                      value={(goal.current_value / goal.target_value) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {goal.current_value} / {goal.target_value} {goal.completed ? "✓ Complete" : ""}
                    </div>
                    {!goal.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleGoalComplete(goal.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No goals set yet</p>
                  </div>
                )}

                <Button
                  className="w-full mt-4 bg-gradient-learning"
                  onClick={() => navigate('/goals')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Manage Goals
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

      <footer className="dashboard-footer">
        <MascotEasterEgg />
      </footer>
    </div>
  );
}