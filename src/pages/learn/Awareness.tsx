import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Awareness() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Learn & Awareness</h1>
        <p className="text-gray-600">Understand blood and plasma donation, safety and benefits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-blood">
              <AccordionTrigger>What is Blood Donation?</AccordionTrigger>
              <AccordionContent>
                Blood donation is the process of voluntarily giving blood for transfusions or manufacturing biopharmaceuticals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="what-is-plasma">
              <AccordionTrigger>What is Plasma Donation?</AccordionTrigger>
              <AccordionContent>
                Plasma donation collects plasma, the liquid component of blood, used for therapies and critical treatments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="differences">
              <AccordionTrigger>Blood vs Plasma Donation (Differences)</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Aspect</th>
                        <th className="py-2">Blood</th>
                        <th className="py-2">Plasma</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Typical Duration</td>
                        <td className="py-2">8–12 minutes</td>
                        <td className="py-2">45–60 minutes</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Cooldown</td>
                        <td className="py-2">56 days</td>
                        <td className="py-2">14 days</td>
                      </tr>
                      <tr>
                        <td className="py-2">Primary Use</td>
                        <td className="py-2">Transfusions</td>
                        <td className="py-2">Therapies (e.g., clotting factors)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="precautions">
              <AccordionTrigger>Precautions (Before/After)</AccordionTrigger>
              <AccordionContent>
                Hydrate, eat iron-rich foods, avoid strenuous activity immediately after donation, and follow medical advice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="benefits">
              <AccordionTrigger>Benefits of Donation Drives</AccordionTrigger>
              <AccordionContent>
                Community impact, saving lives, health screening, and encouraging a culture of care and preparedness.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link to="/request">
          <Button className="blood-btn">Make a Request</Button>
        </Link>
      </div>
    </div>
  );
}


