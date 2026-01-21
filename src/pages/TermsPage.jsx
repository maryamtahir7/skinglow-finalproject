import React from "react";
import { ScrollText } from "lucide-react";

function TermsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
            <div className="bg-slate-900 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollText className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-slate-400">Effective Date: January 1, 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                    <p className="text-slate-600 leading-relaxed">
                        By accessing or using the SkinGlow website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Permission is granted to temporarily download one copy of the materials (information or software) on SkinGlow's website for personal, non-commercial transitory viewing only.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600">
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display;</li>
                        <li>attempt to decompile or reverse engineer any software contained on SkinGlow's website;</li>
                        <li>remove any copyright or other proprietary notations from the materials.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
                    <p className="text-slate-600 leading-relaxed">
                        The materials on SkinGlow's website are provided on an 'as is' basis. SkinGlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">4. Accuracy of Materials</h2>
                    <p className="text-slate-600 leading-relaxed">
                        The materials appearing on SkinGlow's website could include technical, typographical, or photographic errors. SkinGlow does not warrant that any of the materials on its website are accurate, complete, or current. SkinGlow may make changes to the materials contained on its website at any time without notice.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default TermsPage;
