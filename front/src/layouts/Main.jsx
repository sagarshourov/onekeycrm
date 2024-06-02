import { Transition } from "react-transition-group";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallbackState, helper as $h } from "@/utils";
import { supAdminMenu as superAdminMenuStore } from "@/stores/side-menu";
import { adminMenu as adminMenuStore } from "@/stores/side-menu";
import { empMenu as empMenuStore } from "@/stores/side-menu";

import { supervisorMenu as supervisorMenuStore } from "@/stores/side-menu";
import { useRecoilValue } from "recoil";
import { linkTo, nestedMenu, enter, leave } from "./index";
import { Lucide } from "@/base-components";
import dom from "@left4code/tw-starter/dist/js/dom";
import SimpleBar from "simplebar";
import logoUrl from "@/assets/images/logo.png";
import classnames from "classnames";
import TopBar from "@/components/top-bar/Main";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import MainColorSwitcher from "@/components/main-color-switcher/Main";

import { loginState } from "../state/login-atom";

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);
  const loginStore = useRecoilValue(loginState);
  const superAdminMenu = useRecoilValue(superAdminMenuStore);
  const adminMenu = useRecoilValue(adminMenuStore);
  const empMenu = useRecoilValue(empMenuStore);
  const supervisoMenu = useRecoilValue(supervisorMenuStore);
  //const userSideMenuStore = useRecoilValue(useUserSideMenuStore);

  const sideMenu = () => {
    if (loginStore.role == 1) {
      return nestedMenu($h.toRaw(superAdminMenu.menu), location);
    } else if (loginStore.role == 2) {
      return nestedMenu($h.toRaw(adminMenu.menu), location);
    } else if (loginStore.role == 4) {
      return nestedMenu($h.toRaw(supervisoMenu.menu), location);
    } else {
      return nestedMenu($h.toRaw(empMenu.menu), location);
    }

    // return nestedMenu($h.toRaw(sideMenuStore.menu), location)
  };

  const [simpleMenu, setSimpleMenu] = useCallbackState({
    active: false,
    hover: false,
    wrapper: false,
  });
  const [mobileMenu, setMobileMenu] = useState(false);

  // Set active/inactive simple menu
  const toggleSimpleMenu = (event) => {
    event.preventDefault();

    if (simpleMenu.active) {
      setSimpleMenu(
        {
          ...simpleMenu,
          hover: true,
        },
        (simpleMenu) => {
          dom(".wrapper")[0].animate(
            {
              marginLeft: "270px",
            },
            {
              duration: 200,
            }
          ).onfinish = function () {
            dom(".wrapper").css("margin-left", "270px");
            setSimpleMenu(
              {
                ...simpleMenu,
                hover: false,
                active: false,
                wrapper: false,
              },
              () => {
                dom(".wrapper").removeAttr("style");
              }
            );
          };
        }
      );
    } else {
      setSimpleMenu(
        {
          ...simpleMenu,
          active: true,
          wrapper: true,
        },
        () => {
          dom(".wrapper").css("margin-left", "270px");
          dom(".wrapper")[0].animate(
            {
              marginLeft: "112px",
            },
            {
              duration: 200,
            }
          ).onfinish = function () {
            dom(".wrapper").removeAttr("style");
          };
        }
      );
    }
  };

  // Set active/inactive mobile menu
  const toggleMobileMenu = (event) => {
    event.preventDefault();
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    dom("body").removeClass("error-page").removeClass("login").addClass("main");
    new SimpleBar(dom(".side-nav .scrollable")[0]);
    setFormattedMenu(sideMenu());
  }, [location.pathname]);

  return (
    <div className="flex">
      {/* <DarkModeSwitcher /> */}
      <MainColorSwitcher />
      {/* BEGIN: Side Menu */}
      <nav
        className={classnames({
          "side-nav": true,
          "side-nav--simple": simpleMenu.active,
          hover: simpleMenu.hover,
          "side-nav--active": mobileMenu,
        })}
      >
        <div className="pt-4 mb-4">
          <div className="side-nav__header flex items-center">
            <Link to="/" className="intro-x flex items-center">
              <img
                alt=""
                className="side-nav__header__logo side-nav__header__text text-white pt-0.5 text-lg ml-2.5"
                src={logoUrl}
              />
              <span className="side-nav__header__text text-white pt-0.5 text-lg ml-2.5">
                OneKeyVisa
              </span>
            </Link>
            <a
              href="#"
              onClick={toggleSimpleMenu}
              className="side-nav__header__toggler hidden xl:block ml-auto text-white text-opacity-70 hover:text-opacity-100 transition-all duration-300 ease-in-out pr-5"
            >
              <Lucide icon="ArrowLeftCircle" className="w-5 h-5" />
            </a>
            <a
              href="#"
              onClick={toggleMobileMenu}
              className="mobile-menu-toggler xl:hidden ml-auto text-white text-opacity-70 hover:text-opacity-100 transition-all duration-300 ease-in-out pr-5"
            >
              <Lucide icon="XCircle" className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="scrollable">
          <ul className="scrollable__content">
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              typeof menu === "string" ? (
                <li className="side-nav__devider mb-4" key={menu + menuKey}>
                  {menu}
                </li>
              ) : (
                <li key={menu + menuKey}>
                  <a
                    href={menu.subMenu ? "#" : menu.pathname}
                    className={classnames({
                      "side-menu": true,
                      "side-menu--active": menu.active,
                      "side-menu--open": menu.activeDropdown,
                    })}
                    onClick={(event) => {
                      event.preventDefault();
                      linkTo(menu, navigate);
                      setFormattedMenu($h.toRaw(formattedMenu));
                    }}
                  >
                    <div className="side-menu__icon">
                      <Lucide icon={menu.icon} />
                    </div>
                    <div className="side-menu__title">
                      {menu.title}
                      {menu.subMenu && (
                        <div
                          className={classnames({
                            "side-menu__sub-icon": true,
                            "transform rotate-180": menu.activeDropdown,
                          })}
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      )}
                    </div>
                  </a>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={classnames({
                          "side-menu__sub-open": menu.activeDropdown,
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <a
                              href={subMenu.subMenu ? "#" : subMenu.pathname}
                              className={classnames({
                                "side-menu": true,
                                "side-menu--active": subMenu.active,
                              })}
                              onClick={(event) => {
                                event.preventDefault();
                                linkTo(subMenu, navigate);
                                setFormattedMenu($h.toRaw(formattedMenu));
                              }}
                            >
                              <div className="side-menu__icon">
                                <Lucide icon="Activity" />
                              </div>
                              <div className="side-menu__title">
                                {subMenu.title}
                                {subMenu.subMenu && (
                                  <div
                                    className={classnames({
                                      "side-menu__sub-icon": true,
                                      "transform rotate-180":
                                        subMenu.activeDropdown,
                                    })}
                                  >
                                    <Lucide icon="ChevronDown" />
                                  </div>
                                )}
                              </div>
                            </a>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={classnames({
                                    "side-menu__sub-open":
                                      subMenu.activeDropdown,
                                  })}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li key={lastSubMenuKey}>
                                        <a
                                          href={
                                            lastSubMenu.subMenu
                                              ? "#"
                                              : lastSubMenu.pathname
                                          }
                                          className={classnames({
                                            "side-menu": true,
                                            "side-menu--active":
                                              lastSubMenu.active,
                                          })}
                                          onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(lastSubMenu, navigate);
                                          }}
                                        >
                                          <div className="side-menu__icon">
                                            <Lucide icon="Zap" />
                                          </div>
                                          <div className="side-menu__title">
                                            {lastSubMenu.title}
                                          </div>
                                        </a>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </div>
      </nav>
      {/* END: Side Menu */}
      {/* BEGIN: Content */}
      <div
        className={classnames({
          wrapper: true,
          "wrapper--simple": simpleMenu.wrapper,
        })}
      >
        <TopBar toggleMobileMenu={toggleMobileMenu} />
        <div className="content">
          <Outlet />
        </div>
      </div>
      {/* END: Content */}
    </div>
  );
}

export default Main;
