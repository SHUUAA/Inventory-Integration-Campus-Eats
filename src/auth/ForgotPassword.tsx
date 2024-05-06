import { sendPasswordResetEmail } from 'firebase/auth';
import { authentication } from '../config/firebase'; 

const actionCodeSettings = {
  url: 'http://localhost:5173/reset-password?oobCode=CODE', // Replace with your app's password reset page
  handleCodeInApp: true  // Handle the link in your app
};


const forgotpassword = async (email: string) => {
  try {
    const response = await sendPasswordResetEmail(authentication, email);
    console.log('Password reset email sent!');
    // Notify user of success (e.g., display a message)
    return response;
  } catch (error) {
    console.error('Error sending reset email:', error);
    // Notify user of error (e.g., display an error message)
  }
};

export default forgotpassword;
