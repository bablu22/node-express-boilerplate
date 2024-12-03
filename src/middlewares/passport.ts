import { setupJwtStrategy } from '@/common/passport/strategy';
import passport from 'passport';

const initializePassport = () => {
  setupJwtStrategy(passport);
};

initializePassport();

export default passport;
