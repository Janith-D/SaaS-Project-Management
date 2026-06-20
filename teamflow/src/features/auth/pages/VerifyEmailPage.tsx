import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authApi } from "../../../api/authApi";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    authApi.verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Verification failed. The link may be expired.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg max-w-md w-full text-center space-y-4">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Verifying your email...</p>
          </div>
        )}
        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Email Verified</h2>
            <p className="text-sm text-slate-500">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white text-sm font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-500">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-slate-200 text-slate-700 text-sm font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifyEmailPage;
