import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

export async function logoutAction() {
  // delete from local storage
  localStorage.removeItem("user_details");

  toast.success("You've been logged out!");

  // redirect to home page
  return redirect("/dashboard");
}
