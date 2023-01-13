import { NextPage } from 'next'
import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import { MoreHorizontal } from 'react-feather'
import { toast } from 'react-hot-toast'

import FilterIcon from '~/utils/icons/FilterIcon'
import Layout from '~/components/templates/Layout'
import DTRTable from '~/components/molecules/DTRManagementTable'
import LegendTooltip from '~/components/molecules/LegendTooltip'
import { mapDTRManagement } from '~/utils/mapping/dtrManagementMap'
import GlobalSearchFilter from '~/components/molecules/GlobalSearchFilter'
import { columns } from '~/components/molecules/DTRManagementTable/columns'
import SummaryMenuDropdown from '~/components/molecules/SummaryMenuDropdown'
import TimeSheetFilterDropdown from '~/components/molecules/TimeSheetFilterDropdown'
import { getAllEmployeeTimesheet, IAllTimeSheet } from '~/hooks/useTimesheetQuery'

const DTRManagement: NextPage = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const { data, error, isLoading } = getAllEmployeeTimesheet()
  const timesheets: IAllTimeSheet = data as IAllTimeSheet

  useEffect(() => {
    let toastId
    if (isLoading) {
      toastId = toast.loading('Loading...')
    } else if (!isLoading) {
      toast.dismiss(toastId)
    }
  }, [isLoading])

  useEffect(() => {
    if (error != null) {
      toast.error('There is an error!', { duration: 3000 })
    }
  }, [error])

  return (
    <Layout metaTitle="DTR Management">
      <section className="default-scrollbar relative h-full min-h-full overflow-auto text-xs text-slate-800">
        <div className="sticky top-0 z-20 block bg-slate-100 md:hidden">
          <div className="flex items-center space-x-2 border-b border-slate-200 px-4 py-2">
            <h1 className="text-base font-semibold text-slate-700">DTR Management</h1>
            <LegendTooltip
              {...{
                placement: 'bottom'
              }}
            />
          </div>
        </div>
        <header
          className={classNames(
            'sticky top-[41px] left-0 z-20 flex items-center justify-between md:top-0',
            'border-b border-slate-200 bg-slate-100 px-4 py-2'
          )}
        >
          <GlobalSearchFilter
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search"
          />
          <div className="flex items-center space-x-2 text-slate-500">
            <TimeSheetFilterDropdown
              className={classNames(
                'flex items-center space-x-2 rounded border border-slate-200 bg-transparent bg-white',
                'px-3 py-1 shadow-sm outline-none hover:text-slate-600 active:scale-95'
              )}
            >
              <FilterIcon className="h-4 w-4 fill-current" />
              <span>Filters</span>
            </TimeSheetFilterDropdown>
            <SummaryMenuDropdown
              className={classNames(
                'rounded border border-slate-200 bg-white py-0.5 px-2 outline-none',
                'shadow-sm hover:bg-white hover:text-slate-600 active:scale-95'
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
            </SummaryMenuDropdown>
          </div>
        </header>
        {!isLoading ? (
          <DTRTable
            {...{
              data: mapDTRManagement(timesheets.timeEntries),
              columns,
              globalFilter,
              setGlobalFilter
            }}
          />
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </section>
    </Layout>
  )
}

export default DTRManagement
