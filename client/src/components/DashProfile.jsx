import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashProfile() {

  //fetching the user from global state to see if any user's logged in or not
  const { currentUser } = useSelector((state) => state.user);
  //we need to contain the image file in some varibale
  const [imageFile, setImageFile] = useState(null);
  //for converting the image file into url
  const [imageFileUrl, setImageFileUrl] = useState(null);
  //for tracking and showing image file uploading progress
  const [imageFileUploadingProgress,setImageFileUploadingProgress]=useState(0);
  //for tracking incase any error happens in the uploading
  const [imageFileUploadError,setImageFileUploadError]=useState(null);

  //we want to upload the image by clicking on the image itself so we make the input hidden and ref (filePickerRef) it to the div using useRef hook
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  //anytime we upload an image the useEffect will run and it will save the image to the database
  useEffect(()=>{
    if(imageFile){
      //this function saves the image to the db
      uploadImage();
    }
  },[imageFile]);


  const uploadImage=async()=>{
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2*1024*1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    setImageFileUploadError(null);
    const storage=getStorage(app);
    const fileName=new Date().getTime()+imageFile.name;
    const storageRef=ref(storage,fileName);
    //to keep track of the uploading we need an object
    const uploadTask=uploadBytesResumable(storageRef,imageFile);
    
    //tracking the uploading
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        //to know how much (in percentage) of our file is uploaded
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError('Could not upload image(File must be wihin 2MB');
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      //now we want to get a download url for the image
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          //this is the url we are going to save inside our database once user hits the update button
          setImageFileUrl(downloadURL);
          
        });
      }
    );
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/.*"
          onChange={handleImageChange}
          ref={filePickerRef} hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar value={imageFileUploadingProgress || 0} text={`${imageFileUploadingProgress}%`}
            strokeWidth={5}
            styles={{
              root:{
                width:'100%',
                height:'100%',
                position:'absolute',
                top:0,
                left:0,
              },
              path:{
                stroke:`rgba(62,152,199,${imageFileUploadingProgress/100})`,
              },

            }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.rest.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress<100 && 'opacity-60'}`}
          />
        </div>

        {imageFileUploadError && <Alert color='failure' >{imageFileUploadError}</Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.rest.username}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="example@hotmail.com"
          defaultValue={currentUser.rest.email}
        />

        <TextInput type="password" id="password" placeholder="********" />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>

        <div className="text-red-500 flex justify-between mt-2">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
}

export default DashProfile;
