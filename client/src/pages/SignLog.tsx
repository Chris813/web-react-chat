import logoUrl from "../assets/images/logo.png";
import AuthForm from "../components/auth/AuthForm";

function SignLog() {
  return (
    <div className=' min-h-full bg-dswall flex justify-center flex-col py-12 sm:px-6 lg:px-8'>
      <div className=' sm:mx-auto sm:w-full sm:max-w-md'>
        <img className='w-20 h-20 mx-auto' src={logoUrl} />
        <AuthForm />
      </div>
    </div>
  );
}

export default SignLog;
