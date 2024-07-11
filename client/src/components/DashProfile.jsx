import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice.js";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashProfile() {
  //fetching the user from global state to see if any user's logged in or not
  const { currentUser, error } = useSelector((state) => state.user);
  //we need to contain the image file in some varibale
  const [imageFile, setImageFile] = useState(null);
  //for converting the image file into url
  const [imageFileUrl, setImageFileUrl] = useState(null);
  //for tracking and showing image file uploading progress
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(0);
  //for tracking incase any error happens in the uploading
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  //for keeping the data of the edit profile form
  const [formData, setFormData] = useState(null);
  //to make sure image is successfully uploaded
  const [imageFileUploading, setImageFileUploading] = useState(false);
  //to track if user is successfully updated or not
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  //to track if there's any error while updating the user or not
  const [updateUserError, setUpdateUserError] = useState(null);
  //for showing the modal of deleting a user
  const [showModal, setShowModal] = useState(false);

  //initialize dispatch
  const dispatch = useDispatch();

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
  useEffect(() => {
    if (imageFile) {
      //this function saves the image to the db
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
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
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    //to keep track of the uploading we need an object
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    //tracking the uploading
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //to know how much (in percentage) of our file is uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image(File must be wihin 2MB"
        );
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      //now we want to get a download url for the image
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //this is the url we are going to save inside our database once user hits the update button
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
          //save the form data
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    //check if object is unchanged(means empty form submission)
    console.log(formData);
    if (formData === null) {
      setUpdateUserError("No Changes Made.");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Wait for image to upload.");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser.rest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(data.message));
      updateUserError(data.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      
      const res = await fetch(`/api/user/delete/${currentUser.rest._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data.message));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32  self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.rest.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.rest.username}
          onChange={handleChange}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="example@hotmail.com"
          defaultValue={currentUser.rest.email}
          onChange={handleChange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="********"
          onChange={handleChange}
        />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-2">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}

      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="sm"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
