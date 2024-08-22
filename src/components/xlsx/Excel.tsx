import { Order, TimeTableData, TrakingInfo } from '@/types/data'
import * as ExcelJS from 'exceljs'

export async function downloadExcel(
  TR_NO: string | undefined,
  ADD_DATE: string | undefined,
  UPDATE_DATE: string | undefined,
  routeHistory: TimeTableData[] | undefined,
) {
  if (!routeHistory || routeHistory.length === 0) {
    console.error('No data available')
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  worksheet.addRow(['TRANK HISTORY'])
  worksheet.addRow([''])
  worksheet.addRow(['Order/Num', 'Datetime', 'Address'])

  // 열 너비 설정
  worksheet.columns = [{ width: 15 }, { width: 35 }, { width: 70 }]

  // 셀 병합
  worksheet.mergeCells('A1:C1')
  worksheet.mergeCells('A2:C2')

  //===================================================================//
  // 스타일 적용
  //===================================================================//
  worksheet.getCell('A1').style = {
    alignment: {
      horizontal: 'center' as 'center',
      vertical: 'middle' as 'middle',
    },
    font: {
      size: 15,
      bold: true,
    },
  }
  worksheet.getCell('A2').style = {
    alignment: {
      horizontal: 'center' as 'center',
      vertical: 'middle' as 'middle',
    },
    font: {
      size: 12,
      italic: true,
    },
  }
  const ColumnStyle = {
    alignment: {
      horizontal: 'center' as 'center',
      vertical: 'middle' as 'middle',
    },
    font: {
      size: 11,
    },
    fill: {
      type: 'pattern' as 'pattern',
      pattern: 'solid' as 'solid',
      fgColor: { argb: 'C5D9F1' },
    },
  }
  worksheet.getCell('A3').style = ColumnStyle
  worksheet.getCell('B3').style = ColumnStyle
  worksheet.getCell('C3').style = ColumnStyle
  //===================================================================//

  //===================================================================//
  // 데이터 추가
  //===================================================================//
  worksheet.getCell('A2').value = `From: ${ADD_DATE} To: ${UPDATE_DATE}`

  const formattedData = routeHistory.map((item, index) => [
    index + 1,
    item.Datetime,
    item.SEQ_NAME,
  ])
  worksheet.addRows(formattedData)
  //===================================================================//
  // 추가된 데이터에 스타일 적용
  const startRow = 4

  for (let row = startRow; row < startRow + routeHistory.length; row++) {
    for (let col = 1; col <= 3; col++) {
      worksheet.getCell(row, col).style = {
        alignment: {
          horizontal: 'center' as 'center',
          vertical: 'middle' as 'middle',
        },
        font: {
          size: 11,
          bold: false,
          italic: false,
        },
      }
    }
  }
  //===================================================================//

  // 파일 생성 및 다운로드
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${TR_NO}.xlsx`
  a.click()
  window.URL.revokeObjectURL(url)
}
