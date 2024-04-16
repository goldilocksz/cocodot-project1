import Fuse from 'fuse.js'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { Button } from '../ui/button'
import { X, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Select } from '../ui/select'

interface SearchElement extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

interface SearchFormProps extends HTMLFormElement {
  readonly elements: SearchElement
}

interface Props<T> {
  setPage: Dispatch<SetStateAction<number>>
  pageSize: string
  setPageSize: Dispatch<SetStateAction<string>>
  initData: T[]
  list: T[]
  setList: Dispatch<SetStateAction<T[]>>
  searchKey: string[]
}

export default function SearchLine<T>({
  setPage,
  pageSize,
  setPageSize,
  initData,
  list,
  setList,
  searchKey,
}: Props<T>) {
  const [search, setSearch] = useState('')
  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    setPage(1)
    if (!search.trim()) {
      event.currentTarget.search.focus()
      setSearch('')
      setList(initData ?? [])
    } else {
      if (!initData) return
      const fuse = new Fuse(initData, {
        includeScore: true,
        threshold: 0.3,
        keys: searchKey,
      })
      setList(fuse.search(search).map((item) => item.item))
    }
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <form className="flex w-80 items-center gap-2" onSubmit={handleSearch}>
        <div className="relative">
          <Input
            placeholder="search..."
            name="search"
            autoComplete="off"
            className="w-auto pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
          {search.trim() && (
            <div
              className="absolute right-0 top-0 cursor-pointer p-3"
              onClick={() => {
                setSearch('')
                setList(initData ?? [])
              }}
            >
              <X className="h-4 w-4" />
            </div>
          )}
        </div>
        <Button type="submit" disabled={search.trim().length === 0}>
          <Search className="mr-1 h-4 w-4" />
          Search
        </Button>
      </form>
      <div className="flex items-center gap-6 whitespace-nowrap">
        <div>
          <span className="text-sm text-muted-foreground">Count: </span>
          {list?.length}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Page:</div>
          <Select
            defaultValue={pageSize}
            onChange={(e) => {
              setPage(1)
              setPageSize(e.target.value)
            }}
          >
            <option value="10">10</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>
      </div>
    </div>
  )
}
