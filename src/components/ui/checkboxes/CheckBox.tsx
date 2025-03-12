import { forwardRef } from 'react'

interface CheckBoxProps {
  label: string
  checked: boolean
  onChange: () => void
}

export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ label, checked, onChange }, ref) => {
    return (
      <div className='flex items-center'>
        <input
          ref={ref}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className='w-5 h-5 rounded-lg border border-border bg-white/0 mr-2 cursor-pointer'
        />
        <label className='text-sm text-white/60 dark:text-white font-medium'>
          {label}
        </label>
      </div>
    )
  }
)
