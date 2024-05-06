import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef } from 'react'

const loader = new Loader({
  apiKey: 'AIzaSyCILoSLSUZUPFqaR13p1XlsusHOej47PUk',
  version: 'weekly',
  libraries: ['places'],
})

const mapOptions = {
  center: {
    lat: 0,
    lng: 0,
  },
  zoom: 4,
}

export default function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral
  zoom: number
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    loader.importLibrary('maps').then(({ Map }) => {
      new Map(ref.current!, mapOptions)
    })
  })

  return <div ref={ref} id="map" />
}
