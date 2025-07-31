import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuthState } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Star,
  Activity,
  Bell,
  Plus,
  ArrowRight,
  MessageSquare,
  Award,
  Target,
  Eye,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   technologies: string[];
//   status: string;
//   client: string;
//   budget: string;
//   progress: number;
// }

interface EventData {
  id: string;
  title: string;
  startDate: string; // Use string type to handle date format from backend
}

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthState();
  console.log(user);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [completedProjects, setCompletedProjects] = useState("");
  const [totalEarnings, setTotalEarnings] = useState("");
  // const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);
  const [activeProjects, setActiveProjects] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [network, setNetwork] = useState("");
  const [changeStats, setChangeStats] = useState({
    projectChange: 0,
    earningsChange: 0,
    successRate: 0,
    newConnections: 0,
  });
  const [performance, setPerformance] = useState({
    successRate: 0,
    clientSatisfaction: 0,
    responseTime: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard/${user._id}`
        );
        const data = await res.json();

        setActiveProjects(data.activeProjects);
        setCompletedProjects(data.completedProjects);
        setTotalEarnings(data.totalEarnings);
        setNetwork(data.network);
        setRecentActivities(data.recentActivities);
        setChangeStats(data.changeStats);
        setPerformance(data.performance);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardStats();
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const eventsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/events`
        );

        const eventsData = await eventsRes.json();
        const sortedEvents = eventsData.sort(
          (a: EventData, b: EventData) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        setUpcomingEvents(eventsData);

        console.log("Fetched Events:", eventsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);
  const eventsToDisplay = showAllEvents
    ? upcomingEvents
    : upcomingEvents.slice(0, 3);

  // ✅ Welcome Toast – Always runs once on mount
  useEffect(() => {
    toast({
      title: "Welcome to W3nity!",
      description: "Your collaboration dashboard is ready",
    });
  }, [toast]);

  // ✅ Stats and Data (declared outside render logic)
  const quickStats = [
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Briefcase,
      change: `${changeStats.projectChange >= 0 ? "+" : ""}${
        changeStats.projectChange
      } this week`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Earnings",
      value: `$${Number(totalEarnings).toLocaleString()}`,
      icon: DollarSign,
      change: `${
        changeStats.earningsChange >= 0 ? "+" : ""
      }$${changeStats.earningsChange.toLocaleString()} this month`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle,
      change: `${changeStats.successRate}% success rate`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Network",
      value: network,
      icon: Users,
      change: `+${changeStats.newConnections} connections`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // ✅ Handler Functions — also declared at top level
  const handleCreateGig = () => {
    navigate("/freelance/create");
    toast({
      title: "Create New Gig",
      description: "Starting gig creation process",
    });
  };

  const handleCreateEvent = () => {
    navigate("/events/create");
    toast({
      title: "Create New Event",
      description: "Starting event creation process",
    });
  };

  const handleViewGigs = () => {
    navigate("/freelance");
    toast({
      title: "Browse Gigs",
      description: "Exploring available freelance opportunities",
    });
  };

  const handleViewEvents = () => {
    navigate("/events");
    toast({
      title: "Browse Events",
      description: "Discovering upcoming tech events",
    });
  };

  const handleJoinCommunity = () => {
    navigate("/community");
    toast({
      title: "Join Community",
      description: "Connecting with fellow developers",
    });
  };

  const handleViewProfile = () => {
    navigate("/profile");
    toast({
      title: "View Profile",
      description: "Managing your professional profile",
    });
  };

  const handleStartChat = () => {
    navigate("/community");
    toast({
      title: "Start Chatting",
      description: "Opening real-time collaboration chat",
    });
  };

  const handleViewNotifications = () => {
    navigate("/notifications");
    toast({
      title: "Notifications",
      description: "Checking your latest updates",
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Please Log In</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access your dashboard.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Ready to spark some collaboration today?
          </motion.p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateGig} className="glow-button">
            <Plus className="w-4 h-4 mr-2" />
            Create Gig
          </Button>
          <Button onClick={handleCreateEvent} variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </motion.div>

      {/* Wallet Connection */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
          >
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleViewProfile}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Left Column */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Quick Actions */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleViewGigs}
                variant="outline"
                className="h-20 flex-col hover:bg-primary/5"
              >
                <Briefcase className="w-6 h-6 mb-2" />
                Browse Gigs
              </Button>
              <Button
                onClick={handleViewEvents}
                variant="outline"
                className="h-20 flex-col hover:bg-primary/5"
              >
                <Calendar className="w-6 h-6 mb-2" />
                Find Events
              </Button>
              <Button
                onClick={handleJoinCommunity}
                variant="outline"
                className="h-20 flex-col hover:bg-primary/5"
              >
                <Users className="w-6 h-6 mb-2" />
                Join Community
              </Button>
              <Button
                onClick={handleStartChat}
                variant="outline"
                className="h-20 flex-col hover:bg-primary/5"
              >
                <MessageSquare className="w-6 h-6 mb-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </div>
                <Button
                  onClick={handleViewNotifications}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={handleViewNotifications}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{activity.actionTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.context}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : activity.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {/* Performance Overview */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Project Success Rate</span>
                  <span>{performance.successRate}%</span>
                </div>
                <Progress value={performance.successRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Client Satisfaction</span>
                  <span>{performance.clientSatisfaction}/5</span>
                </div>
                <Progress
                  value={(performance.clientSatisfaction / 5) * 100}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Response Time</span>
                  <span>{performance.responseTime}&nbsp;hrs</span>
                </div>
                <Progress
                  value={Math.max(0, 100 - performance.responseTime * 10)}
                  className="h-2"
                />
              </div>

              <Button
                onClick={handleViewProfile}
                variant="outline"
                className="w-full mt-4"
              >
                <Star className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming
                </div>
                <Button onClick={handleViewEvents} variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4" />
                  {showAllEvents ? "View Less" : "View More"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {eventsToDisplay.length > 0 ? (
                  eventsToDisplay.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.startDate).toLocaleString()}{" "}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No upcoming events found.</p>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
