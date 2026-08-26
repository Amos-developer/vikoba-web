import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

let lastNotice = { key: "", at: 0 };

const shouldShow = (key) => {
  const now = Date.now();
  if (lastNotice.key === key && now - lastNotice.at < 1200) return false;
  lastNotice = { key, at: now };
  return true;
};

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3800,
  timerProgressBar: true,
  customClass: { popup: "app-toast" },
});

export const successAlert = (message = "Completed successfully.") => {
  if (shouldShow(`success:${message}`)) toast.fire({ icon: "success", title: message });
};

export const errorAlert = (message = "Something went wrong. Please try again.") => {
  if (shouldShow(`error:${message}`)) toast.fire({ icon: "error", title: message });
};

export const apiErrorMessage = (error) => {
  if (!error?.response) return "Unable to connect to the server. Check your connection and try again.";
  return error.response.data?.message
    || error.response.data?.error
    || "The request could not be completed. Please try again.";
};

export const confirmAction = async ({
  title,
  text,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: danger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: danger,
    customClass: {
      popup: "app-alert-dialog",
      confirmButton: danger ? "app-alert-danger" : "app-alert-primary",
      cancelButton: "app-alert-secondary",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};
