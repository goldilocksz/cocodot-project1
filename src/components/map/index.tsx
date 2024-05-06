import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
}

function MyMapComponent() {
  return <div id="map" />
}

const render = (status: string) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center text-red-600">
          Error
        </div>
      )
    case Status.SUCCESS:
      return <MyMapComponent />
    default:
      return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )
  }
}

export default function GoogleMap({ lat, lng }: Props) {
  return (
    <Wrapper
      apiKey="AIzaSyCILoSLSUZUPFqaR13p1XlsusHOej47PUk"
      render={render}
    ></Wrapper>
  )
}
