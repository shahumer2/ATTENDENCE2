import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import loginImage from '../../assets/images/attendence.jpg'; // Make sure the path is correct
import useSignIn from "../../hooks/useSignIn.js"
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
const {handleSubmit,initialValues} = useSignIn()
  

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(3, 'Minimum 6 characters'),
  });



  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="absolute bottom-10 left-10 z-10 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-xl">Sign in to access Attendence And Payroll</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center md:w-1/2 w-full px-8 py-16 bg-gray-50">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Sign In</h2>
          <p className="text-center text-gray-600 mb-6">Enter your credentials to continue</p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Field
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-10 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <Field type="checkbox" name="remember" className="mr-2" />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Don’t have an account?{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
