import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        if (res.ok) {
          setPost(data.posts[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <div className="flex justify-center min-h-screen items-center">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl lg:text-4xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto">
        {post && post.title}
      </h1>

      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">{post && post.category}</Button>
      </Link>

      <img src={post&& post.image} alt="Post-Image" className="w-full max-w-4xl mt-10 p-3 max-h-[600px] object-cover self-center" />
      
      <div className="flex justify-between p-3 border-b border-slate-600 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic"> {post && (post.content.length/1000).toFixed(0)} mins read</span>
      </div>
      <div  dangerouslySetInnerHTML={{__html: post && post.content}} className="post-content w-full max-w-2xl p-3 mx-auto"></div>
    </main>
  );
}

export default PostPage;
