import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Signin() {
  const [formData, setFormData]=useState({});
  const {loading, error:errorMessage}=useSelector((state)=>state.user);

  const navigate=useNavigate();
  const dispatch=useDispatch();


  //for handling changes in the signup form
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }

  //for handling submission of signup form
  const handleSubmit= async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password)
    {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res= await fetch('/api/auth/signin',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
      });

      const data=await res.json();

      //if successfully not registered show the error
      if(data.success===false)
      {
        dispatch(signInFailure(data.message));
      }

      //if successfully regiustered then move to sign-in page
      if(res.ok)
      {
        dispatch(signInSuccess(data));
        navigate('/home')
      }
      
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-8">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-lg text-white">
              TechTalker
            </span>
          </Link>

          <p className="text-sm mt-5">
            TechTalker is a dynamic blog website that offers a variety of
            engaging and informative content. It serves as a hub for readers
            seeking insights, tips, and updates across diverse topics.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email"></Label>
              <TextInput type="email" placeholder="example@gmail.com" id="email" onChange={handleChange}/>
            </div>
            <div>
              <Label value="Your Password"></Label>
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
            </div>

            <Button gradientDuoTone='purpleToPink' type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className="pl-3">Loading...</span>
                  </>
                ):(
                  'Sign-in'
                )
              }
            </Button>
            <OAuth/>
          </form>

          <div className="flex gap-2 mt-5 text-sm">
            <span>New to TechTalker?</span>
            <Link to="/sign-up" className="text-blue-500">
            Sign Up</Link>
          </div>

          {
            errorMessage && 
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          }
        </div>
      </div>
    </div>
  );
}
