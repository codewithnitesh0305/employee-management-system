import axios from "axios";

const STATUS_MESSAGES = {
  400: "Please check the information you entered and try again.",
  401: "Your login details are invalid or your session has expired.",
  403: "You do not have permission to perform this action.",
  404: "The requested information could not be found.",
  409: "This change conflicts with existing information.",
  422: "Some of the information is invalid. Please review and try again.",
  500: "The server encountered an error. Please try again later.",
};

export function getApiErrorMessage(error) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : "Something went wrong. Please try again.";
  }

  const status = error.response?.status;
  if (status === 500) {
    return STATUS_MESSAGES[status];
  }

  const responseMessage = error.response?.data?.message;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  if (!error.response) {
    return "Unable to connect to the server. Please try again.";
  }

  return "The request could not be completed. Please try again.";
}
