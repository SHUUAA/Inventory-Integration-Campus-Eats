import React from "react";
import "../css/Settings.css";

const Settings = () => {
  const handleLanguageSave = () => {
    // Add logic for saving language settings
  };

  const handleNotificationSave = () => {
    // Add logic for saving notification preferences
  };

  return (
    <div>
      <h2>Settings</h2>
      <h3>Inventory System</h3>
      
      <div>
        <h4>Notification Preferences</h4>
        <label>
          <input type="checkbox" name="email" value="email" />
          Email
        </label>
        <label>
          <input type="checkbox" name="sms" value="sms" />
          SMS
        </label>
        <button onClick={handleNotificationSave}>
          Save Notification Preferences
        </button>  
      </div>
      
      <div>
        <h3>Help & Support</h3>
        <p>
          Include FAQs, troubleshooting guides, and contact information for
          technical assistance.
        </p>
        <h4>FAQs</h4>
      </div>
      <div>  
        <h4>Troubleshooting Guides</h4>
        {/* Add troubleshooting guides section */}

        <h4>Contact Information</h4>
        <a href="mailto:support@example.com">support@example.com</a>
      </div>
    </div>
  );
};

export default Settings;
