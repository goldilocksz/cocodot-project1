import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef } from 'react'

export default function GoogleRouteInfo({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const markers: google.maps.Marker[] = []
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')

      const mapOptions = {
        center: {
          lat: Number(data[data.length - 1].LATITUDE),
          lng: Number(data[data.length - 1].LONGITUDE),
        },
        zoom: 14,
      }
      const map = new Map(ref.current!, mapOptions)

      // 출발점 마커
      const startMarker = new google.maps.Marker({
        position: {
          lat: Number(data[0].FROM_LATITUDE),
          lng: Number(data[0].FROM_LONGITUDE),
        },
        map: map,
      })
      markers.push(startMarker)

      data.forEach((item: any) => {
        if (item.LATITUDE === 'NULL' || item.LONGITUDE === 'NULL') return
        const defaultMarker = new google.maps.Marker({
          position: { lat: Number(item.LATITUDE), lng: Number(item.LONGITUDE) },
          map: map,
        })
        markers.push(defaultMarker)
      })

      // 도착점 마커
      const endMarker = new google.maps.Marker({
        position: {
          lat: Number(data[0].TO_LATITUDE),
          lng: Number(data[0].TO_LONGITUDE),
        },
        map: map,
      })
      markers.push(endMarker)
    }

    initMap()
  }, [])

  return <div ref={ref} id="map" className="h-[150px]" />
}
