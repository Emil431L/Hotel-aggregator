import { useState } from 'react'
import { getHotels } from '../services/getHotels'
import { parseError, TypeError } from '../utils/errHandle'
import { Hotels } from '../types/hotels'

const cache: {[key: string]: Hotels[]} = {}

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<TypeError | null>(null)
  const [isSearched, setIsSearched] = useState<boolean>(false)

  const resetSearch = () => {
    setIsSearched(false)
  }

  const fetchHotels = async (city: string) => {
    const cityName = city.trim().toLowerCase()

    if (!cityName) {
      alert("City required")
      return
    }

    if (cache[cityName]) {
      console.log(`Данные для ${cityName} взяты из кэша 🚀`)
      setHotels(cache[cityName])
      setError(error)
      return
    }

    setLoading(true)
    setIsSearched(true)
    setError(null)

    try {
      const data = await getHotels(city)
      cache[cityName] = data
      setHotels(data)    
    } catch (err: any) {
      console.error(err)
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  return {
    hotels,
    loading,
    error,
    isSearched,
    fetchHotels,
    resetSearch
  }
}


