import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface LocationState {
  err?: string;
}

const Login = () => {
  //form data
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  //state to handle waiting for a response and an error response
  const locationState = useLocation().state as LocationState | null;

  const [error, setError] = useState<string | null>(locationState?.err || null);
  const [isLoading, setIsLoading] = useState(false);
  //navigator to redirect user after successful form submission
  const navigate = useNavigate();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    //stop page from refreshing
    e.preventDefault();
    setError(null);

    //collect form data
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    //check for empty fields
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    //try logging in user
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      //handle error
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in');
      }
      console.log('Login successful:', data);
      navigate('/app');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 w-120  bg-zinc-400 shadow-[0_0_10px_5px_rgba(0,0,0,0.2)] rounded-2xl flex flex-col"
    >
      <h1 className="text-center">login</h1>
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

export default Login;
