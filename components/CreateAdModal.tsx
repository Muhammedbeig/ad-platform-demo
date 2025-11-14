import React from 'react';
import { XIcon } from './icons';
import CreateAdForm from './CreateAdForm';

interface CreateAdModalProps {
  onClose: () => void;
}

const CreateAdModal: React.FC<CreateAdModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Create a New Advertisement
            </h2>
            <p className="text-slate-500 mt-1">
              Fill out the details to post your ad.
            </p>
          </div>
          <button
            onClick={onClose}
            className="-mt-2 -mr-2 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
          >
            <XIcon />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <CreateAdForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CreateAdModal;