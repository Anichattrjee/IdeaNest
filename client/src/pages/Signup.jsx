import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-8">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-lg text-white">
              Blogosphere
            </span>
          </Link>

          <p className="text-sm mt-5">
            Blogosphere is a dynamic blog website that offers a variety of
            engaging and informative content. It serves as a hub for readers
            seeking insights, tips, and updates across diverse topics.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your Username"></Label>
              <TextInput type="text" placeholder="Username" id="username"/>
            </div>
            <div>
              <Label value="Your Email"></Label>
              <TextInput type="text" placeholder="example@gmail.com" id="email"/>
            </div>
            <div>
              <Label value="Your Password"></Label>
              <TextInput type="text" placeholder="Password" id="password"/>
            </div>

            <Button gradientDuoTone='purpleToPink' type="submit">
              Sign Up
            </Button>
          </form>

          <div className="flex gap-2 mt-5 text-sm">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
            Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
