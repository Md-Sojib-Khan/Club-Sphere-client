import React from 'react';
import { useForm } from 'react-hook-form';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { logInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        console.log('form data', data);
        logInUser(data.email, data.password)
            .then(() => {
                toast.success("Login Successfully")
                navigate(location?.state || '/')
            })
            .catch(error => {
                if (error.code === 'auth/invalid-credential') {
                    toast.error("Invalid email or password ❌");
                } else if (error.code === 'auth/user-not-found') {
                    toast.error("No user found with this email ❗");
                } else if (error.code === 'auth/wrong-password') {
                    toast.error("Wrong password, try again!");
                } else {
                    toast.error(`Login failed: ${error.code}`);
                }
            })
    }

    return (
        <div>
            <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
                <h3 className="text-3xl text-center">Welcome back</h3>
                <p className='text-center'>Please Login</p>
                <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
                    <fieldset className="fieldset">
                        {/* email field */}
                        <label className="label">Email</label>
                        <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
                        }

                        {/* password field */}
                        <label className="label">Password</label>
                        <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters  or longer </p>
                        }


                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-neutral mt-4">Login</button>
                    </fieldset>
                    <p>New to Club Sphere <Link
                        state={location.state}
                        className='text-blue-400 underline'
                        to="/register">Register</Link></p>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Login;