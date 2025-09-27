import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, User, Lock, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupFormProps {
  onToggleForm: () => void;
}

const grades = [
  "Elementary (K-5)",
  "Middle School (6-8)", 
  "High School (9-12)",
  "College/University",
  "Adult Learner"
];

const subjects = [
  { id: "math", label: "Mathematics", icon: "📊" },
  { id: "science", label: "Science", icon: "🔬" },
  { id: "english", label: "English/Language Arts", icon: "📝" },
  { id: "history", label: "History/Social Studies", icon: "🏛️" },
  { id: "art", label: "Arts & Design", icon: "🎨" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "coding", label: "Programming/Tech", icon: "💻" },
  { id: "languages", label: "Foreign Languages", icon: "🌍" }
];

export function SignupForm({ onToggleForm }: SignupFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim() || !gradeLevel || selectedSubjects.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select at least one subject",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      const userData = {
        username,
        gradeLevel,
        subjects: selectedSubjects,
        isAuthenticated: true,
        joinedDate: new Date().toISOString()
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Account Created!",
        description: `Welcome to EduLearn, ${username}! Your learning journey begins now.`,
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="shadow-elevated border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <UserPlus className="h-6 w-6 text-secondary" />
          Join EduLearn
        </CardTitle>
        <p className="text-muted-foreground">Create your personalized learning account</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-border focus:ring-2 focus:ring-secondary/20"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-border focus:ring-2 focus:ring-secondary/20"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Grade Level
            </Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel} disabled={isLoading}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your grade level" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Subjects of Interest (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.id}
                    checked={selectedSubjects.includes(subject.id)}
                    onCheckedChange={(checked) => 
                      handleSubjectChange(subject.id, checked as boolean)
                    }
                    disabled={isLoading}
                    className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  />
                  <Label 
                    htmlFor={subject.id} 
                    className="text-sm cursor-pointer flex items-center gap-1"
                  >
                    <span>{subject.icon}</span>
                    {subject.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="lavender"
            size="lg"
            className="w-full h-12 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={onToggleForm}
              className="text-secondary hover:text-secondary/80 font-medium hover:underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}