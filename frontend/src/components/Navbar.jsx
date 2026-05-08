import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="apple-nav sticky top-0 z-50 w-full h-[48px] flex items-center justify-center">
            <nav className="max-w-[980px] w-full flex justify-between items-center px-4">
                <span className="font-semibold tracking-tight text-[17px]">WebChat</span>
                <div className="flex space-x-8 text-[12px] font-normal text-black/80">
                    <Link to="/" className="hover:text-black transition">Home</Link>
                    <Link to="/rooms" className="hover:text-black transition">Rooms</Link>
                    <Link to="/about" className="hover:text-black transition">Sobre</Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
