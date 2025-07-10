import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { MapPin, Star, Youtube, Users } from 'lucide-react'
import foodStallsData from './data/foodStalls.json'
import './App.css'

function App() {
  const [location, setLocation] = useState('')
  const [filteredStalls, setFilteredStalls] = useState([])
  const [isSearched, setIsSearched] = useState(false)

  // Sort stalls by number of recommendations (descending)
  const sortedStalls = [...foodStallsData].sort((a, b) => 
    b.youtube_recommendations.length - a.youtube_recommendations.length
  )

  const handleSearch = () => {
    if (location.trim()) {
      // For demo purposes, show all stalls when any location is entered
      setFilteredStalls(sortedStalls)
      setIsSearched(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getImagePath = (imageName) => {
    try {
      return new URL(`./assets/${imageName}`, import.meta.url).href
    } catch {
      return `/src/assets/${imageName}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">FoodieMap</h1>
            </div>
            <p className="text-sm text-gray-600 hidden sm:block">
              Discover food stalls recommended by YouTube food bloggers
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Food Stalls Near You
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enter your location and discover amazing food stalls recommended by your favorite YouTube food bloggers within 5km radius
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter your location (e.g., Los Angeles, CA)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
              <MapPin className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {isSearched && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Food Stalls Near {location}
              </h3>
              <p className="text-gray-600">
                Found {filteredStalls.length} recommended food stalls • Sorted by popularity
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStalls.map((stall) => (
                <Card key={stall.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={getImagePath(stall.images[0])}
                      alt={stall.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Food+Image'
                      }}
                    />
                    <Badge className="absolute top-2 right-2 bg-red-600">
                      <Users className="h-3 w-3 mr-1" />
                      {stall.youtube_recommendations.length} reviews
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {stall.name}
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">Popular</span>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {stall.location.address}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Dishes */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Signature Dishes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {stall.dishes_offered.map((dish, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {dish}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* YouTube Recommendations */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Featured By:</h4>
                      <div className="space-y-2">
                        {stall.youtube_recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-red-600">{rec.blogger_name}</span>
                              <a
                                href={rec.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Youtube className="h-3 w-3" />
                              </a>
                            </div>
                            <p className="text-gray-600 line-clamp-2">{rec.summary}</p>
                          </div>
                        ))}
                        {stall.youtube_recommendations.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{stall.youtube_recommendations.length - 2} more reviews
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isSearched && (
          <div className="text-center py-12">
            <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to discover amazing food?
            </h3>
            <p className="text-gray-600">
              Enter your location above to find food stalls recommended by YouTube food bloggers
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 FoodieMap. Discover food through the eyes of YouTube food bloggers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

