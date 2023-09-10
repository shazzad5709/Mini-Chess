import React, { useState } from 'react';
import Head from 'next/head';
import BackgroundImage from '../components/BackgroundImage';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useRouter } from 'next/router';


const HomePage = () => {
  const backgroundImageUrl = '/path/to/your/background-image.jpg';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handlePlayClick = () => {
    
    router.push('/play');

  };

  const handleSettingsClick = () => {
    // Add your logic for the Settings button here
  };

  const handleRulesClick = () => {
    // Add your logic for the Rules button here
  };

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <BackgroundImage imageUrl={backgroundImageUrl} />
      <div className="container mx-auto flex flex-col justify-center items-center h-screen">
        <div className="space-y-4 text-center">
          <Button
            text="Play"
            onClick={handlePlayClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          /> <br />
          <Button
            text="Settings"
            onClick={handleSettingsClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
          /> <br />
          <Button
            text="Rules"
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full"
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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

    </>
  );
};

export default HomePage;
