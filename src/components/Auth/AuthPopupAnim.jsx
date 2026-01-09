import { motion } from "framer-motion"

const AuthPopupAnim = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AuthPopupAnim
