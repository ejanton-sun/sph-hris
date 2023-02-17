import React, { FC } from 'react'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import { Table } from '@tanstack/react-table'
import { Disclosure } from '@headlessui/react'
import { Check, ChevronRight, X } from 'react-feather'

import Avatar from '~/components/atoms/Avatar'
import { INotification } from '~/utils/interfaces'
import Button from '~/components/atoms/Buttons/Button'
import LineSkeleton from '~/components/atoms/Skeletons/LineSkeleton'

type Props = {
  table: Table<INotification>
  isLoading: boolean
}

const NotificationItem: FC<Props> = ({ table, isLoading }): JSX.Element => {
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col px-4 py-3">
          {Array.from({ length: 30 }, (_, i) => (
            <LineSkeleton key={i} className="py-1" />
          ))}
        </div>
      ) : (
        <>
          {table.getPageCount() === 0 ? (
            <div className="h-[50vh]">
              <DiscloseMessage message="No Notification Available" />
            </div>
          ) : (
            <>
              {table.getRowModel().rows.map((row) => (
                <Disclosure key={row.id}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={classNames(
                          'w-full border-b border-slate-200 py-2 px-4 hover:bg-white',
                          open ? 'bg-white' : 'hover:shadow-md hover:shadow-slate-200'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar
                              src={`https://placeimg.com/640/480/abstract/${row.id}`}
                              size="base"
                              rounded="full"
                            />
                            <p className="ml-3 text-left">
                              <span className="font-semibold">{row.original.name}</span>
                              <span className="mx-1 text-slate-500">
                                has requested for your approval for
                              </span>
                              <span className="font-semibold">
                                {row.original.type}({row.original.date} - {row.original.duration}{' '}
                                Hours)
                              </span>
                              <span className="absolute right-10 text-slate-500">1m</span>
                            </p>
                          </div>
                          <ChevronRight
                            className={classNames(
                              'h-4 w-4 text-slate-600',
                              open ? 'rotate-90' : ''
                            )}
                          />
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel
                        className={classNames('text-slate-600', open ? 'bg-white shadow-md' : '')}
                      >
                        <ul className="flex flex-col flex-wrap divide-y divide-slate-200 md:flex-row md:items-center md:divide-none">
                          <li className="px-4 py-2 md:py-3">
                            Project: <span className="font-semibold">{row.original.project}</span>
                          </li>
                          <li className="px-4 py-2 md:py-3">
                            Type: <span className="font-semibold">{row.original.type}</span>
                          </li>
                          <li className="px-4 py-2 md:py-3">
                            Date Requested:{' '}
                            <span className="font-semibold">{row.original.date}</span>
                          </li>
                          <li className="px-4 py-2 md:py-3">
                            Requested Hours:{' '}
                            <span className="font-semibold">{row.original.duration}</span>
                          </li>
                          <li className="px-4 py-2 md:py-3">
                            Date Filed:{' '}
                            <span className="font-semibold">{row.original.dateFiled}</span>
                          </li>
                          <li className="inline-flex items-center px-4 py-2 md:py-3">
                            Status:{' '}
                            <span
                              className={classNames(
                                'py-0.25  ml-1 rounded-full border  px-1.5',
                                row.original.status === 'Pending' &&
                                  'border-amber-200 bg-amber-50 text-amber-600',
                                row.original.status === 'Approved' &&
                                  'border-green-200 bg-green-50 text-green-600',
                                row.original.status === 'Disapproved' &&
                                  'border-rose-200 bg-rose-50 text-rose-600'
                              )}
                            >
                              {row.original.status}
                            </span>
                          </li>
                          <li className="px-4 py-2 md:py-3">
                            Remarks: <span className="font-semibold">{row.original.remarks}</span>
                          </li>
                          <li className="inline-flex items-center px-4 py-2 md:py-3">
                            Actions:{' '}
                            <div className="ml-2 inline-flex items-center divide-x divide-slate-300 rounded border border-slate-300">
                              <Tippy placement="left" content="Approve" className="!text-xs">
                                <Button rounded="none" className="py-0.5 px-1 text-slate-500">
                                  <Check className="h-4 w-4" />
                                </Button>
                              </Tippy>
                              <Tippy placement="left" content="Disapprove" className="!text-xs">
                                <Button rounded="none" className="py-0.5 px-1 text-slate-500">
                                  <X className="h-4 w-4" />
                                </Button>
                              </Tippy>
                            </div>
                          </li>
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </>
          )}
        </>
      )}
    </>
  )
}

const DiscloseMessage = ({
  message,
  type = 'default'
}: {
  message: string
  type?: string
}): JSX.Element => {
  return (
    <p
      className={classNames(
        'py-2 text-center font-medium',
        type === 'default' && 'text-slate-500',
        type === 'error' && 'bg-rose-50 text-rose-500'
      )}
    >
      {message}
    </p>
  )
}

export default NotificationItem
