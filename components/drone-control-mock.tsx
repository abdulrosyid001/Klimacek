"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  Plane,
  Camera,
  Battery,
  Radio,
  Navigation,
  Target,
  AlertCircle,
  Play,
  Pause,
  Square,
  Home,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw
} from "lucide-react"

export default function DroneControlMock() {
  const [isFlying, setIsFlying] = useState(false)
  const [altitude, setAltitude] = useState(0)
  const [battery] = useState(85)
  const [signal] = useState(92)

  const handleTakeoff = () => {
    setIsFlying(true)
    setAltitude(10)
  }

  const handleLand = () => {
    setIsFlying(false)
    setAltitude(0)
  }

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant={isFlying ? "default" : "secondary"} className="bg-purple-600 text-white">
              {isFlying ? "Flying" : "Grounded"}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Battery className="w-4 h-4" />
              <span>{battery}%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Radio className="w-4 h-4" />
              <span>{signal}%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Navigation className="w-4 h-4" />
              <span>{altitude}m</span>
            </div>
          </div>
          <div className="text-sm text-orange-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Simulation Mode - Backend Not Connected
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Video Feed Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Live Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Camera Feed Unavailable</p>
                <p className="text-sm opacity-75 mt-2">Backend service not running</p>
              </div>
              {isFlying && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs animate-pulse">
                  ● REC
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="w-5 h-5" />
              <span>Drone Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Actions */}
            <div className="flex justify-center space-x-2">
              {!isFlying ? (
                <Button
                  onClick={handleTakeoff}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Takeoff
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleLand}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Land
                  </Button>
                  <Button variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Hover
                  </Button>
                </>
              )}
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>

            {/* Direction Controls */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Movement Controls</p>
              <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isFlying}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div></div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isFlying}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isFlying}
                >
                  <Square className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isFlying}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isFlying}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <div></div>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!isFlying}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Rotate Left
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!isFlying}
              >
                <RotateCw className="w-4 h-4 mr-1" />
                Rotate Right
              </Button>
            </div>

            {/* Disease Detection */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-600 mb-2">AI Detection</p>
              <Button
                variant="outline"
                className="w-full"
                disabled={!isFlying}
              >
                <Target className="w-4 h-4 mr-2" />
                Start Disease Detection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Message */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">Simulation Mode Active</p>
            <p className="text-sm text-amber-700 mt-1">
              The drone backend service is not running. This is a mock interface for demonstration purposes.
              To enable real drone control, please start the backend service on port 8000.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}