"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/common/avatar";
import ProfileForm from "@/components/profile/profile-form";
import { User, ArrowLeft, Calendar, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProfileWrapperProps {
  initialFullName: string;
  initialPhone: string;
  initialAddress: string;
  initialDateOfBirth: string;
  initialGender: string;
  email: string;
  createdAt: string;
}

export default function ProfileWrapper({
  initialFullName,
  initialPhone,
  initialAddress,
  initialDateOfBirth,
  initialGender,
  email,
  createdAt,
}: ProfileWrapperProps) {
  const [currentFullName, setCurrentFullName] = useState(initialFullName);

  const handleNameUpdate = (newName: string) => {
    setCurrentFullName(newName);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <div className="flex items-center gap-3">
            <Link href={"/map"}>
              <ArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold">Profil Pengguna</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <Avatar
                    displayName={currentFullName || "User"}
                    size="lg"
                    className="w-24 h-24 text-2xl shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] rounded-full flex items-center justify-center border-4 border-white">
                    <User size={16} className="text-white" />
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                  {currentFullName || "Nama Belum Diatur"}
                </h2>

                {/* Email */}
                <p className="text-sm text-gray-500 mb-6 text-center break-all">
                  {email}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />

                {/* Info Items */}
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                      <Mail size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Bergabung</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-white p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  Edit Profil
                </h3>
                <p className="text-gray-600 text-sm">
                  Perbarui informasi profil Anda di sini
                </p>
              </div>

              {/* Form */}
              <ProfileForm
                initialFullName={currentFullName}
                initialPhone={initialPhone}
                initialAddress={initialAddress}
                initialDateOfBirth={initialDateOfBirth}
                initialGender={initialGender}
                email={email}
                onNameUpdate={handleNameUpdate}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
