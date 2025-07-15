import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onSync, lastSync, isLoading, onSearch, connectionStatus = "connected" }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "connected": return "text-success";
      case "disconnected": return "text-error";
      case "syncing": return "text-warning";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected": return "Wifi";
      case "disconnected": return "WifiOff";
      case "syncing": return "RotateCw";
      default: return "AlertCircle";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected": return "Connected";
      case "disconnected": return "Disconnected";
      case "syncing": return "Syncing...";
      default: return "Unknown";
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return "Never";
    const now = new Date();
    const sync = new Date(timestamp);
    const diff = now - sync;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return sync.toLocaleDateString();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">LearnHub</h1>
              <p className="text-sm text-gray-600">E-Learning Dashboard</p>
            </div>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search courses, assignments..."
              className="w-full"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon 
                name={getStatusIcon(connectionStatus)}
                className={`w-4 h-4 ${getStatusColor(connectionStatus)} ${
                  connectionStatus === "syncing" ? "animate-spin" : ""
                }`}
              />
              <span className={getStatusColor(connectionStatus)}>
                {getStatusText(connectionStatus)}
              </span>
            </div>

            {/* Last Sync */}
            <div className="hidden sm:block text-sm text-gray-500">
              Last sync: {formatLastSync(lastSync)}
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
            </Button>

            {/* Sync Button */}
            <Button
              onClick={onSync}
              disabled={isLoading}
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ApperIcon 
                name="RefreshCw" 
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isLoading ? "Syncing..." : "Sync"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search courses, assignments..."
              className="w-full"
            />
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;