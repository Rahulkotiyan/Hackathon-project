import React from "react";
import axios from "axios";
import { useState } from "react";

const checklistItems = [
  {
    key: "qualityCheck",
    label: "Quality Check Passed",
    description: "Artwork is free of defects and meets quality standards.",
  },
  {
    key: "materialCertification",
    label: "Material Certification",
    description: "Natural dyes and authentic materials are certified.",
  },
  {
    key: "durablePackaging",
    label: "Durable Packaging",
    description: "Artwork is securely packaged for international shipping.",
  },
  {
    key: "labelingComplete",
    label: "Labeling & Documentation",
    description: "Includes artist info, story, and care instructions.",
  },
];


const ExportChecklist=({artwork,onUpdate})=>{
    const[checklist,setChecklist] = useState(artwork.exportReady);
    const[saving,setSaving] = useState(false);

    const handleCheckboxChange = async(key)=>{
        const newChecklist = { ...checklist, [key]: !checklist[key] };
        setChecklist(newChecklist);
        setSaving(true);

        try{
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
              },
            };
            const {data} = await axios.put(`/api/artworks/${artwork._id}`,{exportReady:newChecklist},config);
            onUpdate(data);
        }catch(error){
            console.error("Failed to update checklist", error);
            setChecklist(artwork.exportReady);
        }finally{
            setSaving(false);
        }
    };
    const completedCount = Object.values(checklist).filter(Boolean).length;
    const totalCount = checklistItems.length;
    const isExportReady = completedCount===totalCount;

    return (
      <div className="bg-gray-50 p-4 rounded-lg border mt-4">
        <h4 className="font-semibold text-gray-700">Export Readiness</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
          <div
            className={`h-2.5 rounded-full ${
              isExportReady ? "bg-green-500" : "bg-amber-500"
            }`}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        <p
          className={`text-sm font-bold ${
            isExportReady ? "text-green-600" : "text-amber-600"
          }`}
        >
          {isExportReady
            ? "Ready for Export!"
            : `${completedCount} of ${totalCount} checks complete`}
        </p>
        <div className="mt-3 space-y-2">
          {checklistItems.map((item) => (
            <div key={item.key}>
              <label className="flex items-center text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={() => handleCheckboxChange(item.key)}
                  disabled={saving}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2">{item.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );

};

export default ExportChecklist;