import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HospitalAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast({ title: "Login successful", description: "Welcome to Hospital Dashboard" });
      navigate("/hospital/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast({ title: "Registration submitted", description: "Your hospital registration is under review." });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Building2 className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Hospital Portal</h1>
          <p className="text-muted-foreground">Manage blood inventory and requests</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Hospital Authentication</CardTitle>
            <CardDescription>Sign in or register your facility</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register Hospital</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Hospital Email</Label>
                    <Input id="login-email" type="email" placeholder="hospital@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital-name">Hospital Name *</Label>
                      <Input id="hospital-name" placeholder="City General Hospital" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital-type">Hospital Type *</Label>
                      <Select required>
                        <SelectTrigger id="hospital-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="semi-government">Semi-Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital-category">Category *</Label>
                    <Select required>
                      <SelectTrigger id="hospital-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multi-specialty">Multi-Specialty</SelectItem>
                        <SelectItem value="super-specialty">Super-Specialty</SelectItem>
                        <SelectItem value="general">General Hospital</SelectItem>
                        <SelectItem value="blood-bank">Blood Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Hospital Address *</Label>
                    <Input id="address" placeholder="123 Medical Street" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select required>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input id="district" placeholder="Enter district" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" type="url" placeholder="https://example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctors">Number of Doctors</Label>
                      <Input id="doctors" type="number" placeholder="50" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input id="mobile" type="tel" placeholder="+91 9876543210" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landline">Landline</Label>
                      <Input id="landline" type="tel" placeholder="0381-222-1234" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="hospital@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="head-name">Hospital Head Name *</Label>
                    <Input id="head-name" placeholder="Dr. John Smith" required />
                  </div>

                  <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Registration"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalAuth;


