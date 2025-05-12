import { useRef, useState } from "react";
import WebcamFeed from "../components/WebcamFeed";
import { loadModels, getFaceDescriptor, compareDescriptors } from "../lib/faceUtils";
import { db } from "../lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import Webcam from "react-webcam";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/state";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CustomInputField from "@/components/CustomInputField";
import Head from "next/head";
import { averageDescriptors } from "@/utils/faceUtilsHelpers";




const Register = () => {
const canvasRef = useRef<HTMLCanvasElement>(null); // canvasRef
  const webcamRef = useRef<Webcam>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !firstName || !lastName) {
      toast.error("Please fill all fields");
      return;
    }
  
    try {
      setIsLoading(true);
      toast.info("Loading models and scanning...");
  
      // Load models for face detection
      await loadModels();
  
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) {
        toast.error("Webcam is not ready. Please wait or refresh.");
        return;
      }
  
      // Check if user with same email already exists
      const existingDoc = await getDoc(doc(db, "faceUsers", email.trim()));
      if (existingDoc.exists()) {
        toast.error("User already exists with this email");
        return;
      }
  
      const descriptors: Float32Array[] = [];
  
      // Attempt to collect 3 valid descriptors with 500ms delay
      for (let i = 0; i < 5; i++) {
        const descriptor = await getFaceDescriptor(video, canvasRef.current ?? undefined);
        if (descriptor) descriptors.push(descriptor);
  
        if (descriptors.length === 3) break;
        await new Promise((res) => setTimeout(res, 500));
      }
  
      if (descriptors.length < 1) {
        toast.error("No face detected. Please ensure good lighting and try again.");
        return;
      }
  
      // Average face descriptors
      const averagedDescriptor = averageDescriptors(descriptors);
  
      // Check if this face already exists in the database
      const querySnapshot = await getDocs(collection(db, "faceUsers"));
      for (const docSnap of querySnapshot.docs) {
        const storedDescriptor = new Float32Array(docSnap.data().descriptor);
        const distance = compareDescriptors(averagedDescriptor, storedDescriptor);
  
        // Log distances (optional during development)
        // console.log("Distance with user", docSnap.id, ":", distance);
  
        if (distance < 0.45) {
          toast.error("A user with this face already exists");
          return;
        }
      }
  
      // Save new user to Firestore
      await setDoc(doc(db, "faceUsers", email.trim()), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        descriptor: Array.from(averagedDescriptor),
      });
  
      setUser({ email, firstName, lastName });
      toast.success("Registration successful!");
      router.push("/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error(`An error occurred during registration: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  const isDisabled = isLoading || !email || !firstName || !lastName;
  return (
    <main>
      <Head>
        <title>Register</title>
      </Head>
      <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center px-3">
        <h1 className="text-base font-bold text-white uppercase mb-4">
          Signup
        </h1>

        <div className="flex flex-col items-center justify-center p-4 w-[300px] sm:w-[400px] bg-white rounded-2xl shadow-2xl">
          <CustomInputField
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
          />
          <CustomInputField
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
          />
          <CustomInputField
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <WebcamFeed videoRef={webcamRef} canvasRef={canvasRef} isScanning={isLoading} />

          <button
            onClick={handleRegister}
            className={`${isDisabled ? 'bg-gray-400' : 'bg-green-800'} text-white font-bold py-2 px-4 rounded mt-3`}
            disabled={isDisabled}
          >
            {isLoading ? "Registering..." : "Register Face"}
          </button>
        </div>
        <p className="text-base text-white text-center mt-3">
          Already have an account?{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </main>
  );
};

export default Register;
