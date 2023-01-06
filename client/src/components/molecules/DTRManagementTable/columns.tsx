import React from 'react'
import Tooltip from 'rc-tooltip'
import { Clock, Edit } from 'react-feather'
import { createColumnHelper } from '@tanstack/react-table'

import Chip from '~/components/atoms/Chip'
import SortIcon from '~/utils/icons/SortIcon'
import Avatar from '~/components/atoms/Avatar'
import { IDTRManagement } from '~/utils/interfaces'
import Button from '~/components/atoms/Buttons/Button'

const columnHelper = createColumnHelper<IDTRManagement>()

const CellHeader = ({ label }: { label: string }): JSX.Element => {
  return (
    <span className="group flex items-center font-normal text-slate-500">
      {label}
      <SortIcon className="ml-2 h-3 w-3 shrink-0 fill-current group-active:scale-95" />
    </span>
  )
}

export const columns = [
  columnHelper.accessor('name', {
    header: () => <CellHeader label="Name" />,
    footer: (info) => info.column.id,
    cell: (props) => (
      <div className="flex items-center space-x-2">
        <Avatar
          src={`https://placeimg.com/640/480/abstract/${props.row.id}`}
          size="base"
          rounded="full"
        />
        <div className="flex flex-col items-start">
          <h1 className="font-semibold">{props.getValue()}</h1>
          <small className="text-slate-500">Web Developer</small>
        </div>
      </div>
    )
  }),
  columnHelper.accessor((row) => row.time_in, {
    id: 'Time In',
    header: () => <CellHeader label="Time In" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('time_out', {
    header: () => <CellHeader label="Time Out" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('start_time', {
    header: () => <CellHeader label="Start Time" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('end_time', {
    header: () => <CellHeader label="End Time" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('work_hours', {
    header: () => <CellHeader label="Work Hours" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('late', {
    header: () => <CellHeader label="Late(min)" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('undertime', {
    header: () => <CellHeader label="Undertime(min)" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('overtime', {
    header: () => <CellHeader label="Overtime(min)" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('status', {
    header: () => <CellHeader label="Status" />,
    footer: (info) => info.column.id,
    cell: (props) => <Chip label={props.getValue()} />
  }),
  columnHelper.display({
    id: 'id',
    header: () => <span className="font-normal">Actions</span>,
    cell: (props) => (
      <div className="inline-flex items-center divide-x divide-slate-300 rounded border border-slate-300">
        <Tooltip
          placement="left"
          overlay="Time Entries"
          arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
        >
          <Button
            onClick={() => alert(props.row.id)}
            rounded="none"
            className="py-0.5 px-1 text-slate-500"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip
          placement="left"
          overlay="Edit"
          arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
        >
          <Button
            onClick={() => alert(props.row.id)}
            rounded="none"
            className="py-0.5 px-1 text-slate-500"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    ),
    footer: (info) => info.column.id
  })
]
