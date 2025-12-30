import React from "react"

/**
 * BubblePillMessage
 * Nút dạng “speech bubble / pill” đỏ như hình (có thể chứa icon + text qua children).
 */
const BubblePillMessage = ({ className = "", children, asChild, ...rest }) => {
  return (
    <button
      type="button"
      className={[
        "relative inline-flex items-center justify-center",
        className,
      ].join(" ")}
      {...rest}
    >
      <svg
        width="145"
        height="47"
        viewBox="0 0 145 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <foreignObject x="5.59033" y="-4" width="143.41" height="55">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              backdropFilter: "blur(2px)",
              clipPath: "url(#bgblur_0_2386_4248_clip_path)",
              height: "100%",
              width: "100%",
            }}
          />
        </foreignObject>
        <path
          d="M37.4277 1.5H121.5C133.65 1.5 143.5 11.3497 143.5 23.5C143.5 35.6503 133.65 45.5 121.5 45.5H16.002C11.5792 45.4999 9.42076 40.1023 12.624 37.0527C14.1901 35.5618 15.0771 33.4943 15.0771 31.332V23.8506C15.0771 11.5068 25.0839 1.5 37.4277 1.5Z"
          fill="#990011"
          stroke="white"
          strokeWidth="3"
        />
      </svg>

      {/* Nội dung (icon + text) nằm giữa pill */}
      <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
        {children}
      </span>
    </button>
  )
}

export default BubblePillMessage
