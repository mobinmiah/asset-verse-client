import { Link } from "react-router";
import lotoImg from "../../assets/logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center group">
      <img 
        className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-all duration-200 group-hover:scale-105" 
        src={lotoImg} 
        alt="AssetVerse Logo"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(20, 194, 237, 0.1))'
        }}
      />
    </Link>
  );
};

export default Logo;
