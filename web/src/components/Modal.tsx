import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isNotStepOne: boolean
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, isNotStepOne }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-start md:items-center bg-black/50">
      <div className="bg-[#2C3E50] p-6 rounded-md shadow-lg relative">
        <Icon icon="material-symbols:close" width="24" height="24" className={` ${isNotStepOne? 'block': 'hidden'} absolute hover:bg-white transition-colors duration-200 cursor-pointer rounded-full text-textColor top-4 right-4`} onClick={onClose}/>
        {children}
      </div>
    </div>
  );
};

export default Modal;
