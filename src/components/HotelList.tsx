import { useState } from 'react';
import { useHotels } from '../hooks/useHotels';

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
  const {hotels, loading, error, isSearched, fetchHotels, resetSearch} = useHotels()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    fetchHotels(city)
  }
  
  return (
    <div>
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
            {hotels.map((hl) => (
              <li key={hl.id}>
                <p>{hl.name}</p>
                <p>{hl.address}</p>
                <p>rating {"⭐".repeat(Math.max(0, Math.floor(Number(hl.rating || 0))))}</p>
                </li>
              ))}
              </ul>
            )}
      </form>
    </div>
  )
}

export default HotelList;
