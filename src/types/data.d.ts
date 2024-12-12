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
  CUSTOMER_TYPE: string
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

export interface TrReport {
  id: number
  COMPANY_CODE: string
  TR_NO: string
  STATUS: string
  BL_NO: string
  LSP_CD: string
  JOB_DATE: string
  POL: string
  VENDOR_NAME: string
  SINGLE_OR_CONSOL: string
  FROM_ROUTE_CODE: string
  FROM_NATION: string
  CN_TRUCK_NO: string
  CN_TRUCK_TYPE: string
  TO_ROUTE_CODE: string
  TO_NATION: string
  VN_TRUCK_NO: string
  VN_TRUCK_TYPE: string
  ETD: string
  PLT_QTY: number
  ATA_FACTORY_TO_PICK_UP: string
  PICK_UP_TIME: string
  ATD_FACTORY: string
  ETA_BORDER: string
  ATA_BORDER: string
  BORDER_PASS: string
  URGENT: string
  REGION_CODE: string
  REGION_NAME: string
  CC_DONE_TIME: string
  ARRIVE_VIETAM_YARD_CN: string
  ARRIVE_VIETAM_YARD_VN: string
  TRANSLOADING: string
  DEPART_FROM_VIETNAM_YARD: string
  ETA_CNEE_FACTORY: string
  ATA_CNEE_FACTORY: string
  UNLOADING: string
  CNEE: string
  INVOICE_NO: string
  INCOTERMS: string
  ITEM_CODE: string
  WEEK: string
  ETD_FACTORY: string
}

export interface Order {
  COMPANY_CODE: string
  TR_NO: string
  BL_NO: string
  CNEE: string
  VENDOR_NAME: string
  REF_INVOICE_NO: string
  INCOTERMS: string
  FROM_ROUTE_CODE: string
  TO_ROUTE_CODE: string
  FROM_TRUCK_TYPE: string
  TO_TRUCK_TYPE: string
  ITEM_CODE: string
  PLT_QTY: number
  CUSTOMER_CODE: string
  CLIENT_CODE: string
  LSP_CD: string
  JOB_DATE: string
  FROM_ROUTE_CODE: string
  FROM_TRUCK_NO: string
  FROM_LATITUDE: string
  FROM_LONGITUDE: string
  TO_ROUTE_CODE: string
  TO_TRUCK_NO: string
  TO_LATITUDE: string
  TO_LONGITUDE: string
  ETD: string
  POL: string
  CC_DONE_TIME: string
  LEAD_TIME: string
  REGION_CODE: string
  REGION_NAME: string
  URGENT: string
  IMP_EXP: string
  STATUS: string
  REMARKS: string
  TIME_ZONE: string
  ADD_DATE: string
  ADD_USER_ID: string
  ADD_USER_NAME: string
  UPDATE_DATE: string
  UPDATE_USER_ID: string
  UPDATE_USER_NAME: string
  DT_COUNT: number
  BL_COUNT: number
  id: number
  ETA_BORDER: string
  ETA_CNEE_FACTORY: string
}

export interface Monitoring {
  id: number
  LSP_CD: string
  STATUS: string
  CNEE: string
  REF_NO: string
  COMPANY_CODE: string
  REMARKS: string
  LAST_UPDATE_DATE: string
  CHECK_YN: string
  NOW_STATUS: string
  POL: string
  POD: string
  BL_NO: string
}

export interface Customer {
  id: string
  UPDATE_USER_ID: string
  CUSTOMER_NAME_ENG: string
  TEL_NO: string
  UPDATE_DATE: string
  ADD_USER_ID: string
  CUSTOMER_TYPE: string
  ADD_USER_NAME: string
  REMARKS: string
  STATUS: string
  FAX_NO: string
  TIME_ZONE: string
  CUSTOMER_NAME: string
  ADD_DATE: string
  CUSTOMER_CODE: string
  UPDATE_USER_NAME: string
  DEPT_CODE: string
  DEPT_NAME: string
  DEPT_NAME_ENG: string
  PIC_NAME: string
  PIC_TEL: string
  PIC_EMAIL: string
}

export interface TrakingInfo {
  TRUCK_NO: string
  TR_NO: string
  CHECK_DATE: string
  BTN_STATUS: string
  LONGITUDE: string
  SEQ_NAME: string
  JOB_DATE: string
  TO_LONGITUDE: string
  ROUTE_CODE: string
  ROUTE_NAME: string
  STATUS: string
  COMPANY_CODE: string
  NATION_CD: string
  FROM_LONGITUDE: string
  FROM_LATITUDE: string
  TO_LATITUDE: string
  LATITUDE: string
  SEQ: string
}

export interface RouteHistory {
  COMPANY_CODE: string
  TR_NO: string
  SEQ: string
  TRUCK_NO: string
  CHECK_DATE: string
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

export interface TimeTableData {
  SEQ: string
  Datetime: string
  SEQ_NAME: string
}

interface SyncManager {
  getTags(): Promise<string[]>
  register(tag: string): Promise<void>
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager
  }

  interface SyncEvent extends ExtendableEvent {
    readonly lastChance: boolean
    readonly tag: string
  }

  interface ServiceWorkerGlobalScopeEventMap {
    sync: SyncEvent
  }
}
