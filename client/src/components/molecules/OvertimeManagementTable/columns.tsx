import moment from 'moment'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import React, { Fragment, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { Check, Edit, Eye, X } from 'react-feather'
import { Listbox, Transition } from '@headlessui/react'
import { createColumnHelper } from '@tanstack/react-table'

import Chip from './Chip'
import Card from '~/components/atoms/Card'
import useOvertime from '~/hooks/useOvertime'
import Avatar from '~/components/atoms/Avatar'
import useUserQuery from '~/hooks/useUserQuery'
import ShowRemarksModal from './ShowRemarksModal'
import SpinnerIcon from '~/utils/icons/SpinnerIcon'
import { Position } from '~/utils/constants/position'
import Button from '~/components/atoms/Buttons/Button'
import CellHeader from '~/components/atoms/CellHeader'
import handleImageError from '~/utils/handleImageError'
import UpdateOvertimeModal from './UpdateOvertimeModal'
import ApproveConfirmationModal from './ApproveConfirmationModal'
import ButtonAction from '~/components/atoms/Buttons/ButtonAction'
import { IOvertimeManagement, IOvertimeManagementManager } from '~/utils/interfaces'

const columnHelper = createColumnHelper<IOvertimeManagement | IOvertimeManagementManager>()

// =====  FOR HR COLUMNS ======
export const hrColumns = [
  columnHelper.accessor('user.name', {
    header: () => <CellHeader label="Name" />,
    footer: (info) => info.column.id,
    cell: (props) => {
      const { original: overtimeManagement } = props.row
      return (
        <div className="flex items-center space-x-2">
          <Avatar
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              handleImageError(e, '/images/default.png')
            }
            src={`${overtimeManagement.user.link}`}
            size="base"
            rounded="full"
          />
          <div className="flex flex-col items-start">
            <h1 className="font-semibold">{overtimeManagement.user.name}</h1>
            <small className="text-slate-500">{overtimeManagement.user.role.name}</small>
          </div>
        </div>
      )
    }
  }),
  columnHelper.display({
    id: 'empty1',
    header: () => '',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('projects', {
    header: () => <CellHeader label="Project" />,
    footer: (info) => info.column.id,
    cell: (props) => {
      const { original: overtimeManagement } = props.row
      return (
        <Listbox value={overtimeManagement.projects[0]}>
          <div className="relative mt-1">
            <>
              <Listbox.Button
                className={classNames(
                  'flex items-center space-x-2',
                  'text-xs outline-none focus:scale-95'
                )}
              >
                <span className="block truncate">
                  {overtimeManagement.projects[0].project_name.label}
                </span>
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
                  {overtimeManagement.projects.map((project, index) => (
                    <Listbox.Option key={index} value={project.project_name.value}>
                      {({ selected }) => (
                        <>
                          <span
                            className={classNames(
                              'block',
                              selected ? 'font-medium' : 'font-normal'
                            )}
                          >
                            {project.project_name.label.split(',').map((here, index) => {
                              if (here !== 'Others' && here !== '') {
                                return (
                                  <p
                                    key={index}
                                    className={classNames(
                                      'relative cursor-default select-none py-2 pl-5 pr-4 hover:bg-amber-100 hover:text-amber-900'
                                    )}
                                  >
                                    {here}
                                  </p>
                                )
                              }
                              return null
                            })}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </>
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
  columnHelper.accessor('approvedMinutes', {
    header: () => <CellHeader label="Approved Minutes" />,
    footer: (info) => info.column.id
  }),
  columnHelper.display({
    id: 'empty2',
    header: () => '',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('supervisor', {
    header: () => <CellHeader label="Supervisor" />,
    footer: (info) => info.column.id
  }),
  columnHelper.display({
    id: 'empty3',
    header: () => '',
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
      const { original: overtimeManagement } = props.row
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
              row: overtimeManagement
            }}
          />

          {/* This will show the Update Overtime Modal */}
          <UpdateOvertimeModal
            {...{
              isOpen: isOpenUpdateModal,
              closeModal: () => handleUpdateToggle(),
              row: overtimeManagement
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
    cell: (props) => {
      const { original: overtimeManagement } = props.row

      return (
        <div className="flex items-center space-x-2">
          <Avatar
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              handleImageError(e, '/images/default.png')
            }
            src={`${overtimeManagement.user.link}`}
            size="base"
            rounded="full"
          />
          <div className="flex flex-col items-start">
            <h1 className="font-semibold">{overtimeManagement.user.name}</h1>
            <small className="text-slate-500">{overtimeManagement.user.role.name}</small>
          </div>
        </div>
      )
    }
  }),
  columnHelper.accessor('projects', {
    header: () => <CellHeader label="Project" />,
    footer: (info) => info.column.id,
    cell: (props) => {
      const { original: overtimeManagement } = props.row
      return (
        <Listbox value={overtimeManagement.projects[0]}>
          <div className="relative mt-1">
            <>
              <Listbox.Button
                className={classNames(
                  'flex items-center space-x-2',
                  'text-xs outline-none focus:scale-95'
                )}
              >
                <span className="block truncate">
                  {overtimeManagement.projects[0].project_name.label}
                </span>
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
                  {overtimeManagement.projects.map((project, index) => (
                    <Listbox.Option key={index} value={project.project_name.value}>
                      {({ selected }) => (
                        <>
                          <span
                            className={classNames(
                              'block',
                              selected ? 'font-medium' : 'font-normal'
                            )}
                          >
                            {project.project_name.label.split(',').map((here, index) => {
                              if (here !== 'Others' && here !== '') {
                                return (
                                  <p
                                    key={index}
                                    className={classNames(
                                      'relative cursor-default select-none py-2 pl-5 pr-4 hover:bg-amber-100 hover:text-amber-900'
                                    )}
                                  >
                                    {here}
                                  </p>
                                )
                              }
                              return null
                            })}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </>
          </div>
        </Listbox>
      )
    }
  }),
  columnHelper.display({
    id: 'empty1',
    header: () => '',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('date', {
    header: () => <CellHeader label="Date" />,
    footer: (info) => info.column.id,
    cell: (props) => (
      <span>{moment(new Date(props.row.original.date)).format('MMMM DD, YYYY')}</span>
    )
  }),
  columnHelper.display({
    id: 'empty2',
    header: () => '',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('approvedMinutes', {
    header: () => <CellHeader label="Approved Minutes" />,
    footer: (info) => info.column.id
  }),
  columnHelper.display({
    id: 'empty3',
    header: () => '',
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
    id: 'empty4',
    header: () => '',
    footer: (info) => info.column.id
  }),
  columnHelper.display({
    id: 'id',
    header: () => <span className="font-normal text-slate-500">Actions</span>,
    cell: (props) => {
      const { original: overtimeManagement } = props.row
      const [isOpenRemarksModal, setIsOpenRemarksModal] = useState<boolean>(false)
      const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false)
      const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false)
      const [loading, setLoading] = useState<boolean>(false)
      const { isManagerApproved } = props.row.original

      const handleUpdateToggle = (): void => setIsOpenUpdateModal(!isOpenUpdateModal)
      const handleShowRemarksToggle = (): void => setIsOpenRemarksModal(!isOpenRemarksModal)
      const handleConfirmationToggle = (): void =>
        setIsOpenConfirmationModal(!isOpenConfirmationModal)

      const { handleUserQuery } = useUserQuery()
      const { data: user } = handleUserQuery()

      const positionId = user?.userById.position.id as number

      const { handleManagerApproveOvertimeMutation } = useOvertime()
      const approveOvertimeMutation = handleManagerApproveOvertimeMutation()

      const handleDisapprove = (onClose: () => void): void => {
        setLoading(true)
        approveOvertimeMutation.mutate(
          {
            userId: user?.userById.id as number,
            overtimeId: overtimeManagement.id,
            approvedMinutes: 0,
            isApproved: false
          },
          {
            onSuccess: () => onClose(),
            onSettled: () => setLoading(false)
          }
        )
      }

      const handleDisapproveConfirmationToggle = (): void => {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <Card className="w-full max-w-xs px-8 py-6" shadow-size="xl" rounded="lg">
                <h1 className="text-center text-xl font-bold">Confirmation</h1>
                <p className="mt-2 text-sm font-medium">
                  Are you sure you want to disapprove the request?
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-white">
                  {!loading ? (
                    <>
                      <ButtonAction
                        variant="danger"
                        onClick={() => handleDisapprove(onClose)}
                        className="w-full py-1 px-4"
                      >
                        Yes
                      </ButtonAction>
                      <ButtonAction
                        onClick={onClose}
                        variant="secondary"
                        className="w-full py-1 px-4 text-slate-500"
                      >
                        No
                      </ButtonAction>
                    </>
                  ) : (
                    <>
                      <SpinnerIcon className="h-3 w-3 fill-white" />
                      <span>Saving..</span>
                    </>
                  )}
                </div>
              </Card>
            )
          }
        })
      }

      const isManager = (): boolean => {
        return positionId === Position.MANAGER
      }

      return (
        <div className="inline-flex items-center divide-x divide-slate-300 rounded border border-slate-300">
          {isManager() ? (
            <>
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
                  onClick={handleDisapproveConfirmationToggle}
                  className="py-0.5 px-1 text-slate-500"
                >
                  <X className="h-4 w-4 stroke-[3px]" />
                </Button>
              </Tippy>
            </>
          ) : (
            isManagerApproved == null && (
              <>
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
                    onClick={handleDisapproveConfirmationToggle}
                    className="py-0.5 px-1 text-slate-500"
                  >
                    <X className="h-4 w-4 stroke-[3px]" />
                  </Button>
                </Tippy>
              </>
            )
          )}

          {!isManager() && isManagerApproved && (
            <>
              <Tippy placement="left" content="Edit" className="!text-xs">
                <Button
                  onClick={handleConfirmationToggle}
                  rounded="none"
                  className="py-0.5 px-1 text-slate-500"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </Tippy>
            </>
          )}

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
              row: overtimeManagement
            }}
          />
          {/* This will show the remarks modal */}
          <ShowRemarksModal
            {...{
              isOpen: isOpenRemarksModal,
              closeModal: () => handleShowRemarksToggle(),
              row: overtimeManagement
            }}
          />
          {/* This will show the Update Overtime Modal */}
          <UpdateOvertimeModal
            {...{
              isOpen: isOpenUpdateModal,
              closeModal: () => handleUpdateToggle(),
              row: overtimeManagement
            }}
          />
        </div>
      )
    },
    footer: (info) => info.column.id
  })
]
