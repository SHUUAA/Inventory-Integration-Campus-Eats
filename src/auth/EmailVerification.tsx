import { sendEmailVerification } from "firebase/auth";

const actionCodeSettings = {
    url: 'http://localhost:5173/complete-verification?oobCode=CODE', 
    handleCodeInApp: true  
};

const EmailVerification = async (user: any) => {
  try {
    const response = await sendEmailVerification(user);
    console.log("Email verification sent!");
    // Notify user of success (e.g., display a message)
    return response;
  } catch (error) {
    console.error("Error sending email verification:", error);
    // Notify user of error (e.g., display an error message)
  }
};

export default EmailVerification;
