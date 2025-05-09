import { useRef, useState } from "react";
import WebcamFeed from "../components/WebcamFeed";
import {
  loadModels,
  getFaceDescriptor,
  compareDescriptors,
} from "../lib/faceUtils";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Webcam from "react-webcam";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/state";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CustomInputField from "@/components/CustomInputField";
import Head from "next/head";
import { averageDescriptors } from "@/utils/faceUtilsHelpers";

const Login = () => {
  const webcamRef = useRef<Webcam>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  const handleLogin = async () => {
    // Ensure email is provided
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Scanning face...");
      // Load face detection models
      await loadModels();

      const video = webcamRef.current?.video;
      if (!video) {
        toast.error("Webcam not accessible");
        return;
      }

      const descriptors: Float32Array[] = [];

      // Capture multiple face descriptors with delay to increase reliability
      for (let i = 0; i < 5; i++) {
        const desc = await getFaceDescriptor(video);
        if (desc) descriptors.push(desc);
        if (descriptors.length === 3) break;
        await new Promise((res) => setTimeout(res, 500));
      }

      if (descriptors.length < 1) {
        toast.error("No face detected. Please try again.");
        return;
      }

      const averagedDescriptor = averageDescriptors(descriptors);

      // Fetch stored face descriptor from Firestore using email
      const docRef = doc(db, "faceUsers", email);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        toast.error("No user found.");
        return;
      }

      // Compare current face with stored descriptor
      const storedDescriptor = new Float32Array(snapshot.data().descriptor);
      const distance = compareDescriptors(averagedDescriptor, storedDescriptor);
      console.log("Computed face distance:", distance); // Log it for debugging

      // A threshold distance of < 0.4 means a match
      if (distance < 0.4) {
        const { firstName, lastName } = snapshot.data();
        setUser({ email, firstName, lastName });
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Face does not match.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Head>
        <title>Login</title>
      </Head>
      <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center px-3">
        <h1 className="text-base font-bold text-white text-center uppercase mb-4">
          Login
        </h1>
        <div className="flex flex-col items-center justify-center p-4 w-[300px] sm:w-[400px] bg-white rounded-2xl shadow-2xl">
          <CustomInputField
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <WebcamFeed videoRef={webcamRef} isScanning={isLoading} />
          <button
            onClick={handleLogin}
            className="bg-green-800 text-white font-bold py-2 px-4 rounded mt-3"
            disabled={isLoading || !email}
          >
            {isLoading ? "Logging in..." : "Login with Face"}
          </button>
        </div>
        <p className="text-base text-white text-center mt-3">
          Don’t have an account?{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Register
          </span>
        </p>
      </div>
    </main>
  );
};

export default Login;
