import { atom } from "recoil";

let supAdminObj = {
  menu: [
    "START MENU",
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/dashboard",
    },
    {
      icon: "Home",
      title: "Super Admin Profile",
      pathname: "/profile",
    },
    {
      icon: "UserCheck",
      title: "Admins",
      pathname: "/admins",
    },
    {
      icon: "UserCheck",
      title: "Supervisor",
      pathname: "/supervisor",
    },

    {
      icon: "Users",
      title: "Employee",
      pathname: "/employees",
    },
    {
      icon: "Slack",
      title: "Slack ",
      subMenu: [
        {
          icon: "User",
          pathname: "/slack/users",
          title: "Users",
        },
        {
          icon: "Users",
          pathname: "/slack/conversion",
          title: "Conversion",
        },
        {
          icon: "MessageCircle",
          pathname: "/slack/chat",
          title: "Chat",
        },
      ],
    },
    {
      icon: "MessageCircle",
      title: "WhatsApp",
      subMenu: [
        {
          icon: "User",
          pathname: "/whatsapp/message",
          title: "Send Bulk Message",
        },
        {
          icon: "Users",
          pathname: "/whatsapp/template",
          title: "Message Template",
        },
        {
          icon: "MessageCircle",
          pathname: "/whatsapp/chat",
          title: "Chat",
        },
      ],
    },
    {
      icon: "PhoneCall",
      title: "Calls",
      subMenu: [
        {
          icon: "",
          pathname: "/",
          title: "Open Calls",
        },
        {
          icon: "",
          pathname: "/calls/search",
          title: "Search",
        },
        // {
        //   icon: "",
        //   pathname: "/calls/1",
        //   title: "Installment",
        // },
        // {
        //   icon: "",
        //   pathname: "/calls/2",
        //   title: "Agreement ",
        // },

        // {
        //   icon: "",
        //   pathname: "/calls/3",
        //   title: " Did Not Answer",
        // },
        // {
        //   icon: "",
        //   pathname: "/calls/4",
        //   title: "Promotions",
        // },

        {
          icon: "",
          pathname: "/calls/add",
          title: "Add",
        },
        {
          icon: "",
          pathname: "/calls/import",
          title: "Import",
        },
      ],
    },
    {
      icon: "Calendar",
      pathname: "/calendar",
      title: "Calendar",
    },
    {
      icon: "PhoneCall",
      title: "Reports",
      pathname: "/reports",
      subMenu: [
        {
          icon: "",
          pathname: "/reports",
          title: "Pre Made",
        },
        {
          icon: "",
          pathname: "/creport",
          title: "Custom",
        },
      ],
    },

    {
      icon: "PhoneMissed",
      pathname: "/cancel",
      title: "Cancel",
    },
    {
      icon: "User",
      pathname: "/clients",
      title: "Clients",
    },
    {
      icon: "User",
      pathname: "/results/5",
      title: "Do Not Contact",
    },
    {
      icon: "Bell",
      pathname: "/notifications",
      title: "Notifications",
    },
    {
      icon: "Settings",
      pathname: "/settings",
      title: "Settings",
    },
  ],
};

let adminObj = {
  menu: [
    "START MENU",
    {
      icon: "Home",
      title: "Admin Profile",
      pathname: "/profile",
    },
    {
      icon: "UserCheck",
      title: "Supervisor",
      pathname: "/supervisor",
    },

    {
      icon: "Users",
      title: "Employee",
      pathname: "/employees",
    },
    {
      icon: "PhoneCall",
      title: "Calls",
      subMenu: [
        {
          icon: "",
          pathname: "/",
          title: "Open Calls",
        },
        {
          icon: "",
          pathname: "/calls/search",
          title: "Search",
        },
        // {
        //   icon: "",
        //   pathname: "/calls/1",
        //   title: "Installment",
        // },
        // {
        //   icon: "",
        //   pathname: "/calls/2",
        //   title: "Agreement ",
        // },

        // {
        //   icon: "",
        //   pathname: "/calls/3",
        //   title: " Did Not Answer",
        // },

        {
          icon: "",
          pathname: "/calls/add",
          title: "Add",
        },
      ],
    },
    {
      icon: "Calendar",
      pathname: "/calendar",
      title: "Calendar",
    },
    {
      icon: "PhoneCall",
      title: "Reports",
      pathname: "/reports",
      subMenu: [
        {
          icon: "",
          pathname: "/reports",
          title: "Pre Made",
        },
        {
          icon: "",
          pathname: "/creport",
          title: "Custom",
        },
      ],
    },

    {
      icon: "PhoneMissed",
      pathname: "/cancel",
      title: "Cancel",
    },
    {
      icon: "User",
      pathname: "/clients",
      title: "Clients",
    },
    {
      icon: "User",
      pathname: "/results/5",
      title: "Do Not Contact",
    },
    {
      icon: "Bell",
      pathname: "/notifications",
      title: "Notifications",
    },
  ],
};

let empObj = {
  menu: [
    "START MENU",
    {
      icon: "Home",
      title: "Employee Profile",
      pathname: "/profile",
    },

    {
      icon: "PhoneCall",
      title: "Calls",
      subMenu: [
        {
          icon: "",
          pathname: "/",
          title: "Open Calls",
        },
        // {
        //   icon: "",
        //   pathname: "/calls/1",
        //   title: "Installment",
        // },
        // {
        //   icon: "",
        //   pathname: "/calls/2",
        //   title: "Agreement ",
        // },

        // {
        //   icon: "",
        //   pathname: "/calls/3",
        //   title: " Did Not Answer",
        // },

        {
          icon: "",
          pathname: "/calls/add",
          title: "Add",
        },
        {
          icon: "",
          pathname: "/calls/search",
          title: "Search",
        }
      ],
    },
    {
      icon: "FileText",
      title: "Reports",
      pathname: "/reports",
      subMenu: [
        {
          icon: "",
          pathname: "/reports",
          title: "Pre Made",
        },
        {
          icon: "",
          pathname: "/fcreport",
          title: "First Call Report",
        },

        {
          icon: "",
          pathname: "/freport",
          title: "Follow Up Report",
        },
      ],
    },

    {
      icon: "PhoneMissed",
      pathname: "/cancel",
      title: "Cancel",
    },
    {
      icon: "User",
      pathname: "/clients",
      title: "Clients",
    },
    {
      icon: "User",
      pathname: "/results/5",
      title: "Do Not Contact",
    },
    {
      icon: "Calendar",
      pathname: "/calendar",
      title: "Calendar",
    },

    // {
    //   icon: "Calendar",
    //   pathname: "/notes",
    //   title: "Notes",
    // },
    // {
    //   icon: "Calendar",
    //   pathname: "/feedback",
    //   title: "Feedback",
    // },
  ],
};

let superVisorObj = {
  menu: [
    "START MENU",
    {
      icon: "Home",
      title: "Supervisor Profile",
      pathname: "/profile",
    },
    {
      icon: "Users",
      title: "Employee",
      pathname: "/employees",
    },

    {
      icon: "PhoneCall",
      title: "Calls",
      subMenu: [
        {
          icon: "",
          pathname: "/",
          title: "Open Calls",
        },
        // {
        //   icon: "",
        //   pathname: "/calls/1",
        //   title: "Installment",
        // },
        // {
        //   icon: "",
        //   pathname: "/calls/2",
        //   title: "Agreement ",
        // },

        // {
        //   icon: "",
        //   pathname: "/calls/3",
        //   title: " Did Not Answer",
        // },

        {
          icon: "",
          pathname: "/calls/add",
          title: "Add",
        },
        {
          icon: "",
          pathname: "/calls/search",
          title: "Search",
        },
      ],
    },
    {
      icon: "FileText",
      title: "Reports",
      pathname: "/reports",
      subMenu: [
        {
          icon: "",
          pathname: "/reports",
          title: "Pre Made",
        },
        {
          icon: "",
          pathname: "/fcreport",
          title: "First Call Report",
        },

        {
          icon: "",
          pathname: "/freport",
          title: "Follow Up Report",
        },
      ],
    },

    {
      icon: "PhoneMissed",
      pathname: "/cancel",
      title: "Cancel",
    },
    {
      icon: "User",
      pathname: "/clients",
      title: "Clients",
    },
    {
      icon: "User",
      pathname: "/results/5",
      title: "Do Not Contact",
    },
    {
      icon: "Calendar",
      pathname: "/calendar",
      title: "Calendar",
    },

    // {
    //   icon: "Calendar",
    //   pathname: "/notes",
    //   title: "Notes",
    // },
    // {
    //   icon: "Calendar",
    //   pathname: "/feedback",
    //   title: "Feedback",
    // },
  ],
};

let supAdminMenu = atom({
  key: "supAdminMenu",
  default: supAdminObj,
});

let adminMenu = atom({
  key: "adminMenu",

  default: adminObj,
});

let empMenu = atom({
  key: "empMenu",

  default: empObj,
});

let supervisorMenu = atom({
  key: "supervisorMenu",

  default: superVisorObj,
});

export {supervisorMenu, supAdminMenu, adminMenu, empMenu };
