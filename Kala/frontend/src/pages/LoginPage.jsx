import axios from '../api/axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const[email,setEmail] = useState('');
    const[password,setPassword]= useState('');
    const[error,setError]=useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const userInfo = localStorage.getItem('userInfo');
        if(userInfo){
            navigate('/dashboard');
        }
    },[navigate]);

    const submitHandler = async(e)=>{
        e.preventDefault();
        try{
            const config = {headers:{'Content-Type':'application/json'}};
            const {data} = await axios.post('/users/login',{email,password},config);
            localStorage.setItem('userInfo',JSON.stringify(data));
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message||'An error occurred');
        }
    };


  return (
    <div className="container mx-auto flex justify-center items-center py-12 px-6">
      <div className="w-full max-w-md">
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Artist Login</h1>
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
          )}
          <div className="mb-4">
            <label className='block text-gray-700 text-sm font-bold mb-2"'>
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </button>
            <Link to="/register">New Artist?Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage