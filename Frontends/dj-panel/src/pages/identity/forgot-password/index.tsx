import React, { useState } from "react";
import './index.css';
import { UsersService } from "../../../services/users-service";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordComponent = () => {

    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Password reset link sent to:', email);
        UsersService.forgotPassword(email)
            .then(response => {
                console.log('Password reset link sent:', response);
            })
            .catch(error => {
                console.error('Error sending password reset link:', error);
            });
            
        setEmail('');
        navigate('/users/login');
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 content-container">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                <p className="mb-4 text-gray-600">Enter your email address to reset your password.</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Send Reset Link</button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">Remembered your password? <a href="/users/login" className="text-blue-500 hover:underline">Login</a></p>
            </div>
        </div>
    );
}