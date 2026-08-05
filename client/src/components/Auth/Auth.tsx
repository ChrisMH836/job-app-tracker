import { Outlet } from 'react-router';

const Auth = () => {
  return (
    <div className=" w-full h-full flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default Auth;
