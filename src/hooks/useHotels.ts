// import { useState } from 'react'
// import { getHotels } from '../services/getHotels'
// import { parseError, TypeError } from '../utils/errHandle'
// import { Hotels } from '../types/hotels'

// const cache: {[key: string]: Hotels[]} = {}

// export const useHotels = () => {
//   const [hotels, setHotels] = useState<Hotels[]>([])
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<TypeError | null>(null)
//   const [isSearched, setIsSearched] = useState<boolean>(false)

//   const resetSearch = () => {
//     setIsSearched(false)
//     setError(error)
//   }

//   const fetchHotels = async (city: string) => {
//     const cityName = city.trim().toLowerCase()

//     if (!cityName) {
//       alert("City required")
//       return
//     }

//     if (cache[cityName]) {
//       console.log(`Данные для ${cityName} взяты из кэша 🚀`)
//       setHotels(cache[cityName])
//       setError(error)
//       return
//     }

//     setLoading(true)
//     setIsSearched(true)
//     setError(null)

//     try {
//       const data = await getHotels(city)
//       cache[cityName] = data
//       setHotels(data)    
//     } catch (err: any) {
//       console.error(err)
//       setError(parseError(err))
//     } finally {
//       setLoading(false)
//     }
//   }

//   return {
//     hotels,
//     loading,
//     error,
//     isSearched,
//     fetchHotels,
//     resetSearch
//   }
// }


import { getHotels } from '../services/getHotels'
import { parseError } from '../utils/errHandle'
import { useQuery } from '@tanstack/react-query'

export const useHotels = (city: string) => {

    const query = useQuery({
        queryKey: ["hotels", city],
        queryFn: () => getHotels(city),
        enabled: false,
        staleTime: 100 * 60 * 5,
        retry: 1 
    })

    return {
        hotels: query.data ?? [],
        loading: query.isFetching,
        error: query.error ? parseError(query.error) : null,
        isSearched: query.isFetched,
        fetchHotels: query.refetch,
        // resetSearch: () => queryClient.removeQueries({ queryKey: ["hotels", city] })
      }
}
