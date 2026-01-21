import React from "react";
import { ShieldCheck, Award, FileText } from "lucide-react";

function LicensePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
            <div className="bg-slate-50 py-20 px-6 border-b border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Regulatory & License Info</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Transparency is at our core. View our operational licenses and regulatory certifications below.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Drug Sale License</h3>
                        <p className="text-sm text-slate-500 mb-4">Issued by Primary Health Department</p>
                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-700">
                            License No: SG-2026-PHD-8842
                            <br />
                            Valid Until: Dec 2030
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-6">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Business Registration</h3>
                        <p className="text-sm text-slate-500 mb-4">Securities & Exchange Commission</p>
                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-700">
                            Reg No: CUIN-4492-SG
                            <br />
                            Status: Active
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 text-sm">
                        For official inquiries or to report a concern, please contact our Legal Department at <a href="mailto:legal@skinglow.com" className="text-primary hover:underline">legal@skinglow.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LicensePage;
