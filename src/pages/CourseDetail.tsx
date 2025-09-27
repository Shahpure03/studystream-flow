import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Play,
    Clock,
    BookOpen,
    CheckCircle,
    Star,
    Target,
    Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mockService from "@/services/mockService";
import { Content } from "@/data/mockData";

export default function CourseDetail() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [course,setCourse] = useState<Content | null>(null);
    const [progress,setProgress] = useState(0);
    const [isCompleted,setIsCompleted] = useState(false);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                // Simulate loading course data
                const result = await mockService.getContent();
                const foundCourse = result.content.find(c => c.id === courseId);

                if (foundCourse) {
                    setCourse(foundCourse);
                    // Simulate some progress
                    setProgress(Math.floor(Math.random() * 100));
                    setIsCompleted(progress >= 100);
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error loading course:',error);
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        loadCourse();
    },[courseId,navigate,progress]);

    const handleStartCourse = () => {
        toast({
            title: "Course Started!",
            description: "Your progress is being tracked. Good luck!",
        });
        setProgress(prev => Math.min(prev + 10,100));
    };

    const handleCompleteCourse = () => {
        setIsCompleted(true);
        setProgress(100);
        toast({
            title: "Congratulations!",
            description: "You've completed this course!",
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Play className="h-5 w-5" />;
            case 'quiz': return <CheckCircle className="h-5 w-5" />;
            case 'reading': return <BookOpen className="h-5 w-5" />;
            default: return <BookOpen className="h-5 w-5" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
                    <Button onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* Header */}
            <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-xl font-semibold">{course.title}</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Header */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-4xl">{course.thumbnail_url}</div>
                                            <div>
                                                <CardTitle className="text-2xl">{course.title}</CardTitle>
                                                <p className="text-muted-foreground">{course.subject}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <Badge className={getDifficultyColor(course.difficulty)}>
                                                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{course.duration_minutes} min</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                {getTypeIcon(course.content_type)}
                                                <span>{course.content_type.charAt(0).toUpperCase() + course.content_type.slice(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-6">{course.description}</p>

                                {/* Progress Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Progress</span>
                                        <span className="text-sm text-muted-foreground">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />

                                    {!isCompleted ? (
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleStartCourse}
                                                className="bg-gradient-primary hover:opacity-90"
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                {progress === 0 ? 'Start Course' : 'Continue Learning'}
                                            </Button>
                                            {progress >= 80 && (
                                                <Button
                                                    onClick={handleCompleteCourse}
                                                    variant="outline"
                                                    className="border-success text-success hover:bg-success hover:text-success-foreground"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark Complete
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-success">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-semibold">Course Completed!</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Content Simulation */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Course Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold">1</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Introduction</h4>
                                            <p className="text-sm text-muted-foreground">Overview and learning objectives</p>
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-success" />
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold">2</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Main Concepts</h4>
                                            <p className="text-sm text-muted-foreground">Core topics and key principles</p>
                                        </div>
                                        {progress >= 50 ? (
                                            <CheckCircle className="h-5 w-5 text-success" />
                                        ) : (
                                            <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold">3</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Practice Exercises</h4>
                                            <p className="text-sm text-muted-foreground">Hands-on activities and examples</p>
                                        </div>
                                        {progress >= 80 ? (
                                            <CheckCircle className="h-5 w-5 text-success" />
                                        ) : (
                                            <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold">4</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Assessment</h4>
                                            <p className="text-sm text-muted-foreground">Test your knowledge</p>
                                        </div>
                                        {isCompleted ? (
                                            <CheckCircle className="h-5 w-5 text-success" />
                                        ) : (
                                            <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Info */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Course Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Duration</span>
                                    <span className="font-semibold">{course.duration_minutes} min</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Difficulty</span>
                                    <Badge className={getDifficultyColor(course.difficulty)}>
                                        {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Type</span>
                                    <span className="font-semibold capitalize">{course.content_type}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Subject</span>
                                    <span className="font-semibold">{course.subject}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Learning Objectives */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Learning Objectives</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Understand the fundamental concepts</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Apply knowledge through practice</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Demonstrate mastery through assessment</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-warning" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Star className="h-5 w-5 text-warning" />
                                        <div>
                                            <div className="font-medium text-sm">First Steps</div>
                                            <div className="text-xs text-muted-foreground">Start your first lesson</div>
                                        </div>
                                        {progress > 0 && <CheckCircle className="h-4 w-4 text-success" />}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Star className="h-5 w-5 text-warning" />
                                        <div>
                                            <div className="font-medium text-sm">Halfway There</div>
                                            <div className="text-xs text-muted-foreground">Complete 50% of the course</div>
                                        </div>
                                        {progress >= 50 && <CheckCircle className="h-4 w-4 text-success" />}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Star className="h-5 w-5 text-warning" />
                                        <div>
                                            <div className="font-medium text-sm">Course Master</div>
                                            <div className="text-xs text-muted-foreground">Complete the entire course</div>
                                        </div>
                                        {isCompleted && <CheckCircle className="h-4 w-4 text-success" />}
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
