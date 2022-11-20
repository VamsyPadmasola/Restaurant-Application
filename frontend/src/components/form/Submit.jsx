import React from "react";
import { ImSpinner3 } from "react-icons/im";
import { commonModalButtonClasses } from "../../utils/theme";

export default function Submit({ value, busy, type, onClick }) {
  return (
    <button
      type={type || "submit"}
      className={"w-full rounded text-white font-semibold text-lg cursor-pointer h-10 flex items-center justify-center " 
      + commonModalButtonClasses }
      onClick={onClick}
    >
      {busy ? <ImSpinner3 className="animate-spin" /> : value}
    </button>
  );
}
