import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../../context/AuthContext";
import AuthLayout from "../../../components/layout/AuthLayout";
import { Loader2, User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(5, "Password must contain at least 5 characters.")
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      await authRegister(data);
      toast.success("Registration completed successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during registration.");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Create your Workspace
          </h2>
          <p className="text-sm text-slate-500">
            Create your account and set up your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Full Employee Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Nimal Silva"
                className={`w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition ${
                  errors.fullName ? "border-red-300" : "border-slate-200"
                }`}
                {...registerField("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Work Email Address
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
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Password Lock
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
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
            Complete Enterprise Sign up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            Already have a workspace seat?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
export default RegisterPage;
