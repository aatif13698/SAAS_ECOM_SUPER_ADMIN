import layout from "./layout";
import auth from "./api/auth/authSlice";
import profile from "./api/auth/peofileSlice";
import states from "./api/auth/stateSlice";
import Auth from "@/redux/slices/Auth/Auth";

import SuperAdminNotification from "@/redux/slices/Notification/SuperAdminNotification";
import resetSlice from "@/redux/slices/Auth/Logout";
const rootReducer = {
  layout,
  auth,
  profile,
  states,
  Auth,
  SuperAdminNotification,
  Auth,
  resetSlice,
};
export default rootReducer;
