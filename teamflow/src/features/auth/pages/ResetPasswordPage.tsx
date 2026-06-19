import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout";
import { Lock, AlignLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 5) {
      toast.error("Security: Password must be at least 5 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mismatch: Provided passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Credentials updated! Sign in with your new password.");
      navigate("/login");
    }, 700);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500">
            Enter the 5-digit verification code sent to your inbox to override credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Verification Code (Dispatched 99424)
            </label>
            <input
              type="text"
              placeholder="e.g. 99424"
              className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              New Password Lock
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg cursor-pointer transition shadow-md shadow-blue-600/10"
          >
            {loading ? "Re-encrypting..." : "Update Credentials"}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            Cancel reset process
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
export default ResetPasswordPage;
