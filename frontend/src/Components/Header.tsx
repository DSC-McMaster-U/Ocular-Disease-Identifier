import NavLogo from "../vendor/img/Header/gdsc-logo.png";
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="w-full h-[57px] pl-[22px] pr-[55px] gap-[78px] fixed top-0 start-0 z-10 flex items-center justify-between bg-white drop-shadow-md border border-[#d2d2d2]">
      {/* Header Logo */}
      <div className="shrink-0">
        <a href="/" className="flex gap-[14px]">
          {" "}
          <img src={NavLogo} alt="" className="w-[63px] h-[31px]" />
          <span className="text-[#5d6166] text-[23px] font-normal font-google hidden sm:block">
            Ocular Disease Identifier
          </span>
        </a>
      </div>

      <div className="w-full h-[21px] flex justify-between items-center shrink">
        {/* Middle Primary Nav Links */}
        <ul className="w-min h-[21px] flex gap-[33px]">
          <a href="/user/dashboard">
            <li className="font-navlink after:anim-navlink after:hover:anim-navlink-hover text-[#5d6166]">
              Home
            </li>
          </a>
          <a href="">
            <li className="font-navlink after:anim-navlink after:hover:anim-navlink-hover text-[#5d6166]">
              About
            </li>
          </a>
          <a href="/">
            <li className="font-navlink after:anim-navlink after:hover:anim-navlink-hover text-[#5d6166]">
              Upload Image
            </li>
          </a>
        </ul>

        {/* Authentication Nav Links */}
        <ul className="w-min h-max flex gap-[23px]">
          {isAuthPage ? (
            <>
              <a href="/login">
                <li className="font-navlink text-[#277be9] px-[10px] py-[4px] rounded-md hover:bg-[#e8f0fe] hover:text-[#1a73e8] transition ease-linear duration-[0.125s]">
                  Login
                </li>
              </a>
              <a href="/signup">
                <li className="font-navlink text-[#277be9] px-[10px] py-[4px] rounded-md hover:bg-[#e8f0fe] hover:text-[#1a73e8] transition ease-linear duration-[0.125s]">
                  Register
                </li>
              </a>
            </>
          ) : (
            <a href="/login">
              <li className="font-navlink text-[#277be9] px-[10px] py-[4px] rounded-md hover:bg-[#e8f0fe] hover:text-[#1a73e8] transition ease-linear duration-[0.125s]">
                Logout
              </li>
            </a>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;