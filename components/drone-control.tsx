"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { DroneStatus, Prediction } from "../types/drone"
import { useToast } from "./ui/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function DroneControl() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'tello' | 'webcam'>('webcam')
  const [status, setStatus] = useState<DroneStatus>({
    connected: false,
    mode: "idle",
    battery: 0,
    signal: 0,
  })
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const { toast } = useToast()

  const connectToDevice = async (selectedSource: 'tello' | 'webcam') => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop any existing connection
      await fetch('http://localhost:8000/stop').catch(() => {})

      // Try to connect to selected source
      const response = await fetch(`http://localhost:8000/start?source=${selectedSource}`, {
        method: 'GET',
        mode: 'cors'
      }).catch((err) => {
        throw new Error('Cannot connect to device. Please check your connection.')
      })

      if (!response) {
        throw new Error('Connection failed')
      }

      if (!response.ok) {
        throw new Error(`Failed to connect to ${selectedSource}`)
      }
      
      setIsConnected(true)
      setSource(selectedSource)
      setStatus((prev: DroneStatus) => ({
        ...prev,
        connected: true,
        mode: selectedSource,
        battery: 100,
        signal: 100
      }))
    } catch (err: any) {
      console.error(`Connection error:`, err)
      const errorMessage = err.message || `Failed to connect to ${selectedSource}`
      setError(errorMessage)
      setIsConnected(false)
      setStatus((prev: DroneStatus) => ({
        ...prev,
        connected: false,
        mode: "error"
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Don't auto-connect on mount
    setIsLoading(false)
    setError(null)

    return () => {
      // Cleanup on unmount
      fetch('http://localhost:8000/stop').catch(() => {})
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!isConnected) return

    // Connect to WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'status') {
        setStatus(data.status)
      } else if (data.type === 'prediction') {
        setPrediction(data.prediction)
        if (data.prediction) {
          toast({
            title: "New Prediction",
            description: `${data.prediction.class} (${(data.prediction.confidence * 100).toFixed(1)}% confidence)`,
          })
        }
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setError('Lost connection to server')
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
      setError('Connection to server closed')
    }

    return () => {
      ws.close()
    }
  }, [isConnected, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to {source === 'tello' ? 'Tello drone' : 'webcam'}...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-center">
            <div className={`${error ? 'text-amber-500' : 'text-gray-400'} mb-4`}>
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={error
                    ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    : "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  }
                />
              </svg>
            </div>
            <p className={`font-semibold ${error ? 'text-amber-700' : 'text-gray-700'}`}>
              {error || 'Select a device to connect'}
            </p>
          </div>

          <div className="mt-6 space-y-3 max-w-xs mx-auto">
            <Select
              value={source}
              onValueChange={(value) => setSource(value as 'tello' | 'webcam')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webcam">Webcam</SelectItem>
                <SelectItem value="tello">Tello Drone</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => connectToDevice(source)}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </span>
              ) : (
                <span>Connect to {source === 'tello' ? 'Tello Drone' : 'Webcam'}</span>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Device Information</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• <strong>Webcam:</strong> Uses your computer's camera for testing</p>
            <p>• <strong>Tello Drone:</strong> Connects to DJI Tello drone via WiFi</p>
          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <Select
          value={source}
          onValueChange={(value) => {
            setSource(value as 'tello' | 'webcam')
            connectToDevice(value as 'tello' | 'webcam')
          }}
        >
          <SelectTrigger className="w-[180px] bg-black bg-opacity-50 text-white border-none">
            <SelectValue placeholder="Pilih perangkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tello">Tello Drone</SelectItem>
            <SelectItem value="webcam">Webcam</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {source === 'tello' ? 'Connected to Tello' : 'Using Webcam'}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <img
                  src="http://localhost:8000/video_feed"
                  alt="Drone/Webcam Feed"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error loading video feed");
                    setError("Failed to load video feed. Please check your connection.");
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">Mode</p>
                  <p className="text-lg font-semibold">{status.mode}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">Battery</p>
                  <p className="text-lg font-semibold">{status.battery}%</p>
                </div>
              </div>
              
              {prediction && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-500">Latest Prediction</p>
                  <p className="text-lg font-semibold text-green-700">
                    {prediction.class} ({(prediction.confidence * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 