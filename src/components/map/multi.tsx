import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef } from 'react'

export default function GoogleMapMulti({
  data,
  gps,
  highlightedIndex,
}: {
  data: any
  gps: any
  highlightedIndex: number | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const gpsMarkersRef = useRef<google.maps.Marker[]>([])
  const routePathRef = useRef<google.maps.Polyline | null>(null)

  useEffect(() => {
    const markers: google.maps.Marker[] = []
    const gpsMarkers: google.maps.Marker[] = []
    const paths: google.maps.LatLngLiteral[] = []

    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')

      const gpsDotIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#62D811',
        fillOpacity: 1,
        scale: 4,
        strokeColor: '#62D811',
        strokeWeight: 1,
      }

      const dotIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#397d0b',
        fillOpacity: 1,
        scale: 4,
        strokeColor: '#397d0b',
        strokeWeight: 1,
      }

      const lastData = data[data.length - 1]

      const mapOptions = {
        center: {
          lat: Number(

<!--             gps && gps.length > 0
              ? gps[gps.length - 1].LATITUDE
              : lastData
                ? lastData.LATITUDE
                : 0,
          ),
          lng: Number(
            gps && gps.length > 0
              ? gps[gps.length - 1].LONGITUDE
              : lastData
                ? lastData.LONGITUDE
                : 0, -->

            gps && gps.length > 0 ? gps[gps.length - 1].LATITUDE : lastData ? lastData.LATITUDE : 0,
          ),
          lng: Number(
            gps && gps.length > 0 ? gps[gps.length - 1].LONGITUDE : lastData ? lastData.LONGITUDE : 0,

          ),
        },
        zoom: 14,
      }

      const map = new Map(ref.current!, mapOptions)
      mapRef.current = map

      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      gpsMarkersRef.current.forEach((marker) => marker.setMap(null))
      gpsMarkersRef.current = []

      if (routePathRef.current) {
        routePathRef.current.setMap(null)
        routePathRef.current = null
      }

      if (data) {
        data.forEach((item: any, index: number) => {
          if (item.LATITUDE === 'NULL' || item.LONGITUDE === 'NULL') return

          const isStartOrEnd = index === 0 || index === data.length - 1

          const defaultMarker = new google.maps.Marker({
            position: {
              lat: Number(item.LATITUDE),
              lng: Number(item.LONGITUDE),
            },
            map: map,
            icon: isStartOrEnd ? undefined : dotIcon,
          })
          markers.push(defaultMarker)
          // paths.push({
          //   lat: Number(item.LATITUDE),
          //   lng: Number(item.LONGITUDE),
          // })
        })
      }

      if (gps) {
        gps.forEach((item: any) => {
          if (item.LATITUDE === 'NULL' || item.LONGITUDE === 'NULL') return

          const gpsMarker = new google.maps.Marker({
            position: {
              lat: Number(item.LATITUDE),
              lng: Number(item.LONGITUDE),
            },
            map: map,
            icon: gpsDotIcon,
          })
          markers.push(gpsMarker)
          gpsMarkers.push(gpsMarker)
          paths.push({
            lat: Number(item.LATITUDE),
            lng: Number(item.LONGITUDE),
          })
        })
      }
      gpsMarkersRef.current = gpsMarkers
      markersRef.current = markers

      if (paths.length > 1) {
        routePathRef.current = new google.maps.Polyline({
          path: paths,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: map,
        })
      }
    }

    initMap()
  }, [data, gps])

  useEffect(() => {
    // if (markersRef.current.length > 0 && highlightedIndex !== null) {
    //   markersRef.current.forEach((marker, index) => {
    //     if (index === highlightedIndex) {
    //       marker.setAnimation(google.maps.Animation.BOUNCE)

    //       const markerPosition = marker.getPosition()
    //       if (markerPosition && mapRef.current) {
    //         mapRef.current.setCenter(markerPosition)
    //       }
    //     } else {
    //       marker.setAnimation(null)
    //     }
    //   })
    // }
    if (gpsMarkersRef.current.length > 0 && highlightedIndex !== null) {
      gpsMarkersRef.current.forEach((marker, index) => {
        if (index === highlightedIndex) {
          marker.setAnimation(google.maps.Animation.BOUNCE)

          const markerPosition = marker.getPosition()
          if (markerPosition && mapRef.current) {
            mapRef.current.setCenter(markerPosition)
          }
        } else {
          marker.setAnimation(null)
        }
      })
    }
  }, [highlightedIndex])

  return <div ref={ref} id="map" className="h-full" />
}
