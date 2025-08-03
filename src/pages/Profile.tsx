import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Edit3, 
  Camera,
  Moon,
  Sun,
  Globe,
  Car,
  PoundSterling,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    earnings: true,
    targets: true,
    expenses: false,
    weekly: true
  });

  const [userProfile, setUserProfile] = useState({
    name: "John Driver",
    email: "john.driver@email.com",
    phone: "+44 7123 456789",
    location: "Birmingham, UK",
    joinDate: "January 2024",
    avatar: "",
    preferredPlatforms: ["Uber", "Bolt"],
    currency: "GBP",
    language: "en-GB"
  });

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    location: userProfile.location
  });

  const handleSaveProfile = () => {
    setUserProfile({
      ...userProfile,
      ...editForm
    });
    setIsEditDialogOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    // In a real app, this would redirect to login
  };

  const stats = {
    totalEarnings: 2847.50,
    totalTrips: 156,
    avgRating: 4.8,
    hoursWorked: 89.5
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Profile</h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">Manage your account and preferences</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Profile Card */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="ghost"
                className="absolute -bottom-1 -right-1 w-8 h-8 p-0 bg-white/20 hover:bg-white/30 rounded-full"
              >
                <Camera className="w-4 h-4 text-white" />
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{userProfile.name}</h2>
              <p className="text-white/80 text-sm truncate">{userProfile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-success/20 text-success border-success/30 text-xs">
                  Active Driver
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  Member since {userProfile.joinDate}
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditForm({
                  name: userProfile.name,
                  email: userProfile.email,
                  phone: userProfile.phone,
                  location: userProfile.location
                });
                setIsEditDialogOpen(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-white/80 text-xs">Total Earned</p>
              <p className="text-sm sm:text-base font-bold text-success">£{stats.totalEarnings}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs">Total Trips</p>
              <p className="text-sm sm:text-base font-bold text-white">{stats.totalTrips}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs">Avg Rating</p>
              <p className="text-sm sm:text-base font-bold text-warning">{stats.avgRating}★</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs">Hours</p>
              <p className="text-sm sm:text-base font-bold text-accent">{stats.hoursWorked}h</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {/* Account Information */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-primary">Account Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{userProfile.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{userProfile.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </GradientCard>

        {/* Preferences */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-primary">Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">English (UK)</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <PoundSterling className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-muted-foreground">British Pound (£)</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </div>
        </GradientCard>

        {/* Notifications */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <h3 className="font-semibold text-lg text-primary">Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div>
                  <p className="font-medium">Earnings Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about new earnings</p>
                </div>
                <Switch
                  checked={notifications.earnings}
                  onCheckedChange={(checked) => setNotifications({...notifications, earnings: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div>
                  <p className="font-medium">Target Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders about your targets</p>
                </div>
                <Switch
                  checked={notifications.targets}
                  onCheckedChange={(checked) => setNotifications({...notifications, targets: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
                </div>
                <Switch
                  checked={notifications.weekly}
                  onCheckedChange={(checked) => setNotifications({...notifications, weekly: checked})}
                />
              </div>
            </div>
          </div>
        </GradientCard>

        {/* Support & Help */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-semibold text-lg text-primary">Support & Help</h3>
            </div>

            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start h-12 text-left">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help Center
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 text-left">
                <Shield className="w-4 h-4 mr-3" />
                Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 text-left">
                <Award className="w-4 h-4 mr-3" />
                Terms of Service
              </Button>
            </div>
          </div>
        </GradientCard>

        {/* Logout */}
        <GradientCard>
          <Button
            variant="destructive"
            className="w-full h-12"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </GradientCard>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">Edit Profile</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update your personal information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="edit-name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-email" className="text-sm font-medium">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-location" className="text-sm font-medium">Location</Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
};

export default Profile;