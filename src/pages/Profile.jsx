import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { User, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useContext(ShopContext);

  return (
    <div className="py-8 flex justify-center px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4 sm:mb-6">
            <span className="bg-blue-100 px-3 py-1 rounded-xl text-blue-700">
              Profile
            </span>
          </h2>

          <div className="space-y-4 sm:space-y-6 mt-4">

            {/* Name */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Name</div>
                <div className="text-base sm:text-lg font-medium text-gray-900">
                  {user?.name || "Not available"}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Email</div>
                <div className="text-base sm:text-lg font-medium text-gray-900">
                  {user?.email || "Not available"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
