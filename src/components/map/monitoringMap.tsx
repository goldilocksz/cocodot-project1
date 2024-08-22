import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef } from 'react'

export default function GoogleMapMonitoring({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
        // apiKey: "AIzaSyAUul4WOPFSjQoEI8z99NF-UadzHiyBr0s",
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')

      const mapOptions = {
        center: {
          lat: 36.350411,
          lng: 127.384547,
        },
        zoom: 14,
      }
      const map = new Map(ref.current!, mapOptions)

      // 마커 관련 코드를 제거했습니다.
    }

    initMap()
  }, [])

  return <div ref={ref} id="map" className="h-[520px]" />
}
