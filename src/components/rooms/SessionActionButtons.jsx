import React from "react"
import { motion } from "framer-motion"
import { BubblePillMessage } from "@/components/ui/button"
import { badges } from "@/constants/constants"

const SessionActionButtons = ({
  handleCreateOneOnOneSession,
  handleCreateStudyGroupSession,
  isCreatingOneOnOne,
  isCreatingStudyGroup,
}) => {
  return (
    <div className="relative mt-6 pl-6">
      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#990011]" />
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

          const isLoadingThis =
            (isOneOnOne && isCreatingOneOnOne) ||
            (isStudyGroup && isCreatingStudyGroup)

          return (
            <motion.div
              key={b.label}
              className={`text-sm font-semibold flex items-center transform transition duration-200 ease-out ${isActionable ? "cursor-pointer" : "cursor-default opacity-80"
                }`}
              onClick={isActionable ? handleClick : undefined}
              disabled={isActionable && isLoadingThis}
              whileHover={isActionable ? { scale: 1.1 } : {}}
              whileTap={isActionable ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <BubblePillMessage asChild>
                {isActionable && isLoadingThis ? (
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
  )
}

export default SessionActionButtons
