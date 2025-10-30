import React, { useState, useEffect } from 'react';
import { User, Mail, Home, Phone, Plus, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [statusUser, setStatusUser] = useState({ type: '', text: '' });
  const [statusOrgs, setStatusOrgs] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save user details only (not organizations)
  const handleSaveUser = async (e: any) => {
    e.preventDefault();
    setLoadingUser(true);
    setStatusUser({ type: '', text: '' });
    try {
      await apiService.updateProfile(profile.id,profile);
      setStatusUser({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setStatusUser({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setLoadingUser(false);
    }
  };

  // Save organizations only
  const handleSaveOrgs = async (e: any) => {
    e.preventDefault();
    setLoadingOrgs(true);
    setStatusOrgs({ type: '', text: '' });
    try {
      const organizationsWithUserId = (profile.organizations || []).map((org: any) => ({
        ...org,
        user_id: profile.id,
      }));
      await apiService.createVendorProfile({ organizations: organizationsWithUserId });
      setStatusOrgs({ type: 'success', text: 'Organizations updated successfully!' });
    } catch (error) {
      setStatusOrgs({ type: 'error', text: 'Failed to save organizations. Please try again.' });
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleAddOrganization = () => {
    setProfile((prev: any) => ({
      ...prev,
      organizations: Array.isArray(prev.organizations)
        ? [...prev.organizations, { business_name: "", city: "", state: "", country: "" }]
        : [{ business_name: "", city: "", state: "", country: "" }],
    }));
  };

  const handleRemoveOrganization = (idx: number) => {
    setProfile((prev: any) => ({
      ...prev,
      organizations: Array.isArray(prev.organizations)
        ? prev.organizations.filter((_: any, i: number) => i !== idx)
        : [],
    }));
  };

  const handleOrganizationFieldChange = (idx: number, field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      organizations: Array.isArray(prev.organizations)
        ? prev.organizations.map((org: any, i: number) =>
          i === idx ? { ...org, [field]: value } : org
        )
        : [],
    }));
  };

  const editableInputClass = "appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 bg-white cursor-text text-gray-900";
  const disabledInputClass = "appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 bg-gray-100 cursor-not-allowed text-gray-600";
  const statusClasses = (type: string) =>
    type === 'success'
      ? "bg-green-50 border border-green-200 text-green-600"
      : "bg-red-50 border border-red-200 text-red-600";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          My Profile Information
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          View and update your personal details.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          {/* User Fields Section */}
          <form className="space-y-6" onSubmit={handleSaveUser}>
            {statusUser.text && (
              <div className={`px-4 py-3 rounded-md ${statusClasses(statusUser.type)}`}>
                {statusUser.text}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={profile.name || ""}
                  onChange={handleChange}
                  className={editableInputClass}
                />
                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address (Cannot be changed)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={true}
                  value={profile.email || ""}
                  onChange={handleChange}
                  className={disabledInputClass}
                />
                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={profile.phone || ""}
                  onChange={handleChange}
                  className={editableInputClass}
                />
                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  value={profile.address || ''}
                  onChange={handleChange}
                  className={editableInputClass}
                />
                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                  <Home className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className='flex justify-end pt-4 space-x-4'>
              <button
                type="submit"
                className="w-40 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {loadingUser ? <LoadingSpinner /> : "Save User Info"}
              </button>
            </div>
          </form>
          </div>
      </div>
    </div >
  );
};

export default ProfilePage;
