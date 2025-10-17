
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import OTPVerification from '@/components/OTPVerification';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [donationType, setDonationType] = useState<'blood' | 'plasma'>('blood');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'verification' | 'registration'>('verification');
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('two_factor_enabled, is_email_verified, email')
            .eq('email', email)
            .single();

          if (profile?.two_factor_enabled) {
            setOtpPurpose('login');
            // Email-based OTP
            setShowOTP(true);
          } else {
            toast({ title: "Welcome back!", description: "You have successfully logged in." });
          }
        }
      } else {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // Optional: still store phone if provided
          if (phone) await supabase.from('profiles').update({ phone }).eq('email', email);
          await supabase
            .from('profiles')
            .update({ medical_conditions: donationType === 'plasma' ? 'pref_plasma' : 'pref_blood' })
            .eq('email', email);

          toast({ title: "Account Created", description: "Please check your email to verify your account." });
          setOtpPurpose('registration');
          setShowOTP(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blood/5 to-medical/5 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blood mr-2" />
            <h1 className="text-2xl font-bold">BloodConnect</h1>
          </div>
          <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Join our blood donation community'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'signup'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Login</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>Sign Up</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+91XXXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Donation Preference</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="donationType"
                          value="blood"
                          checked={donationType === 'blood'}
                          onChange={() => setDonationType('blood')}
                        />
                        Blood
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="donationType"
                          value="plasma"
                          checked={donationType === 'plasma'}
                          onChange={() => setDonationType('plasma')}
                        />
                        Plasma
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
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
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>

              {/* Guest login removed as requested */}
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {showOTP && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <OTPVerification
              email={email}
              purpose={otpPurpose}
              onVerified={() => { setShowOTP(false); navigate('/dashboard'); }}
              onCancel={() => setShowOTP(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
