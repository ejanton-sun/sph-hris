import moment from 'moment'
import classNames from 'classnames'
import { Menu } from '@headlessui/react'
import React, { FC, ReactNode } from 'react'

import Text from '~/components/atoms/Text'
import { Filters } from '~/pages/dtr-management'
import Button from '~/components/atoms/Buttons/ButtonAction'
import MenuTransition from '~/components/templates/MenuTransition'

type Props = {
  className?: string
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<any>>
  handleFilterUpdate: Function
  children: ReactNode
}

const HROvertimeFilterDropdown: FC<Props> = (props): JSX.Element => {
  const {
    children,
    className = 'shrink-0 outline-none active:scale-95',
    filters,
    setFilters,
    handleFilterUpdate
  } = props
  const monthYearSelectionRef = React.createRef<HTMLInputElement>()

  const daysRangeSelectionRef = React.createRef<HTMLSelectElement>()

  const daysRangeOptions = ['1-15 Days Timesheet', '16-31 Days Timesheet']

  const handleSummaryFilterChange = (): void => {
    if (monthYearSelectionRef.current !== null) {
      const monthyear = monthYearSelectionRef.current.value
      daysRangeSelectionRef.current?.value === daysRangeOptions[0]
        ? setFilters({
            ...filters,
            startDate: moment(`${monthyear}` + '-01').format('YYYY-MM-DD'),
            endDate: moment(`${monthyear}` + '-15').format('YYYY-MM-DD')
          })
        : setFilters({
            ...filters,
            startDate: moment(`${monthyear}` + '-16').format('YYYY-MM-DD'),
            endDate: moment(`${monthyear}` + '-16')
              .endOf('month')
              .format('YYYY-MM-DD')
          })
    }
  }

  return (
    <Menu as="div" className="relative z-10 flex w-full">
      <Menu.Button className={className}>{children}</Menu.Button>
      <MenuTransition>
        <Menu.Items
          className={classNames(
            'fixed right-6 top-[138px] flex w-80 flex-col overflow-hidden rounded-md sm:right-32 md:top-[102px]',
            'flex flex-col bg-white shadow-xl ring-1 ring-black',
            'shadow-slate-200 ring-opacity-5 focus:outline-none'
          )}
        >
          <main className="flex flex-col space-y-4 px-5 py-4">
            <Text theme="sm" weight="semibold" className="text-slate-500">
              Timesheet Filters
            </Text>
            <input
              type="month"
              className={classNames(
                'w-full rounded-md border border-slate-300 text-xs shadow-sm',
                'focus:border-primary focus:ring-1 focus:ring-primary'
              )}
              ref={monthYearSelectionRef}
              defaultValue={moment(filters.startDate).format('YYYY-MM')}
              onChange={handleSummaryFilterChange}
            ></input>
            <select
              className={classNames(
                'w-full rounded-md border border-slate-300 text-xs shadow-sm',
                'focus:border-primary focus:ring-1 focus:ring-primary'
              )}
              ref={daysRangeSelectionRef}
              onChange={handleSummaryFilterChange}
              defaultValue={
                new Date(filters.endDate).getDate() > 15 ? daysRangeOptions[1] : daysRangeOptions[0]
              }
            >
              <option>{daysRangeOptions[0]}</option>
              <option>{daysRangeOptions[1]}</option>
            </select>
          </main>
          <footer className="bg-slate-100 px-5 py-3">
            <Button
              type="button"
              variant="primary"
              rounded="md"
              className="w-full py-2 text-xs"
              onClick={(): React.MouseEvent<HTMLInputElement> => handleFilterUpdate()}
            >
              Update Results
            </Button>
          </footer>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  )
}

export default HROvertimeFilterDropdown
