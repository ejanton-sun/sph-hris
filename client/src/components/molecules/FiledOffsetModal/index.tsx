import { Clock } from 'react-feather'
import React, { FC, useState } from 'react'
import {
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import { fuzzyFilter } from '~/utils/fuzzyFilter'

import { columns } from './columns'
import FiledOffsetTable from './Table'
import MobileDisclose from './MobileDisclose'
import FileOffsetModal from './FileOffsetModal'
import GlobalSearchFilter from '../GlobalSearchFilter'
import Button from '~/components/atoms/Buttons/ButtonAction'
import ModalTemplate from '~/components/templates/ModalTemplate'
import ModalFooter from '~/components/templates/ModalTemplate/ModalFooter'
import ModalHeader from '~/components/templates/ModalTemplate/ModalHeader'
import { IEmployeeTimeEntry, ITimeEntry } from '~/utils/types/timeEntryTypes'
import { dummyFiledOffsetData } from '~/utils/constants/dummyFiledOffsetsData'

type Props = {
  isOpen: boolean
  closeModal: () => void
  row: ITimeEntry | IEmployeeTimeEntry
  query: {
    isLoading: boolean
    isError: boolean
  }
  isMyDTRPage?: boolean
}

const FiledOffsetModal: FC<Props> = (props): JSX.Element => {
  const {
    isOpen,
    closeModal,
    query: { isLoading, isError },
    row,
    isMyDTRPage
  } = props

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [isOpenFileOffset, setIsOpenFileOffset] = useState<boolean>(false)

  const handleIsOpenFileOffsetToggle = (): void => setIsOpenFileOffset(!isOpenFileOffset)

  const table = useReactTable({
    data: dummyFiledOffsetData,
    columns,
    // Options
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <ModalTemplate
      {...{
        isOpen,
        closeModal
      }}
      className="w-full max-w-[720px]"
    >
      {/* Custom Modal Header */}
      <ModalHeader
        {...{
          title:
            isMyDTRPage === true
              ? 'Filed Offset'
              : `${(row as ITimeEntry).user?.name}'s Filed Offset`,
          Icon: Clock,
          closeModal
        }}
      />
      <div className="flex items-center space-x-2 px-4 py-1">
        <GlobalSearchFilter
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search"
          className="w-full"
        />
        {isMyDTRPage === true ? (
          <Button
            variant="primary"
            className="shrink-0 px-4 py-1 text-xs"
            onClick={handleIsOpenFileOffsetToggle}
          >
            File Request
          </Button>
        ) : null}
      </div>
      {isOpenFileOffset ? (
        <FileOffsetModal
          {...{
            isOpen: isOpenFileOffset,
            closeModal: handleIsOpenFileOffsetToggle
          }}
        />
      ) : null}
      {/* Actual Data Table for Interruption Time Entries */}
      <div className="default-scrollbar overflow-auto">
        <div className="block md:hidden">
          <MobileDisclose
            {...{
              table,
              isLoading,
              error: null
            }}
          />
        </div>
        {/* Show on medium size and beyond */}
        <div className="mx-auto hidden w-full max-w-fit md:block">
          <FiledOffsetTable
            {...{
              table,
              query: {
                isLoading,
                isError
              }
            }}
          />
        </div>
      </div>
      {/* Custom Modal Footer Style */}
      <ModalFooter>
        <Button onClick={closeModal} variant="secondary" className="px-5 py-1 text-sm">
          Close
        </Button>
      </ModalFooter>
    </ModalTemplate>
  )
}

FiledOffsetModal.defaultProps = {
  isMyDTRPage: false
}

export default FiledOffsetModal
