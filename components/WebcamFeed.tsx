// import React, { RefObject } from 'react';
// import Webcam from 'react-webcam';

// interface Props {
//   videoRef: RefObject<Webcam | null>;
// }

// const WebcamFeed: React.FC<Props> = ({ videoRef }) => {
//   return (
//     <Webcam
//       ref={videoRef}
//       audio={false}
//       screenshotFormat="image/jpeg"
//       width={320}
//       height={240}
//       videoConstraints={{ facingMode: 'user' }}
//     />
//   );
// };

// export default WebcamFeed;
import React, { useEffect } from 'react';
import Webcam from 'react-webcam';

type Props = {
  videoRef: React.RefObject<Webcam | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isScanning?: boolean;
};

const WebcamFeed = ({ videoRef, canvasRef, isScanning = false }: Props) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        isScanning &&
        videoRef.current?.video &&
        canvasRef.current &&
        videoRef.current.video.readyState >= 2
      ) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }, 1000); // clear face box every second

    return () => clearInterval(interval);
  }, [isScanning, videoRef]);

  return (
    <div className="relative w-full max-w-md aspect-video border border-gray-300 rounded overflow-hidden h-[250px] sm:h-[200px]">
      <Webcam
        ref={videoRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="w-full h-[250px] sm:h-[200px] object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
      />
      {isScanning && (
        <div className="absolute inset-0 z-10 bg-black opacity-65">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scanner-line animate-scan" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamFeed;
