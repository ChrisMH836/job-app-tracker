import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  //form data
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  //state to handle waiting for a response and an error response
  const [error, setError] = useState<string | null>(null);
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
        throw new Error(data.message || 'Failed to log in');
      }
      console.log('Login successful:', data);
      navigate('/app');
    } catch (error: any) {
      setError(error.message || 'something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-blue-400 w-120 border-2 border-red-400 rounded-2xl"
    >
      <h1 className="text-center">login</h1>
      <div className=" flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          type="text"
          id="email"
          className="bg-white rounded"
        />
      </div>
      <div className=" flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          ref={passwordRef}
          type="text"
          id="password"
          className="bg-white rounded"
        />
      </div>
      {error && <h1 className="text-red-500 font-bold text-center">{error}</h1>}
      {isLoading && <h1>Loading...</h1>}
      <button type="submit" className=" bg-rose-300 mt-2 rounded  ">
        Submit
      </button>
    </form>
  );
};

export default Login;
