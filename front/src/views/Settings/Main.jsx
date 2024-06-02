import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/base-components";

import Table from "./Table";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";

import { settingState } from "../../state/setting-atom";
import { loginState } from "../../state/login-atom";

const Settings = (props) => {
  const [allTable, setAllTable] = useRecoilStateLoadable(settingState);
  const loginData = useRecoilValue(loginState);

  const headers = {
    Authorization: `Bearer ${loginData?.token}`,
    ContentType: "application/json",
  };

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Settings</h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0"></div>
      </div>
      <div className=" mt-5">
        <TabGroup>
          <TabList className="nav-tabs">
            {allTable.state == "hasValue" &&
              Object.keys(allTable.contents).map((value, key) => {
                return (
                  <Tab
                    key={key}
                    className="w-full capitalize py-2"
                    tag="button"
                  >
                    {value.replace(/_/g, " ")}
                  </Tab>
                );
              })}
          </TabList>
          <TabPanels className="border-l border-r border-b">
            {allTable.state == "hasValue" &&
              Object.keys(allTable.contents).map((key) => {
                return (
                  <TabPanel key={key} className="leading-relaxed bg-white p-5">
                    <Table
                      setAllTable={setAllTable}
                      tbl={key}
                      headers={headers}
                      value={allTable.contents[key]}
                      data={allTable.contents}
                    />
                    
                  </TabPanel>
                );
              })}
          </TabPanels>
        </TabGroup>
      </div>
    </>
  );
};

export default Settings;
