
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Smartphone, Bell, Eye, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import OTPVerification from "@/components/OTPVerification";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [showMobileVerification, setShowMobileVerification] = useState(false);
  const [tempPhone, setTempPhone] = useState('+91');
  const [loading, setLoading] = useState(false);

  // Form states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');

  useEffect(() => {
    if (profile) {
      setEmailNotifications(profile.email_notifications ?? true);
      setSmsNotifications(profile.sms_notifications ?? true);
      setLocationSharing(profile.location_sharing ?? true);
      setTwoFactorEnabled(profile.two_factor_enabled ?? false);
      setTempPhone(profile.phone || '+91');
    }
  }, [profile]);

  const handlePhoneChange = (value: string) => {
    if (!value.startsWith('+91')) {
      setTempPhone('+91' + value.replace(/^\+91/, ''));
    } else {
      if (value.length <= 13) {
        setTempPhone(value);
      }
    }
  };

  const handleVerifyMobile = () => {
    if (tempPhone.length !== 13) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }
    setShowMobileVerification(true);
  };

  const handleMobileVerified = async () => {
    await updateProfile({ 
      phone: tempPhone,
      is_mobile_verified: true 
    });
    setShowMobileVerification(false);
    toast({
      title: "Mobile Verified",
      description: "Your mobile number has been successfully verified.",
    });
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (enabled && !profile?.is_mobile_verified) {
      toast({
        title: "Mobile Verification Required",
        description: "Please verify your mobile number before enabling 2FA.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await updateProfile({ two_factor_enabled: enabled });
    setTwoFactorEnabled(enabled);
    setLoading(false);
    
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled 
        ? "Two-factor authentication is now active on your account."
        : "Two-factor authentication has been disabled.",
    });
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    await updateProfile({
      email_notifications: emailNotifications,
      sms_notifications: smsNotifications,
      location_sharing: locationSharing,
    });
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Delete user profile first
        await supabase.from('profiles').delete().eq('id', user?.id);
        
        // Sign out user
        await signOut();
        
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const generateBackupCodes = async () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    await updateProfile({ backup_codes: codes });
    
    // Download codes as text file
    const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    
    toast({
      title: "Backup Codes Generated",
      description: "Your backup codes have been downloaded. Keep them safe!",
    });
  };

  if (showMobileVerification) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <OTPVerification
          phoneNumber={tempPhone}
          purpose="verification"
          onVerified={handleMobileVerified}
          onCancel={() => setShowMobileVerification(false)}
          userId={user?.id}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and security settings</p>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Verification
              </CardTitle>
              <CardDescription>
                Verify your mobile number for enhanced security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="mobile"
                    value={tempPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleVerifyMobile}
                    variant={profile?.is_mobile_verified ? "secondary" : "default"}
                    disabled={profile?.phone === tempPhone && profile?.is_mobile_verified}
                  >
                    {profile?.is_mobile_verified && profile?.phone === tempPhone ? "Verified" : "Verify"}
                  </Button>
                </div>
              </div>

              {profile?.is_mobile_verified && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your mobile number is verified and secure.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Require OTP verification for login
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                  disabled={loading || !profile?.is_mobile_verified}
                />
              </div>

              {!profile?.is_mobile_verified && (
                <Alert>
                  <AlertDescription>
                    Please verify your mobile number first to enable 2FA.
                  </AlertDescription>
                </Alert>
              )}

              {twoFactorEnabled && (
                <div className="space-y-2">
                  <Button 
                    onClick={generateBackupCodes}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Backup Codes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for blood requests</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive text messages for urgent requests</p>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-sharing">Location Sharing</Label>
                  <p className="text-sm text-gray-500">Allow the app to access your location</p>
                </div>
                <Switch 
                  id="location-sharing" 
                  checked={locationSharing}
                  onCheckedChange={setLocationSharing}
                />
              </div>

              <Button 
                onClick={handleSaveNotifications}
                className="w-full blood-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your profile visibility and data sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <select 
                  id="profile-visibility"
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="public">Public - Visible to all users</option>
                  <option value="limited">Limited - Only basic info visible</option>
                  <option value="private">Private - Hidden from search</option>
                </select>
              </div>

              <Button className="w-full" variant="outline">
                Download My Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>

              <Button variant="outline" className="w-full">
                Export Account Data
              </Button>

              <div className="border-t pt-4">
                <Button 
                  onClick={handleDeleteAccount}
                  variant="destructive" 
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
