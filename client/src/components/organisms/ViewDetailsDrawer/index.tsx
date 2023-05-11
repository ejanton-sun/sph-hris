import moment from 'moment'
import React, { FC } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { parse } from 'iso8601-duration'
import { Calendar, Clock, Download, X } from 'react-feather'
import { DefaultExtensionType, FileIcon, defaultStyles } from 'react-file-icon'

import Text from '~/components/atoms/Text'
import Avatar from '~/components/atoms/Avatar'
import {
  getSpecificTimeEntry,
  getSpecificTimeEntryById,
  getUserProfileLink
} from '~/hooks/useTimesheetQuery'
import { IMedia } from '~/utils/types/timeEntryTypes'
import handleImageError from '~/utils/handleImageError'
import DrawerTemplate from '~/components/templates/DrawerTemplate'

type Props = {
  isOpenViewDetailsDrawer: boolean
  actions: {
    handleToggleViewDetailsDrawer: () => void
  }
}

type UploadFileProps = {
  file: IMedia
  index: number
}

const UploadedFiles = ({ file, index }: UploadFileProps): JSX.Element => {
  const fileExtension = file.fileName.split('.').pop()
  const styles = defaultStyles[fileExtension as DefaultExtensionType]

  const LinkChecker = (link: string): void => {
    void fetch(link).then(async (resp) => {
      if (resp.ok) {
        return window.open(link)
      } else {
        toast.error('Sorry, cannot open file')
      }
    })
  }

  const handleDownloadFile = (link: string, fileName: string): void => {
    void fetch(link)
      .then(async (resp) => {
        if (!resp.ok) {
          throw Error(resp.statusText)
        }
        return await resp.blob()
      })
      .then((blobobject) => {
        const blob = window.URL.createObjectURL(blobobject)
        const anchor = document.createElement('a')
        anchor.style.display = 'none'
        anchor.href = blob
        anchor.download = fileName
        document.body.appendChild(anchor)
        anchor.click()
        window.URL.revokeObjectURL(blob)
      })
      .catch(() => toast.error('File does not exist'))
  }

  return (
    <div
      key={index}
      className="group flex w-full justify-between rounded px-2 py-2 text-xs font-medium text-slate-700 transition duration-150 ease-in-out focus:outline-none focus:ring-0 hover:bg-slate-700 hover:bg-opacity-5"
    >
      <div className="mr-1">
        <div className="h-4 w-4">
          <FileIcon extension={fileExtension} {...styles} />
        </div>
      </div>
      <div className="flex w-full truncate" onClick={() => LinkChecker(file.link)}>
        <div>{file.fileName}</div>
      </div>
      <button
        className="rounded bg-white p-0.5 opacity-0 focus:outline-slate-400 group-hover:opacity-100"
        onClick={() => handleDownloadFile(file.link, file.fileName)}
      >
        <Download className="h-4 w-4 text-slate-500" />
      </button>
    </div>
  )
}

const ViewDetailsDrawer: FC<Props> = (props): JSX.Element => {
  const router = useRouter()
  const timeIdExists = router.query.time_in ?? router.query.time_out
  const res = getSpecificTimeEntry(Number(timeIdExists))
  const timeIn = parse(res.data?.timeById?.timeHour ?? 'PT0H')
  const date = res.data?.timeById?.createdAt
  const { data } = getSpecificTimeEntryById(Number(timeIdExists))
  const { data: profileLink } = getUserProfileLink(Number(data?.specificTimeEntryById?.user?.id))

  const {
    isOpenViewDetailsDrawer,
    actions: { handleToggleViewDetailsDrawer }
  } = props

  const handleToggleDrawer = (): void => {
    void router.replace(router.pathname, undefined, { shallow: false })
  }

  return (
    <DrawerTemplate
      {...{
        isOpen: timeIdExists !== undefined ? !isOpenViewDetailsDrawer : isOpenViewDetailsDrawer,
        actions: {
          handleToggle: handleToggleViewDetailsDrawer
        }
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <h1 className="text-base font-medium text-slate-900">View Details</h1>
        <button onClick={() => handleToggleDrawer()} className="active:scale-95">
          <X className="h-6 w-6 stroke-0.5 text-slate-400" />
        </button>
      </header>
      {/* Body */}
      <div className="default-scrollbar flex h-full flex-col space-y-3 overflow-y-auto px-6">
        {/* User */}
        <div className="flex items-center space-x-3 border-b border-slate-200 py-3">
          <Avatar
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              handleImageError(e, '/images/default.png')
            }
            src={profileLink?.specificUserProfileDetail?.avatarLink as string}
            alt="user-avatar"
            size="lg"
            rounded="full"
          />
          <div>
            <Text
              theme="md"
              size="sm"
              weight="semibold"
              className="font-inter !text-slate-600 line-clamp-1"
            >
              {profileLink?.specificUserProfileDetail?.name as string}
            </Text>
            <p className="text-[11px] leading-tight text-slate-500">
              {profileLink?.specificUserProfileDetail?.role?.name}
            </p>
            <p className="text-[11px] leading-tight text-slate-500">
              Schedule: {profileLink?.specificUserProfileDetail?.employeeSchedule?.name}
            </p>
          </div>
        </div>
        {/* Error Message */}
        {/* <Alert type="error" /> */}
        <div className="form-group space-y-2">
          {/* Time */}
          <div>
            <label htmlFor="remarks" className="space-y-0.5">
              <span className="text-xs text-slate-500">Time</span>
              <div
                id="remarks"
                className={classNames(
                  'm-0 block w-full items-center rounded placeholder:text-slate-400',
                  'border border-solid border-slate-300 bg-slate-100 bg-clip-padding',
                  'resize-none text-sm font-normal text-slate-700 transition'
                )}
              >
                <div className="flex items-center">
                  <div className="rounded-l border-r border-slate-300 bg-white p-1.5">
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="border-l-4 border-slate-300"></div>
                  <p className="text-xs">
                    {Number(timeIn.hours) > 12 ? Number(timeIn.hours) - 12 : Number(timeIn.hours)}:
                    {timeIn.minutes} {Number(timeIn?.hours) >= 12 ? 'PM' : 'AM'}
                  </p>
                </div>
              </div>
            </label>
          </div>
          {/* Date */}
          <div>
            <label htmlFor="remarks" className="space-y-0.5">
              <span className="text-xs text-slate-500">Date</span>
              <div
                id="remarks"
                className={classNames(
                  'm-0 block w-full items-center rounded placeholder:text-slate-400',
                  'border border-solid border-slate-300 bg-slate-100 bg-clip-padding',
                  'resize-none text-sm font-normal text-slate-700 transition'
                )}
              >
                <div className="flex items-center">
                  <div className="rounded-l border-r border-slate-300 bg-white p-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="border-l-4 border-slate-300"></div>
                  <p className="text-xs">{moment(date).format('MM/DD/YYYY')}</p>
                </div>
              </div>
            </label>
          </div>
          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="space-y-0.5">
              <span className="text-xs text-slate-500">Remarks</span>
              <div
                id="remarks"
                className={classNames(
                  'm-0 block min-h-[20vh] w-full rounded placeholder:text-slate-400',
                  'border border-solid border-slate-300 bg-white bg-clip-padding',
                  'resize-none px-3 py-1.5 text-sm font-normal text-slate-700 transition'
                )}
              >
                <p>{res.data?.timeById?.remarks}</p>
              </div>
            </label>
          </div>
          {/* Downloaded Files */}
          {!(router.query.time_out !== undefined) && (
            <div>
              <label htmlFor="remarks" className="space-y-0.5">
                <span className="text-xs text-slate-500">Proofs Provided</span>
                <div
                  className={classNames(
                    'm-0 block h-[200px] w-full rounded placeholder:text-slate-400',
                    'border border-solid border-slate-300 bg-white bg-clip-padding',
                    'default-scrollbar '
                  )}
                >
                  {res.data?.timeById?.media?.map((file: IMedia, index: number) => {
                    return <UploadedFiles file={file} index={index} key={index} />
                  })}
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </DrawerTemplate>
  )
}

export default ViewDetailsDrawer
