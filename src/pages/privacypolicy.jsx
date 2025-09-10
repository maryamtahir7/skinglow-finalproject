import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Shield, Lock, FileText, AlertCircle } from "lucide-react";

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-indigo-50 py-16 px-4 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 tracking-tight">
          MT STORE – Privacy & Copyright Policies
        </h1>
        <p className="text-gray-600 text-lg">
          Protecting your data and intellectual property is our top priority. Read through our updated policies to understand your rights and our responsibilities.
        </p>
      </section>

      {/* Main Card */}
      <Card className="w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        <CardContent className="p-8 space-y-12">

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl shadow-inner mb-6">
              <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 rounded-lg py-3 font-semibold transition-all">
                Privacy Policy
              </TabsTrigger>
              <TabsTrigger value="copyright" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 rounded-lg py-3 font-semibold transition-all">
                Copyright & Legal
              </TabsTrigger>
            </TabsList>

            {/* Privacy Policy Content */}
            <TabsContent value="privacy" className="space-y-6 text-gray-700">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-indigo-600 mb-2">Data Privacy & Security</h2>
                  <p>
                    At <strong>MT Store</strong>, your privacy is paramount. We collect only essential data such as name, email, and phone number to ensure a smooth shopping experience.
                  </p>
                  <p>
                    All user data is securely stored, encrypted, and <strong>never shared or sold</strong> to unauthorized third parties. We use data solely for order processing, delivery updates, and customer support.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">Account Security</h2>
                  <p>
                    Users are responsible for maintaining the confidentiality of their account credentials. Any suspicious activity should be reported immediately to our support team.
                  </p>
                  <p>
                    We implement advanced security measures, including SSL encryption and secure payment gateways, to protect your account and transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Legal Notices</h2>
                  <p>
                    MT Store prohibits unauthorized access, copying, or distribution of its software, website content, or digital assets. Any attempt to infringe upon our intellectual property may result in legal action.
                  </p>
                  <p>
                    Users are expected to comply with all applicable laws and refrain from actions that violate our terms and privacy policies.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Copyright Content */}
            <TabsContent value="copyright" className="space-y-6 text-gray-700">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-indigo-600 mb-2">Intellectual Property</h2>
                  <p>
                    All content on MT Store, including text, graphics, logos, images, and software, is the intellectual property of MT Store or its licensors. Unauthorized reproduction or use is strictly prohibited.
                  </p>
                  <p>
                    Copyright claims are enforced rigorously. Any copying, redistribution, or modification without prior written consent may result in legal proceedings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">DMCA & Enforcement</h2>
                  <p>
                    MT Store complies with DMCA regulations and other intellectual property laws. If you believe your copyrighted content has been used without permission, contact us immediately.
                  </p>
                  <p>
                    We will review and take necessary action promptly to protect both your rights and ours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">User Responsibilities</h2>
                  <p>
                    Users must respect MT Store's intellectual property and data privacy policies. Any misuse, including hacking attempts or illegal distribution of software, is strictly forbidden.
                  </p>
                  <p>
                    Violations may result in account termination and legal consequences.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Note */}
          <div className="text-center text-gray-500 text-sm mt-12">
            &copy; {new Date().getFullYear()} MT Store. All rights reserved. Your privacy and security are protected.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
