import DashboardIcon from "@mui/icons-material/Dashboard";
import CalculateIcon from '@mui/icons-material/Calculate';
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { Link } from "react-router-dom";

const Sidebar = ({ setToggleMenu, toggleMenu }) => {

  const handleMenu = () => {
    setToggleMenu(!toggleMenu);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
  }

  const linkClass = 'flex gap-1 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-light-gray m-2'
  return (
    <div className="pl-3 w-72 h-screen fixed bg-gray-100 z-9999 md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {toggleMenu && (
        <>
          <div className="absolute cursor-pointer right-3 top-3 text-xl text-purple-600" onClick={handleMenu}>
            <CloseIcon />
          </div>
          <div className="flex justify-start items-center">
            <Link to="/" className="items-center ml-3 mt-4 mb-4 flex text-xl font-extrabold tracking-tight text-purple-700">
              <span>Admin panel</span>
            </Link>
          </div>
          <hr />
          <div className="mt-6">
            <ul>
              <p className="text-gray-400 m-2 mt-3 uppercase">MAIN</p>
              <Link to="/" onClick={handleMenu}>
                <li className={linkClass}>
                  <div>
                    <DashboardIcon className="text-xl text-purple-500" />
                  </div>
                  <span className="text-xl text-purple-500">Dashboard</span>
                </li>
              </Link>
              <Link to="/newsale" onClick={handleMenu}>
                <li className={linkClass}>
                  <div>
                    <AttachMoneyIcon className="text-xl text-purple-500" />
                  </div>
                  <span className="text-xl text-purple-500">Yangi Sotuv</span>
                </li>
              </Link>
              <Link to="/newcollection" onClick={handleMenu}>
                <li className={linkClass}>
                  <div>
                    <AttachMoneyIcon className="text-xl text-purple-500" />
                  </div>
                  <span className="text-xl text-purple-500">Yangi Mol</span>
                </li>
              </Link>
              <p className="text-gray-400 m-2 mt-3 uppercase">LISTS</p>
              <Link to="/products">
                <li className={linkClass} onClick={() => setToggleMenu(!toggleMenu)}>
                  <div>
                    <Inventory2Icon className="text-xl text-purple-500" />
                  </div>
                  <span className="text-xl text-purple-500 mb-2 cursor-pointer">Mahsulotlar</span>
                </li>
              </Link>
              <Link to="/sales">
                <li className={linkClass}>
                  <div>
                    <InsertChartIcon className="text-xl text-purple-500" />
                  </div>
                  <span className="text-xl text-purple-500 mb-2 cursor-pointer">Sotuvlar</span>
                </li>
              </Link>
              {/* <p className="text-gray-400 m-2 mt-3 uppercase">USEFUL</p>
              <li className={linkClass}>
                <div>
                  <CalculateIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">Calculator</span>
              </li>
              <li className={linkClass}>
                <div>
                  <NotificationsNoneIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">Notifications</span>
              </li>
              <p className="text-gray-400 m-2 mt-3 uppercase">SERVICE</p>
              <li className={linkClass}>
                <div>
                  <SettingsSystemDaydreamOutlinedIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">System Health</span>
              </li>
              <li className={linkClass}>
                <div>
                  <PsychologyOutlinedIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">Logs</span>
              </li>
              <li className={linkClass}>
                <div>
                  <SettingsApplicationsIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">Settings</span>
              </li>
              <p className="text-gray-400 m-2 mt-3 uppercase">USER</p>
              <li className={linkClass}>
                <div>
                  <AccountCircleOutlinedIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">Profile</span>
              </li> */}
              <li className={linkClass} onClick={handleLogout}>
                <div>
                  <ExitToAppIcon className="text-xl text-purple-500" />
                </div>
                <span className="text-xl text-purple-500 mb-2 cursor-pointer">Logout</span>
              </li>
            </ul>
          </div>
        </>)}

    </div>
  );
}

export default Sidebar