export type ConfirmInterruptionValues = {
  work_interruption: number
  power_checkbox: boolean
  specify_reason: string
  time_out: string
  time_in: string
  remarks: string
}

export type TimeEntryFormValues = Required<
  Pick<ConfirmInterruptionValues, 'time_out' | 'time_in' | 'remarks'>
>

export type ReactSelectOption = {
  value: string
  label: string
  __isNew__?: boolean
}

export type NewLeaveFormValues = {
  // eslint-disable-next-line @typescript-eslint/array-type
  projects: {
    project_name: ReactSelectOption
    project_leader: ReactSelectOption
  }[]
  leave_type: ReactSelectOption
  leave_date: Array<{
    date: string
    number_of_days_in_leave: ReactSelectOption
    is_with_pay: boolean
  }>
  manager: ReactSelectOption
  reason: string
}

export type UndertimeFormValues = {
  // eslint-disable-next-line @typescript-eslint/array-type
  projects: {
    project_name: ReactSelectOption
    project_leader: ReactSelectOption
    __isNew__?: boolean
  }[]
  undertime_leave_date: string
  number_of_days_in_leave_undertime: ReactSelectOption
  manager: ReactSelectOption
  reason: string
}

export type NewOvertimeFormValues = {
  // eslint-disable-next-line @typescript-eslint/array-type
  project: {
    label: string
    value: string
  }[]
  other_project?: string
  date_effective: string
  requested_hours: number
  remarks: string
}

export type NewEmployeeFormValues = {
  // eslint-disable-next-line @typescript-eslint/array-type
  email: string
  position: string
  first_name: string
  middle_name?: string
  last_name: string
}

export type FirstDayOnBoardingFormValues = {
  install_below: {
    docker_toolbox: boolean
    vscode: boolean
    mysql_workbench: boolean
    docker_for_windows: boolean
  }
  github_account_link: string
  ss_auth_for_email_image: FileList
  ss_auth_for_github_image: FileList
  signature_for_company_id_image: FileList
  picture_2x2_company_id: FileList
  is_signing_probationary_contract: boolean
  is_existing_sss_loan: boolean
  is_existing_pag_ibig_loan: boolean
  monthly_amortization_for_sss_loan: string
  monthly_amortization_for_pag_ibig_loan: string
}
