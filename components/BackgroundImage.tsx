import React from 'react';

// Define the type for the imageUrl prop
interface BackgroundImageProps {
  imageUrl: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ imageUrl }) => {
  const backgroundImageStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
  };

  return <div style={backgroundImageStyle}></div>;
};

export default BackgroundImage;
