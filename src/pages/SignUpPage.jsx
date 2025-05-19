import { useEffect } from 'react';
import SignUp from '../components/SignUp';
import Vectors from '../assets/Vectors.png'

export default function SignUpPage() {
  useEffect(() => {
    console.log("SignUp");
  }, []);
  return (
    <div className='main-container'>
      <div className="signin-container">
        <SignUp />
      </div>
      <img src={Vectors} className='bg-wave'></img>
    </div>
  );
}