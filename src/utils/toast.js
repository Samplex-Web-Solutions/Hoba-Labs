import { toast, Slide } from 'react-toastify';

export const showToast = {
  success: (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      transition: Slide,
    }),
  error: (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      transition: Slide,
    }),
};