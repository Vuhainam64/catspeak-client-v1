import React from "react"
import { badges } from "../constants"
import { BubblePillMessage } from "@/components/ui/button"
import { motion } from "framer-motion"

const WelcomeSection = ({
  allowConnect,
  setAllowConnect,
  handleCreateOneOnOneSession,
  handleCreateStudyGroupSession,
  isCreating,
}) => {
  return (
    <div className="relative pl-6 h-full">
      {/* Decorative connecting lines */}
      <div className="absolute left-2 top-4 h-0.5 w-20 bg-[#990011]" />
      <div className="absolute left-2 top-4 h-[220px] w-0.5 bg-[#990011]" />

      <p className="text-3xl font-bold mb-1 ml-20">Hi Quỳnh,</p>
      <h2 className="text-3xl font-bold text-[#990011] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
        Happy Halloween
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-gray-800">
        Halloween is nominally a{" "}
        <span className="font-semibold text-[#990011]">Christian holiday</span>{" "}
        honoring the souls of saints and other souls who have been blessed. It
        descends from an{" "}
        <span className="font-semibold text-[#990011]">
          ancient Celtic festival
        </span>{" "}
        of the dead that marked the official end of the growing season.
      </p>
      <p className="mt-3 text-sm italic text-gray-600">Trick or Treat</p>

      <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-gray-50 px-4 py-2 text-sm text-[#990011] shadow">
        <button
          type="button"
          onClick={() => setAllowConnect((v) => !v)}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition",
            allowConnect ? "bg-yellow-500" : "bg-gray-300",
          ].join(" ")}
          aria-pressed={allowConnect}
        >
          <span
            className={[
              "h-5 w-5 transform rounded-full bg-white shadow transition",
              allowConnect ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>
        Cho phép kết nối với bạn bè quốc tế
      </div>

      <div className="relative mt-6">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#990011]/20" />
        <div className="relative flex flex-wrap gap-3">
          {badges.map((b) => {
            const Icon = b.icon
            const isOneOnOne = b.label === "1:1"
            const isStudyGroup = b.label === "2:5"
            const isActionable = isOneOnOne || isStudyGroup

            const handleClick = () => {
              if (isOneOnOne) handleCreateOneOnOneSession()
              if (isStudyGroup) handleCreateStudyGroupSession()
            }

            return (
              <motion.div
                className={`text-sm font-semibold flex items-center transform transition duration-200 ease-out ${
                  isActionable ? "cursor-pointer" : "cursor-default opacity-80"
                }`}
                onClick={isActionable ? handleClick : undefined}
                disabled={isActionable && isCreating}
                whileHover={isActionable ? { rotate: 720 } : {}} // spin only if actionable
                transition={{ duration: 0.5, ease: "linear" }}
              >
                <BubblePillMessage key={b.label} asChild>
                  {isActionable && isCreating ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Icon className="mr-2 h-4 w-4 text-white" />
                  )}
                  {b.label}
                </BubblePillMessage>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WelcomeSection
