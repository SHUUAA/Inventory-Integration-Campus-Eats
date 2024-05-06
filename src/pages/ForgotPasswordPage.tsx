import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../css/ForgotPasswordPage.css";
import { sendPasswordResetEmail } from 'firebase/auth';
import { authentication } from '../config/firebase'; 

const actionCodeSettings = {
  url: 'http://localhost:5173/reset-password?oobCode=CODE', // Replace with your app's password reset page
  handleCodeInApp: true  // Handle the link in your app
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(true);

  const handleGetCodeClick = async (e) => {
    try {
    e.preventDefault()
    await sendPasswordResetEmail(authentication, email);
    toast.success("If this user exists, we have sent you a password reset email.");
    } catch (error) {
        toast.error("Please enter a valid email.");
    }
  };

  return (
    <main className="fp-main">
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#DFD5C5",
            },

            // Default options for specific types
            success: {
              duration: 5000,
              theme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
      </div>
      <div className="fp-box" style={{ height: "320px" }}>
        <div className="fp-inner-box">
          <div className="fp-forms-wrap">
            <form className="fp-form">
              <div className="fp-header">
                <h1>Forgot Password</h1>
                <span className="small-text">
                  Enter your email and we'll send you a reset password link!
                </span>
              </div>
              <div className="fp-actual-form">
                <div className="fp-input-wrap">
                  <input
                    type="text"
                    id="email"
                    required
                    className={`fp-input-field ${
                      emailFocus || email ? "active" : ""
                    }`}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                  />
                  <label>Email</label>
                </div>

                <button onClick={handleGetCodeClick} className="fp-btn">
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
