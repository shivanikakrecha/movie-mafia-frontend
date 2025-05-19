import { useEffect } from 'react';
import SignInForm from '../components/SignInForm';
import Vectors from '../assets/Vectors.png'

export default function SignInPage() {
  useEffect(() => {
    console.log("Sign in");
  }, []);
  return (
    <div className='main-container'>
      <div className="signin-container">
        <SignInForm />
      </div>
      <img src={Vectors} className='bg-wave'></img>
    </div>
  );
}