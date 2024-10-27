// useOverlay.ts (or you can name it as you prefer)
import { useCallback } from "react";

const useOverlay = (setIsVisible: (visible: boolean) => void) => {
  const closeOverlay = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  return { closeOverlay };
};

export default useOverlay;
