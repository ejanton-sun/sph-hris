import moment from 'moment'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import { Eye } from 'react-feather'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import { Table } from '@tanstack/react-table'

import Avatar from '~/components/atoms/Avatar'
import useUserQuery from '~/hooks/useUserQuery'
import ViewDetailsModal from './ViewDetailsModal'
import { INotification } from '~/utils/interfaces'
import Button from '~/components/atoms/Buttons/Button'
import useNotification from '~/hooks/useNotificationQuery'
import { SpecificType } from '~/utils/constants/notificationTypes'
import LineSkeleton from '~/components/atoms/Skeletons/LineSkeleton'
import useNotificationMutation from '~/hooks/useNotificationMutation'

type Props = {
  table: Table<INotification>
  isLoading: boolean
}

const NotificationItem: FC<Props> = ({ table, isLoading }): JSX.Element => {
  const router = useRouter()
  const id = Number(router.query.id)

  const { handleNotificationMutation } = useNotificationMutation()
  const notificationMutations = handleNotificationMutation()

  const { handleUserQuery } = useUserQuery()
  const { data } = handleUserQuery()
  const { getUserNotificationsQuery } = useNotification()
  const { refetch } = getUserNotificationsQuery(data?.userById.id as number)

  const switchMessage = (type: string): string => {
    switch (type) {
      case SpecificType.REQUEST:
        return 'has requested for your approval for'
      case SpecificType.APPROVAL:
        return 'has approved your request for'
      case SpecificType.DISAPPROVAL:
        return 'has disapproved your request for'
      default:
        return ''
    }
  }

  useEffect(() => {
    if (router.query.id !== undefined) {
      void table.options.data.forEach((row, index) => {
        if (row.id === Number(router.query.id)) {
          void table.setPageIndex(~~(index / 10))
        }
      })
    }
  }, [id])

  const handleViewDetails = (row: INotification): void => {
    void router.push(`/notifications/?id=${row.id}`)
  }

  const handleLink = (id: number): void => {
    void notificationMutations.mutate(
      { id },
      {
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        onSuccess: () => {
          void refetch()
        }
      }
    )
  }

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
              <Message message="No Notification Available" />
            </div>
          ) : (
            <>
              {table.getRowModel().rows.map((row) => {
                const isActive = !row.original.isRead || row.original.readAt == null
                return (
                  <div key={row.original.id} className="my-2 px-4">
                    <div
                      className={classNames(
                        'group rounded-md border border-slate-200',
                        'py-2.5 px-3 shadow-slate-200 hover:shadow',
                        'transition duration-75 ease-in-out ',
                        isActive || row.original.id === id
                          ? 'border-l-4 border-l-amber-300 bg-white'
                          : 'bg-transparent pl-4'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex w-full items-start space-x-2 md:items-center">
                          <Avatar src={`${row.original.userAvatarLink}`} size="md" rounded="lg" />
                          <div
                            className={classNames(
                              'flex flex-col space-y-0.5',
                              isActive ? 'text-slate-700' : 'text-slate-500'
                            )}
                          >
                            <p className="flex flex-wrap items-center space-x-2">
                              <span className="font-semibold">{row.original.name}</span>
                              <span>{switchMessage(row.original.specificType)}</span>
                              <span className="font-semibold">{row.original.type}</span>
                            </p>
                            <p>
                              {moment(row.original.dateFiled).fromNow()} &bull; {row.original.date}{' '}
                              -{' '}
                              <span className={`font-medium ${isActive ? 'text-amber-500' : ''}`}>
                                {row.original.duration}Hrs
                              </span>
                            </p>
                          </div>
                        </div>
                        <Tippy content="View Details" placement="left" className="!text-xs">
                          <Button
                            type="button"
                            className="text-slate-400 group-hover:text-slate-500"
                            onClick={() => {
                              handleLink(row.original.id)
                              handleViewDetails(row.original)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tippy>

                        {/* This will handle view details */}
                        <ViewDetailsModal
                          {...{
                            isOpen: row.original.id === id,
                            row: row.original
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </>
      )}
    </>
  )
}

const Message = ({
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
