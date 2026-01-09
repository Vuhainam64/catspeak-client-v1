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
      {/* Line removed as requested */}
      <div className="relative flex flex-wrap gap-3">
        {badges.map((b) => {
          const Icon = b.icon
          const isOneOnOne = b.label === "Queue 1:1"
          const isStudyGroup = b.label === "Create 2:5 room"
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
              className={`text-sm font-semibold flex items-center transform transition-colors duration-200 ease-out`}
              onClick={isActionable ? handleClick : undefined}
            >
              <BubblePillMessage
                asChild
                disabled={!isActionable || isLoadingThis}
              >
                {isActionable && isLoadingThis ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
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
