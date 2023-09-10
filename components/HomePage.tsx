import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BackgroundImage from '../components/BackgroundImage';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useRouter } from 'next/router';

function HomePage() {
  const backgroundImageUrl = '/path/to/your/background-image.jpg';
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // Default theme is light
  const [soundOn, setSoundOn] = useState(true); // Default sound is on
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const audio = new Audio('/sound.mp3'); // Create Audio object here

    if (soundOn) {
      audio.play(); // Play the audio if soundOn is true
    } else {
      audio.pause(); // Pause the audio if soundOn is false
      audio.currentTime = 0; // Reset audio to the beginning
    }

    return () => {
      // Clean up the audio when the component unmounts
      audio.pause();
      audio.currentTime = 0;
    };
  }, [soundOn]);

  const handlePlayClick = () => {
    router.push('/play'); // Use the router to navigate
  };

  const handleRulesClick = () => {
    setIsRulesModalOpen(true);
  };

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleSoundToggle = () => {
    setSoundOn(!soundOn); // Toggle soundOn state
  };

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      {/* <BackgroundImage imageUrl={backgroundImageUrl} /> */}
      <div className="container mx-auto flex flex-col justify-center items-center h-screen">
        <div className="space-y-4 text-center">
          <Button
            text="Play"
            onClick={handlePlayClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          />
          <Button
            text="Rules"
            onClick={handleRulesClick}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full"
          />
          <Button
            text="Settings"
            onClick={handleSettingsClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
          />
        </div>
      </div>
      <Modal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)}>
        {/* Rules content */}
      </Modal>
      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <div className="mb-4">
            <p className="mb-2">Theme:</p>
            <button
              className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </button>
          </div>
          <div>
            <p className="mb-2">Sound:</p>
            <button
              className={`sound-option ${soundOn ? 'selected' : ''}`}
              onClick={handleSoundToggle}
            >
              {soundOn ? 'Sound On' : 'Sound Off'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default HomePage;
