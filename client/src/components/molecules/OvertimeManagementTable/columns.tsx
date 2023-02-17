import moment from 'moment'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import React, { Fragment, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { Check, Edit, Eye, X } from 'react-feather'
import { Listbox, Transition } from '@headlessui/react'
import { createColumnHelper } from '@tanstack/react-table'

import Chip from './Chip'
import Avatar from '~/components/atoms/Avatar'
import ShowRemarksModal from './ShowRemarksModal'
import Button from '~/components/atoms/Buttons/Button'
import CellHeader from '~/components/atoms/CellHeader'
import UpdateOvertimeModal from './UpdateOvertimeModal'
import ApproveConfirmationModal from './ApproveConfirmationModal'
import ButtonAction from '~/components/atoms/Buttons/ButtonAction'
import { IOvertimeManagement, IOvertimeManagementManager } from '~/utils/interfaces'
import Card from '~/components/atoms/Card'

const columnHelper = createColumnHelper<IOvertimeManagement | IOvertimeManagementManager>()

// =====  FOR HR COLUMNS ======
export const hrColumns = [
  columnHelper.accessor('user.name', {
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
          <h1 className="font-semibold">{props.row.original.user.name}</h1>
          <small className="text-slate-500">{props.row.original.user.role.name}</small>
        </div>
      </div>
    )
  }),
  columnHelper.display({
    id: 'empty1',
    header: () => '',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('project', {
    header: () => <CellHeader label="Project" />,
    footer: (info) => info.column.id,
    cell: (props) => {
      return (
        <Listbox value={props.row.original.project[0].value}>
          <div className="relative mt-1">
            <Listbox.Button
              className={classNames(
                'flex items-center space-x-2',
                'text-xs outline-none focus:scale-95'
              )}
            >
              <span className="block truncate">{props.row.original.project[0].label}</span>
              <AiOutlineCaretDown className="h-3 w-3 text-gray-400" aria-hidden="true" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={classNames(
                  'absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white',
                  'py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                )}
              >
                {props.row.original.project.map(({ label, value }, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-5 pr-4',
                        active ? 'bg-amber-100 text-amber-900' : 'text-slate-800'
                      )
                    }
                    value={value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal'
                          )}
                        >
                          {label}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )
    }
  }),
  columnHelper.accessor('date', {
    header: () => <CellHeader label="Date" />,
    footer: (info) => info.column.id,
    cell: (props) => (
      <span>{moment(new Date(props.row.original.date)).format('MMMM DD, YYYY')}</span>
    )
  }),
  columnHelper.accessor('overtimeIn', {
    header: () => <CellHeader label="Overtime in" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('overtimeOut', {
    header: () => <CellHeader label="Overtime Out" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('requestedHours', {
    header: () => <CellHeader label="Approved Hours" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('supervisor', {
    header: () => <CellHeader label="Supervisor" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('dateFiled', {
    header: () => <CellHeader label="Date Filed" />,
    footer: (info) => info.column.id,
    cell: (props) => (
      <span>{moment(new Date(props.row.original.dateFiled)).format('MMMM DD, YYYY')}</span>
    )
  }),
  columnHelper.accessor('status', {
    header: () => <CellHeader label="Status" />,
    footer: (info) => info.column.id,
    cell: (props) => <Chip label={props.getValue()} />
  }),
  columnHelper.display({
    id: 'id',
    header: () => <span className="font-normal text-slate-500">Actions</span>,
    cell: (props) => {
      const [isOpenRemarksModal, setIsOpenRemarksModal] = useState<boolean>(false)
      const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false)

      const handleShowRemarksToggle = (): void => setIsOpenRemarksModal(!isOpenRemarksModal)
      const handleUpdateToggle = (): void => setIsOpenUpdateModal(!isOpenUpdateModal)

      return (
        <div className="inline-flex items-center divide-x divide-slate-300 rounded border border-slate-300">
          <Tippy placement="left" content="Edit" className="!text-xs">
            <Button
              onClick={handleUpdateToggle}
              rounded="none"
              className="py-0.5 px-1 text-slate-500"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Tippy>
          <Tippy placement="left" content="View Remarks" className="!text-xs">
            <Button
              onClick={handleShowRemarksToggle}
              rounded="none"
              className="py-0.5 px-1 text-slate-500"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Tippy>

          {/* This will show the remarks modal */}
          <ShowRemarksModal
            {...{
              isOpen: isOpenRemarksModal,
              closeModal: () => handleShowRemarksToggle(),
              row: props.row.original
            }}
          />

          {/* This will show the Update Overtime Modal */}
          <UpdateOvertimeModal
            {...{
              isOpen: isOpenUpdateModal,
              closeModal: () => handleUpdateToggle(),
              row: props.row.original
            }}
          />
        </div>
      )
    },
    footer: (info) => info.column.id
  })
]

// =====  FOR MANAGER COLUMNS =====
export const managerColumns = [
  columnHelper.accessor('user.name', {
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
          <h1 className="font-semibold">{props.row.original.user.name}</h1>
          <small className="text-slate-500">{props.row.original.user.role.name}</small>
        </div>
      </div>
    )
  }),
  columnHelper.accessor('project', {
    header: () => <CellHeader label="Project" />,
    footer: (info) => info.column.id,
    cell: (props) => {
      return (
        <Listbox value={props.row.original.project[0].value}>
          <div className="relative mt-1">
            <Listbox.Button
              className={classNames(
                'flex items-center space-x-2',
                'text-xs outline-none focus:scale-95'
              )}
            >
              <span className="block truncate">{props.row.original.project[0].label}</span>
              <AiOutlineCaretDown className="h-3 w-3 text-gray-400" aria-hidden="true" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={classNames(
                  'absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white',
                  'py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                )}
              >
                {props.row.original.project.map(({ label, value }, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-5 pr-4',
                        active ? 'bg-amber-100 text-amber-900' : 'text-slate-800'
                      )
                    }
                    value={value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal'
                          )}
                        >
                          {label}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )
    }
  }),
  columnHelper.accessor('date', {
    header: () => <CellHeader label="Date" />,
    footer: (info) => info.column.id,
    cell: (props) => (
      <span>{moment(new Date(props.row.original.date)).format('MMMM DD, YYYY')}</span>
    )
  }),
  columnHelper.accessor('requestedHours', {
    header: () => <CellHeader label="Approved Hours" />,
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('dateFiled', {
    header: () => <CellHeader label="Date Filed" />,
    footer: (info) => info.column.id,
    cell: (props) => (
      <span>{moment(new Date(props.row.original.dateFiled)).format('MMMM DD, YYYY')}</span>
    )
  }),
  columnHelper.accessor('status', {
    header: () => <CellHeader label="Status" />,
    footer: (info) => info.column.id,
    cell: (props) => <Chip label={props.getValue()} />
  }),
  columnHelper.display({
    id: 'id',
    header: () => <span className="font-normal text-slate-500">Actions</span>,
    cell: (props) => {
      const [isOpenRemarksModal, setIsOpenRemarksModal] = useState<boolean>(false)
      const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false)

      const handleShowRemarksToggle = (): void => setIsOpenRemarksModal(!isOpenRemarksModal)
      const handleConfirmationToggle = (): void =>
        setIsOpenConfirmationModal(!isOpenConfirmationModal)

      const handleDeleteMessage = (onClose: () => void): void => {
        toast.success('Successfully Disapproved!')
        onClose()
      }

      const handleDeleteConfirmationToggle = (): void => {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <Card className="w-full max-w-xs px-8 py-6" shadow-size="xl" rounded="lg">
                <h1 className="text-center text-xl font-bold">Confirmation</h1>
                <p className="mt-2 text-sm font-medium">
                  Are you sure you want to disapprove the requuest?
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-white">
                  <ButtonAction
                    onClick={onClose}
                    variant="secondary"
                    className="w-full py-1 px-4 text-slate-500"
                  >
                    No
                  </ButtonAction>
                  <ButtonAction
                    variant="danger"
                    onClick={() => handleDeleteMessage(onClose)}
                    className="w-full py-1 px-4"
                  >
                    Yes
                  </ButtonAction>
                </div>
              </Card>
            )
          }
        })
      }

      return (
        <div className="inline-flex items-center divide-x divide-slate-300 rounded border border-slate-300">
          <Tippy placement="left" content="Approve" className="!text-xs">
            <Button
              rounded="none"
              onClick={handleConfirmationToggle}
              className="py-0.5 px-1 text-slate-500"
            >
              <Check className="h-4 w-4 stroke-[3px]" />
            </Button>
          </Tippy>
          <Tippy placement="left" content="Disapprove" className="!text-xs">
            <Button
              rounded="none"
              onClick={handleDeleteConfirmationToggle}
              className="py-0.5 px-1 text-slate-500"
            >
              <X className="h-4 w-4 stroke-[3px]" />
            </Button>
          </Tippy>
          <Tippy placement="left" content="View Remarks" className="!text-xs">
            <Button
              rounded="none"
              onClick={handleShowRemarksToggle}
              className="py-0.5 px-1 text-slate-500"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Tippy>

          {/* This will show the Approve Confirmation Modal */}
          <ApproveConfirmationModal
            {...{
              isOpen: isOpenConfirmationModal,
              closeModal: () => handleConfirmationToggle(),
              row: props.row.original
            }}
          />
          {/* This will show the remarks modal */}
          <ShowRemarksModal
            {...{
              isOpen: isOpenRemarksModal,
              closeModal: () => handleShowRemarksToggle(),
              row: props.row.original
            }}
          />
        </div>
      )
    },
    footer: (info) => info.column.id
  })
]
