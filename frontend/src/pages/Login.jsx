import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import graphic from '../assets/graphic.png';
import catLogo from '../assets/cat-logo.png';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', { 
        email, password
      });
      localStorage.setItem('token', data.token); // NOSONAR
      localStorage.setItem('userName', data.name); // NOSONAR
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">

      <div className="hidden lg:flex lg:w-1/2 bg-purple-800 justify-center items-center p-12">
         <div className="text-white text-opacity-80 text-xl font-medium tracking-wider">
            <img 
            src={graphic} 
            alt="Welcome graphic" 
            className="w-full max-w-md object-contain drop-shadow-lg" 
         />
         </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-16 md:px-24 py-8 justify-center relative">
       <div className="absolute top-8 left-8 sm:left-16 md:left-24 font-bold text-xl text-purple-700 flex items-center gap-2">
          <img 
            src={catLogo} 
            alt="Notely Cat Logo" 
            className="h-8 w-auto object-contain" 
          />
          Notely
        </div>

        <div className="w-full max-w-sm mx-auto mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8 text-sm">Please enter your details</p>
          
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email address</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-2.5 px-4  bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md transition duration-200 mb-4"
            >
              Sign in
            </button>
          </form>
          
          <p className="mt-8 text-sm text-center text-gray-600">
            Don't have an account? <Link to="/register" className="text-purple-600 hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>

    </div>
  );
}