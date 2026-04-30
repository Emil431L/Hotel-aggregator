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
    <div className="field-container">
      <label>{props.label}</label>
      {props.children}
    </div>
  )
}

const HotelList = () => {
  const [city, setCity] = useState<string>("")
  const [bookingId, setBookingId] = useState<string | null>(null); // Чтобы знать, какой именно отель бронируется
  
  const { hotels, loading, error, isSearched, fetchHotels, resetSearch } = useHotels(city)
  const navigate = useNavigate()

  // Авто-редирект если токен протух или отсутствует
  useEffect(() => {
    if (error && (error.message === "Token missing" || error.message === "Invalid or expired token")) {
      navigate("/login")
    }
  }, [error, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city) {
      alert("City required!")
      return
    }
    fetchHotels()
  }

  // Функция для обработки бронирования
  const handleBook = async (hotelId: string, hotelName: string) => {
    setBookingId(hotelId);
    
    try {
      // Здесь будет твой fetch к api/book.js
      console.log(`Отправляем запрос на бронирование: ${hotelName} (ID: ${hotelId})`);
      
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Успешно забронировано: ${hotelName}`);
    } catch (err) {
      alert("Ошибка при бронировании");
    } finally {
      setBookingId(null);
    }
  }
  
  return (
    <div className="hotel-page">
      <h2>Hotel Search</h2>

      <form onSubmit={handleSubmit}>
        <Field label="City:">
          <input 
            type="text" 
            value={city} 
            onChange={(e) => { setCity(e.target.value); resetSearch() }} 
            placeholder="e.g. London"
          />
        </Field>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Hotels"}
        </button>

        {/* Если ничего не нашли */}
        {!loading && !error && isSearched && hotels.length === 0 && (
          <div className="info-message">
            <p>No hotels found in {city}</p>
          </div>
        )}

        {/* Ошибки */}
        {error && (
          <div className="error-container">
            <h3>{error.title}</h3>
            <p>{error.message}</p>
            {error.type === "OFFLINE" && (
              <button type="button" onClick={handleSubmit}>Try again</button>
            )}
          </div>
        )}

        {/* Список отелей */}
        {Array.isArray(hotels) && hotels.length > 0 && (
          <ul className="hotel-list">
            {hotels.map((hl) => (
              <li key={hl.id} className="hotel-card">
                <div className="hotel-info">
                  <p className="hotel-name"><strong>{hl.name}</strong></p>
                  <p className="hotel-address">{hl.address}</p>
                  <p className="hotel-rating">
                    Rating: {"⭐".repeat(Math.max(0, Math.floor(Number(hl.rating || 0))))}
                  </p>
                </div>
                
                <button 
                  type="button" 
                  className="book-button"
                  disabled={bookingId === hl.id}
                  onClick={() => handleBook(hl.id, hl.name)}
                >
                  {bookingId === hl.id ? "Booking..." : "Book Now"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  )
}

export default HotelList;
