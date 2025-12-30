import React from "react"
import { Link } from "react-router-dom"
import { MainLogo } from "@assets/icons/logo"

const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-4 max-lg:justify-between">
      <Link
        to="/"
        className="flex items-center gap-4"
        aria-label="Cath Speak Home"
      >
        <img src={MainLogo} alt="Cath Speak logo" className="h-10 w-auto" />
      </Link>
    </div>
  )
}

export default HeaderLogo
