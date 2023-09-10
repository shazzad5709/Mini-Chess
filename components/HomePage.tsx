import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BackgroundImage from '../components/BackgroundImage';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useRouter } from 'next/router';

function HomePage() {
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
        <title>Mini Chess</title>
      </Head>
      {/* Background image with opacity */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: `url('/BackgroundImage.jpg')`,
          backgroundSize: '100% 100%', // Cover the entire container
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', // Prevent repeating the image
          opacity: 0.7, // Adjust the opacity as needed
        }}
      ></div>

      <div className="container mx-auto flex flex-col justify-center items-center h-screen relative">
        {/* Glowing title */}
        <h1 className="text-5xl font-bold text-white mb-8 animate-pulse">
          Mini Chess
        </h1>
        
        <div className="space-y-4 text-center">
          <Button
            text="Play"
            onClick={handlePlayClick}
            className="bg-golden hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full w-48 h-16"
          /> <br />
          <Button
            text="Rules"
            onClick={handleRulesClick}
            className="bg-golden hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full w-48 h-16"
          /> <br />
          <Button
            text="Settings"
            onClick={handleSettingsClick}
            className="bg-golden hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full w-48 h-16"
          />
        </div>
      </div>
      <Modal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)}>
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-4">MiniChess Rules</h2>
    <p className="mb-2">
      MiniChess is a simplified version of chess played on a 5x5 board. The game follows these basic rules:
    </p>
    <ul className="list-disc ml-6">
      <li>Each player starts with 4 pawns and 1 king.</li>
      <li>The pawns move one square forward or capture diagonally forward.</li>
      <li>The king can move one square in any direction.</li>
      <li>There is no castling, en passant, or promotion.</li>
      <li>The objective is to checkmate the opponent's king.</li>
    </ul>
    <p className="mt-4">
      These are the fundamental rules of MiniChess. You can explore variations and strategies as you play.
    </p>
  </div>
</Modal>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
         
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
