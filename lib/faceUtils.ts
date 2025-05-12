import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';

export const loadModels = async () => {
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ]);
};

export const getFaceDescriptor = async (
  video: HTMLVideoElement,
  canvas?: HTMLCanvasElement
): Promise<Float32Array | null> => {
  if (!video || video.readyState < 2) return null;

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 512,
    scoreThreshold: 0.5,
  });

  try {
    const detection = await faceapi
      .detectSingleFace(video, options)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.warn("No face detected.");
      return null;
    }

    const { width, height } = detection.detection.box;
    if (width < 100 || height < 100) {
      toast.warning("Face too small, move closer to the camera.");
      return null;
    }

    if (canvas) {
      // Clear previous drawing
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Resize canvas to video size
      faceapi.matchDimensions(canvas, {
        width: video.videoWidth,
        height: video.videoHeight,
      });

      const resized = faceapi.resizeResults(detection, {
        width: video.videoWidth,
        height: video.videoHeight,
      });

      faceapi.draw.drawDetections(canvas, resized);
    }

    return detection.descriptor;
  } catch (error) {
    console.error("Error in getFaceDescriptor:", error);
    return null;
  }
};

export const compareDescriptors = (d1: Float32Array, d2: Float32Array): number => {
  return faceapi.euclideanDistance(d1, d2);
};
