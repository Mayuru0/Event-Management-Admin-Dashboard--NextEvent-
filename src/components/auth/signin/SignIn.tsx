"use client"; // Mark this as a Client Component

import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation"; 
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useLoginMutation } from "@/Redux/features/authApiSlice";
import { setCredentials, selectuser } from "@/Redux/features/authSlice";
import Swal from "sweetalert2";
import type {  LoginResponse } from "@/type/user";


const SignIn: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  

  const [errors, setErrors] = useState({ email: "", password: "", });

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const user = useSelector(selectuser);


  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const response = (await login(formData).unwrap()) as unknown as LoginResponse;

  
      const userData = response?.user;
      const token = response?.token;
  
      if (!userData || !token) {
        throw new Error("Invalid response format from server");
      }
  
      // Check if user is an admin
      if (userData.role !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only admin users can log in.",
        });
        return;
      }
  
      dispatch(setCredentials({ user: userData, token }));
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful",
      });
  
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      console.error("Login error details:", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Something went wrong during login",
      });
    }
  };
  
  
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);
  

  return (
  
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Breadcrumb pageName="Sign In" />

        <div className="w-full max-w-lg p-8 bg-white py-20 rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
            Admin Login
          </h2>

          

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="mb-5">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              >
                Sign In
              </button>
            </div>

            {/* Uncomment if you want a sign-up link */}
            {/* <div className="mt-6 text-center">
              <p>
                Don’t have an account?{" "}
                <Link href="/auth/signup" className="text-primary">
                  Sign Up
                </Link>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    
  );
};

export default SignIn;