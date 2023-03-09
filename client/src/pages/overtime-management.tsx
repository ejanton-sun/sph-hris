import { NextPage } from 'next'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import useUserQuery from '~/hooks/useUserQuery'
import { Roles } from '~/utils/constants/roles'
import Layout from '~/components/templates/Layout'
import { getAllovertime } from '~/hooks/useOvertime'
import { IOvertimeManagement } from '~/utils/interfaces'
import BarsLoadingIcon from '~/utils/icons/BarsLoadingIcon'
import { STATUS_OPTIONS } from '~/utils/constants/notificationFilter'
import GlobalSearchFilter from '~/components/molecules/GlobalSearchFilter'
import OvertimeManagementTable from '~/components/molecules/OvertimeManagementTable'
import { hrColumns, managerColumns } from '~/components/molecules/OvertimeManagementTable/columns'
import YearlyFilterDropdown from '~/components/molecules/MyDailyTimeRecordTable/YearlyFilterDropdown'

const OvertimeManagement: NextPage = (): JSX.Element => {
  const { handleUserQuery } = useUserQuery()
  const { data: user } = handleUserQuery()

  const [globalFilter, setGlobalFilter] = useState<string>('')

  const { data: overtime } = getAllovertime()

  const [overtimeData, setOvertimeData] = useState<IOvertimeManagement[]>()

  const status = (isLeaderApproved: boolean, isManagerApproved: boolean): string | undefined => {
    if (isLeaderApproved == null || isManagerApproved == null) {
      return STATUS_OPTIONS.PENDING.toLowerCase()
    }
    if (isLeaderApproved && isManagerApproved) {
      return STATUS_OPTIONS.APPROVED.toLowerCase()
    }
    if (!isLeaderApproved || !isManagerApproved) {
      return STATUS_OPTIONS.DISAPPROVED.toLowerCase()
    }
  }

  useEffect(() => {
    if (overtime?.allOvertime !== undefined) {
      const mappedOvertime = overtime?.allOvertime.map((notif) => {
        const [project] = notif.projects
        const mapped: IOvertimeManagement = {
          id: notif.id,
          projects: [
            {
              project_name: {
                value: project?.project.id as unknown as string,
                label: project?.project.name
              },
              project_leader: {
                value: project?.projectLeader.id as unknown as string,
                label: project?.projectLeader.name
              }
            },
            {
              project_name: {
                value: notif.otherProject,
                label: notif.otherProject
              },
              project_leader: {
                value: 'others',
                label: 'others'
              }
            }
          ],
          user: {
            id: notif.user.id,
            name: notif.user.name,
            link: notif.user.link,
            role: {
              id: notif.user.roleId,
              name: notif.user.roleName
            }
          },
          date: notif.overtimeDate,
          requestedHours: notif.approvedMinutes,
          supervisor: project?.projectLeader.name,
          dateFiled: notif.dateFiled,
          remarks: notif.remarks,
          status: status(notif.isLeaderApproved, notif.isManagerApproved) as string,
          overtimeIn: '',
          overtimeOut: '',
          manager: {
            label: '',
            value: ''
          }
        }
        return mapped
      })
      setOvertimeData(mappedOvertime)
    }
  }, [overtime])

  return (
    <Layout metaTitle="Overtime Management">
      <section
        className={classNames(
          'default-scrollbar relative h-screen min-h-full',
          'overflow-auto text-xs text-slate-800'
        )}
      >
        <header
          className={classNames(
            'sticky left-0 top-0 z-20 flex items-center justify-between',
            'border-b border-slate-200 bg-slate-100 px-4 py-2'
          )}
        >
          <GlobalSearchFilter
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search"
          />
          <YearlyFilterDropdown />
        </header>

        {overtimeData !== undefined ? (
          <OvertimeManagementTable
            {...{
              query: {
                data: overtimeData,
                error: null
              },
              table: {
                columns: user?.userById.role.name === Roles.HR_ADMIN ? hrColumns : managerColumns,
                globalFilter,
                setGlobalFilter
              }
            }}
          />
        ) : (
          <div className="flex min-h-[50vh] items-center justify-center">
            <BarsLoadingIcon className="h-7 w-7 fill-current text-amber-500" />
          </div>
        )}
      </section>
    </Layout>
  )
}

export default OvertimeManagement
