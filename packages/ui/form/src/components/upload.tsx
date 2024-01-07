import { Controller } from "react-hook-form"
// import { DropZone } from "@golfcart/dropzone"
import { ControlProps } from "../types"
import { ReactNode } from "react"

interface formUploadProps extends ControlProps {
  name: string
  withBorder?: boolean
  acceptComponent: ReactNode
  rejectComponent: ReactNode
  idleComponent: ReactNode
  maxSize?: number
  maxFiles?: number
  accept?: string[]
  showUploads?: boolean
}

function FormUpload(props: formUploadProps) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { value, onChange } }) => (
        <></>
        // <DropZone
        //   withBorder={props.withBorder}
        //   maxFiles={props.maxFiles}
        //   acceptComponent={props.acceptComponent}
        //   rejectComponent={props.rejectComponent}
        //   idleComponent={props.idleComponent}
        //   showUploads={props.showUploads}
        //   files={value}
        //   onDrop={onChange}
        // />
      )}
      defaultValue={false}
    />
  )
}

export default FormUpload
