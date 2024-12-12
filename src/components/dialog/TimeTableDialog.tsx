import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Download } from 'lucide-react'
import { Order, RouteHistory, TimeTableData, TrakingInfo } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { downloadExcel } from '@/components/xlsx/Excel'
import { useEffect } from 'react'

type Props = {
  // detail: Order | undefined
  TR_NO: string | undefined
  ADD_DATE: string | undefined
  UPDATE_DATE: string | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  callback: () => void
  trakingInfo?: TrakingInfo[] | undefined
  routeHistory: TimeTableData[] | undefined
  onSelectRow: (index: number) => void
}

export default function TimeTableDialog({
  // detail,
  TR_NO,
  ADD_DATE,
  UPDATE_DATE,
  isOpen,
  setIsOpen,
  callback,
  routeHistory,
  trakingInfo,
  onSelectRow,
}: Props) {
  const handleDownloadClick = () => {
    alert('click Download')
    downloadExcel(TR_NO, ADD_DATE, UPDATE_DATE, routeHistory)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>TimeTable</DialogTitle>
        </DialogHeader>
        <div className="relative flex items-start justify-end gap-2">
          <Button className="flex gap-1" onClick={handleDownloadClick}>
            <Download className="h-4 w-4" />
            DOWNLOAD
          </Button>
        </div>
        <div className="mt-3 w-full">
          <Table>
            <TableHeader>
              <TableRow className="whitespace-pre-line text-xs">
                <TableCell>Order/Num</TableCell>
                <TableCell>Datetime</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routeHistory?.map((item, index) => (
                <TableRow
                  key={index}
                  onClick={() => onSelectRow(index)}
                  className="cursor-pointer"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.Datetime}</TableCell>
                  <TableCell>{item.SEQ_NAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
