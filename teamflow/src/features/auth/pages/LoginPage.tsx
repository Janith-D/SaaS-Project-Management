import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../../context/AuthContext";
import AuthLayout from "../../../components/layout/AuthLayout";
import { Loader2, KeyRound, Mail, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(5, "Password must contain at least 5 characters.")
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login(data);
      toast.success("Successfully authenticated. Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to authenticate. Check credentials.");
    }
  };

  const fillQuickCredentials = (email: string) => {
    setValue("email", email);
    setValue("password", "password");
    toast.success(`Quick login credentials pre-filled: ${email}`);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Sign In to TeamFlow
          </h2>
          <p className="text-sm text-slate-500">
            Sign in to manage your projects and team workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                className={`w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition ${
                  errors.email ? "border-red-300" : "border-slate-200"
                }`}
                {...registerField("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Account Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition ${
                  errors.password ? "border-red-300" : "border-slate-200"
                }`}
                {...registerField("password")}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg cursor-pointer transition duration-150 shadow-md shadow-indigo-600/10 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white mr-2" />
            ) : null}
            Authenticate Securely
          </button>
        </form>

        <div className="relative my-6 select-none">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400 font-medium uppercase bg-slate-50 lg:bg-white px-2">
            sandbox demo quick login
          </div>
        </div>

        {/* Demo shortcuts trigger cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillQuickCredentials("admin@tf.com")}
            className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg text-left text-xs transition duration-150"
          >
            <div className="flex items-center space-x-1 font-bold text-indigo-700">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span>Administrator</span>
            </div>
            <p className="text-[10px] text-indigo-500/80 truncate mt-0.5">
              admin@tf.com
            </p>
          </button>
          
          <button
            type="button"
            onClick={() => fillQuickCredentials("alice@tf.com")}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg text-left text-xs transition duration-150"
          >
            <div className="flex items-center space-x-1 font-bold text-rose-700">
              <KeyRound className="h-3 w-3 shrink-0" />
              <span>Project Manager</span>
            </div>
            <p className="text-[10px] text-rose-500/80 truncate mt-0.5">
              alice@tf.com
            </p>
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Don't have an organization workspace?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
export default LoginPage;
