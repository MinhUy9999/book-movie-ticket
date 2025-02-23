import { useState, useRef, useEffect } from "react";
import logo from "../assets/logocinema.png";

const Header = () => {
    const [activeMenu, setActiveMenu] = useState("");
    const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const movieTimeout = useRef(null);
    const userTimeout = useRef(null);

    const handleMouseEnterMovie = () => {
        clearTimeout(movieTimeout.current);
        setIsMovieDropdownOpen(true);
    };

    const handleMouseLeaveMovie = () => {
        movieTimeout.current = setTimeout(() => {
            setIsMovieDropdownOpen(false);
        }, 500);
    };

    const handleMouseEnterUser = () => {
        clearTimeout(userTimeout.current);
        setIsUserDropdownOpen(true);
    };

    const handleMouseLeaveUser = () => {
        userTimeout.current = setTimeout(() => {
            setIsUserDropdownOpen(false);
        }, 500);
    };
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gray-800 bg-opacity-10 shadow-md backdrop-blur-md" : "bg-gray-800"
            }`}>
            <div className="container px-4 flex items-center justify-between w-full py-3">
                {/* Logo */}
                <div>
                    <img src={logo} alt="logo" width={120} className="md:w-[100px] zoom-animation" />
                </div>

                {/* Mobile Menu Button */}
                <button className="text-white text-3xl md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <i className="fas fa-bars"></i>
                </button>

                {/* Navigation for Desktop */}
                <nav className="hidden md:flex space-x-6 text-white text-lg pr-[80%]">
                    <div className="relative cursor-pointer" onMouseEnter={handleMouseEnterMovie} onMouseLeave={handleMouseLeaveMovie}>
                        <span className="relative group hover:text-yellow-400">
                            Phim
                            <span className={`absolute left-0 bottom-0 h-[3px] bg-yellow-400 w-0 group-hover:w-full transition-all duration-300 ${activeMenu === "phim" ? "w-full" : ""}`}></span>
                        </span>
                        {isMovieDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white rounded-lg shadow-lg w-40">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-700">Phim sắp chiếu</li>
                                    <li className="px-4 py-2 hover:bg-gray-700">Phim đang chiếu</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <span className="relative group hover:text-yellow-400 cursor-pointer" onClick={() => setActiveMenu("rap")}>Rạp</span>
                </nav>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-gray-900 text-white md:hidden flex flex-col items-center py-4 space-y-4">
                        <span className="hover:text-yellow-400 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Phim</span>
                        <span className="hover:text-yellow-400 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Rạp</span>
                    </div>
                )}

                {/* User & Search */}
                <div className="flex items-center space-x-4">
                    <div className="cursor-pointer p-2 rounded-full bg-gray-800 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300" onClick={() => setIsSearchModalOpen(true)}>
                        <i className="fa-solid fa-magnifying-glass text-xl"></i>
                    </div>
                    <div className="relative" onMouseEnter={handleMouseEnterUser} onMouseLeave={handleMouseLeaveUser}>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer active:scale-95 bg-gray-800 text-white transition-all duration-300 hover:bg-yellow-500 hover:text-black">
                            <i className="fas fa-user-circle text-2xl"></i>
                        </div>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-gray-800 text-white rounded-lg shadow-lg w-40">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đăng ký</li>
                                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đăng nhập</li>
                                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đăng xuất</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg w-[90%] max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Tìm kiếm</h2>
                            <button onClick={() => setIsSearchModalOpen(false)} className="text-gray-600 hover:text-red-600 text-3xl">&times;</button>
                        </div>
                        <input type="text" placeholder="Nhập tên phim..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
