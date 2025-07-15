import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const ConnectionModal = ({ isOpen, onClose, onConnect, isConnecting }) => {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!spreadsheetId.trim()) {
      setError("Please enter a Google Sheets ID");
      return;
    }

    try {
      await onConnect(spreadsheetId.trim());
      setSpreadsheetId("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to connect to Google Sheets");
    }
  };

  const extractIdFromUrl = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSpreadsheetId(extractIdFromUrl(value));
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Table" className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Connect Google Sheets
                  </h3>
                  <p className="text-sm text-gray-600">
                    Link your spreadsheet to sync data
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Google Sheets ID or URL"
                  type="text"
                  value={spreadsheetId}
                  onChange={handleInputChange}
                  placeholder="Enter spreadsheet ID or paste URL"
                  error={error}
                  disabled={isConnecting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can paste the full URL or just the spreadsheet ID
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Required Sheets
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• "Courses" - Course information</li>
                      <li>• "Assignments" - Assignment details</li>
                      <li>• "Performance" - Grade history</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 flex items-center justify-center space-x-2"
                  disabled={isConnecting || !spreadsheetId.trim()}
                >
                  {isConnecting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Link" className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionModal;