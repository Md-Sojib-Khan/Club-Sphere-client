import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure()

    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered!',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Your password is too weak — use 6+ characters.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/missing-password': 'Please enter your password.',
        'default': 'Something went wrong. Please try again.'
    };

    const handleRegistration = (data) => {
        console.log(data)
        createUser(data.email, data.password)
            .then(() => {
                const userInfo = {
                    email: data.email,
                    displayName: data.name,
                    photoURL: data.photo,
                    role: 'member',
                    createdAt: new Date()
                }
                axiosSecure.post('/users', userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            console.log('user created in database');
                        }
                    })

                const userProfile = {
                    displayName: data.name,
                    photoURL: data.photo
                }

                updateUser(userProfile)
                    .then(() => {
                        toast.success('SignUp successfully')
                        navigate(location.state || '/');
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => {
                const message = errorMessages[error.code] || errorMessages.default;
                toast.error(message);
            })
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center">Welcome to Club Sphere</h3>
            <p className='text-center'>Please Register</p>
            <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
                <fieldset className="fieldset">
                    {/* name field */}
                    <label className="label">Name</label>
                    <input type="text"
                        {...register('name', { required: true })}
                        className="input"
                        placeholder="Your Name" />
                    {errors.name?.type === 'required' && <p className='text-red-500'>Name is required.</p>}

                    {/* photo image field */}
                    <label className="label">Photo</label>

                    <input type="text" {...register('photo', { required: true })} className="input" placeholder="Your Photo" />

                    {errors.name?.type === 'required' && <p className='text-red-500'>Photo is required.</p>}

                    {/* email field */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email?.type === 'required' && <p className='text-red-500'>Email is required.</p>}

                    {/* password */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', {
                        required: true,
                        minLength: 6,
                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                    })} className="input" placeholder="Password" />
                    {
                        errors.password?.type === 'required' && <p className='text-red-500'>Password is required.</p>
                    }
                    {
                        errors.password?.type === 'minLength' && <p className='text-red-500'>
                            Password must be 6 characters or longer
                        </p>
                    }
                    {
                        errors.password?.type === 'pattern' && <p className='text-red-500'>Password must have at least one uppercase, at least one lowercase, at least one number, and at least one special characters</p>
                    }

                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p>Already have an account <Link
                    state={location.state}
                    className='text-blue-400 underline'
                    to="/login">Login</Link></p>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Register;