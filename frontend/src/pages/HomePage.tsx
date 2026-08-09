import { Link } from 'react-router-dom'
import BackendStatus from '../components/BackendStatus'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">HealthGPT AI</h1>
        <p className="mt-4 text-lg text-gray-600">
          AI-powered healthcare assistant
        </p>
        <div className="mt-8">
          <BackendStatus />
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/login"
            className="rounded-md bg-teal-600 px-6 py-2 text-white hover:bg-teal-700"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}