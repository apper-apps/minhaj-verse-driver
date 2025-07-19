import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const Whiteboard = () => {
  const { t } = useLanguage()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState("pen")
  const [currentColor, setCurrentColor] = useState("#2E7D32")
  const [lineWidth, setLineWidth] = useState(3)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionCode, setSessionCode] = useState("")
  const [connectedStudents, setConnectedStudents] = useState(0)

  const tools = [
    { id: "pen", name: "Pen", icon: "Pen" },
    { id: "eraser", name: "Eraser", icon: "Eraser" },
    { id: "text", name: "Text", icon: "Type" },
    { id: "line", name: "Line", icon: "Minus" },
    { id: "rectangle", name: "Rectangle", icon: "Square" },
    { id: "circle", name: "Circle", icon: "Circle" }
  ]

  const colors = [
    "#2E7D32", "#1976D2", "#D32F2F", "#FF9800", 
    "#9C27B0", "#000000", "#795548", "#607D8B"
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e) => {
    if (currentTool === "text") return
    
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(x, y)
    
    if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = lineWidth * 3
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = currentColor
      ctx.lineWidth = lineWidth
    }
  }

  const draw = (e) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    
    if (currentTool === "pen" || currentTool === "eraser") {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    toast.success("Canvas cleared! 🧹")
  }

  const startSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setSessionCode(code)
    setIsSessionActive(true)
    setConnectedStudents(Math.floor(Math.random() * 5) + 1) // Simulate students
    toast.success(`Live session started! Share code: ${code} 🎉`)
  }

  const endSession = () => {
    setIsSessionActive(false)
    setSessionCode("")
    setConnectedStudents(0)
    toast.info("Session ended 👋")
  }

  const joinSession = () => {
    const code = prompt("Enter session code:")
    if (code) {
      setIsSessionActive(true)
      setSessionCode(code)
      toast.success(`Joined session: ${code} ✨`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
            🎨 {t("whiteboard")}
          </h1>
          <p className="text-xl text-gray-600">
            Interactive learning space for teachers and students
          </p>
        </div>

        {/* Session Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {isSessionActive ? (
                <div className="flex items-center gap-4">
                  <Badge variant="success" className="animate-pulse">
                    🟢 Live Session
                  </Badge>
                  <div className="text-sm">
                    <span className="font-medium">Code: </span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {sessionCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <ApperIcon name="Users" size={16} />
                    {connectedStudents} students
                  </div>
                </div>
              ) : (
                <Badge variant="default">
                  ⚫ No Active Session
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isSessionActive ? (
                <>
                  <Button onClick={startSession} variant="primary">
                    <ApperIcon name="Video" size={16} className="mr-2" />
                    Start Session
                  </Button>
                  <Button onClick={joinSession} variant="outline">
                    <ApperIcon name="UserPlus" size={16} className="mr-2" />
                    Join Session
                  </Button>
                </>
              ) : (
                <Button onClick={endSession} variant="danger">
                  <ApperIcon name="StopCircle" size={16} className="mr-2" />
                  End Session
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit sticky top-24">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <ApperIcon name="Palette" size={20} />
                🛠️ Tools
              </h3>
              
              {/* Drawing Tools */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700">Drawing Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={currentTool === tool.id ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentTool(tool.id)}
                      className="drawing-tool"
                    >
                      <ApperIcon name={tool.icon} size={16} />
                      <span className="ml-1 text-xs">{tool.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700">Colors</h4>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        currentColor === color 
                          ? "border-gray-400 scale-110" 
                          : "border-gray-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Line Width */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700">
                  Brush Size: {lineWidth}px
                </h4>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                  {t("clear")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Save
                </Button>
              </div>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <ApperIcon name="PenTool" size={20} />
                  🎯 Canvas
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Current tool:</span>
                  <Badge variant="primary">{currentTool}</Badge>
                </div>
              </div>
              
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="whiteboard-canvas w-full max-w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                
                {/* Overlay instructions */}
                {!isSessionActive && (
                  <div className="absolute inset-0 bg-black/5 rounded-xl flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                      <ApperIcon name="MousePointer" size={48} className="text-primary mx-auto mb-4" />
                      <h4 className="font-display font-bold text-lg mb-2">
                        🚀 Ready to Create!
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Start a live session to begin teaching, or join an existing session to learn together.
                      </p>
                      <p className="text-sm text-gray-500">
                        💡 Tip: Use the pen tool to draw, eraser to correct, and text tool to add notes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-accent/5 to-primary/5">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <ApperIcon name="HelpCircle" size={20} />
            💡 How to Use the Whiteboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎨</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Draw & Create</h4>
                <p className="text-gray-600">Use pen, shapes, and text tools to create engaging lessons</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📡</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Live Sessions</h4>
                <p className="text-gray-600">Start or join live sessions to collaborate in real-time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💾</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Save & Share</h4>
                <p className="text-gray-600">Save your work and share session codes with students</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Whiteboard