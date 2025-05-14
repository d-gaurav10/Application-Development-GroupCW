import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

function Navbar() {
  return (
    <header className="bg-[#0d1b61] text-white py-4 px-8 flex items-center justify-between flex-wrap">
      <div className="text-xl font-bold flex items-center gap-2">
        📖 Book<span className="text-[#f54748]">Bazzar</span>
      </div>
      <nav className="flex gap-8 flex-wrap">
        <a href="#" className="text-white font-medium hover:text-yellow-400 transition-colors">Home</a>
        <a href="#" className="text-white font-medium hover:text-yellow-400 transition-colors">About</a>
        <a href="#" className="text-white font-medium hover:text-yellow-400 transition-colors">Shop</a>
        <a href="#" className="text-white font-medium hover:text-yellow-400 transition-colors">Contact</a>
      </nav>
      <div className="flex gap-6 text-lg items-center">
        <FiSearch />
        <FiShoppingCart />
        <FiUser />
      </div>
    </header>
  );
}

export default Navbar;
