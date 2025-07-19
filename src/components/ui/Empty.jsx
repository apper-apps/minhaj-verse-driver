import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No content available", 
  description = "There's nothing here yet. Check back later!", 
  action,
  actionLabel = "Get Started",
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-2xl flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary/60" />
      </div>
      <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {action && (
        <Button onClick={action} variant="primary" size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty