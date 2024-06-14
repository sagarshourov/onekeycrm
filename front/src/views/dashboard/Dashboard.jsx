import {
  Lucide,
  Tippy,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Litepicker,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/base-components";

import ReportPieChart1 from "@/components/report-pie-chart-1/Main";
import * as $_ from "lodash";
import classnames from "classnames";
import ReportBarChart1 from "@/components/report-bar-chart-1/Main";
import ReportLineChart1 from "@/components/report-line-chart-1/Main";
import ReportLineChart2 from "@/components/report-line-chart-2/Main";
import ReportDonutChart1 from "@/components/report-donut-chart-1/Main";
import { useState } from "react";
import { helper as $h } from "@/utils/helper";
import unitedStatesUrl from "@/assets/images/united-states.svg";
import franceUrl from "@/assets/images/france.svg";
import spainUrl from "@/assets/images/spain.svg";
import unitedKingdomUrl from "@/assets/images/united-kingdom.svg";
import indiaUrl from "@/assets/images/india.svg";
import brazilUrl from "@/assets/images/brazil.svg";
import switzerlandUrl from "@/assets/images/switzerland.svg";
import chromeUrl from "@/assets/images/chrome.png";
import edgeUrl from "@/assets/images/edge.png";
import firefoxUrl from "@/assets/images/firefox.png";
import operaUrl from "@/assets/images/opera.png";
import safariUrl from "@/assets/images/safari.png";
import { helper } from "@/utils/helper";
import { dashBoardSelect } from "../../state/dashboard-atom";
const token = localStorage.token && localStorage.getItem("token");
import { useRecoilValue } from "recoil";
function getMonthName(month) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month];
}
function Main() {

  var currentDate = new Date();

  var firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), +1);
  var lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, +0);

  var formattedFirstDate = `${firstDate.getDate()} ${getMonthName(firstDate.getMonth())}, ${firstDate.getFullYear()}`;
  var formattedLastDate = `${lastDate.getDate()} ${getMonthName(lastDate.getMonth())}, ${lastDate.getFullYear()}`;
  var dateRange = `${formattedFirstDate} - ${formattedLastDate}`;

  const [dateFilter, setDateFilter] = useState(dateRange);
  const [teamFilter, setTeamFilter] = useState(0);
  const handelRange = (date) => {
    setDateFilter(date);
  };

  // const [salesReportFilter, setSalesReportFilter] = useState();

  const dashBoardData = useRecoilValue(
    dashBoardSelect({ teamFilter, dateFilter })
  );

  const salesPerformance = () => {
    return [
      "bg-opacity-60",
      "bg-opacity-40",
      "bg-opacity-30",
      "bg-opacity-20",
      "bg-opacity-10",
    ][$_.random(0, 4)];
  };

  const handelSelectTeam = (e) => {
    console.log("sagar", e.target.value);
    setTeamFilter(e.target.value);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-12">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-6">
            <div className="intro-y block sm:flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Seller Report
              </h2>

              <div className="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                <select
                  onChange={handelSelectTeam.bind(this)}
                  className=" form-select box mt-3 sm:mt-0"
                >
                  <option value="0">All Team</option>
                  <option value="1">IR Team</option>
                  <option value="2">TR Team</option>
                </select>
              </div>

              <div className="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                <Lucide
                  icon="Calendar"
                  className="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"
                />
                <Litepicker
                  value={dateFilter}
                  onChange={handelRange}
                  options={{
                    autoApply: false,
                    singleMode: false,
                    numberOfColumns: 2,
                    numberOfMonths: 2,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true
                    },
                  }}
                  className="form-control sm:w-56 box pl-10"
                />
              </div>
            </div>
            <div className="intro-y report-box mt-12 sm:mt-4">
              <div className="box py-0 xl:py-5 grid grid-cols-12 gap-0 divide-y xl:divide-y-0 divide-x divide-dashed divide-slate-200 dark:divide-white/5">
                <div className="report-box__item py-5 xl:py-0 px-5 col-span-12 sm:col-span-6 xl:col-span-3">
                  <div className="report-box__content">
                    <div className="flex">
                      <div className="report-box__item__icon text-primary bg-primary/20 border border-primary/20 flex items-center justify-center rounded-full">
                        <Lucide icon="PieChart" />
                      </div>
                      <div className="ml-auto">
                        {/* <Tippy
                          tag="div"
                          className="report-box__item__indicator text-success cursor-pointer"
                          content="5.2% Higher than last month"
                        >
                          +5.2%
                          <Lucide icon="ArrowUp" className="w-4 h-4 ml-0.5" />
                        </Tippy> */}
                      </div>
                    </div>
                    <div className="text-2xl font-medium leading-7 mt-6">
                      F1 Gold
                    </div>
                    <div className="text-slate-500 mt-1">
                      ${" "}
                      {dashBoardData.case_type.count && helper.formatCurrency(
                        dashBoardData?.case_type?.count[0] * 4400
                      )}
                    </div>
                  </div>
                </div>
                <div className="report-box__item py-5 xl:py-0 px-5 sm:!border-t-0 col-span-12 sm:col-span-6 xl:col-span-3">
                  <div className="report-box__content">
                    <div className="f lex">
                      <div className="report-box__item__icon text-pending bg-pending/20 border border-pending/20 flex items-center justify-center rounded-full">
                        <Lucide icon="CreditCard" />
                      </div>
                      <div className="ml-auto">
                        {/* <Tippy
                          tag="div"
                          className="report-box__item__indicator text-danger cursor-pointer"
                          content="2% Lower than last month"
                        >
                          -2%
                          <Lucide icon="ArrowDown" className="w-4 h-4 ml-0.5" />
                        </Tippy> */}
                      </div>
                    </div>
                    <div className="text-2xl font-medium leading-7 mt-6">
                      F1/F2 Gold
                    </div>
                    <div className="text-slate-500 mt-1">
                      ${" "}
                      {dashBoardData.case_type.count && helper.formatCurrency(
                        dashBoardData?.case_type?.count[0] * 5400
                      )}
                    </div>
                  </div>
                </div>
                <div className="report-box__item py-5 xl:py-0 px-5 col-span-12 sm:col-span-6 xl:col-span-3">
                  <div className="report-box__content">
                    <div className="flex">
                      <div className="report-box__item__icon text-warning bg-warning/20 border border-warning/20 flex items-center justify-center rounded-full">
                        <Lucide icon="ShoppingBag" />
                      </div>
                      <div className="ml-auto">
                        {/* <Tippy
                          tag="div"
                          className="report-box__item__indicator text-success cursor-pointer"
                          content="4.1% Higher than last month"
                        >
                          +4.1%
                          <Lucide icon="ArrowDown" className="w-4 h-4 ml-0.5" />
                        </Tippy> */}
                      </div>
                    </div>
                    <div className="text-2xl font-medium leading-7 mt-6">
                      F1 Platinum
                    </div>
                    <div className="text-slate-500 mt-1">
                      ${" "}
                      {dashBoardData.case_type.count && helper.formatCurrency(
                        dashBoardData?.case_type?.count[0] * 5400
                      )}
                    </div>
                  </div>
                </div>
                <div className="report-box__item py-5 xl:py-0 px-5 col-span-12 sm:col-span-6 xl:col-span-3">
                  <div className="report-box__content">
                    <div className="flex">
                      <div className="report-box__item__icon text-success bg-success/20 border border-success/20 flex items-center justify-center rounded-full">
                        <Lucide icon="HardDrive" />
                      </div>
                      <div className="ml-auto">
                        <Tippy
                          tag="div"
                          className="report-box__item__indicator text-danger cursor-pointer"
                          content="1% Lower than last month"
                        >
                          -1%
                          <Lucide icon="ArrowDown" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="text-2xl font-medium leading-7 mt-6">
                      F1/F2 Platinum
                    </div>
                    <div className="text-slate-500 mt-1">
                      ${" "}
                      {dashBoardData.case_type.count && helper.formatCurrency(
                        dashBoardData?.case_type?.count[0] * 6400
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}

          {/* BEGIN: Product Report */}

          {/* <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Seller Report
              </h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  <ReportBarChart1 className="mt-2 z-10 relative" />
                </div>
              </div>
              <div className="w-52 lg:w-auto mx-auto mt-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">17 - 30 Years old</span>
                  <span className="ml-auto">50%</span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-pending/50 border border-pending/50 rounded-full mr-3"></div>
                  <span className="truncate">31 - 50 Years old</span>
                  <span className="ml-auto">30%</span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-warning/50 border border-warning/60 rounded-full mr-3"></div>
                  <span className="truncate">&gt;= 50 Years old</span>
                  <span className="ml-auto">20%</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* END: Product Report */}

          {/* BEGIN: Seller Report */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Marital Status
              </h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  {dashBoardData.marital_status && (
                    <ReportPieChart1
                      className="mt-2 z-10 relative"
                      height={210}
                      data={[dashBoardData.marital_status[0], dashBoardData.marital_status[1], dashBoardData.marital_status[2]]}
                      labels={["Married", "Unmarried", "Applying"]}
                    />
                  )}
                </div>
              </div>
              {dashBoardData.marital_status && (
                <div className="w-52 lg:w-auto mx-auto mt-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                    <span className="truncate">Married</span>
                    <span className="ml-auto">
                      {dashBoardData.marital_status &&
                        dashBoardData.marital_status[0]}
                      %
                    </span>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                    <span className="truncate">Unmarried</span>
                    <span className="ml-auto">
                      {dashBoardData.marital_status &&
                        dashBoardData.marital_status[1]}
                      %
                    </span>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                    <span className="truncate">Applying</span>
                    <span className="ml-auto">
                      {dashBoardData.marital_status &&
                        dashBoardData.marital_status[2]}
                      %
                    </span>
                  </div>
                  <div className="flex items-center mt-4 border-t pt-3">
                    <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                    <span className="truncate">Total = </span>
                    <span className="ml-auto">
                      {dashBoardData.marital_status &&
                        dashBoardData.marital_status[3]}

                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* END: Seller Report */}

          {/* BEGIN: Seller Report */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Case Type</h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  <ReportPieChart1
                    className="mt-2 z-10 relative"
                    height={210}
                    data={dashBoardData?.case_type?.percent}
                    labels={["F-1", "F-1/F2"]}
                  />
                </div>
              </div>
              <div className="w-52 lg:w-auto mx-auto mt-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">F-1</span>
                  <span className="ml-auto">
                    {dashBoardData.case_type.percent &&
                      dashBoardData?.case_type?.percent[0]}
                    %
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">F-1/F2</span>
                  <span className="ml-auto">
                    {dashBoardData.case_type.percent &&
                      dashBoardData?.case_type?.percent[1]}
                    %
                  </span>
                </div>
                <div className="flex items-center mt-4 border-t pt-3">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Total = </span>
                  <span className="ml-auto">
                    {dashBoardData.case_type.total &&
                      dashBoardData?.case_type?.total
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* END: Seller Report */}

          <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Status</h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  <ReportPieChart1
                    className="mt-2 z-10 relative"
                    height={210}
                    data={[dashBoardData.status[0], dashBoardData.status[1], dashBoardData.status[2]]}
                    labels={["Cold", "Hot", "Warm"]}
                  />
                </div>
              </div>
              <div className="w-52 lg:w-auto mx-auto mt-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Cold</span>
                  <span className="ml-auto">
                    {" "}
                    {dashBoardData.status && dashBoardData.status[0]}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Hot</span>
                  <span className="ml-auto">
                    {" "}
                    {dashBoardData.status && dashBoardData.status[1]}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Warm</span>
                  <span className="ml-auto">
                    {dashBoardData.status && dashBoardData.status[2]}%
                  </span>
                </div>
                <div className="flex items-center mt-4 border-t pt-3">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Total = </span>
                  <span className="ml-auto">
                    {dashBoardData.status[3] && dashBoardData.status[3]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                {" "}
                Agreement 
              </h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  <ReportPieChart1
                    className="mt-2 z-10 relative"
                    height={210}
                    data={[dashBoardData.agreement_sent[0], dashBoardData.agreement_sent[1]]}
                    labels={["Yes", "No"]}
                  />
                </div>
              </div>
              <div className="w-52 lg:w-auto mx-auto mt-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pending/50 border border-pending/50 rounded-full mr-3"></div>
                  <span className="truncate">Agreement Sent</span>
                  <span className="ml-auto">
                    {dashBoardData.agreement_sent &&
                      dashBoardData.agreement_sent[0]}
                    %
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Agreement Not Sent</span>
                  <span className="ml-auto">
                    {dashBoardData.agreement_sent &&
                      dashBoardData.agreement_sent[1]}
                    %
                  </span>
                </div>
                <div className="flex items-center mt-4 border-t pt-4">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Total = </span>
                  <span className="ml-auto">
                    {dashBoardData.agreement_sent &&
                      dashBoardData.agreement_sent[2]}
                    
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                {" "}
                Agreement Signed
              </h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  <ReportPieChart1
                    className="mt-2 z-10 relative"
                    height={210}
                    data={dashBoardData.agsigned && [dashBoardData.agsigned[0], dashBoardData.agsigned[1]]}
                    labels={["Yes", "No"]}
                  />
                </div>
              </div>
              <div className="w-52 lg:w-auto mx-auto mt-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                  <span className="truncate">Yes</span>
                  <span className="ml-auto">
                    {" "}
                    {dashBoardData.agsigned && dashBoardData.agsigned[0]}%
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>

                  <span className="truncate">No</span>
                  <span className="ml-auto">
                    {" "}
                    {dashBoardData.agsigned && dashBoardData.agsigned[1]}%
                  </span>
                </div>
                <div className="flex items-center mt-4 border-t pt-3">
                  <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>

                  <span className="truncate">Total = </span>
                  <span className="ml-auto">
                    {" "}
                    {dashBoardData.agsigned && dashBoardData.agsigned[2]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 sm:row-start-4 md:row-start-3 lg:row-start-auto mt-4">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Packages</h2>
            </div>
            <div className="intro-y box p-5 mt-4">
              <div className="relative px-3">
                <div className="w-40 mx-auto lg:w-auto">
                  <ReportPieChart1
                    className="mt-2 z-10 relative"
                    height={210}
                    data={
                      dashBoardData.packages &&
                      dashBoardData.packages.map((row) => row.p)
                    }
                    labels={
                      dashBoardData.packages &&
                      dashBoardData.packages.map((row) => row.title)
                    }
                  />
                </div>
              </div>
              <div className="w-52 lg:w-auto mx-auto mt-6">
                {dashBoardData.packages &&
                  dashBoardData.packages.map((data, key) => {
                    return (
                      <div key={key} className="flex items-center">
                        <div className="w-2 h-2 bg-primary/50 border border-primary/50 rounded-full mr-3"></div>
                        <span className="truncate">{data.title}</span>
                        <span className="ml-auto">{data.p}%</span>
                      </div>
                    );
                  })}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
