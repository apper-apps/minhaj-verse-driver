import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-base",
        "placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        "transition-all duration-200 hover:border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input