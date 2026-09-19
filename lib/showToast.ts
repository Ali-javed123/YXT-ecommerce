import { Bounce, toast } from "react-toastify";

type ToastType = "info" | "success" | "error" | "warning";

type ShowToastProps = {
  content: string;
  type: ToastType;
};

export const showToast = ({ content, type }: ShowToastProps) => {
  const option = {
    position: "top-left" as const,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light" as const,
    transition: Bounce,
  };

  switch (type) {
    case "info":
      toast.info(content, option);
      break;

    case "success":
      toast.success(content, option);
      break;

    case "error":
      toast.error(content, option);
      break;

    case "warning":
      toast.warning(content, option);
      break;

    default:
      toast(content, option);
      break;
  }
};
