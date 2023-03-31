import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import ReactSelect from 'react-select'
import { RefreshCcw, Save, X } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { FC, useEffect, useState } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import TextField from './../TextField'
import useProject from '~/hooks/useProject'
import Input from '~/components/atoms/Input'
import SpinnerIcon from '~/utils/icons/SpinnerIcon'
import { NewOffsetSchema } from '~/utils/validation'
import { User as UserType } from '~/utils/types/userTypes'
import Button from '~/components/atoms/Buttons/ButtonAction'
import { NewOffsetFormValues } from '~/utils/types/formValues'
import { customStyles } from '~/utils/customReactSelectStyles'
import { generateUserSelect } from '~/utils/createLeaveHelpers'
import ModalTemplate from '~/components/templates/ModalTemplate'
import { IEmployeeTimeEntry } from '~/utils/types/timeEntryTypes'
import ModalFooter from '~/components/templates/ModalTemplate/ModalFooter'
import ModalHeader from '~/components/templates/ModalTemplate/ModalHeader'

type Props = {
  isOpen: boolean
  closeModal: () => void
  row: IEmployeeTimeEntry
}

const AddNewOffsetModal: FC<Props> = ({ isOpen, closeModal }): JSX.Element => {
  const [leaders, setLeaders] = useState<UserType[]>([])

  const { handleProjectQuery } = useProject()
  const { data: projects, isSuccess: isProjectsSuccess } = handleProjectQuery()

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NewOffsetFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(NewOffsetSchema)
  })

  // modify custom style control
  customStyles.control = (provided) => ({
    ...provided,
    boxShadow: 'none',
    borderColor: 'none',
    '&:hover': {
      color: '#75c55e'
    }
  })

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

  const handleSave: SubmitHandler<NewOffsetFormValues> = async (data): Promise<void> => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        // console.log(data)
        alert(JSON.stringify(data, null, 2))
        handleReset()
        resolve()
      }, 2000)
    })
  }

  const handleReset = (): void => {
    reset({
      offsetTime: {
        timeIn: '',
        timeOut: ''
      },
      teamLeader: {
        label: '',
        value: ''
      },
      remarks: ''
    })
  }

  return (
    <ModalTemplate
      {...{
        isOpen,
        closeModal
      }}
      className="w-full max-w-[686px] overflow-visible"
    >
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(handleSave)}
      >
        {/* Custom Modal Header */}
        <ModalHeader
          {...{
            title: 'Add New Offset',
            closeModal
          }}
        />
        <main className="mb-6 grid grid-cols-2 gap-x-4 gap-y-6 py-6 px-8 text-xs text-slate-800">
          {/* Offset Time */}
          <section className="col-span-2">
            <label
              htmlFor="schedule-name"
              className={classNames(
                'flex flex-col space-y-0.5',
                !isEmpty(errors.offsetTime?.timeIn) || !isEmpty(errors.offsetTime?.timeOut)
                  ? 'mb-5'
                  : ''
              )}
            >
              <p className="shrink-0">
                Offset Time <span className="text-rose-500">*</span>
              </p>
              <div className="relative flex items-center space-x-2">
                <div className="w-1/2">
                  <Input
                    type="time"
                    disabled={isSubmitting}
                    {...register('offsetTime.timeIn')}
                    iserror={!isEmpty(errors.offsetTime?.timeIn)}
                    className="w-full py-1.5 px-4 text-[13px] placeholder:text-slate-500"
                  />
                  {!isEmpty(errors.offsetTime?.timeIn) && (
                    <p className="error absolute">{errors.offsetTime?.timeIn.message}</p>
                  )}
                </div>
                <span>to</span>
                <div className="w-1/2">
                  <Input
                    type="time"
                    disabled={isSubmitting}
                    {...register('offsetTime.timeOut')}
                    iserror={!isEmpty(errors.offsetTime?.timeOut)}
                    className="py-1.5 px-4 text-[13px] placeholder:text-slate-500"
                  />
                  {!isEmpty(errors.offsetTime?.timeOut) && (
                    <p className="error absolute">{errors.offsetTime?.timeOut.message}</p>
                  )}
                </div>
              </div>
            </label>
          </section>

          {/* Team Leader */}
          <section className="col-span-2">
            <TextField title="Team Leader" isRequired className="py-2.5 text-xs">
              <Controller
                name="teamLeader"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    isClearable
                    placeholder=""
                    className="w-full"
                    classNames={{
                      control: (state) =>
                        state.isFocused
                          ? 'border-primary'
                          : errors.teamLeader !== null && errors.teamLeader !== undefined
                          ? 'border-rose-500 ring-rose-500'
                          : 'border-slate-300'
                    }}
                    value={field.value}
                    styles={customStyles}
                    onChange={field.onChange}
                    isDisabled={isSubmitting}
                    backspaceRemovesValue={true}
                    options={generateUserSelect(leaders)}
                  />
                )}
              />
            </TextField>
            {errors.teamLeader !== null && errors.teamLeader !== undefined && (
              <span className="error text-[10px]">Team Leader is required</span>
            )}
          </section>

          {/* Descriptiohn Field */}
          <section className="col-span-2">
            <TextField title="Remarks" isRequired>
              <ReactTextareaAutosize
                id="reason"
                {...register('remarks')}
                className={classNames(
                  'text-area-auto-resize pl-12',
                  errors?.remarks !== null && errors.remarks !== undefined
                    ? 'border-rose-500 ring-rose-500'
                    : ''
                )}
                disabled={isSubmitting}
              />
            </TextField>
            {errors.remarks !== null && errors.remarks !== undefined && (
              <span className="error text-[10px]">{errors.remarks?.message}</span>
            )}
          </section>
        </main>
        {/* Custom Modal Footer Style */}
        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-1 text-sm"
            onClick={handleReset}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
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
                <SpinnerIcon className="h-3 w-3 fill-white" />
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
    </ModalTemplate>
  )
}

export default AddNewOffsetModal
