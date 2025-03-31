import * as React from "react"

export const CalendarCell = React.forwardRef<React.HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, children, ...props }, ref) => {
    return (
      <button className={className} ref={ref} {...props}>
        {children}
      </button>
    )
  },
)
CalendarCell.displayName = "CalendarCell"

export const CalendarGrid = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={className} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
CalendarGrid.displayName = "CalendarGrid"

export const CalendarHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={className} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
CalendarHeader.displayName = "CalendarHeader"

export const CalendarHeading = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2 className={className} ref={ref} {...props}>
        {children}
      </h2>
    )
  },
)
CalendarHeading.displayName = "CalendarHeading"

export const CalendarNav = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={className} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
CalendarNav.displayName = "CalendarNav"

export const CalendarViewControl = React.forwardRef<React.HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => {
    return <button className={className} ref={ref} {...props} />
  },
)
CalendarViewControl.displayName = "CalendarViewControl"

export const Calendar = () => {
  return null
}

