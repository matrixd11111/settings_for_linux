import ChromeBus from "../../../commons/ChromeBus/ChromeBus";
import {POPUP_SUCCESS_ACTION} from "./Constants";

window.checkChromeBusAccessibility = () => {
  return ChromeBus.checkBusAccessibility();
};

window.popupChromeExtensionLoaderCallback = () => {
    const locationHref = window.location.href;

    ChromeBus.send(POPUP_SUCCESS_ACTION, {
        url: locationHref
    });
};
