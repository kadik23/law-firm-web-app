import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

type AlertProps = {
  alertType: string; // "success" or "warning" or "error" or "help"
  alertTitle: string;
  alertMessage: string;
  onClose: () => void; 
};

export const Alert = ({ alertType, alertTitle, alertMessage, onClose }: AlertProps) => {
  const alertStyle = {
    alertBackground: {
      backgroundColor:
        alertType.toLowerCase() === "success"
          ? "#385F7A"
          : alertType.toLowerCase() === "error"
          ? "#E4F1FE"
          : alertType.toLowerCase() === "warning"
          ? "#4A84AA"
          : "#3498DB",
    },
    alertTextColor: { color: alertType.toLowerCase() === "error" ? "#34495E" : "white" },
  };

  return (
    <div style={alertStyle.alertBackground} className="m-3 fixed bottom-0 right-0 z-50 rounded-2xl">
      <div className="flex gap-8 items-center overflow-hidden">
        <div className="ml-16">
          <img
            src={`/images/alert-bubbles/${alertType.toLowerCase()}-bubbles.svg`}
            width={75}
            className="rounded-bl-md absolute bottom-0 left-0 z-[-1]"
            alt="alert icon"
          />
        </div>
        <div style={alertStyle.alertTextColor} className="flex items-start py-3">
          <div style={alertStyle.alertTextColor}>
            <p className="text-2xl font-semibold mb-1">{alertTitle}</p>
            <span className="text-sm text-light block w-[30ch]">{alertMessage}</span>
          </div>
          <Icon
            width={25}
            icon="mdi:close"
            className="pr-2 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <img
          src={`/icons/alert/${alertType}.svg`}
          className="absolute top-[-25px] left-3"
          width={55}
          alt="alert icon"
        />
      </div>
    </div>
  );
};
