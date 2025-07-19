import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-button hover:scale-105 focus:ring-primary",
    secondary: "bg-gradient-to-r from-secondary to-warning text-white hover:shadow-lg hover:scale-105 focus:ring-secondary",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white hover:scale-105 focus:ring-primary",
    ghost: "text-primary hover:bg-primary/10 hover:scale-105 focus:ring-primary",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button