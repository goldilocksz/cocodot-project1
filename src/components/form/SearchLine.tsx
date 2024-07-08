import Fuse from 'fuse.js'
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { X, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { QueryClient, useQueryClient } from '@tanstack/react-query'

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
  searchData: T[] | undefined
  searchKey?: string[]
  queryKey: string[]
}

export default function SearchLine<T>({
  setPage,
  pageSize,
  setPageSize,
  searchData,
  searchKey,
  queryKey,
}: Props<T>) {
  const [search, setSearch] = useState('')
  const [filteredData, setFilteredData] = useState<T[] | undefined>(searchData)
  const queryClient = useQueryClient()

  useEffect(() => {
    setFilteredData(searchData)
  }, [searchData])

  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    setPage(1)
    if (!searchData) return

    const fuse = new Fuse(searchData, {
      includeScore: true,
      threshold: 0.3,
      keys: searchKey ? searchKey : Object.keys(searchData[0]!),
    })

    const filtered = fuse.search(search).map((item) => item.item)
    setFilteredData(filtered)

    queryClient.setQueryData(queryKey, filtered)
  }

  const handleClearSearch = () => {
    setSearch('')
    setFilteredData(searchData)
    queryClient.setQueryData(queryKey, searchData)
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
            onChange={(e) => {
              setSearch(e.target.value)
              if (!e.target.value.trim()) {
                setFilteredData(searchData)
                queryClient.setQueryData(queryKey, searchData)
              }
            }}
          ></Input>
          {search.trim() && (
            <div
              className="absolute right-0 top-0 cursor-pointer p-3"
              onClick={handleClearSearch}
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
          {filteredData?.length}
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
