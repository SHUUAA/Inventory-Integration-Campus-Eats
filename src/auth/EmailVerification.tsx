import { sendEmailVerification } from "firebase/auth";

const actionCodeSettings = {
    url: 'http://localhost:5173/complete-verification?oobCode=CODE', 
    handleCodeInApp: true  
};

const EmailVerification = async (user: any) => {
  try {
    if (user) {
        await sendEmailVerification(user);
        console.log("Verification email sent successfully.");
    }
} catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
}
};

export default EmailVerification;
