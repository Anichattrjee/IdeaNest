import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center max-w-3xl mx-auto">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about Docker?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources for learning Docker
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a className="inline-block "
            href="https://www.docker.com/resources/trainings/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Docker
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://tech.osteel.me/images/2020/03/04/docker-introduction-01.jpg" />
      </div>
    </div>
  );
}
