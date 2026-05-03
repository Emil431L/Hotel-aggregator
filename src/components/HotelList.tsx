// import { useState } from 'react';
// import { useHotels } from '../hooks/useHotels';
// import '../css/HotelList.css';

// interface FieldProps {
//   label: string,
//   children: React.ReactNode
// }

// const Field = (props: FieldProps) => {
//   return (
//     <div>
//       <label>{props.label}</label>
//       {props.children}
//     </div>
//   )
// }

// const HotelList = () => {
//   const [city, setCity] = useState<string>("")
//   const {hotels, loading, error, isSearched, fetchHotels, resetSearch} = useHotels()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     fetchHotels(city)
//   }
  
//   return (
//     <div>
//       <h2>Hotel Search</h2>

//       <form onSubmit={handleSubmit}>
//       <Field label="City:">
//         <input type="text" value={city} onChange={(e) => {setCity(e.target.value); resetSearch()}} />
//       </Field>

//         <button type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Search Hotels"}
//         </button>

//         {!loading && !error && city && isSearched && hotels.length === 0 && (
//           <div>
//             <p>No hotels found in {city}</p>
//           </div>
//         )}

//         {error && (
//         <div>
//           <h3>{error.title}</h3>
//           <p>{error.message}</p>
//           {error.type === "OFFLINE" && (
//             <button onClick={handleSubmit}>
//               Try again
//             </button>
//           )}
//         </div>
//         )}

//         {Array.isArray(hotels) && hotels.length > 0 && (
//           <ul>
//             {hotels.map((hl) => (
//               <li key={hl.id}>
//                 <p>{hl.name}</p>
//                 <p>{hl.address}</p>
//                 <p>rating {"⭐".repeat(Math.max(0, Math.floor(Number(hl.rating || 0))))}</p>
//                 </li>
//               ))}
//               </ul>
//             )}
//       </form>
//     </div>
//   )
// }

// export default HotelList;


import { useState, useEffect } from 'react';
import { useHotels } from '../hooks/useHotels';
import { useNavigate } from 'react-router-dom';
import '../css/HotelList.css';

interface FieldProps {
  label: string,
  children: React.ReactNode
}

const Field = (props: FieldProps) => {
  return (
    <div>
      <label>{props.label}</label>
      {props.children}
    </div>
  )
}

const HotelList = () => {
  const [city, setCity] = useState<string>("")
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookedIds, setBookedIds] = useState<string[]>([])
  const {hotels, loading, error, isSearched, fetchHotels, resetSearch} = useHotels(city)
  
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
      const response = await fetch("/api/my-bookings")
        if (response.ok) {
          const data = await response.json()
          setBookedIds(data.map((d: any) => String(d.hotelId)))
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchMyBookings()
  }, [])

  useEffect(() => {
      if (error && (error.message === "Token missing" || error.message === "Invalid or expired token")) {
        navigate("/login")
      }
  }, [error, navigate])

  const handleBook = async (hotelId: string, hotelName: string) => {
    setBookingId(hotelId)
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({hotelId, hotelName})
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Booking failed")
      }

      setBookedIds(prev => [...prev, hotelId])
      alert(`Hotel ${hotelName} booked`)

    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setBookingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city) {
      alert("City required!")
      return
    }

    fetchHotels()
  }
  
  return (
    <div className="hotel-page">
      <h2>Hotel Search</h2>

      <form onSubmit={handleSubmit}>
      <Field label="City:">
        <input type="text" value={city} onChange={(e) => {setCity(e.target.value); resetSearch()}} />
      </Field>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search Hotels"}
        </button>

        {!loading && !error && city && isSearched && hotels.length === 0 && (
          <div>
            <p>No hotels found in {city}</p>
          </div>
        )}

        {error && (
        <div>
          <h3>{error.title}</h3>
          <p>{error.message}</p>
          {error.type === "OFFLINE" && (
            <button onClick={handleSubmit}>
              Try again
            </button>
          )}
        </div>
        )}

        {Array.isArray(hotels) && hotels.length > 0 && (
          <ul>
            {hotels.map((hl) => {
              const isAlreadyBooked = bookedIds.includes(String(hl.id))
              
              return (
              <li key={hl.id}>
                <p>{hl.name}</p>
                <p>{hl.address}</p>
                <p>rating {"⭐".repeat(Math.max(0, Math.floor(Number(hl.rating || 0))))}</p>

                {isAlreadyBooked ? (
                  <button type="button" disabled>
                    ✅ Booked
                  </button>
                ) : (
                <button type="button" disabled={bookingId === hl.id} onClick={() => handleBook(hl.id, hl.name)}>
                  {bookingId === hl.id ? "Booking..." : "Book now"}
                </button>
                )}
                </li>
              )
                })}
          </ul>
            )}
      </form>
    </div>
  )
}

export default HotelList;