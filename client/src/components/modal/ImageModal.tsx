import React from "react";
import Modal from "./modal";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  if (!src) return null;

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className=' w-150 h-150'>
          <img src={src} className=' object-cover' />
        </div>
      </Modal>
    </div>
  );
};

export default ImageModal;
