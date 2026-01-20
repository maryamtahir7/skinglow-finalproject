// src/pages/privacypolicy.jsx
import React from 'react';
import { Shield, Lock, FileText, Sparkles } from 'lucide-react';

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="bg-primary/5 py-16 px-6 border-b border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-4 rounded-full inline-flex mb-6 shadow-sm">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trust is our priority. Learn how SkinGlow protects your personal information and shopping experience.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> 1. Information We Collect
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            To provide you with a personalized skincare experience, we collect information such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-primary text-muted-foreground">
            <li>Personal details (Name, email, shipping address) for order fulfillment.</li>
            <li>Skin concerns and preferences (from quizzes) to recommend suitable products.</li>
            <li>Shopping history to verify purchases and manage returns.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" /> 2. How We Use Your Data
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We use your data solely to improve your shopping experience, process orders, and provide personalized skincare recommendations. We <strong>never</strong> sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> 3. Secure Transactions
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            All transactions are encrypted using industry-standard SSL technology. Your payment details are processed securely by our trusted payment partners and are never stored on our servers.
          </p>
        </section>

        <section className="bg-secondary/20 p-8 rounded-3xl border border-primary/10">
          <h3 className="font-bold text-foreground mb-2 text-lg">Questions?</h3>
          <p className="text-muted-foreground">
            If you have any questions about our privacy practices, please reach out to our support team at <a href="mailto:care@skinglow.com" className="text-primary font-medium hover:underline">care@skinglow.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PolicyPage;
