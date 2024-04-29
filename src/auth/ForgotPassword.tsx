import { sendPasswordResetEmail } from 'firebase/auth';
import { authentication } from '../config/firebase'; 

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
