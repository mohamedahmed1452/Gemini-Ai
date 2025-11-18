
import React from 'react';
import { ImageGen } from '../types';
import { ImageIcon } from './icons';

interface ImageViewProps {
  images: ImageGen[];
}

const ImageView: React.FC<ImageViewProps> = ({ images }) => {
  return (
    <div className="h-full">
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <ImageIcon className="w-16 h-16 mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2 text-gray-300">Image Generation</h2>
          <p>Describe the image you want to create.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-800">
              <img src={img.src} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/70 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm">{img.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageView;
