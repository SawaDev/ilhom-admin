import React, { useEffect, useRef, useState } from 'react'
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const ref = useRef();

  const handleClick = () => {
    setToggleMenu(!toggleMenu);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setToggleMenu(false);
        console.log("clicked outside")
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      {!toggleMenu ? (
        <div className="navbar flex justify-end md:p-2 md:ml-6 md:mr-6  md:justify-end">
          <div className="flex gap-1 items-center p-2">
            <button
              type="button"
              onClick={handleClick}
              className="relative rounded-full p-2 mt-2 mb-2 hover:bg-light-gray"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed w-full flex justify-end h-full z-999">
          <Sidebar setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
        </div>
      )}
    </>
  )
}

export default Navbar