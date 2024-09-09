// self.addEventListener('instlall', (event) => {
//   console.log('Service Worker installed')
// })

// self.addEventListener('activate', (event) => {
//   console.log('Service Worker activated')
// })

// self.addEventListener('sync', (event) => {
//   if (event.tag === 'gps-sync') {
//     event.waitUtil(syncGpsData())
//   }
// })

// async function syncGpsData() {
//   const position = await getCurrentPosition()

//   if (position) {
//     const gpsData = {
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude,
//     }

//     try {
//       const response = await fetch('/order/updateRouteHistory', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(gpsData),
//       })

//       if (!response.ok) {
//         throw new Error('Network response wat not ok')
//       }
//       console.log('GPS data sent successfully')
//     } catch (error) {
//       console.error('Error sending GPS data: ', error)
//     }
//   }
// }

// function getCurrentPosition() {
//   return new Promise((resolve, regect) => {
//     if (navigator.geolocation) {
//       navigator.getlocation.getCurrentPosition(resolve, reject, {
//         enableHighAccuracy: true,
//       })
//     } else {
//       reject('Geolocation is not supported by this browser.')
//     }
//   })
// }

// *****************************************************************************************************************

// let intervalId = null

// function startTracking() {
//   intervalId = setInterval(() => {
//     console.log('Service Worker interval111222')
//   }, 5000)
// }

// const updateTrackingDistance = (latitude, longitude) => {
//   if (trakingInfo && trakingInfo.length > 0) {
//     const distances = trakingInfo.map((info) => {
//       const prevLat = parseFloat(info.LATITUDE)
//       const prevLon = parseFloat(info.LONGITUDE)
//       return getDistance(prevLat, prevLon, latitude, longitude)
//     })
//     console.log(distances)
//     const minDistanceIndex = distances.indexOf(Math.min(...distances))
//     console.log(minDistanceIndex)

//     const data = {
//       COMPANY_CODE: detail?.COMPANY_CODE,
//       TR_NO: detail?.TR_NO,
//       SEQ: 1,
//       TRUCK_NO: trakingInfo[minDistanceIndex].TRUCK_NO,
//       CHECK_DATE: new Date().toISOString(),
//       LATITUDE: latitude.toString(),
//       LONGITUDE: longitude.toString(),
//       STATUS: detail?.STATUS,
//       REMARKS: detail?.REMARKS,
//       TIME_ZONE: '+09:00',
//       ADD_DATE: new Date().toISOString(),
//       ADD_USER_ID: detail?.ADD_USER_ID,
//       ADD_USER_NAME: detail?.ADD_USER_NAME,
//       UPDATE_DATE: new Date().toISOString(),
//       UPDATE_USER_ID: new Date().toISOString(),
//       UPDATE_USER_NAME: detail?.ADD_USER_NAME,
//     }

//     console.log(data)
//     return data
//   }
// }

// function sendGPSData() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         console.log('Sending GPS data:', position.coords)
//         const requestData = updateTrackingDistance(
//           position.coords.latitude,
//           position.coords.longitude,
//         )
//         request
//           .post('/order/updateRouteHistory', requestData)
//           .then((response) => {
//             if (!response.data) {
//               console.error('Failed to send tracking data')
//             } else {
//               console.success('Tracking data sent successfully')
//             }
//           })
//           .catch((error) => {
//             console.error('Error sending tracking data: ' + error.message)
//           })
//       },
//       (error) => {
//         console.error(error.message)
//       },
//       {
//         enableHighAccuracy: true,
//       },
//     )
//   } else {
//     console.error('Geolocation is not supported by this browser.')
//   }
// }

// // 15분마다 요청을 보내는 함수
// function sendRequest() {
//   const requestData = {}

//   fetch('/api/order/updateRouteHistory', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//     body: JSON.stringify(requestData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (!data) {
//         console.error('Failed to send tracking data')
//       } else {
//         console.log('Tracking data sent successfully')
//       }
//     })
//     .catch((error) => {
//       console.error('Error sending tracking data: ' + error.message)
//     })
// }

// function sendTrackingData() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const requestData = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         }

//         fetch('/api/order/updateRouteHistory', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//           body: JSON.stringify(requestData),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             if (!data) {
//               console.error('Failed to send tracking data')
//             } else {
//               console.log('Tracking data sent successfully')
//             }
//           })
//           .catch((error) => {
//             console.error('Error sending tracking data: ' + error.message)
//           })
//       },
//       (error) => {
//         console.error('Error getting GPS data: ' + error.message)
//       },
//       {
//         enableHighAccuracy: true,
//       },
//     )
//   } else {
//     console.error('Geolocation is not supported by this browser.')
//   }
// }

// function startTracking() {
//   if (!intervalId) {
//     intervalId = setInterval(() => {
//       sendTrackingData()
//     }, 1 * 1000) // 15분 (900,000 밀리초)마다 호출
//     console.log('Interval started')
//   }
// }

// self.addEventListener('message', (event) => {
//   console.log(event.data)
//   if (event.data === 'start') {
//     startTracking()
//   } else if (event.data === 'stop') {
//     if (intervalId) {
//       clearInterval(intervalId)
//       intervalId = null
//       console.log('Interval stopped')
//     }
//   }
// })

// self.addEventListener('push', (event) => {
//   const data = event.data.json()
//   console.log('Pus received', data)
// })

// self.addEventListener('sync', (event) => {
//   if (event.tag === 'gps-sync') {
//     event.waitUntil(sendTrackingData())
//   }
// })

// /**
//  * Console창 테스트
//  * navigator.serviceWorker.controller.postMessage('start')
//  * navigator.serviceWorker.controller.postMessage('stop')
//  *
//  *
//  * service-workers 새로 추가된 내용있으면 저장후 화면 새로고침 & Application - Service Workers update 눌러주면 status 새로운거 생김
//  * 그러다가 어느시점에 바뀌는지 모르겠는데, 변경된 service-worker 적용됨
//  *
//  * 새로고침하면 console.log('Service Worker registered with scope:', registration.scope) 뜨면 등록된거임
//  */
