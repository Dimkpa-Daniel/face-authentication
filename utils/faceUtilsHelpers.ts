
// Averages multiple face descriptors into a single descriptor

export const averageDescriptors = (descriptors: Float32Array[]): Float32Array => {
    const length = descriptors[0].length;
    const avg = new Float32Array(length);
  
    descriptors.forEach((desc) => {
      for (let i = 0; i < length; i++) {
        avg[i] += desc[i];
      }
    });
  
    for (let i = 0; i < length; i++) {
      avg[i] /= descriptors.length;
    }
  
    return avg;
  };
  