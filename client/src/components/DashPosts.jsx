import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showmore, setShowmore]=useState(true);

  //run this useEffect code each time the currentuser changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser.rest._id}`
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length<9)
          {
            setShowmore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    //if currentuser is an admin then  only show his own posts
    if (currentUser.rest.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore=async()=>{
    try {
      const startIndex=userPosts.length;

      const res=await fetch(`/api/post/getposts?userId=${currentUser.rest._id}&startIndex=${startIndex}`);

      const data=await res.json();
      
      if(res.ok)
      {
        setUserPosts((prev)=>[...prev, ...data.posts]);
        if(data.posts.length<9)
        {
          setShowmore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.rest.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span className="hidded md:block">Edit</span>
              </Table.HeadCell>
            </Table.Head>

            {userPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell className="font-medium dark:text-white text-gray-900">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>

                  <Table.Cell>{post.category}</Table.Cell>

                  <Table.Cell className=" font-medium hover:underline hover:cursor-pointer text-red-700">
                    <span>Delete</span>
                  </Table.Cell>

                  <Table.Cell className="text-teal-500">
                    <Link to={`/update-post/${post._id}`}>Edit</Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showmore && 
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show More</button>
          }
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}

export default DashPosts;
