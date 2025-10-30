import React, { useState } from "react";

type BusinessCardProps = {
    business: any;
    onEdit: (business: any) => void;
    onDelete: (business: any) => void;
};

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onEdit, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:shadow-lg transition relative">
            {/* EDIT / DELETE BUTTONS AT TOP RIGHT */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
                {/* Edit button */}
                <button
                    title="Edit"
                    onClick={() => onEdit(business)}
                    className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 113.536 3.536L7.5 20.5H4v-3.5l12.732-13.268z" />
                    </svg>
                </button>
                {/* Delete button */}
                <button
                    title="Delete"
                    onClick={() => setShowConfirm(true)}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* LEFT: IMAGE */}
            <div className="md:w-1/3 flex-shrink-0">
                <img
                    src={business.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
                    alt={business.business_name}
                    className="w-full h-60 md:h-full object-cover object-center"
                />
            </div>

            {/* RIGHT: DETAILS (SAME AS BEFORE) */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <h2 className="font-bold text-2xl text-emerald-700 mb-1">{business.business_name}</h2>
                    <div className="flex flex-wrap items-center gap-2 mb-2 text-gray-500">
                        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded">
                            {business.city}, {business.state}, {business.country}
                        </span>
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                            📞 {business.phone}
                        </span>
                    </div>
                    <p className="text-gray-800 mb-4">{business.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {business.services?.map((service: string, i: number) => (
                            <span
                                key={i}
                                className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium"
                            >
                                {service}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Packages */}
                {business.pricing_packages && business.pricing_packages.length > 0 && (
                    <div>
                        <h3 className="text-emerald-700 font-semibold mb-2 mt-3">Packages</h3>
                        <div className="space-y-2">
                            {business.pricing_packages.map((pkg: any) => (
                                <div
                                    key={pkg.id}
                                    className="flex items-center justify-between p-2 border border-emerald-100 rounded"
                                >
                                    <div>
                                        <span className="font-semibold">{pkg.name}</span>
                                        <span className="ml-2 text-gray-500 text-xs">{pkg.description}</span>
                                    </div>
                                    <span className="text-emerald-700 font-bold text-sm">
                                        ₹{pkg.price}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Delete Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px] text-center">
                        <h2 className="text-lg font-bold mb-3 text-gray-700">Delete Business?</h2>
                        <p className="mb-6 text-gray-500">Are you sure you want to delete <span className="font-semibold">{business.business_name}</span>?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    onDelete(business);
                                    setShowConfirm(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default BusinessCard;
