import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Shield, Activity } from "lucide-react";

interface HealthFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function HealthForm({ onComplete, onCancel }: HealthFormProps) {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    bloodType: '',
    medicalConditions: '',
    medications: '',
    allergies: '',
    lastDonationDate: '',
    hasTattoo: false,
    hasPiercing: false,
    hasTraveledRecently: false,
    hasSurgeryRecently: false,
    isPregnant: false,
    hasDiabetes: false,
    hasHypertension: false,
    hasHeartDisease: false,
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Calculate BMI
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height) / 100; // Convert cm to meters
      const bmi = weight / (height * height);

      // Check eligibility
      const isEligible = checkEligibility();

      // Update user profile with health information
      const { error } = await supabase
        .from('profiles')
        .update({
          age: parseInt(formData.age),
          weight: weight,
          height: parseFloat(formData.height),
          blood_type: formData.bloodType,
          medical_conditions: formData.medicalConditions,
          medications: formData.medications,
          allergies: formData.allergies,
          last_donation_date: formData.lastDonationDate || null,
          has_tattoo: formData.hasTattoo,
          has_piercing: formData.hasPiercing,
          has_traveled_recently: formData.hasTraveledRecently,
          has_surgery_recently: formData.hasSurgeryRecently,
          is_pregnant: formData.isPregnant,
          has_diabetes: formData.hasDiabetes,
          has_hypertension: formData.hasHypertension,
          has_heart_disease: formData.hasHeartDisease,
          emergency_contact: formData.emergencyContact,
          emergency_phone: formData.emergencyPhone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          bmi: bmi,
          is_eligible: isEligible,
          health_form_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Health Information Saved",
        description: "Your health information has been successfully recorded.",
        variant: "default",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving health information:', error);
      toast({
        title: "Error",
        description: "Failed to save health information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    
    // Basic eligibility criteria
    if (age < 18 || age > 65) return false;
    if (weight < 50) return false;
    if (formData.hasDiabetes || formData.hasHypertension || formData.hasHeartDisease) return false;
    if (formData.isPregnant) return false;
    if (formData.hasSurgeryRecently) return false;
    
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-600 mr-2" />
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <Activity className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>Health Information Form</CardTitle>
          <CardDescription>
            Please provide your health information to complete your donor profile. This information helps us ensure safe blood donation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    required
                    min="18"
                    max="65"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    required
                    min="50"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    required
                    min="150"
                    max="200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type *</Label>
                <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  placeholder="List any current medical conditions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="List any medications you are currently taking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any allergies you have"
                />
              </div>
            </div>

            {/* Health Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasTattoo"
                    checked={formData.hasTattoo}
                    onCheckedChange={(checked) => handleInputChange('hasTattoo', checked)}
                  />
                  <Label htmlFor="hasTattoo">Have tattoos or piercings in last 6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasTraveledRecently"
                    checked={formData.hasTraveledRecently}
                    onCheckedChange={(checked) => handleInputChange('hasTraveledRecently', checked)}
                  />
                  <Label htmlFor="hasTraveledRecently">Traveled internationally recently</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSurgeryRecently"
                    checked={formData.hasSurgeryRecently}
                    onCheckedChange={(checked) => handleInputChange('hasSurgeryRecently', checked)}
                  />
                  <Label htmlFor="hasSurgeryRecently">Had surgery in last 6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPregnant"
                    checked={formData.isPregnant}
                    onCheckedChange={(checked) => handleInputChange('isPregnant', checked)}
                  />
                  <Label htmlFor="isPregnant">Currently pregnant or breastfeeding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDiabetes"
                    checked={formData.hasDiabetes}
                    onCheckedChange={(checked) => handleInputChange('hasDiabetes', checked)}
                  />
                  <Label htmlFor="hasDiabetes">Have diabetes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasHypertension"
                    checked={formData.hasHypertension}
                    onCheckedChange={(checked) => handleInputChange('hasHypertension', checked)}
                  />
                  <Label htmlFor="hasHypertension">Have hypertension</Label>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading ? "Saving..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
