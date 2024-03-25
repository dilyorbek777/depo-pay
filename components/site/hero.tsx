import React from "react";
import { Button } from "../ui/button";
import Cards from "./cards";
import PaymentData from "./payment-data";
import Whypp from "./whypp";
import Pros from "./pros";
import EyeProtection from "./eyeProtection";
import CustomImage from "./customImage";

export default function Hero() {
  return (
    <div className="w-full min-h-screen bg-white px-7">
      <div className="max-w-[1440px] mx-auto bg-cvr bg-blue-300 rounded-2xl py-20 min-h-[80vh] flex justify-center items-start relative">
        <div className="flex flex-col justify-center items-center py-5 gap-9">
          <h1 className="text-6xl font-bold text-primary text-center max-sm:text-4xl ">
            Ready To Launch Your <br /> Online{" "}
            <span className="text-white">Payment </span>App
          </h1>
          <p className="text-2xl text-primary text-center max-sm:text-lg">
            A simple yet modern solution to showcase your app
          </p>
          <Button id="get-started"
            area-label={"Get Started"} 
            role="none"
            className="bg-primary text-white px-5 py-3 rounded-md"
          >
            Get Started
          </Button>
        </div>
        <CustomImage
          nameclass="absolute top-0 left-1/2 transform -translate-x-[48%] translate-y-[40%] z-20 max-w-[500px] max-lg:max-w-[350px] max-lg:translate-y-[70%] max-[400px]:translate-y-[85%] max-[400px]:w-[300px]"
          img="/hero.png"
          title="Ready To Launch Your "
        />
      </div>
      <div className="max-w-[1440px] mx-auto rounded-2xl bg-background py-20 h-screen flex justify-center items-end mt-12 max-xl:h-[130vh] max-lg:min-h-screen">
        <div className="flex flex-col justify-center items-center py-5 gap-9 px-2">
          <Cards />
        </div>
      </div>
      <PaymentData />
      <Whypp />
      <Pros />
      <EyeProtection />
    </div>
  );
}
