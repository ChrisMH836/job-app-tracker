import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

interface RegisterResponse {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface ErrorResponse {
  error: string;
}
const Register = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //navigator to redirect user after successful form submission
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<Element>) => {
    //prevent page refresh on submission
    e.preventDefault();

    const name = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    //validate form fields
    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }

    //send request to register endpoint
    try {
      setError(null);
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const json = await response.json();
      //handle error
      if (!response.ok) {
        const errorJson = json as ErrorResponse;
        throw new Error(errorJson.error || 'Something went wrong');
      }
      const successJson = json as RegisterResponse;
      console.log('Signup successful:', successJson.data);
      navigate('/app');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className=" w-120 px-2 py-6 bg-zinc-400 rounded-lg shadow-[0_0_10px_5px_rgba(0,0,0,0.2)] flex flex-col"
      noValidate
    >
      <h1 className="text-center"> Signup</h1>
      <div className="form-input-section flex flex-col gap-2">
        <label htmlFor="username">Username</label>
        <input
          ref={usernameRef}
          type="text"
          id="username"
          name="username"
          className="bg-white rounded"
        />
      </div>
      <div className="form-input-section flex flex-col gap-2">
        <label htmlFor="email">email</label>
        <input
          ref={emailRef}
          type="text"
          id="email"
          name="email"
          className="bg-white rounded"
        />
      </div>
      <div className="form-input-section flex flex-col gap-2">
        <label htmlFor="password">password</label>
        <input
          ref={passwordRef}
          type="text"
          id="password"
          name="password"
          className="bg-white rounded"
        />
      </div>
      {error && <h1 className="text-red-500 font-bold text-center">{error}</h1>}
      {isLoading && <h1>Loading...</h1>}
      <button
        type="submit"
        className="mt-5 px-3 py-2 bg-zinc-500 hover:bg-zinc-800 hover:text-white rounded self-center"
      >
        Submit
      </button>
    </form>
  );
};

export default Register;
