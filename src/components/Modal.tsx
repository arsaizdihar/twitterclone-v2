import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface Props {
  open?: boolean;
  onClose: () => void;
  title?: string;
  small?: boolean;
  titleLeft?: boolean;
  noCorner?: boolean;
  children?: React.ReactNode;
}

const Modal: React.FC<Props> = ({
  open,
  onClose,
  title,
  children,
  small,
  ...props
}) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center bg-black dark:bg-gray-200 bg-opacity-30 dark:bg-opacity-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`inline-block w-full ${
                  small ? "max-w-xs" : "max-w-lg"
                } ${
                  props.noCorner ? "" : "p-6"
                } my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-black shadow-xl rounded-2xl`}
              >
                {title !== undefined && (
                  <Dialog.Title
                    as="h3"
                    className={`${
                      small ? "text-lg" : "text-xl"
                    } font-bold leading-6 text-black dark:text-gray-200 ${
                      props.titleLeft ? "" : "text-center"
                    }`}
                  >
                    {title}
                  </Dialog.Title>
                )}
                {children}
                {/* <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </button>
                </div> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
