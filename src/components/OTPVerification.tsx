
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  purpose: 'login' | 'verification' | 'registration';
  onVerified: () => void;
  onCancel: () => void;
  userId?: string;
  hospitalId?: string;
}

export default function OTPVerification({ 
  email,
  purpose, 
  onVerified, 
  onCancel, 
  userId, 
  hospitalId 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async () => {
    const otpCode = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    try {
      const { error } = await supabase
        .from('otp_verifications')
        .insert({
          email,
          otp_code: otpCode,
          purpose,
          user_id: userId || null,
          hospital_id: hospitalId || null,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      // In a real app, you would send the OTP via email service
      // For demo purposes, we'll show it in the console
      console.log(`OTP for ${email}: ${otpCode}`);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${email}. Check console for demo OTP.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', email)
        .eq('otp_code', otp)
        .eq('purpose', purpose)
        .eq('is_used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect or has expired.",
          variant: "destructive",
        });
        return;
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ is_used: true })
        .eq('id', data.id);

      // Optional: Update profile email verification flag if you maintain one
      // Skipped to keep this generic

      toast({
        title: "Verification Successful",
        description: "Your email has been verified.",
      });

      onVerified();
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    await sendOTP();
    setTimeLeft(60);
    setResendLoading(false);
  };

  // Send initial OTP when component mounts
  useEffect(() => {
    sendOTP();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={verifyOTP} 
            className="flex-1 blood-btn"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in {timeLeft} seconds
            </p>
          ) : (
            <Button 
              variant="link" 
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-sm"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
