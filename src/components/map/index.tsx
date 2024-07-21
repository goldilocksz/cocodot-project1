import { Loader } from '@googlemaps/js-api-loader'
import { Fragment, useEffect, useRef } from 'react'

export default function VanilaMap({
  lat,
  lng,
  setPosition,
}: {
  lat: number
  lng: number
  setPosition: (value: { lat: number; lng: number }) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const markers: google.maps.Marker[] = []
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
		//apiKey:"AIzaSyB5JRlvlHJ09OsXR7WF4r5rzJ7qt9AazEg",
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { Marker } = await loader.importLibrary('marker')

      const mapOptions = {
        center: { lat, lng },
        zoom: 14,
      }
      const map = new Map(ref.current!, mapOptions)

      const defaultMarker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
      })
      markers.push(defaultMarker)

      map.addListener('click', (event: any) => {
        markers.forEach((marker) => marker.setMap(null))
        const newMarker = new Marker({
          position: event.latLng,
          map: map,
        })
        markers.push(newMarker)
        setPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        })
      })
    }

    initMap()
  }, [])

  return <div ref={ref} id="map" className="h-[300px]" />
}
