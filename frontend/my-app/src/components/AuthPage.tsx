import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div>
      <button onClick={() => setIsSignIn(true)}>Sign In</button>
      <button onClick={() => setIsSignIn(false)}>Sign Up</button>
      {isSignIn ? <SignIn /> : <SignUp />}
    </div>
  );
};

export default AuthPage;
