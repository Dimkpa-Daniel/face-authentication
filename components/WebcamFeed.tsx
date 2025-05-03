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

import React from 'react';
import Webcam from 'react-webcam';

type Props = {
  videoRef: React.RefObject<Webcam | null>;
  isScanning?: boolean;
};

const WebcamFeed = ({ videoRef, isScanning = false }: Props) => {
  return (
    <div className="relative w-full max-w-md aspect-video border border-gray-300 rounded overflow-hidden h-[250px]">
      <Webcam
        ref={videoRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="w-full h-[250px] object-cover"
      />
      {isScanning && (
        <div className="absolute inset-0 z-10 bg-transparent bg-opacity-30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scanner-line animate-scan" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamFeed;

