import { Slide, toast, ToastContent, ToastOptions } from 'react-toastify';

export const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  transition: Slide,
};

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

/**
 * Display toast
 *
 * @param {ToastType} type
 * @param {ToastContent} content
 * @param {ToastOptions} [options=defaultToastOption]
 * @return {Id}
 */
export const showToast = (
  type: ToastType,
  content: ToastContent,
  options: Partial<ToastOptions> = {},
) => {
  const optionsToApply = { ...defaultToastOptions, ...options };
  const isOnline = typeof window !== 'undefined' && window.navigator.onLine;
  const isNetworkError =
    typeof content === 'string' && content.includes('Failed to fetch');

  switch (type) {
    case 'success':
      return toast.success(content, optionsToApply);
    case 'error':
      if (!isOnline && isNetworkError) {
        return;
      }
      return toast.error(content, optionsToApply);
    case 'info':
      return toast.info(content, optionsToApply);
    case 'warning':
      return toast.warn(content, optionsToApply);
    case 'default':
      return toast(content, optionsToApply);
    default:
      return toast(content, optionsToApply);
  }
};
