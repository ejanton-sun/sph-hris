import classNames from 'classnames'
import { useRouter } from 'next/router'
import makeAnimated from 'react-select/animated'
import { yupResolver } from '@hookform/resolvers/yup'
import ReactSelect, { MultiValue } from 'react-select'
import React, { FC, useEffect, useState } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  X,
  Plus,
  Save,
  User,
  Minus,
  Coffee,
  FileText,
  Activity,
  Calendar,
  UserCheck
} from 'react-feather'

import TextField from './../TextField'
import Input from '~/components/atoms/Input'
import SpinnerIcon from '~/utils/icons/SpinnerIcon'
import { NewLeaveSchema } from '~/utils/validation'
import Button from '~/components/atoms/Buttons/ButtonAction'
import { NewLeaveFormValues } from '~/utils/types/formValues'
import { customStyles } from '~/utils/customReactSelectStyles'
import ModalFooter from '~/components/templates/ModalTemplate/ModalFooter'
import { numberOfDaysInLeaves } from '~/utils/constants/dummyAddNewLeaveFields'
import useProject from '~/hooks/useProject'
import useUserQuery from '~/hooks/useUserQuery'
import { User as UserType } from '~/utils/types/userTypes'
import { Roles } from '~/utils/constants/roles'
import {
  generateUserSelect,
  generateProjectsMultiSelect,
  generateLeaveTypeSelect,
  generateNumberOfDaysSelect
} from '~/utils/createLeaveHelpers'
import { ProjectDetails } from '~/utils/types/projectTypes'
import useLeave from '~/hooks/useLeave'
import { LeaveType } from '~/utils/types/leaveTypes'

type Props = {
  isOpen: boolean
  closeModal: () => void
}

type ReactSelectProps = { label: string; value: string }

const animatedComponents = makeAnimated()

const LeaveTab: FC<Props> = ({ isOpen, closeModal }): JSX.Element => {
  const router = useRouter()
  const [managers, setManagers] = useState<UserType[]>([])
  const [leaders, setLeaders] = useState<UserType[]>([])
  const [otherProject, setOtherProject] = useState<boolean>(false)
  const { handleProjectQuery } = useProject()
  const { handleAllUsersQuery, handleUserQuery } = useUserQuery()
  const { handleLeaveTypeQuery, handleLeaveMutation } = useLeave()
  const { data: user } = handleUserQuery()
  const leaveMutation = handleLeaveMutation(
    user?.userById.id as number,
    parseInt(router.query.year as string)
  )
  const { data: leaveTypes } = handleLeaveTypeQuery()
  const { data: projects, isSuccess: isProjectsSuccess } = handleProjectQuery()
  const { data: users, isSuccess: isUsersSuccess } = handleAllUsersQuery()

  // modify custom style control
  customStyles.control = (provided: Record<string, unknown>, state: any): any => ({
    ...provided,
    boxShadow: 'none',
    borderColor: 'none',
    '&:hover': {
      color: '#75c55e'
    }
  })

  useEffect(() => {
    if (isUsersSuccess) {
      const tempManager = users.allUsers.filter((user) => user.role.name === Roles.MANAGER)
      setManagers([...tempManager])
    }
  }, [isUsersSuccess])

  useEffect(() => {
    if (isProjectsSuccess && projects.projects.length > 0) {
      const tempLeaders = [...leaders]
      projects?.projects.forEach((project) => {
        if (project?.projectLeader != null || project?.projectSubLeader != null) {
          if (!tempLeaders.some((leader) => leader.id === project.projectLeader.id))
            tempLeaders.push(project?.projectLeader)
          if (!tempLeaders.some((leader) => leader.id === project.projectSubLeader.id))
            tempLeaders.push(project?.projectSubLeader)
        }
      })
      setLeaders(tempLeaders)
    }
  }, [isProjectsSuccess, projects?.projects])

  const [selectedOtherProjectOption, setSelectedOtherProjectOption] = useState<
    MultiValue<ReactSelectProps>
  >([])

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NewLeaveFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(NewLeaveSchema)
  })

  // This will handle form submit and save
  const handleSave = async (data: NewLeaveFormValues): Promise<void> => {
    return await new Promise((resolve) => {
      leaveMutation.mutate(
        {
          userId: user?.userById.id as number,
          projectIds: selectedOtherProjectOption.map((p) => parseInt(p.value)),
          leaveTypeId: parseInt(data.leave_type.value),
          managerId: parseInt(data.manager.value),
          otherProject: data.other_project as string,
          reason: data.reason,
          leaveDates: data.leave_date.map((date) => {
            return {
              leaveDate: date.date,
              isWithPay: date.is_with_pay,
              days: parseFloat(date.number_of_days_in_leave.value)
            }
          })
        },
        {
          onSuccess: () => closeModal()
        }
      )
      resolve()
      // closeModal()
    })
  }

  const handleChangeProject = (selectedOption: MultiValue<ReactSelectProps>): void => {
    setOtherProject(false)
    if (selectedOption.some((s) => s.label === 'Others')) {
      setOtherProject(true)
    }
    setSelectedOtherProjectOption(selectedOption)
  }

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'leave_date'
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        leave_type: {
          label: '',
          value: ''
        },
        leave_date: [
          {
            date: '',
            number_of_days_in_leave: {
              label: '',
              value: ''
            },
            is_with_pay: false
          }
        ],
        other_project: '',
        reason: ''
      })
    }
  }, [isOpen])

  // Add New Date
  const handleAddNewDate = (): void =>
    append({
      date: '',
      number_of_days_in_leave: {
        label: '',
        value: ''
      },
      is_with_pay: false
    })

  // Remove Date
  const handleRemoveDate = (index: number): void => remove(index)

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(handleSave)}
    >
      <main className="grid grid-cols-2 gap-x-4 gap-y-6 py-6 px-8 text-xs text-slate-800">
        {/* Project */}
        <section className="col-span-2">
          <TextField title="Project" Icon={Coffee} isRequired>
            <Controller
              name="project"
              control={control}
              render={({ field }) => {
                return (
                  <ReactSelect
                    className="w-full"
                    classNames={{
                      control: (state) =>
                        state.isFocused
                          ? 'border-primary'
                          : errors.project !== null && errors.project !== undefined
                          ? 'border-rose-500 ring-rose-500'
                          : 'border-slate-300'
                    }}
                    isMulti
                    {...field}
                    isClearable
                    styles={customStyles}
                    options={generateProjectsMultiSelect(projects?.projects as ProjectDetails[])}
                    closeMenuOnSelect={false}
                    isDisabled={isSubmitting}
                    backspaceRemovesValue={true}
                    value={field.value}
                    onChange={(options) => {
                      field.onChange(options.map((c) => c))
                      return handleChangeProject(options)
                    }}
                    components={animatedComponents}
                  />
                )
              }}
            />
          </TextField>
          {errors.project !== null && errors.project !== undefined && (
            <span className="error text-[10px]">{errors?.project.message}</span>
          )}
        </section>

        {/* Other Projects */}
        {otherProject ? (
          <section className="col-span-2 sm:col-span-1">
            <TextField title="Other Project" Icon={Coffee} isOptional>
              <Input type="text" {...register('other_project')} className="py-2.5 pl-11 text-xs" />
            </TextField>
          </section>
        ) : null}

        {/* Leave Types */}
        <section className={`${otherProject ? 'col-span-2 sm:col-span-1' : 'col-span-2'} `}>
          <TextField title="Leave Type" Icon={Activity} isRequired>
            <Controller
              name="leave_type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  styles={customStyles}
                  className="w-full"
                  classNames={{
                    control: (state) =>
                      state.isFocused
                        ? 'border-primary'
                        : errors?.leave_type !== null && errors.leave_type !== undefined
                        ? 'border-rose-500 ring-rose-500'
                        : 'border-slate-300'
                  }}
                  {...field}
                  defaultValue={null}
                  value={field.value}
                  options={generateLeaveTypeSelect(leaveTypes?.leaveTypes as LeaveType[])}
                  onChange={(option) => field.onChange(option)}
                  isDisabled={isSubmitting}
                  components={animatedComponents}
                />
              )}
            />
          </TextField>
          {errors?.leave_type !== null && errors?.leave_type !== undefined && (
            <span className="error text-[10px]">{errors.leave_type?.value?.message}</span>
          )}
        </section>

        {/* Leave Dynamic Field */}
        {fields.map((date, index) => (
          <div
            className="col-span-2 flex w-full flex-wrap items-end justify-between space-y-4 sm:space-x-2 md:space-y-0"
            key={date.id}
          >
            {/* Date Calendar Field */}
            <section className="w-full sm:w-[36%]">
              <TextField
                title={`Leave Date ${index + 1}`}
                Icon={Calendar}
                isRequired
                isError={errors?.leave_date?.[index]?.date}
                className="flex-1"
              >
                <Input
                  type="date"
                  disabled={isSubmitting}
                  {...register(`leave_date.${index}.date` as any)}
                  placeholder="Leave Date"
                  iserror={
                    errors.leave_date?.[index]?.date !== null &&
                    errors.leave_date?.[index]?.date !== undefined
                  }
                  className="py-2.5 pl-11 text-xs"
                />
                {errors.leave_date?.[index]?.date !== null &&
                  errors.leave_date?.[index]?.date !== undefined && (
                    <span className="error absolute -bottom-5 text-[10px]">
                      Leave Date {index + 1} is required field
                    </span>
                  )}
              </TextField>
            </section>
            {/* Number of days in leave */}
            <section className="w-full flex-1">
              <TextField
                title="Number of Days in Leave"
                Icon={User}
                isRequired
                className="py-2.5 text-xs"
              >
                <Controller
                  name={`leave_date.${index}.number_of_days_in_leave`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactSelect
                      styles={customStyles}
                      className="w-full"
                      classNames={{
                        control: (state) =>
                          state.isFocused
                            ? 'border-primary'
                            : errors.leave_date?.[index]?.number_of_days_in_leave !== null &&
                              errors.leave_date?.[index]?.number_of_days_in_leave !== undefined
                            ? 'border-rose-500 ring-rose-500'
                            : 'border-slate-300'
                      }}
                      {...field}
                      defaultValue={null}
                      value={field.value}
                      onChange={field.onChange}
                      options={generateNumberOfDaysSelect(numberOfDaysInLeaves)}
                      isDisabled={isSubmitting}
                      components={animatedComponents}
                    />
                  )}
                />
              </TextField>
              {errors.leave_date?.[index]?.number_of_days_in_leave !== null &&
                errors.leave_date?.[index]?.number_of_days_in_leave !== undefined && (
                  <span className="error absolute text-[10px]">
                    Number of days in leave is required
                  </span>
                )}
            </section>
            <div className="ml-4 flex items-center space-x-2 sm:ml-0">
              {/* With Pay boolean */}
              <div className="shrink-0">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className={classNames(
                      'h-4 w-4 rounded border-slate-300 bg-slate-100',
                      'text-primary focus:ring-primary'
                    )}
                    {...register(`leave_date.${index}.is_with_pay` as any)}
                  />
                  <span className="ml-2 select-none text-xs capitalize text-slate-500">
                    With Pay
                  </span>
                </label>
              </div>
              <Button
                type="button"
                shadow="none"
                disabled={isSubmitting || fields?.length === 1}
                onClick={() => handleRemoveDate(index)}
                className="!bg-white p-[11px]"
              >
                <Minus className="h-4 w-4 stroke-1 text-slate-700" />
              </Button>
              <Button
                type="button"
                shadow="none"
                onClick={handleAddNewDate}
                disabled={isSubmitting}
                className="!bg-white p-[11px]"
              >
                <Plus className="h-4 w-4 stroke-1 text-slate-700" />
              </Button>
            </div>
          </div>
        ))}

        {/* Manager & Project leader */}
        <section className="col-span-2 sm:col-span-1">
          <TextField title="Manager" Icon={UserCheck} isRequired>
            <Controller
              name="manager"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  styles={customStyles}
                  className="w-full"
                  classNames={{
                    control: (state) =>
                      state.isFocused
                        ? 'border-primary'
                        : errors?.manager !== null && errors.manager !== undefined
                        ? 'border-rose-500 ring-rose-500'
                        : 'border-slate-300'
                  }}
                  {...field}
                  options={generateUserSelect(managers)}
                  defaultValue={null}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isSubmitting}
                  components={animatedComponents}
                />
              )}
            />
          </TextField>
          {errors?.manager !== null && errors?.manager !== undefined && (
            <span className="error text-[10px]">{errors.manager?.value?.message}</span>
          )}
        </section>

        {/* Project Leaders Field */}
        <section className="col-span-2 sm:col-span-1">
          <TextField title="Project Leader" Icon={User} isRequired>
            <Controller
              name="project_leader"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  styles={customStyles}
                  className="w-full"
                  classNames={{
                    control: (state) =>
                      state.isFocused
                        ? 'border-primary'
                        : errors?.project_leader !== null && errors.project_leader !== undefined
                        ? 'border-rose-500 ring-rose-500'
                        : 'border-slate-300'
                  }}
                  {...field}
                  options={generateUserSelect(leaders)}
                  defaultValue={null}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isSubmitting}
                  components={animatedComponents}
                />
              )}
            />
          </TextField>
          {errors?.project_leader !== null && errors?.project_leader !== undefined && (
            <span className="error text-[10px]">{errors.project_leader?.value?.message}</span>
          )}
        </section>

        {/* Reason for leave Field */}
        <section className="col-span-2">
          <TextField title="Reason for leave" Icon={FileText} isRequired>
            <ReactTextareaAutosize
              id="reason"
              {...register('reason')}
              className={classNames(
                'text-area-auto-resize pl-12',
                errors?.reason !== null && errors.reason !== undefined
                  ? 'border-rose-500 ring-rose-500'
                  : ''
              )}
              disabled={isSubmitting}
              placeholder="Write down your reason"
            />
          </TextField>
          {errors.reason !== null && errors.reason !== undefined && (
            <span className="error text-[10px]">{errors.reason?.message}</span>
          )}
        </section>
      </main>

      {/* Custom Modal Footer Style */}
      <ModalFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={closeModal}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-4 py-1 text-sm"
        >
          <X className="h-4 w-4" />
          <span>Close</span>
        </Button>
        <Button
          type="submit"
          variant="success"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-5 py-1 text-sm"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="h-3 w-3 fill-amber-600" />
              <span>Saving..</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </Button>
      </ModalFooter>
    </form>
  )
}

LeaveTab.defaultProps = {}

export default LeaveTab
