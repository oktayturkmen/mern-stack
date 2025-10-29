import mongoose from 'mongoose';
import { User } from '../src/models/User';
import { env } from '../src/config/env';

async function makeUserAdmin() {
  try {
    await mongoose.connect(env.MONGO_URI);
    
    const user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log('✅ User admin@example.com is now an admin');
    } else {
      console.log('❌ User admin@example.com not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeUserAdmin();
