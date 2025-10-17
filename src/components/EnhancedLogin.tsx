
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OTPVerification from "./OTPVerification";

interface EnhancedLoginProps {
  onSuccess: () => void;
}

export default function EnhancedLogin({ onSuccess }: EnhancedLoginProps) {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handlePhoneChange = (value: string) => {
    if (!value.startsWith('+91')) {
      setPhone('+91' + value.replace(/^\+91/, ''));
    } else {
      if (value.length <= 13) {
        setPhone(value);
      }
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Check if 2FA is enabled
        const { data: profile } = await supabase
          .from('profiles')
          .select('two_factor_enabled, is_mobile_verified')
          .eq('email', email)
          .single();

        if (profile?.two_factor_enabled && profile?.is_mobile_verified) {
          setShowOTPVerification(true);
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 13) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    // Check if phone number is verified
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_mobile_verified, id')
      .eq('phone', phone)
      .single();

    if (!profile?.is_mobile_verified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first.",
        variant: "destructive",
      });
      return;
    }

    setShowOTPVerification(true);
  };

  if (showOTPVerification) {
    return (
      <OTPVerification
        phoneNumber={loginMethod === 'otp' ? phone : '+91'} // You'd get this from user profile
        purpose="login"
        onVerified={onSuccess}
        onCancel={() => setShowOTPVerification(false)}
      />
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Login to BloodConnect</CardTitle>
        <CardDescription>Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'password' | 'otp')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full blood-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login with Password'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="otp">
            <form onSubmit={handleOTPLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full blood-btn"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Login with OTP'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
