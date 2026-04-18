import { T } from "../../utils/hmsConstants";
import HMSSidebar from "./HMSSidebar";
import { Toast } from "../common/HMSComponents";
import { usePatients } from "../../context/PatientContext";

export default function HMSLayout({ children }) {
  const { toast, closeToast } = usePatients();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "'Outfit',sans-serif" }}>
      <HMSSidebar />
      <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>{children}</div>
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
