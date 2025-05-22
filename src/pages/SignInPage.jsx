import { useEffect } from 'react';
import SignInForm from '../components/SignInForm';
import Vectors from '../assets/Vectors.png'
import LanguageSelector from '../components/LanguageSelector';

export default function SignInPage() {
  useEffect(() => {
    console.log("Sign in");
  }, []);
  return (
    <div className='main-container'>
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      <div className="signin-container">
        <SignInForm />
      </div>
      <img src={Vectors} className='bg-wave'></img>
    </div>
  );
}