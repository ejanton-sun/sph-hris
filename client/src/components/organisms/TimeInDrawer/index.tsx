import React, { FC } from 'react'
import { X } from 'react-feather'
import classNames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'

import Text from '~/components/atoms/Text'
import Avatar from '~/components/atoms/Avatar'
import DrawerTemplate from '~/components/templates/DrawerTemplate'

type Props = {
  isOpenTimeInDrawer: boolean
  actions: {
    handleToggleTimeInDrawer: () => void
  }
}

const TimeInDrawer: FC<Props> = (props): JSX.Element => {
  const {
    isOpenTimeInDrawer,
    actions: { handleToggleTimeInDrawer }
  } = props

  return (
    <DrawerTemplate
      {...{
        isOpen: isOpenTimeInDrawer,
        actions: {
          handleToggle: handleToggleTimeInDrawer
        }
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <h1 className="text-base font-medium text-slate-900">Confirm Time In</h1>
        <button onClick={handleToggleTimeInDrawer} className="active:scale-95">
          <X className="h-6 w-6 stroke-0.5 text-slate-400" />
        </button>
      </header>
      {/* Body */}
      <div className="flex flex-col space-y-3 px-6 py-2">
        {/* User */}
        <div className="flex items-center space-x-3 border-b border-slate-200 py-3">
          <Avatar
            src="https://avatars.githubusercontent.com/u/38458781?v=4"
            alt="user-avatar"
            size="lg"
            rounded="full"
          />
          <div>
            <Text theme="md" size="sm" weight="bold">
              Joshua Galit
            </Text>
            <p className="text-[11px] leading-tight text-slate-500">Clocking from GMT +8</p>
            <p className="text-[11px] leading-tight text-slate-500">Last in a few seconds ago</p>
            <p className="text-[11px] leading-tight text-slate-500">Split time: 12:00 am</p>
          </div>
        </div>
        {/* Error Message */}
        <div className="relative flex items-center justify-center rounded-md border border-rose-400 bg-rose-50 py-2.5 px-4 shadow-md">
          <X className="absolute left-4 h-4 w-4 rounded-full bg-rose-500 p-0.5 text-white" />
          <p className="text-xs font-medium text-rose-500">Something went wrong</p>
        </div>
        {/* Remarks */}
        <div className="form-group space-y-2">
          <div>
            <label htmlFor="remarks" className="space-y-0.5">
              <span className="text-xs text-slate-500">Remarks</span>
              <TextareaAutosize
                id="remarks"
                className={classNames(
                  'm-0 block min-h-[20vh] w-full rounded placeholder:text-slate-400',
                  'border border-solid border-slate-300 bg-white bg-clip-padding focus:ring-primary',
                  'resize-none px-3 py-1.5 text-sm font-normal text-slate-700 transition focus:border-primary',
                  'ease-in-out focus:border-primary focus:bg-white focus:text-slate-700 focus:outline-none'
                )}
                placeholder="Message..."
              />
            </label>
          </div>
          <div>
            <label htmlFor="screenshots">
              <span className="text-xs">Screenshots/Proof</span>
              <input
                id="screenshots"
                className={classNames(
                  'block w-full rounded-md border border-slate-200 bg-white text-xs text-slate-700',
                  'transition ease-in-out file:rounded-l-md  file:border-0 file:bg-slate-700 file:py-3 file:px-2',
                  'file:text-xs file:text-white focus:border-primary focus:bg-white focus:text-slate-700',
                  'focus:outline-none focus:ring-1 focus:ring-primary'
                )}
                type="file"
              />
            </label>
          </div>
        </div>
      </div>
      {/* Footer Options */}
      <section className="mt-auto border-t border-slate-200">
        <div className="flex justify-end py-2 px-6">
          <button
            type="button"
            onClick={handleToggleTimeInDrawer}
            className={classNames(
              'flex items-center justify-center border-slate-200 text-xs active:scale-95',
              'w-24 border-dark-primary py-2 text-dark-primary outline-none'
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleToggleTimeInDrawer}
            className={classNames(
              'flex items-center justify-center rounded-md border active:scale-95',
              'w-24 border-dark-primary bg-primary text-xs text-white outline-none hover:bg-dark-primary'
            )}
          >
            Save
          </button>
        </div>
      </section>
    </DrawerTemplate>
  )
}

export default TimeInDrawer
