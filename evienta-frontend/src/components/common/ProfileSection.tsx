import React, { useState, useCallback } from 'react';
import { User, Mail, Home, Phone, Save, Plus, Building, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';


const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(user || {});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });



  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prev:any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });


    try {
      {
        user && user.id && await apiService.updateProfile(user.id, profile);
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper component for input fields


  const statusClasses = statusMessage.type === 'success'
    ? "bg-green-50 border border-green-200 text-green-600"
    : "bg-red-50 border border-red-200 text-red-600";
  
     const handleAddOrganization = useCallback(() => {
        setProfile((prev:any) => ({
            ...prev,
            organizations: [...(prev.organizations || []), ''], // Add an empty string for a new organization
        }));
    }, []);

   const handleOrganizationChange = useCallback((index:number, value:string) => {
        setProfile((prev:any) => ({
            ...prev,
            organizations: (prev.organizations || []).map((org:string, i:number) => i === index ? value : org),
        }));
    }, []);

       const handleRemoveOrganization = useCallback((index:number) => {
        setProfile((prev:any) => ({
            ...prev,
            organizations: (prev.organizations || []).filter((_:any, i:number) => i !== index),
        }));
    }, []);
    
   const editableInputClass = "appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 bg-white cursor-text text-gray-900";
    // Common input classes for disabled fields
    const disabledInputClass = "appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 bg-gray-100 cursor-not-allowed text-gray-600";

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
                    <form className="space-y-6" onSubmit={handleSave}>
                        {statusMessage.text && (
                            <div className={`px-4 py-3 rounded-md ${statusClasses}`}>
                                {statusMessage.text}
                            </div>
                        )}
                        
                        {/* 1. Full Name Field (Editable) */}
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
                                    value={profile.name}
                                    onChange={handleChange}
                                    className={editableInputClass}
                                />
                                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Email Address Field (Disabled/Read-Only) */}
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
                                    disabled={true} // Explicitly disabled
                                    value={profile.email}
                                    onChange={handleChange}
                                    className={disabledInputClass}
                                />
                                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        
                        {/* 3. Phone Number Field (Editable) */}
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
                                    value={profile.phone}
                                    onChange={handleChange}
                                    className={editableInputClass}
                                />
                                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                                    <Phone className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* 4. Address Field (Editable) */}
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
                                    value={profile.address}
                                    onChange={handleChange}
                                    className={editableInputClass}
                                />
                                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                                    <Home className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                         {profile.role === 'vendor' && (
                            <div className='space-y-3'>
                                <div className="flex justify-between items-center pt-2">
                                    <label className="block text-sm font-bold text-gray-800">
                                        Organizations
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddOrganization}
                                        className="text-blue-600 hover:text-blue-800 transition duration-150 disabled:opacity-50 flex items-center font-medium text-sm"
                                        disabled={loading}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Organization
                                    </button>
                                </div>

                                {(profile.organizations || []).map((org:any, index:any) => (
                                    <div key={index} className="relative flex space-x-2 items-center">
                                        <div className="flex-grow relative">
                                            <input
                                                id={`organization-${index}`}
                                                name={`organization-${index}`}
                                                type="text"
                                                autoComplete="organization"
                                                placeholder={`Organization #${index + 1} Name`}
                                                value={org}
                                                onChange={(e) => handleOrganizationChange(index, e.target.value)}
                                                className={editableInputClass}
                                            />
                                            <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                                                <Building className="h-5 w-5" />
                                            </div>
                                        </div>
                                        
                                        {(profile.organizations.length > 1) && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOrganization(index)}
                                                disabled={loading}
                                                className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-full transition duration-150 disabled:opacity-50"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className='flex justify-end pt-4 space-x-4'>
                            <button
                                type="submit"
                                className="w-40 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150 ease-in-out"
                            >
                                {loading ? <LoadingSpinner /> : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    </div>
  );
};

export default ProfilePage;
