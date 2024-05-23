import "../css/Settings.css";
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Settings page component
const Settings = () => {
  const [isFAQ1Open, setFAQ1Open] = useState(false);
  const [isFAQ2Open, setFAQ2Open] = useState(false);
  //@ts-ignore
  const [isFAQ3Open, setFAQ3Open] = useState(false);

  const handleNotificationSave = () => {
    // Add logic for saving notification preferences
  };

  return (
    <div className="bg-white-950 mx-auto mt-8 p-4 rounded-lg shadow-lg">
      {" "}
      {/* Add Tailwind classes for container, padding, and margin */}
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <section className="mb-8 bg-white p-6">
        {" "}
        {/* Section container */}
        <h3 className="text-xl font-semibold mb-4">Inventory System</h3>
        <div className="notification-preferences-container">
          <h4 className="text-lg font-medium mb-2">Notification Preferences</h4>
          <div className="flex items-center space-x-4 mb-4">
            {" "}
            {/* Flexbox for layout */}
            <label className="flex items-center">
              <input
                type="checkbox"
                name="email"
                value="email"
                className="mr-2"
              />
              Email
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="sms" value="sms" className="mr-2" />
              SMS
            </label>
          </div>
          <button
            onClick={handleNotificationSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Notification Preferences
          </button>
        </div>
      </section>
      <section className="bg-white">
        <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
        <p>
          Include FAQs, troubleshooting guides, and contact information for
          technical assistance.
        </p>
        <h4 onClick={() => setFAQ1Open(!isFAQ1Open)}>
          <FontAwesomeIcon icon={isFAQ1Open ? faChevronUp : faChevronDown} />
          FAQs
        </h4>
        {isFAQ1Open && (
          <div className="faq-container">
            <div className="p">
              <p>How can I track my inventory effectively?</p>
              <p>
                It's really up to you, you can use the inventory system for
                free. Conduct regular audits and maintain accurate records of
                incoming and outgoing stock.
              </p>
            </div>
            <div className="p">
              <p>
                Can I integrate my inventory system with other business
                software?
              </p>
              <p>We are still working on it.</p>
            </div>
            <div className="p">
              <p>How do I add new items to the inventory system?</p>
              <p>
                Typically, there's a simple interface or form within the
                application where you can input details such as item name,
                description, quantity, and other relevant information.
              </p>
            </div>
          </div>
        )}
        <h4 onClick={() => setFAQ2Open(!isFAQ2Open)}>
          <FontAwesomeIcon icon={isFAQ2Open ? faChevronUp : faChevronDown} />
          Troubleshooting Guides
        </h4>
        {isFAQ2Open && (
          <div className="troubleshooting-guides-container">
            <div className="p">
              <p>How do I reset my password?</p>
              <p>
                To reset your password, click on the "Forgot Password" link on
                the login page and follow the instructions.
              </p>
            </div>
            <div className="p">
              <p>I'm having trouble logging in. What should I do?</p>
              <p>
                If you're having trouble logging in, make sure you're using the
                correct email address and password. If you've forgotten your
                password, click on the "Forgot Password" link on the login page
                and follow the instructions.
              </p>
            </div>
          </div>
        )}
        <div className="contact-information-container mt-6">
          {" "}
          {/* Add spacing */}
          <h4 className="text-lg font-medium mb-2">Contact Information</h4>
          <a
            href="mailto:support@c-eats.com"
            className="text-blue-500 hover:underline"
          >
            support@example.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default Settings;
