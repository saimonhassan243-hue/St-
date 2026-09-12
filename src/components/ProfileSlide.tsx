import React, { useState } from 'react';
import { 
  User, School, MapPin, Phone, Calendar, 
  Sparkles, Upload, Edit3, Check, X, ShieldCheck
} from 'lucide-react';
import { UserProfile, StreamKey } from '../types';

export const AI_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
];

interface ProfileSlideProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  stream: StreamKey;
}

export const ProfileSlide: React.FC<ProfileSlideProps> = ({
  profile,
  onUpdateProfile,
  stream,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  // Gallery file upload handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateProfile({ avatar: base64 });
        setFormData(prev => ({ ...prev, avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 transition-all">
      {/* Top action row */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-lg">
          <User className="w-5 h-5 text-indigo-600" />
          <span>শিক্ষার্থীর ব্যক্তিগত প্রোফাইল</span>
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setFormData(profile);
              setIsEditing(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isEditing
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/70'
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-3.5 h-3.5" /> বাতিল
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" /> তথ্য পরিবর্তন করুন
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
        {/* প্রোফাইল পিকচার এবং এডিটর */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative group">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />
            <label
              htmlFor="gallery-upload"
              title="গ্যালারি থেকে ছবি আপলোড করুন"
              className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
            >
              <Upload className="w-4 h-4" />
              <input 
                type="file" 
                id="gallery-upload" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-2">গ্যালারি থেকে ছবি আপলোড করুন</p>
          
          {/* AI অ্যাভাটার নির্বাচন করার সুবিধা */}
          <div className="mt-4 text-center">
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI জেনারেটেড অবতার পছন্দ করুন:
            </p>
            <div className="flex gap-2.5 justify-center">
              {AI_AVATARS.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`AI Avatar ${idx + 1}`}
                  onClick={() => onUpdateProfile({ avatar: imgUrl })}
                  className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                    profile.avatar === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105' : 'border-transparent hover:border-indigo-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* প্রোফাইলের প্রধান পরিচয় */}
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-2">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full border border-indigo-200">
              {profile.sscBatch} Batch
            </span>
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 font-semibold text-xs rounded-full border border-amber-200">
              লক্ষ্য: {profile.targetGrade || 'GPA 5.00 (Golden A+)'}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{profile.name}</h2>
          <p className="text-slate-500 font-medium mt-1">
            {profile.classLevel} • {profile.group}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg flex items-center gap-1.5 font-medium">
              <School className="w-3.5 h-3.5 text-indigo-500" /> {profile.school}
            </span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {profile.district}, {profile.division}
            </span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> নিয়মিত পরীক্ষার্থী
            </span>
          </div>
        </div>
      </div>

      {/* প্রোফাইল এডিট ফর্ম অথবা প্রদর্শনী গ্রিড */}
      {isEditing ? (
        <form onSubmit={handleSave} className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-600" /> প্রোফাইলের তথ্য আপডেট করুন
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">শিক্ষার্থীর পূর্ণ নাম</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">বিদ্যালয়ের নাম</label>
              <input
                type="text"
                value={formData.school}
                onChange={e => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">শ্রেণী (Class Level)</label>
              <input
                type="text"
                value={formData.classLevel}
                onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">এসএসসি ব্যাচ</label>
              <input
                type="text"
                value={formData.sscBatch}
                onChange={e => setFormData({ ...formData, sscBatch: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">বিভাগ (Group)</label>
              <input
                type="text"
                value={formData.group}
                onChange={e => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">টার্গেট ফলাফল (Target Grade)</label>
              <input
                type="text"
                value={formData.targetGrade || 'GPA 5.00'}
                onChange={e => setFormData({ ...formData, targetGrade: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">জেলা</label>
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">বিভাগ (Division)</label>
              <input
                type="text"
                value={formData.division}
                onChange={e => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">মোবাইল নম্বর / অভিভাবকের নম্বর</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> সংরক্ষণ করুন
            </button>
          </div>
        </form>
      ) : (
        /* প্রোফাইলের বিস্তারিত তথ্য গ্রিড */
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> বিস্তারিত তথ্য
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">বিদ্যালয়ের নাম</p>
                <p className="font-semibold text-slate-700">{profile.school}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">এসএসসি ব্যাচ / বর্ষ</p>
                <p className="font-semibold text-slate-700">{profile.sscBatch}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">জেলা ও বিভাগ</p>
                <p className="font-semibold text-slate-700">{profile.district}, {profile.division}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">মোবাইল নম্বর</p>
                <p className="font-semibold text-slate-700">{profile.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
