// Create a new component named Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
    <div className="modal bg-white w-1/2 p-4 rounded-lg shadow-lg">
      <button
        className="close-btn absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        Close
      </button>
      {children}
    </div>
  </div>
  );
};

export default Modal;
