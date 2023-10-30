import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as='div' className='relative z-50 h-full' onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className=' fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>
        <div className=' fixed inset-0 z-10 overflow-x-auto'>
          <div className=' flex min-h-full items-center justify-center text-center'>
            <Transition.Child
              as={React.Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4'
              enterTo='opacity-100 translate-y-0'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-4'>
              <Dialog.Panel className=' relative transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xsl transition-all w-1/4'>
                <div className=' absolute right-0 top-0 pt-4 pr-4 z-10'>
                  <button
                    type='button'
                    className=' rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                    onClick={onClose}>
                    <span className='sr-only'>Close Panel</span>
                    <IoClose className=' w-6 h-6' />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
