import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef } from 'react'

export default function GoogleMapMonitoring({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(data)
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'AIzaSyAUul4WOPFSjQoEI8z99NF-UadzHiyBr0s',
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')

      let initialLatLng = { lat: 37.21015, lng: 68.23044 } // 기본 좌표 설정

      // data 배열에서 유효한 위도와 경도를 가진 첫 번째 요소 찾기
      for (const item of data) {
        const latitude = Number(item.LATITUDE)
        const longitude = Number(item.LONGITUDE)

        if (!isNaN(latitude) && !isNaN(longitude)) {
          initialLatLng = { lat: latitude, lng: longitude }
          break
        }
      }

      const mapOptions = {
        center: initialLatLng,
        zoom: 14,
      }
      const map = new Map(ref.current!, mapOptions)

      if (data && Array.isArray(data)) {
        data.forEach((item) => {
          const latitude = parseFloat(item.LATITUDE)
          const longitude = parseFloat(item.LONGITUDE)

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const marker = new google.maps.Marker({
              position: {
                lat: latitude,
                lng: longitude,
              },
              map: map,
              title: item.TR_NO,
            })
          }
        })
      }
    }

    initMap()
  }, [])

  return <div ref={ref} id="map" className="h-[520px]" />
}
