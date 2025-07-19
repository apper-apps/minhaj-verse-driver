import { useState } from "react"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useLanguage } from "@/hooks/useLanguage"

const SearchBar = ({ onSearch, placeholder }) => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder || "Search..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" size="md">
        <ApperIcon name="Search" size={16} />
      </Button>
    </form>
  )
}

export default SearchBar