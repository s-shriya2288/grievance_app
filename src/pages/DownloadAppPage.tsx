import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Footer from '../components/Footer'

const APK_PATH = '/downloads/dalmia-grievance-portal.apk'

export default function DownloadAppPage() {
  const apkUrl = `${window.location.origin}${APK_PATH}`

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-brand-900/40">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <img src="/brand/dalmia-icon.png" alt="Dalmia Bharat" className="mx-auto h-14 w-14" />
          <h1 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Get the Android App</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Rajgangpur Plant Grievance Portal</p>

          <div className="mx-auto mt-6 flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700">
            <QRCodeSVG value={apkUrl} size={200} />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Scan this code with your phone's camera to download the app
          </p>

          <a
            href={APK_PATH}
            download
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Download for Android (.apk)
          </a>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <p className="font-semibold">Before installing:</p>
            <p className="mt-1">
              This app isn't from the Google Play Store, so Android will ask you to allow installs from this
              source. When prompted, tap <strong>Settings</strong> → enable <strong>Allow from this source</strong>,
              then go back and tap Install.
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Prefer the browser?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Sign in on the web
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
