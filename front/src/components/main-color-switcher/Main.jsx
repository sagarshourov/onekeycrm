import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  colorSchemeValue,
  colorScheme as colorSchemeStore,
} from "@/stores/color-scheme";
import { darkModeValue, darkMode as darkModeStore } from "@/stores/dark-mode";
import dom from "@left4code/tw-starter/dist/js/dom";
import classnames from "classnames";

function Main(props) {
  const darkMode = useRecoilValue(darkModeStore);
  const colorScheme = useRecoilValue(colorSchemeStore);
  const setColorSchemeValue = useSetRecoilState(colorSchemeValue);

  const setColorSchemeClass = () => {
    dom("html")
      .attr("class", colorScheme)
      .addClass(darkMode ? "dark" : "");
  };

  const switchColorScheme = (colorScheme) => {
    setColorSchemeValue(() => colorScheme);
    localStorage.setItem("colorScheme", colorScheme);
    setColorSchemeClass();
  };

  setColorSchemeClass();

  const setDarkModeValue = useSetRecoilState(darkModeValue);

  const setDarkModeClass = () => {
    darkMode ? dom("html").addClass("dark") : dom("html").removeClass("dark");
  };

  const switchMode = () => {
    setDarkModeValue(() => !darkMode);
    localStorage.setItem("darkMode", !darkMode);
    setDarkModeClass();
  };

  setDarkModeClass();

  return (
    <>
      {/* BEGIN: Main Color Switcher */}
      <div className="shadow-md fixed bottom-0 left-5 box border rounded-full h-12 px-5 flex items-center justify-center z-50 mb-0 ">
        {/* <div className="mr-4 hidden sm:block text-slate-600 dark:text-slate-200">
          Color Scheme
        </div> */}
        <a
          onClick={() => {
            switchColorScheme("default");
          }}
          className={classnames({
            "block w-8 h-8 cursor-pointer bg-[#00195f] rounded-full border-4 mr-1 hover:border-slate-200": true,
            "border-slate-300 dark:border-darkmode-800/80":
              colorScheme == "default",
            "border-white dark:border-darkmode-600": colorScheme != "default",
          })}
        ></a>
        <a
          onClick={() => {
            switchColorScheme("theme-1");
          }}
          className={classnames({
            "block w-8 h-8 cursor-pointer bg-blue-800 rounded-full border-4 mr-1 hover:border-slate-200": true,
            "border-slate-300 dark:border-darkmode-800/80":
              colorScheme == "theme-1",
            "border-white dark:border-darkmode-600": colorScheme != "theme-1",
          })}
        ></a>
        <a
          onClick={() => {
            switchColorScheme("theme-2");
          }}
          className={classnames({
            "block w-8 h-8 cursor-pointer bg-[#2d3c5a] rounded-full border-4 mr-1 hover:border-slate-200": true,
            "border-slate-300 dark:border-darkmode-800/80":
              colorScheme == "theme-2",
            "border-white dark:border-darkmode-600": colorScheme != "theme-2",
          })}
        ></a>
        
        <div
          className="dark-mode-switcher cursor-pointer  w-12 h-12 flex items-center justify-center z-50  "
          onClick={switchMode}
        >
          {/* <div className="mr-4 text-slate-600 dark:text-slate-200">Dark Mode</div> */}
          <div
            className={classnames({
              "dark-mode-switcher__toggle border": true,
              "dark-mode-switcher__toggle--active": darkMode,
            })}
          ></div>
        </div>
      </div>
      {/* END: Main Color Switcher */}
    </>
  );
}

export default Main;
