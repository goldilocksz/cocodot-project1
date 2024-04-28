import GoogleMapReact from 'google-map-react'
import { Flag } from 'lucide-react'

interface Props {
  lat: number
  lng: number
}

export default function GoogleMap({ lat, lng }: Props) {
  const defaultProps = {
    center: {
      lat,
      lng,
    },
    zoom: 11,
  }

  return (
    <div className="h-[300px]">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY! }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {/* <AnyReactComponent lat={lat} lng={lng} text="My Marker" /> */}
      </GoogleMapReact>
    </div>
  )
}
