import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide a valid registered email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      toast.success("Recovery instructions dispatched.");
    }, 700);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Forgot Password
          </h2>
          <p className="text-sm text-slate-500">
            We will dispatch instructions to securely reset your credentials.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4">
            <div className="flex items-start space-x-3 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-sm">Dispatched Verification Code</p>
                <p className="text-xs text-emerald-700/85 mt-1 leading-relaxed">
                  We sent an account override link to <strong className="font-semibold">{email}</strong>. Use the override key or code <strong>99424</strong> on the reset terminal.
                </p>
              </div>
            </div>
            <Link
              to="/reset-password"
              className="block text-center w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
            >
              Go to Reset Password screen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg cursor-pointer transition shadow-md shadow-blue-600/10"
            >
              {loading ? (
                <span className="animate-pulse">Loading secure keys...</span>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Request Overwrite Token
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-xs text-slate-500 hover:text-blue-600 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Login gate
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
export default ForgotPasswordPage;
