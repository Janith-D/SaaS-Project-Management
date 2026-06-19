import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { User, Mail, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || "Janet Gomez");
  const [department, setDepartment] = useState("Engineering & Core Product");
  const [phone, setPhone] = useState("+94 (77) 123 4567");
  const [bio, setBio] = useState("Lead staff engineer coordinating sprint milestones, composite DB indexing, and REST API controllers feedback logs.");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter a valid full name.");
      return;
    }
    
    // Simulate updating profile in local database
    const localUser = localStorage.getItem("tf_user");
    if (localUser) {
      const parsed = JSON.parse(localUser);
      parsed.fullName = fullName;
      localStorage.setItem("tf_user", JSON.stringify(parsed));
    }
    
    toast.success("Profile records updated! Reload to refresh directory listings.");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">Participant Settings</h1>
        <p className="text-xs text-slate-500">Edit credentials details and directory attributes.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-6 space-y-5">
        {/* Mock avatar indicator */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center font-extrabold text-2xl text-blue-700">
            {fullName[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{fullName}</h3>
            <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full py-0.5 px-2.2 inline-flex items-center space-x-1 uppercase font-bold text-[9px] mt-1 tracking-wider">
              <Award className="h-3.4 w-3.4" />
              <span>{user?.role.replace("WORKSPACE_", "").replace("PLATFORM_", "")}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Full Employee Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Company Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  value={user?.email || "employee@company.com"}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Department</label>
              <input
                type="text"
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Biography / Sprint Scope Role</label>
            <textarea
              rows={3}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition"
            >
              Save Profile coordinates
            </button>
          </div>
        </form>
      </div>

      {/* Security credentials banner */}
      <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex items-start space-x-3 text-xs text-slate-500 select-none">
        <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-700">Spring Security Session</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Encryption state active. Password resets dispatch a 5-digit security code linked with CORS verification filters.
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserProfilePage;
