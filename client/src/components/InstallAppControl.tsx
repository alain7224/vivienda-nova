import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { type BeforeInstallPromptEvent, isIosDevice, isIosSafari, isStandaloneMode } from "@/lib/installApp";

type InstallCopy = {
  installApp: string;
  installIos: string;
  installIosOther: string;
  installOther: string;
  installUnavailable: string;
};

export default function InstallAppControl({ copy }: { copy: InstallCopy }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isSafariIos, setIsSafariIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const standalone = isStandaloneMode(window.matchMedia("(display-mode: standalone)").matches, (navigator as Navigator & { standalone?: boolean }).standalone);
    setIsIos(isIosDevice(navigator.userAgent));
    setIsSafariIos(isIosSafari(navigator.userAgent));
    setIsInstalled(standalone);
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const markInstalled = () => {
      setIsInstalled(true);
      setShowGuide(false);
      setStatus("");
    };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  const requestInstall = async () => {
    if (!deferredPrompt) {
      setShowGuide(true);
      setStatus(isIos ? (isSafariIos ? copy.installIos : copy.installIosOther) : copy.installUnavailable);
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === "accepted") setIsInstalled(true);
  };

  if (isInstalled) return null;
  return <div className="install-app-control">
    <button type="button" className="install-app-trigger" onClick={requestInstall}><Download size={15} /> {copy.installApp}</button>
    {showGuide && <div className="install-app-guide" role="status"><div><Share size={16} /><p>{status || copy.installOther}</p></div><button type="button" onClick={() => setShowGuide(false)} aria-label="Cerrar"><X size={14} /></button></div>}
  </div>;
}
