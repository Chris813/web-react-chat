import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
config();
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      callbackURL: "/api/auth/github/callback" as string,
      proxy: true,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        console.log(profile);
        return done(null, profile);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "api/auth/google/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        console.log(profile);
        if (profile.emails && profile.photos) {
          const user = {
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          };
        }
        return done(null, profile);
      });
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user);
  console.log(user);
});

passport.deserializeUser(function (user: any, done) {
  // User.findById(id, function (err, user) {
  done(null, user);
  // });
});

export default passport;
