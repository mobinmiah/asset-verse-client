import React from "react";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props 
}) => {
  const baseClasses = "btn transition-all duration-200 hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "btn-primary hover:shadow-lg",
    secondary: "btn-secondary hover:shadow-lg",
    outline: "btn-outline btn-primary hover:shadow-md",
    ghost: "btn-ghost hover:bg-primary/10",
    error: "btn-error hover:shadow-lg",
    success: "btn-success hover:shadow-lg",
    warning: "btn-warning hover:shadow-lg"
  };

  const sizes = {
    xs: "btn-xs",
    sm: "btn-sm", 
    md: "",
    lg: "btn-lg"
  };

  const classes = `
    ${baseClasses} 
    ${variants[variant] || variants.primary} 
    ${sizes[size]} 
    ${loading ? "loading" : ""} 
    ${disabled ? "btn-disabled" : ""} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;