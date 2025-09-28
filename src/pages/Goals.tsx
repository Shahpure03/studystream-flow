import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Target,
    Plus,
    CheckCircle,
    Calendar,
    TrendingUp,
    Star,
    Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mockService from "@/services/mockService";
import { Goal } from "@/data/mockData";

export default function Goals() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [goals,setGoals] = useState<Goal[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [showAddForm,setShowAddForm] = useState(false);
    const [newGoal,setNewGoal] = useState({
        title: '',
        description: '',
        target_value: 1,
        goal_type: 'daily'
    });

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const result = await mockService.getGoals('user-1');
                setGoals(result.goals);
            } catch (error) {
                console.error('Error loading goals:',error);
            } finally {
                setIsLoading(false);
            }
        };

        loadGoals();
    },[]);

    const handleAddGoal = () => {
        if (!newGoal.title.trim()) {
            toast({
                title: "Missing Information",
                description: "Please enter a goal title",
                variant: "destructive",
            });
            return;
        }

        const goal: Goal = {
            id: `goal-${Date.now()}`,
            title: newGoal.title,
            target_value: newGoal.target_value,
            current_value: 0,
            completed: false,
            goal_type: newGoal.goal_type
        };

        setGoals(prev => [...prev,goal]);
        setNewGoal({ title: '',description: '',target_value: 1,goal_type: 'daily' });
        setShowAddForm(false);

        toast({
            title: "Goal Added!",
            description: "Your new goal has been created successfully",
        });
    };

    const handleUpdateGoal = async (goalId: string,updateData: any) => {
        try {
            await mockService.updateGoal(goalId,updateData);

            setGoals(prev => prev.map(goal =>
                goal.id === goalId
                    ? { ...goal,...updateData }
                    : goal
            ));

            toast({
                title: "Goal Updated!",
                description: "Your progress has been saved",
            });
        } catch (error) {
            console.error('Error updating goal:',error);
        }
    };

    const handleCompleteGoal = (goalId: string) => {
        handleUpdateGoal(goalId,{ completed: true,current_value: 1 });
    };

    const handleProgressUpdate = (goalId: string,increment: number) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            const newValue = Math.min(goal.current_value + increment,goal.target_value);
            handleUpdateGoal(goalId,{ current_value: newValue });
        }
    };

    const getGoalTypeColor = (type: string) => {
        switch (type) {
            case 'daily': return 'bg-blue-100 text-blue-800';
            case 'weekly': return 'bg-green-100 text-green-800';
            case 'monthly': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getGoalTypeIcon = (type: string) => {
        switch (type) {
            case 'daily': return <Clock className="h-4 w-4" />;
            case 'weekly': return <Calendar className="h-4 w-4" />;
            case 'monthly': return <TrendingUp className="h-4 w-4" />;
            default: return <Target className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading goals...</p>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-xl font-semibold">My Goals</h1>
                        </div>
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-gradient-primary hover:opacity-90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Goal
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Goals List */}
                    <div className="lg:col-span-2 space-y-6">
                        {goals.length === 0 ? (
                            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                                <CardContent className="text-center py-12">
                                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start your learning journey by setting your first goal!
                                    </p>
                                    <Button
                                        onClick={() => setShowAddForm(true)}
                                        className="bg-gradient-primary hover:opacity-90"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Goal
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            goals.map((goal) => (
                                <Card key={goal.id} className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2">
                                                    {goal.completed ? (
                                                        <CheckCircle className="h-5 w-5 text-success" />
                                                    ) : (
                                                        <Target className="h-5 w-5 text-primary" />
                                                    )}
                                                    {goal.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className={getGoalTypeColor(goal.goal_type)}>
                                                        {getGoalTypeIcon(goal.goal_type)}
                                                        <span className="ml-1 capitalize">{goal.goal_type}</span>
                                                    </Badge>
                                                    {goal.completed && (
                                                        <Badge className="bg-success text-success-foreground">
                                                            Completed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Progress</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {goal.current_value} / {goal.target_value}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(goal.current_value / goal.target_value) * 100}
                                                className="h-2"
                                            />
                                        </div>

                                        {!goal.completed && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleProgressUpdate(goal.id,1)}
                                                    className="bg-gradient-primary hover:opacity-90"
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    +1
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCompleteGoal(goal.id)}
                                                    className="border-success text-success hover:bg-success hover:text-success-foreground"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Complete
                                                </Button>
                                            </div>
                                        )}

                                        {goal.completed && (
                                            <div className="flex items-center gap-2 text-success">
                                                <CheckCircle className="h-5 w-5" />
                                                <span className="font-semibold">Goal Achieved!</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Add Goal Form */}
                    {showAddForm && (
                        <div className="lg:col-span-1">
                            <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-5 w-5 text-primary" />
                                        Add New Goal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Goal Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Study for 2 hours today"
                                            value={newGoal.title}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev,title: e.target.value }))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe your goal..."
                                            value={newGoal.description}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev,description: e.target.value }))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target">Target Value</Label>
                                        <Input
                                            id="target"
                                            type="number"
                                            min="1"
                                            value={newGoal.target_value}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev,target_value: parseInt(e.target.value) || 1 }))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Goal Type</Label>
                                        <select
                                            id="type"
                                            className="w-full p-2 border border-border rounded-md bg-background"
                                            value={newGoal.goal_type}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev,goal_type: e.target.value }))}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleAddGoal}
                                            className="flex-1 bg-gradient-primary hover:opacity-90"
                                        >
                                            Add Goal
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Goals Statistics */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Total Goals</span>
                                    <span className="font-semibold">{goals.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Completed</span>
                                    <span className="font-semibold text-success">
                                        {goals.filter(g => g.completed).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">In Progress</span>
                                    <span className="font-semibold text-primary">
                                        {goals.filter(g => !g.completed).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Completion Rate</span>
                                    <span className="font-semibold">
                                        {goals.length > 0
                                            ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100)
                                            : 0}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="h-5 w-5 text-warning" />
                                    Quick Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Set specific, measurable goals</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Break large goals into smaller steps</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Review and adjust goals regularly</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Celebrate your achievements!</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
