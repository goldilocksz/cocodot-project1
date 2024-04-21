export type Auth = {
  CUSTOMER_CODE: string
  COMPANY_CODE: string
  USER_ID: string
  USER_NAME: string
  TEL_NO: string
  EMAIL: string
  TRUCK_NO: string
  TRUCK_TYPE: string
  NATION_CD: string
  USE_YN: string
  LAST_LOGIN_DATE: string
  ACCOUNT_NAME: string
  USER_LANG: string
  GRADE: string
  STATUS: string
  REMARKS: string
  TIME_ZONE: string
}

export interface User {
  ID: number
  COMPANY_CODE: string
  USER_ID: string
  CUSTOMER_CODE: string
  PW: string
  USER_NAME: string
  DEPT_CODE: string
  TEL_NO: string
  EMAIL: string
  TRUCK_NO: string
  TRUCK_TYPE: string
  NATION_CD: string
  USE_YN: string
  LAST_LOGIN_DATE: string
  USER_LANG: string
  ACCOUNT_NAME: string
  GRADE: string
  STATUS: string
  REMARKS: string
  TIME_ZONE: string
  ADD_DATE: Date
  ADD_USER_ID: string
  ADD_USER_NAME: string
  UPDATE_DATE: Date
  UPDATE_USER_ID: string
  UPDATE_USER_NAME: string
}

export interface Code {
  id: number
  GROUP_CODE: string
  DT_CODE: string
  USE_YN: string
  LOC_VALUE: string
  ENG_VALUE: string
  ETC1: string
  ETC2: string
  ETC3: string
  ETC4: string
  ETC5: string
  ETC6: string
  ETC7: string
  SORT_SEQ_NO: number
  STATUS: string
  REMARKS: string
  TIME_ZONE: string
  ADD_DATE: string
  ADD_USER_ID: string
  ADD_USER_NAME: string
  UPDATE_DATE: string
  UPDATE_USER_ID: string
  UPDATE_USER_NAME: string
}

export interface Route {
  id: string
  COMPANY_CODE: string
  CUSTOMER_CODE: string
  ROUTE_CODE: string
  SEQ: string
  NEW_SEQ: string
  NATION_CD: string
  ROUTE_NAME: string
  SEQ_NAME: string
  FILE_NAME: string
  LATITUDE: string
  LONGITUDE: string
  STATUS: string
  REMARKS: string
  TIME_ZONE: string
  ADD_DATE: string
  ADD_USER_ID: string
  ADD_USER_NAME: string
  UPDATE_DATE: string
  UPDATE_USER_ID: string
  UPDATE_USER_NAME: string
}
