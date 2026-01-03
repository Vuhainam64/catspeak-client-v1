import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiClock } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'

const ComingSoonPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useLanguage()

    // Determine which feature based on pathname
    const getFeatureName = () => {
        if (location.pathname === '/cart') {
            return t.nav.cart
        }
        if (location.pathname === '/connect') {
            return t.nav.connect
        }
        return t.comingSoon.feature
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-[#f5c34a] to-[#c2131a] rounded-full p-6 shadow-lg">
                        <FiClock className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {getFeatureName()}
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 mb-6">
                    {t.comingSoon.title}
                </p>

                <p className="text-sm text-gray-500 italic">
                    {t.comingSoon.description}
                </p>
            </div>
        </div>
    )
}

export default ComingSoonPage
