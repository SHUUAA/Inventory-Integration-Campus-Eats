import React from "react";
import { useState } from "react";
import "../css/ForgotPasswordPage.css";
import forgotpassword from "../auth/ForgotPassword";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);
    const [validEmail, setValidEmail] = useState(true);


    const handleGetCodeClick = (e) => {
        e.preventDefault();

        forgotpassword(email);
        
    }



    return (
        <main className="fp-main">
            <div className="fp-box" style={{ height: '320px' }}>
                <div className="fp-inner-box">
                    <div className="fp-forms-wrap">
                        <form className="fp-form">
                            <div className="fp-header">
                               <h1>Forgot Password</h1>
                                <span className="small-text">Enter your email and we'll send you a reset password link!</span>
                            </div>
                            <div className="fp-actual-form">
                                <div className="fp-input-wrap">
                                    <input
                                        type="text"
                                        id="email"
                                        required
                                        className={`fp-input-field ${emailFocus || email ? 'active' : ''}`}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-invalid={validEmail ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={()=> setEmailFocus(true)}
                                        onBlur={()=> setEmailFocus(false)}
                                        
                                    />
                                    <label>Email</label>
                                </div>
                                
                                <button onClick={ handleGetCodeClick } className="fp-btn">
                                    Send Email
                                </button>
                            </div>
                            
                        
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword;