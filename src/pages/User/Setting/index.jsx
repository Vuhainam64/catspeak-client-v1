import React from 'react'
import SettingsSidebar from '@components/settings/SettingsSidebar'
import SettingsContent from '@components/settings/SettingsContent'

const UserSetting = () => {
  return (
    <div className="w-full py-8">
      <div className="mx-auto flex w-full max-w-screen-2xl gap-6 px-6">
        <SettingsSidebar />
        <SettingsContent />
      </div>
    </div>
  )
}

export default UserSetting