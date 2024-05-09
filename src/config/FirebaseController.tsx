import { User } from '../types/User';
import { authentication } from './firebase';

class FirebaseController {
  private auth: typeof authentication;

  constructor() {
    this.auth = authentication;
  }

  async getCurrentUser(): Promise<User | null> {
    const user = await this.auth.currentUser;
    if (!user) return null;
    return {
      displayName: user.displayName!,
      uid: user.uid,
      email: user.email!,
      emailVerified: user.emailVerified,
      metadata: {
        creationTime: user.metadata.creationTime!,
        lastSignInTime: user.metadata.lastSignInTime!,
      },
    };
  }
}

export default FirebaseController;