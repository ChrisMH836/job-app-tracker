import {Outlet} from 'react-router';


const JobModalLayout = () => {

    return (
        <div className='absolute inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center'><h1>Job Modal Layout</h1>
        <Outlet />
        </div>
    );
}

export default JobModalLayout;