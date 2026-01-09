import React from "react"

/**
 * BubblePillMessage
 * A flexible, prominent red pill button.
 * Replaces the previous fixed-SVG version to support variable text lengths.
 */
const BubblePillMessage = ({ className = "", children, asChild, ...rest }) => {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center px-6 py-3 rounded-full",
        "bg-[#990011] text-white font-semibold border-2 border-transparent",
        "hover:bg-white hover:text-[#990011] hover:border-[#990011] transition-all duration-200",
        "disabled:opacity-60 disabled:grayscale disabled:cursor-not-allowed",
        "disabled:hover:bg-[#990011] disabled:hover:text-white disabled:hover:border-transparent",
        "whitespace-nowrap min-w-[140px]",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  )
}

export default BubblePillMessage
