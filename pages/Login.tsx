import React from 'react';
import AuthForm from '../components/AuthForm';
import Navbar from '../components/Navbar';

const Login: React.FC = () => {
    return (
        <div className="min-h-screen bg-page relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-smile-light/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-smile-mid/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob delay-200"></div>
            </div>

            <div className="flex-grow flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
};

export default Login;
