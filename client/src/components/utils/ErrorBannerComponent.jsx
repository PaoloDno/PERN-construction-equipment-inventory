import { useEffect, useState } from "react";

const ErrorBannerComponent = ({ err }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (err) {
      setVisible(true);
    }
  }, [err]);

  if (!visible || !err) {
    return null;
  }

  

  return (
    <div 
    onClick={() => setVisible(false)}
    className="w-full min-h-8 fixed px-2 py-2 mt-2 rounded-xl bg-danger/85 overflow-hidden flex items-center justify-center text-center z-50 top-0 left-0">
      <p className="text-white text-[14px] md:text-[16px]">
        {err}
      </p>

      <div
        className="ml-3 text-white"
      >
        X
      </div>
    </div>
  );
};

export default ErrorBannerComponent;